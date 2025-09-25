import Joi from 'joi';

// User validation schemas
export const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    userType: Joi.string().valid('buyer', 'seller', 'herbalist').default('buyer')
  });
  
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  return schema.validate(data);
};

export const validateUserUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().max(20),
    address: Joi.object(),
    bio: Joi.string().max(1000),
    businessName: Joi.string().max(200),
    credentials: Joi.array().items(Joi.string()),
    specializations: Joi.array().items(Joi.string()),
    experience: Joi.number().min(0).max(100)
  });
  
  return schema.validate(data);
};

// Product validation schema
export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().required(),
    shortDescription: Joi.string().max(500),
    price: Joi.number().min(0).required(),
    compareAtPrice: Joi.number().min(0),
    category: Joi.string().valid('herbs', 'supplements', 'teas', 'oils', 'powders', 'capsules', 'tinctures', 'other').required(),
    subcategory: Joi.string().max(100),
    tags: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    stock: Joi.number().min(0).required(),
    sku: Joi.string().max(50),
    weight: Joi.number().min(0),
    dimensions: Joi.object(),
    isOrganic: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false),
    botanicalName: Joi.string().max(200),
    origin: Joi.string().max(100),
    harvestDate: Joi.date(),
    expiryDate: Joi.date(),
    medicinalUses: Joi.array().items(Joi.string()),
    contraindications: Joi.array().items(Joi.string()),
    dosage: Joi.string().max(1000),
    preparation: Joi.string().max(1000),
    metaTitle: Joi.string().max(100),
    metaDescription: Joi.string().max(200)
  });
  
  return schema.validate(data);
};

// Order validation schema
export const validateOrder = (data) => {
  const schema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string()
    }).required(),
    billingAddress: Joi.object({
      fullName: Joi.string().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required()
    }),
    paymentMethod: Joi.string().required(),
    notes: Joi.string().max(500)
  });
  
  return schema.validate(data);
};
