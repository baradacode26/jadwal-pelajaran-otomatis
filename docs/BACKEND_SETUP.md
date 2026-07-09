# Backend Setup

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 13
- Redis >= 6
- npm atau yarn

## Installation

```bash
cd backend
npm install
```

## Environment Setup

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi lokal Anda.

## Database Setup

```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

## Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## Build

```bash
npm run build
```

## Testing

```bash
npm run test
npm run test:coverage
```

## Project Structure

```
src/
├── config/           # Konfigurasi aplikasi
├── controllers/      # Request handlers
├── services/         # Business logic
├── models/          # Database models (Prisma)
├── middleware/      # Middleware (auth, validation, etc)
├── utils/           # Utility functions
├── scheduling/      # Scheduling engine
├── validators/      # Input validation
├── routes/          # API routes
├── types/           # TypeScript types
└── main.ts          # Entry point
```

## API Structure

API menggunakan RESTful conventions:

```
GET    /api/v1/resource          # List
GET    /api/v1/resource/:id      # Get
POST   /api/v1/resource          # Create
PUT    /api/v1/resource/:id      # Update
DELETE /api/v1/resource/:id      # Delete
```

## Database Connection

Connecting ke PostgreSQL melalui Prisma ORM.

## Authentication

Menggunakan JWT tokens:

- Access Token: 7 hari (configurable)
- Refresh Token: 30 hari (configurable)

## Logging

Logging menggunakan Winston logger.

## Error Handling

Standard HTTP error codes dan custom error types.
