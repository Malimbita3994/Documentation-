# 🚀 DreamHost Deployment Instructions

## 📋 Pre-Deployment Checklist

### 1. Database Setup (DreamHost Panel)
- [ ] Log into [panel.dreamhost.com](https://panel.dreamhost.com)
- [ ] Go to **Databases** → **MySQL Databases**
- [ ] Create database: `idap_database`
- [ ] Create user: `idap_user`
- [ ] Grant all privileges
- [ ] **Note down the credentials**

### 2. Domain Configuration
- [ ] Go to **Domains** → **Manage Domains**
- [ ] Add subdomain: `srs` to `juvisa.org`
- [ ] Full URL: `srs.juvisa.org`
- [ ] Go to **Security** → **SSL/TLS Certificates**
- [ ] Enable SSL for `srs.juvisa.org`

### 3. File Upload
- [ ] Go to **Files** → **File Manager**
- [ ] Navigate to your domain directory
- [ ] Upload all files from `deployment-package/` to `/home/japhet/srs.juvisa.org/`
- [ ] Set document root to: `srs.juvisa.org/public`

## 🔧 Environment Configuration

### Create .env File
Create a `.env` file in the root directory with:

```env
APP_NAME="IDAP - Intelligent Documentation Analysis Platform"
APP_ENV=production
APP_KEY=base64:your_generated_key_here
APP_DEBUG=false
APP_URL=https://srs.juvisa.org

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=idap_database
DB_USERNAME=your_dreamhost_db_username
DB_PASSWORD=your_dreamhost_db_password

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

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://srs.juvisa.org,http://localhost:3000
```

## 🛠️ Post-Upload Commands

After uploading files, run these commands via SSH:

```bash
cd /home/japhet/srs.juvisa.org

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Set file permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate --force

# Seed the database
php artisan db:seed --force

# Clear and cache configurations
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🌐 Final URL
Your application will be available at: **https://srs.juvisa.org**

## 🔍 Troubleshooting

### Common Issues:
1. **500 Error**: Check file permissions and .env configuration
2. **Database Connection**: Verify database credentials
3. **CORS Errors**: Check CORS_ALLOWED_ORIGINS setting
4. **SSL Issues**: Ensure SSL certificate is properly configured

### Check Logs:
```bash
tail -f storage/logs/laravel.log
```

## ✅ Success Indicators
- [ ] Website loads at https://srs.juvisa.org
- [ ] No 500 errors in browser console
- [ ] Database migrations completed successfully
- [ ] SSL certificate is active
- [ ] All features working (login, SRS, etc.)

---
**Note**: Replace `your_dreamhost_db_username`, `your_dreamhost_db_password`, and `your_mail_password` with actual values from your DreamHost panel.






