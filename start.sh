#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Jadwal Pelajaran Otomatis...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Start services
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose exec -T backend npm run migrate

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
docker-compose exec -T backend npm run seed

# Display URLs
echo -e "${GREEN}✓ Services started successfully!${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend API: http://localhost:5000${NC}"
echo -e "${GREEN}Database: localhost:5432${NC}"
echo -e "${GREEN}Redis: localhost:6379${NC}"
