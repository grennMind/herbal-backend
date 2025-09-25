import express from 'express';
import axios from 'axios';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/ai/plant-identify
// @desc    Identify plant using Plant.id API
// @access  Public
router.post('/plant-identify', optionalAuth, async (req, res) => {
  try {
    const { images, modifiers, plant_details } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const plantIdResponse = await axios.post(
      'https://api.plant.id/v2/identify',
      {
        images,
        modifiers: modifiers || ["crops_fast", "similar_images", "health_only", "disease_similar_images"],
        plant_details: plant_details || ["common_names", "url", "name_authority", "wiki_description", "taxonomy"]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.PLANT_ID_API_KEY
        }
      }
    );

    const result = plantIdResponse.data;

    // Extract medicinal information (you can enhance this with your own database)
    const suggestions = result.suggestions?.map(suggestion => ({
      ...suggestion,
      medicinal_uses: getMedicinalUses(suggestion.plant_name),
      safety_info: getSafetyInfo(suggestion.plant_name)
    }));

    res.json({
      success: true,
      data: {
        ...result,
        suggestions,
        identification_id: result.id
      }
    });

  } catch (error) {
    console.error('Plant identification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Plant identification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/ai/symptom-check
// @desc    Check symptoms using Infermedica API
// @access  Private
router.post('/symptom-check', authenticate, async (req, res) => {
  try {
    const { symptoms, age, sex } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms are required'
      });
    }

    // First, get symptom analysis
    const diagnosisResponse = await axios.post(
      'https://api.infermedica.com/v3/diagnosis',
      {
        sex: sex || 'male',
        age: { value: age || 30 },
        evidence: symptoms.map(symptom => ({
          id: symptom.id,
          choice_id: symptom.choice_id || 'present'
        }))
      },
      {
        headers: {
          'App-Id': process.env.INFERMEDICA_APP_ID,
          'App-Key': process.env.INFERMEDICA_APP_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const diagnosis = diagnosisResponse.data;

    // Get herbal recommendations based on conditions
    const herbalRecommendations = diagnosis.conditions?.map(condition => ({
      ...condition,
      herbal_remedies: getHerbalRemedies(condition.name),
      recommended_products: [] // This would be populated from your product database
    }));

    res.json({
      success: true,
      data: {
        ...diagnosis,
        conditions: herbalRecommendations,
        disclaimer: "This is for informational purposes only and should not replace professional medical advice."
      }
    });

  } catch (error) {
    console.error('Symptom check error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Symptom analysis failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/ai/recommend
// @desc    Get AI-powered herbal recommendations
// @access  Private
router.post('/recommend', authenticate, async (req, res) => {
  try {
    const { conditions, preferences, allergies } = req.body;

    if (!conditions || conditions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one condition is required'
      });
    }

    // Use OpenAI to generate personalized recommendations
    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable herbalist AI assistant. Provide safe, evidence-based herbal recommendations for health conditions. Always include safety warnings and advise consulting healthcare providers.`
          },
          {
            role: 'user',
            content: `Please recommend herbal remedies for these conditions: ${conditions.join(', ')}. 
            User preferences: ${preferences || 'None specified'}. 
            Allergies: ${allergies || 'None specified'}.
            Format the response as a JSON object with recommendations, safety_notes, and interactions.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let recommendations;
    try {
      recommendations = JSON.parse(openAIResponse.data.choices[0].message.content);
    } catch (parseError) {
      recommendations = {
        recommendations: openAIResponse.data.choices[0].message.content,
        safety_notes: "Always consult with a healthcare provider before starting any herbal treatment.",
        interactions: "Check for drug interactions with your current medications."
      };
    }

    res.json({
      success: true,
      data: {
        ...recommendations,
        generated_at: new Date().toISOString(),
        disclaimer: "This AI-generated advice is for informational purposes only and should not replace professional medical consultation."
      }
    });

  } catch (error) {
    console.error('AI recommendation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions (you can expand these with your own database)
function getMedicinalUses(plantName) {
  const medicinalDatabase = {
    'Turmeric': ['Anti-inflammatory', 'Antioxidant', 'Digestive aid'],
    'Ginger': ['Nausea relief', 'Anti-inflammatory', 'Digestive aid'],
    'Echinacea': ['Immune support', 'Cold prevention', 'Wound healing'],
    'Aloe Vera': ['Skin healing', 'Burns treatment', 'Digestive aid']
  };
  
  return medicinalDatabase[plantName] || ['Consult an herbalist for specific uses'];
}

function getSafetyInfo(plantName) {
  const safetyDatabase = {
    'Turmeric': 'Generally safe, may interact with blood thinners',
    'Ginger': 'Generally safe, avoid high doses during pregnancy',
    'Echinacea': 'Generally safe, may cause allergic reactions in some people',
    'Aloe Vera': 'Safe for topical use, internal use requires caution'
  };
  
  return safetyDatabase[plantName] || 'Consult healthcare provider before use';
}

function getHerbalRemedies(conditionName) {
  const remedyDatabase = {
    'Common cold': ['Echinacea', 'Elderberry', 'Ginger tea'],
    'Headache': ['Willow bark', 'Peppermint', 'Feverfew'],
    'Digestive issues': ['Ginger', 'Peppermint', 'Chamomile'],
    'Anxiety': ['Chamomile', 'Lavender', 'Passionflower']
  };
  
  return remedyDatabase[conditionName] || ['Consult an herbalist for specific remedies'];
}

export default router;
