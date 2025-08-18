# DreamHost SSH Deployment Guide for IDAP System

## 🔐 **SSH Setup for DreamHost**

### **Step 1: Enable SSH Access**

1. **Log into DreamHost Panel**
   - Go to [panel.dreamhost.com](https://panel.dreamhost.com)
   - Navigate to **Users** → **Manage Users**

2. **Enable SSH for Your User**
   - Find your username
   - Click **Edit** next to your user
   - Check "Shell access" option
   - Set shell type to: `/bin/bash`
   - Save changes

3. **Generate SSH Key (if you don't have one)**
   ```bash
   # On your local machine
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   # Press Enter to save in default location
   # Enter a passphrase (recommended)
   ```

4. **Add SSH Key to DreamHost**
   - Copy your public key: `cat ~/.ssh/id_rsa.pub`
   - In DreamHost panel: **Users** → **Manage Users** → **Edit** → **SSH Keys**
   - Paste your public key and save

### **Step 2: Test SSH Connection**

```bash
# Test connection to DreamHost
ssh username@your-server.dreamhost.com

# Or if you have a specific server
ssh username@server-name.dreamhost.com
```

### **Step 3: Prepare Local Repository**

1. **Create Deployment Script**
   ```bash
   # Create deployment directory
   mkdir -p ~/deployment-scripts
   cd ~/deployment-scripts
   ```

2. **Create deploy.sh script**
   ```bash
   #!/bin/bash
   
   # DreamHost SSH Deployment Script for IDAP
   
   # Configuration
   REMOTE_USER="your-dreamhost-username"
   REMOTE_HOST="your-server.dreamhost.com"
   REMOTE_PATH="/home/username/srs.juvisa.org"
   LOCAL_BACKEND="./backend"
   LOCAL_FRONTEND="./frontend"
   
   echo "🚀 Starting IDAP deployment to DreamHost..."
   
   # Step 1: Build Frontend
   echo "📦 Building frontend..."
   cd $LOCAL_FRONTEND
   npm install
   npm run build
   cd ..
   
   # Step 2: Create deployment package
   echo "📋 Creating deployment package..."
   rm -rf deployment-package
   mkdir deployment-package
   
   # Copy backend files
   cp -r $LOCAL_BACKEND/* deployment-package/
   
   # Copy built frontend to public directory
   cp -r $LOCAL_FRONTEND/dist/* deployment-package/public/
   
   # Step 3: Upload to DreamHost
   echo "📤 Uploading to DreamHost..."
   rsync -avz --delete deployment-package/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
   
   # Step 4: Run remote setup commands
   echo "🔧 Running remote setup..."
   ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
   cd /home/username/srs.juvisa.org
   
   # Install dependencies
   composer install --no-dev --optimize-autoloader
   
   # Set permissions
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   
   # Clear caches
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   
   # Optimize for production
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   echo "✅ Deployment completed successfully!"
   EOF
   
   echo "🎉 Deployment finished!"
   ```

### **Step 4: Automated Deployment with Git Hooks**

1. **Create Git Hook for Auto-Deployment**
   ```bash
   # Create post-push hook
   mkdir -p .git/hooks
   ```

2. **Create .git/hooks/post-push**
   ```bash
   #!/bin/bash
   
   # Auto-deploy to DreamHost after push
   if [ "$1" = "refs/heads/main" ]; then
       echo "🔄 Auto-deploying to DreamHost..."
       ./deployment-scripts/deploy.sh
   fi
   ```

3. **Make hook executable**
   ```bash
   chmod +x .git/hooks/post-push
   ```

### **Step 5: Manual SSH Deployment Commands**

#### **Initial Setup**
```bash
# Connect to DreamHost
ssh username@your-server.dreamhost.com

# Navigate to your domain directory
cd /home/username/srs.juvisa.org

# Clone your repository (first time only)
git clone https://github.com/Malimbita3994/Documentation-.git temp-repo
cp -r temp-repo/backend/* .
rm -rf temp-repo

# Create .env file
cp env.example .env
nano .env  # Edit with your database credentials

# Generate application key
php artisan key:generate

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Run migrations
php artisan migrate --force
php artisan db:seed --force

# Clear and cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### **Regular Updates**
```bash
# Connect to DreamHost
ssh username@your-server.dreamhost.com

# Navigate to your domain directory
cd /home/username/srs.juvisa.org

# Pull latest changes
git pull origin main

# Install/update dependencies
composer install --no-dev --optimize-autoloader

# Run migrations (if any)
php artisan migrate --force

# Clear and cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

### **Step 6: Frontend Deployment Options**

#### **Option A: Deploy Frontend to Vercel**
```bash
# Build frontend locally
cd frontend
npm install
npm run build

# Deploy to Vercel
vercel --prod
```

#### **Option B: Deploy Frontend to DreamHost**
```bash
# Build frontend
cd frontend
npm install
npm run build

# Upload to DreamHost public directory
rsync -avz --delete dist/ username@your-server.dreamhost.com:/home/username/srs.juvisa.org/public/
```

### **Step 7: Environment Configuration**

#### **Create .env file on DreamHost**
```bash
# Connect via SSH
ssh username@your-server.dreamhost.com

# Navigate to project directory
cd /home/username/srs.juvisa.org

# Create .env file
nano .env
```

#### **Environment Variables for .env**
```env
APP_NAME="IDAP - Intelligent Documentation Analysis Platform"
APP_ENV=production
APP_KEY=base64:your_generated_key
APP_DEBUG=false
APP_URL=https://srs.juvisa.org

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=idap_database
DB_USERNAME=idap_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=mail.juvisa.org
MAIL_PORT=587
MAIL_USERNAME=noreply@juvisa.org
MAIL_PASSWORD=your_mail_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@juvisa.org"
MAIL_FROM_NAME="${APP_NAME}"

CORS_ALLOWED_ORIGINS=https://srs.juvisa.org,http://localhost:3000
```

### **Step 8: Database Setup via SSH**

```bash
# Connect to DreamHost
ssh username@your-server.dreamhost.com

# Access MySQL
mysql -u idap_user -p

# Create database and user (if not done via panel)
CREATE DATABASE IF NOT EXISTS idap_database;
CREATE USER IF NOT EXISTS 'idap_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON idap_database.* TO 'idap_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run Laravel migrations
cd /home/username/srs.juvisa.org
php artisan migrate --force
php artisan db:seed --force
```

### **Step 9: Monitoring and Logs**

#### **Check Laravel Logs**
```bash
# Connect via SSH
ssh username@your-server.dreamhost.com

# View Laravel logs
tail -f /home/username/srs.juvisa.org/storage/logs/laravel.log
```

#### **Check Error Logs**
```bash
# Check Apache error logs
tail -f /home/username/logs/srs.juvisa.org/error.log
```

#### **Check Application Status**
```bash
# Test Laravel installation
php artisan --version

# Test database connection
php artisan tinker
DB::connection()->getPdo();
exit
```

### **Step 10: Backup Strategy**

#### **Database Backup**
```bash
# Create backup script
nano /home/username/backup-script.sh
```

```bash
#!/bin/bash
# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"
mkdir -p $BACKUP_DIR

mysqldump -u idap_user -p'your_password' idap_database > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

#### **File Backup**
```bash
# Backup application files
tar -czf /home/username/backups/app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /home/username/srs.juvisa.org/
```

### **Step 11: Performance Optimization**

#### **Enable OPcache**
```bash
# Check if OPcache is enabled
php -m | grep opcache

# If not enabled, contact DreamHost support
```

#### **Optimize Composer**
```bash
composer install --no-dev --optimize-autoloader --classmap-authoritative
```

#### **Laravel Optimization**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### **Step 12: Security Hardening**

#### **File Permissions**
```bash
# Set proper permissions
find /home/username/srs.juvisa.org -type f -exec chmod 644 {} \;
find /home/username/srs.juvisa.org -type d -exec chmod 755 {} \;
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

#### **Hide Sensitive Files**
```bash
# Ensure .env is not accessible via web
echo "Deny from all" > /home/username/srs.juvisa.org/public/.env
```

### **Step 13: Troubleshooting**

#### **Common SSH Issues**
```bash
# Test SSH connection
ssh -v username@your-server.dreamhost.com

# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Add SSH key to agent
ssh-add ~/.ssh/id_rsa
```

#### **Deployment Issues**
```bash
# Check file permissions
ls -la /home/username/srs.juvisa.org/

# Check Laravel logs
tail -f /home/username/srs.juvisa.org/storage/logs/laravel.log

# Test database connection
php artisan tinker
DB::connection()->getPdo();
```

---

**Note**: Always test deployment scripts in a staging environment first!
