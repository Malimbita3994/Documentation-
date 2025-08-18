# IDAP System Deployment Guide

## 🚀 Quick Start Deployment

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Deploy

2. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```

#### Backend (Railway)
1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Set root directory to `backend`
   - Add MySQL database service

2. **Configure Environment Variables**
   ```
   APP_NAME="IDAP - Intelligent Documentation Analysis Platform"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-railway-backend.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${MYSQL_HOST}
   DB_PORT=${MYSQL_PORT}
   DB_DATABASE=${MYSQL_DATABASE}
   DB_USERNAME=${MYSQL_USERNAME}
   DB_PASSWORD=${MYSQL_PASSWORD}
   
   CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
   ```

3. **Run Database Migrations**
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

### Option 2: DigitalOcean App Platform

#### Frontend
1. Create new app from GitHub
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

#### Backend
1. Create new app from GitHub
2. Set build command: `composer install --no-dev`
3. Set run command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Add MySQL database
5. Configure environment variables

### Option 3: Heroku

#### Frontend
1. Create new app
2. Set buildpacks: `heroku/nodejs`
3. Deploy from GitHub
4. Configure environment variables

#### Backend
1. Create new app
2. Set buildpacks: `heroku/php`
3. Add MySQL addon: `heroku addons:create jawsdb:kitefin`
4. Deploy from GitHub
5. Run migrations: `heroku run php artisan migrate --force`

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME="IDAP"
```

### Backend Environment Variables
```env
APP_NAME="IDAP - Intelligent Documentation Analysis Platform"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-database-name
DB_USERNAME=your-username
DB_PASSWORD=your-password

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📋 Pre-Deployment Checklist

- [ ] Update `frontend/vite.config.ts` with production API URL
- [ ] Update `backend/env.example` with production settings
- [ ] Set up database (MySQL/PostgreSQL)
- [ ] Configure CORS settings
- [ ] Set up SSL certificates
- [ ] Configure domain names
- [ ] Set up monitoring and logging

## 🗄️ Database Setup

### MySQL (Recommended)
```sql
CREATE DATABASE idap_database;
CREATE USER 'idap_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON idap_database.* TO 'idap_user'@'%';
FLUSH PRIVILEGES;
```

### PostgreSQL
```sql
CREATE DATABASE idap_database;
CREATE USER idap_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE idap_database TO idap_user;
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use strong passwords and restrict access
3. **CORS**: Configure allowed origins properly
4. **SSL**: Always use HTTPS in production
5. **Updates**: Keep dependencies updated

## 📊 Monitoring

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Bugsnag
- **Performance**: New Relic, DataDog
- **Logs**: Papertrail, Loggly

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check `CORS_ALLOWED_ORIGINS` setting
2. **Database Connection**: Verify database credentials and network access
3. **Build Failures**: Check Node.js and PHP versions
4. **API 500 Errors**: Check Laravel logs and environment variables

### Debug Commands
```bash
# Check Laravel logs
php artisan log:clear
tail -f storage/logs/laravel.log

# Check database connection
php artisan tinker
DB::connection()->getPdo();

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check Laravel and Vite logs
4. Verify environment variables

## 🔄 CI/CD Setup

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**Note**: Always test deployments in a staging environment first!
