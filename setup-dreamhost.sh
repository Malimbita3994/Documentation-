#!/bin/bash

# DreamHost Initial Setup Script for IDAP System
# Run this script on DreamHost server after first SSH connection

# Configuration
PROJECT_PATH="/home/username/srs.juvisa.org"
DB_NAME="idap_database"
DB_USER="idap_user"
DB_PASSWORD="your_secure_password"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 DreamHost Initial Setup for IDAP System${NC}"

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Laravel artisan file not found. Make sure you're in the project directory.${NC}"
    exit 1
fi

# Step 1: Create .env file
echo -e "${YELLOW}📝 Creating .env file...${NC}"
if [ ! -f ".env" ]; then
    cp env.example .env
    echo -e "${GREEN}✅ .env file created from template${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# Step 2: Generate application key
echo -e "${YELLOW}🔑 Generating Laravel application key...${NC}"
php artisan key:generate

# Step 3: Install dependencies
echo -e "${YELLOW}📦 Installing PHP dependencies...${NC}"
composer install --no-dev --optimize-autoloader

# Step 4: Set permissions
echo -e "${YELLOW}🔐 Setting file permissions...${NC}"
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Step 5: Create database (if it doesn't exist)
echo -e "${YELLOW}🗄️  Setting up database...${NC}"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Step 6: Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
php artisan migrate --force

# Step 7: Seed database
echo -e "${YELLOW}🌱 Seeding database...${NC}"
php artisan db:seed --force

# Step 8: Clear and cache
echo -e "${YELLOW}🧹 Clearing and caching...${NC}"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 9: Create backup directory
echo -e "${YELLOW}💾 Creating backup directory...${NC}"
mkdir -p /home/username/backups

# Step 10: Create backup script
echo -e "${YELLOW}📜 Creating backup script...${NC}"
cat > /home/username/backup-script.sh << 'BACKUP_SCRIPT'
#!/bin/bash
# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"
mkdir -p $BACKUP_DIR

mysqldump -u idap_user -p'your_secure_password' idap_database > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
BACKUP_SCRIPT

chmod +x /home/username/backup-script.sh

# Step 11: Test the application
echo -e "${YELLOW}🧪 Testing application...${NC}"
php artisan --version
php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection successful';"

echo -e "${GREEN}🎉 DreamHost setup completed successfully!${NC}"
echo -e "${BLUE}🌐 Your application should now be available at: https://srs.juvisa.org${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Update .env file with your actual database credentials"
echo -e "  2. Test the application in your browser"
echo -e "  3. Set up SSL certificate in DreamHost panel"
echo -e "  4. Configure cron jobs if needed"
