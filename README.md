# Herbal Marketplace Backend API

A comprehensive Node.js/Express backend for the Herbal Marketplace platform with PostgreSQL database integration.

## Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Support for buyers, sellers, and herbalists
- **Product Management** - Full CRUD operations with advanced filtering
- **Order Processing** - Complete order lifecycle management
- **AI Integration** - Plant identification, symptom checking, and recommendations
- **Database Models** - Comprehensive PostgreSQL schemas with Sequelize ORM

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- API Keys for external services (Plant.id, Infermedica, OpenAI)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE herbal_marketplace;
   CREATE USER your_db_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE herbal_marketplace TO your_db_user;
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/herbalists` - Get verified herbalists
- `GET /api/users/sellers` - Get verified sellers

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (sellers only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/seller/:sellerId` - Get products by seller

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (sellers)

### AI Services
- `POST /api/ai/plant-identify` - Identify plants using images
- `POST /api/ai/symptom-check` - Check symptoms and get diagnosis
- `POST /api/ai/recommend` - Get AI-powered herbal recommendations

## Database Schema

### Users
- Support for buyers, sellers, and herbalists
- Verification status tracking
- Profile and business information
- Rating and review system

### Products
- Comprehensive herbal product information
- Botanical names and medicinal uses
- Stock management and pricing
- SEO optimization fields

### Orders
- Complete order lifecycle tracking
- Multi-seller order support
- Payment and shipping status
- Order item snapshots

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=herbal_marketplace
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# External APIs
PLANT_ID_API_KEY=your_plant_id_key
INFERMEDICA_APP_ID=your_infermedica_id
INFERMEDICA_APP_KEY=your_infermedica_key
OPENAI_API_KEY=your_openai_key

# Other services
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
STRIPE_SECRET_KEY=your_stripe_key
```

## Security Features

- Helmet.js for security headers
- Rate limiting
- Input validation with Joi
- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed
```

## Testing

The API includes comprehensive error handling and validation. Test all endpoints using tools like Postman or curl.

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up process manager (PM2)

## API Documentation

Visit `/api/health` to check if the API is running. All endpoints return JSON responses with consistent structure:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... }
}
```
