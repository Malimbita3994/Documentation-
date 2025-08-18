#!/bin/bash

# DreamHost SSH Deployment Script for IDAP System
# Usage: ./deploy.sh

# Configuration - UPDATE THESE VALUES
REMOTE_USER="your-dreamhost-username"
REMOTE_HOST="your-server.dreamhost.com"
REMOTE_PATH="/home/username/srs.juvisa.org"
LOCAL_BACKEND="./backend"
LOCAL_FRONTEND="./frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting IDAP deployment to DreamHost...${NC}"

# Check if required directories exist
if [ ! -d "$LOCAL_BACKEND" ]; then
    echo -e "${RED}❌ Backend directory not found: $LOCAL_BACKEND${NC}"
    exit 1
fi

if [ ! -d "$LOCAL_FRONTEND" ]; then
    echo -e "${RED}❌ Frontend directory not found: $LOCAL_FRONTEND${NC}"
    exit 1
fi

# Step 1: Build Frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd $LOCAL_FRONTEND

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    npm install
fi

# Build the frontend
echo -e "${YELLOW}🔨 Building frontend for production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

cd ..

# Step 2: Create deployment package
echo -e "${YELLOW}📋 Creating deployment package...${NC}"
rm -rf deployment-package
mkdir deployment-package

# Copy backend files
echo -e "${YELLOW}📁 Copying backend files...${NC}"
cp -r $LOCAL_BACKEND/* deployment-package/

# Copy built frontend to public directory
echo -e "${YELLOW}📁 Copying frontend files to public directory...${NC}"
cp -r $LOCAL_FRONTEND/dist/* deployment-package/public/

# Step 3: Upload to DreamHost
echo -e "${YELLOW}📤 Uploading to DreamHost...${NC}"
rsync -avz --delete deployment-package/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Upload failed! Check your SSH connection and credentials.${NC}"
    exit 1
fi

# Step 4: Run remote setup commands
echo -e "${YELLOW}🔧 Running remote setup...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
cd /home/username/srs.juvisa.org

echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "🔐 Setting file permissions..."
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

echo "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Remote setup completed successfully!"
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Remote setup failed!${NC}"
    exit 1
fi

# Clean up
echo -e "${YELLOW}🧹 Cleaning up local deployment package...${NC}"
rm -rf deployment-package

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your application should now be available at: https://srs.juvisa.org${NC}"
