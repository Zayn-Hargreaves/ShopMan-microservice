# Auth Service

Authentication microservice for ShopMan.

## Features
- User registration and login
- JWT-based token authentication
- Token refresh mechanism
- Integration with PostgreSQL, Redis (Aiven), and RabbitMQ (Aiven)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`.

3. Start the service:
   ```bash
   npm start
   ```

## API Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh-token` - Refresh JWT tokens