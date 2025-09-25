import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'herbal_marketplace',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_make_it_long_and_secure',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: '30d'
  },

  // Stripe Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_stripe_webhook_secret_here',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here',
    currency: 'usd'
  },

  // AI API Keys
  ai: {
    plantId: {
      apiKey: process.env.PLANT_ID_API_KEY || 'your_plant_id_api_key_here',
      baseUrl: 'https://api.plant.id/v2'
    },
    infermedica: {
      appId: process.env.INFERMEDICA_APP_ID || 'your_infermedica_app_id_here',
      appKey: process.env.INFERMEDICA_APP_KEY || 'your_infermedica_app_key_here',
      baseUrl: 'https://api.infermedica.com/v3'
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7
    }
  },

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloudinary_cloud_name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'your_cloudinary_api_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'your_cloudinary_api_secret'
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your_email@gmail.com',
        pass: process.env.SMTP_PASS || 'your_email_app_password'
      }
    },
    from: process.env.SMTP_USER || 'noreply@herbalmarketplace.com',
    templates: {
      welcome: 'welcome-email',
      orderConfirmation: 'order-confirmation',
      passwordReset: 'password-reset'
    }
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    maxFiles: parseInt(process.env.MAX_FILES_PER_REQUEST) || 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadPath: 'uploads/'
  },

  // Security
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your_session_secret_here',
    corsOrigins: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000'
    ]
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    console: process.env.NODE_ENV === 'development'
  },

  // Redis (optional)
  redis: {
    url: process.env.REDIS_URL || null,
    enabled: !!process.env.REDIS_URL
  },

  // Feature Flags
  features: {
    ai: process.env.ENABLE_AI_FEATURES !== 'false',
    payments: process.env.ENABLE_PAYMENT_PROCESSING !== 'false',
    email: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    uploads: process.env.ENABLE_FILE_UPLOADS !== 'false',
    rateLimit: process.env.ENABLE_RATE_LIMITING !== 'false'
  },

  // Business Logic
  business: {
    minOrderAmount: 10.00,
    maxOrderAmount: 1000.00,
    defaultShippingCost: 5.00,
    expressShippingCost: 15.00,
    taxRate: 0.08, // 8%
    autoCancelHours: 24,
    maxRefundDays: 30
  },

  // Validation
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    product: {
      minPrice: 0.01,
      maxPrice: 999.99,
      minStock: 0,
      maxStock: 9999
    }
  }
};

export default config; 