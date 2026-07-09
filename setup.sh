#!/bin/bash

# Backend installation and setup
echo "Setting up backend..."
cd backend
npm install

# Copy environment file
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Seed database
npm run seed

cd ..

# Frontend installation
echo "Setting up frontend..."
cd frontend
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

cd ..

echo "Setup complete! You can now run 'docker-compose up' or 'npm run dev:all'"
