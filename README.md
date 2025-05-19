# API Key Management Microservices

This project consists of two microservices that work together to manage API keys and Web3 tokens:

1. **Access Key Service**: Manages API key generation, validation, and access control
2. **Web3 Token Service**: Handles Web3 token operations and blockchain interactions

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Docker and Docker Compose
- PostgreSQL database

## Project Structure

```
.
├── access-key-service/     # API Key management service
└── web3-token-service/     # Web3 token management service
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd poc-access-api-keys
```

### 2. Environment Setup

Each service requires its own environment configuration. Create `.env` files in both service directories:

#### Access Key Service (.env)
```env
# MongoDB Configuration
MONGODB_USERNAME=user
MONGODB_PASSWORD=password
MONGODB_HOST=host
MONGODB_DATABASE=database

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
PORT=3001
NODE_ENV=development
```

#### Web3 Token Service (.env)
```env
# MongoDB Configuration
MONGODB_USERNAME=user
MONGODB_PASSWORD=password
MONGODB_HOST=host
MONGODB_DATABASE=database

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
PORT=3002
NODE_ENV=development
```

### 3. Database Setup

1. Start PostgreSQL using Docker:
```bash
docker run -d --name redis -p 6379:6379 redis:8
```

2. The services will automatically create their database schemas on first run.

### 4. Install Dependencies

Install dependencies for both services:

```bash
# Access Key Service
cd access-key-service
npm install

# Web3 Token Service
cd web3-token-service
npm install
```

### 5. Build and Run Services

#### Development Mode

For each service, run:

```bash
# Access Key Service
cd access-key-service
npm run start:dev

# Web3 Token Service
cd web3-token-service
npm run start:dev
```

#### Production Mode

```bash
# Build
npm run build

# Start
npm run start:prod
```

## API Documentation

### Access Key Service (Port 3000)

- `POST /api/keys`: Generate new API key
- `GET /api/keys`: List all API keys
- `DELETE /api/keys/:id`: Revoke API key
- `POST /api/validate`: Validate API key

### Web3 Token Service (Port 3001)

- `POST /api/tokens`: Create new Web3 token
- `GET /api/tokens`: List all tokens
- `GET /api/tokens/:id`: Get token details
- `POST /api/tokens/transfer`: Transfer token

## Testing

Run tests for each service:

```bash
# Access Key Service
cd access-key-service
npm run test

# Web3 Token Service
cd web3-token-service
npm run test
```

## Development

- Both services are built with NestJS
- TypeScript is used for type safety
- ESLint and Prettier are configured for code quality
- PostgreSQL is used as the database

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## License

@[i5hekhar](https://github.com/i5hekhar)