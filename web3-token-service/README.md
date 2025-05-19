# Web3 Token Service

A NestJS-based service for web2 token example service with MongoDB and Redis caching.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- npm or yarn package manager

## Setup Guide

1. Clone the repository:
```bash
git clone <repository-url>
cd access-key-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
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

4. Build the application:
```bash
npm run start:dev
```

## Available Commands

### Development
- `npm run start:dev` - Start the application in development 

## Project Structure

```
access-key-service/
├── src/                    # Source files
├── test/                   # Test files
├── dist/                   # Compiled output
├── @database/             # Database related files
├── .vscode/               # VS Code configuration
└── node_modules/          # Dependencies
```

## Dependencies

### Main Dependencies
- @nestjs/common - NestJS core framework
- @nestjs/mongoose - MongoDB integration
- @nestjs/cache-manager - Caching support
- mongoose - MongoDB ODM
- ioredis - Redis client
- class-validator - Input validation
- class-transformer - Object transformation

### Development Dependencies
- @nestjs/cli - NestJS CLI tools
- typescript - TypeScript support
- jest - Testing framework
- eslint - Code linting
- prettier - Code formatting

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## Developer

@[i5hekhar](https://github.com/i5hekhar)

