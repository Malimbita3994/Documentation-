# DreamHost Deployment Guide for IDAP System

## 🚀 **DreamHost Setup for srs.juvisa.org**

### **Step 1: DreamHost Domain Configuration**

1. **Log into DreamHost Panel**
   - Go to [panel.dreamhost.com](https://panel.dreamhost.com)
   - Navigate to **Domains** → **Manage Domains**

2. **Add Subdomain**
   - Find your domain `juvisa.org`
   - Click **Add** next to "Subdomains"
   - Create subdomain: `srs`
   - Full URL will be: `srs.juvisa.org`

3. **Enable SSL Certificate**
   - Go to **Security** → **SSL/TLS Certificates**
   - Enable SSL for `srs.juvisa.org`
   - Choose "Let's Encrypt" (free)

### **Step 2: Database Setup**

1. **Create MySQL Database**
   - Go to **Databases** → **MySQL Databases**
   - Create new database: `idap_database`
   - Create new user: `idap_user`
   - Grant all privileges to the user
   - Note down the database credentials

2. **Database Configuration**
   ```sql
   CREATE DATABASE idap_database;
   CREATE USER 'idap_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON idap_database.* TO 'idap_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### **Step 3: File Upload**

1. **Access DreamHost File Manager**
   - Go to **Files** → **File Manager**
   - Navigate to your domain directory

2. **Upload Backend Files**
   ```bash
   # Upload to: /home/username/srs.juvisa.org/
   # Structure should be:
   /home/username/srs.juvisa.org/
   ├── app/
   ├── bootstrap/
   ├── config/
   ├── database/
   ├── public/          # Document root
   ├── resources/
   ├── routes/
   ├── storage/
   ├── vendor/
   ├── .env
   ├── .htaccess
   └── artisan
   ```

3. **Set Document Root**
   - In DreamHost panel, set document root to: `srs.juvisa.org/public`

### **Step 4: Environment Configuration**

1. **Create .env File**
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

2. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

### **Step 5: Laravel Setup**

1. **Install Dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Set Permissions**
   ```bash
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   chown -R www-data:www-data storage/
   chown -R www-data:www-data bootstrap/cache/
   ```

3. **Run Migrations**
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

4. **Clear Caches**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   ```

### **Step 6: Frontend Deployment**

1. **Build Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload Frontend Files**
   - Upload the `dist` folder contents to: `/home/username/srs.juvisa.org/public/`
   - Or create a separate subdomain for frontend: `app.srs.juvisa.org`

3. **Alternative: Deploy Frontend to Vercel**
   - Deploy frontend to Vercel
   - Update API URL to: `https://srs.juvisa.org/api`

### **Step 7: Testing**

1. **Test Backend API**
   ```bash
   curl https://srs.juvisa.org/api/users
   ```

2. **Test Frontend**
   - Visit: `https://srs.juvisa.org`
   - Check browser console for errors
   - Test API connections

## 🔧 **DreamHost Specific Configuration**

### **PHP Version**
- DreamHost supports PHP 8.1+
- Set PHP version in panel: **Domains** → **PHP Settings**

### **Cron Jobs**
```bash
# Add to DreamHost cron jobs
# Go to: **Advanced** → **Cron Jobs**
0 * * * * cd /home/username/srs.juvisa.org && php artisan schedule:run
```

### **Backup Strategy**
1. **Database Backups**
   ```bash
   mysqldump -u idap_user -p idap_database > backup_$(date +%Y%m%d).sql
   ```

2. **File Backups**
   - Use DreamHost's built-in backup system
   - Or create manual backups via File Manager

## 🚨 **Troubleshooting**

### **Common Issues**

1. **500 Internal Server Error**
   - Check `.htaccess` file exists
   - Verify file permissions
   - Check Laravel logs: `storage/logs/laravel.log`

2. **Database Connection Error**
   - Verify database credentials in `.env`
   - Check database exists and user has permissions
   - Test connection: `php artisan tinker`

3. **CORS Errors**
   - Verify CORS configuration in `.htaccess`
   - Check `CORS_ALLOWED_ORIGINS` in `.env`

4. **File Permission Errors**
   ```bash
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   chown -R www-data:www-data storage/
   chown -R www-data:www-data bootstrap/cache/
   ```

### **Debug Commands**
```bash
# Check PHP version
php -v

# Check Laravel installation
php artisan --version

# Test database connection
php artisan tinker
DB::connection()->getPdo();

# Clear all caches
php artisan optimize:clear
```

## 📊 **Performance Optimization**

1. **Enable OPcache**
   - DreamHost has OPcache enabled by default
   - Optimize autoloader: `composer install --optimize-autoloader --no-dev`

2. **Caching**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use database query caching

## 🔒 **Security**

1. **SSL Certificate**
   - Ensure SSL is enabled for `srs.juvisa.org`
   - Redirect HTTP to HTTPS

2. **File Permissions**
   - Keep sensitive files outside web root
   - Set proper file permissions

3. **Environment Variables**
   - Never commit `.env` files
   - Use strong database passwords

## 📞 **Support**

For DreamHost-specific issues:
1. Check DreamHost knowledge base
2. Contact DreamHost support
3. Check Laravel logs for application errors

---

**Note**: Always test in a staging environment before deploying to production!
