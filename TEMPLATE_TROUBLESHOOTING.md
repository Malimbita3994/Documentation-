# 🔧 **Template System Troubleshooting Guide**

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Template System Not Seamless"**

#### **Symptoms:**
- Templates page loads slowly or shows errors
- Upload/download operations fail
- Statistics don't display properly
- System feels unresponsive

#### **Solutions:**

##### **1. Check Backend Connection**
```bash
# Start Laravel backend server
cd backend
php artisan serve

# Check if server is running on http://localhost:8000
curl http://localhost:8000/api/health
```

##### **2. Verify Frontend Environment**
```bash
# Check frontend environment variables
cd frontend
cat .env

# Ensure these variables are set:
VITE_API_URL=http://localhost:8000/api
VITE_FRONTEND_URL=http://localhost:3000
```

##### **3. Check Database Migration**
```bash
cd backend
php artisan migrate:status
php artisan migrate
```

##### **4. Verify Storage Setup**
```bash
cd backend
php artisan storage:link
ls -la public/storage
```

### **Issue 2: "Offline Mode Active"**

#### **Symptoms:**
- Yellow warning banner shows "Offline Mode"
- Sample templates are displayed instead of real data
- Upload shows "stored locally only" message

#### **Solutions:**

##### **1. Check Backend Health**
- Look at the System Status Indicator (bottom-right corner)
- Click "Reconnect" button in Templates page
- Verify backend server is running

##### **2. Check Network Connectivity**
```bash
# Test API endpoint
curl -X GET http://localhost:8000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

##### **3. Restart Services**
```bash
# Restart backend
cd backend
php artisan serve

# Restart frontend
cd frontend
npm run dev
```

### **Issue 3: "Upload Fails"**

#### **Symptoms:**
- File upload modal doesn't work
- Upload button is disabled
- Error messages during upload

#### **Solutions:**

##### **1. Check File Permissions**
```bash
cd backend
chmod -R 755 storage/app/public/templates
chmod -R 755 storage/app/public
```

##### **2. Verify File Size Limits**
```php
// Check in backend/config/app.php
'upload_max_filesize' => '10M',
'post_max_size' => '10M',
```

##### **3. Check Supported File Types**
- Ensure file is: DOCX, DOC, PDF, TXT, or MD
- File size must be under 10MB

### **Issue 4: "Download Doesn't Work"**

#### **Symptoms:**
- Download button doesn't respond
- File doesn't download
- Error messages during download

#### **Solutions:**

##### **1. Check Authentication**
```javascript
// Verify auth token exists
console.log(localStorage.getItem('authToken'))
```

##### **2. Check File Storage**
```bash
cd backend
ls -la storage/app/public/templates/
```

##### **3. Verify Download Route**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/templates/1/download
```

### **Issue 5: "Statistics Not Loading"**

#### **Symptoms:**
- Statistics cards show 0 or loading indefinitely
- No data in charts or analytics

#### **Solutions:**

##### **1. Check Database**
```bash
cd backend
php artisan tinker
>>> App\Models\Template::count()
```

##### **2. Verify Statistics Endpoint**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/templates/statistics
```

##### **3. Check Template Data**
```bash
cd backend
php artisan tinker
>>> App\Models\Template::all()->toArray()
```

## 🔍 **Diagnostic Tools**

### **1. System Status Indicator**
- Located at bottom-right corner of Templates page
- Shows real-time status of all services
- Click to expand and see detailed status
- Use "Refresh Status" button to recheck

### **2. Browser Developer Tools**
```javascript
// Check API responses
fetch('http://localhost:8000/api/health')
  .then(response => response.json())
  .then(data => console.log(data))

// Check template service
console.log(templateService.isOffline())
```

### **3. Laravel Logs**
```bash
cd backend
tail -f storage/logs/laravel.log
```

### **4. Network Tab**
- Open browser DevTools → Network tab
- Monitor API calls during operations
- Check for failed requests

## 🛠️ **Quick Fixes**

### **Reset Everything**
```bash
# Backend
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan migrate:fresh --seed

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Check Environment**
```bash
# Backend
cd backend
cp .env.example .env
php artisan key:generate

# Frontend
cd frontend
cp env.example .env
# Edit .env with correct values
```

### **Verify Dependencies**
```bash
# Backend
cd backend
composer install
composer dump-autoload

# Frontend
cd frontend
npm install
```

## 📊 **Performance Optimization**

### **1. Enable Caching**
```bash
cd backend
php artisan config:cache
php artisan route:cache
```

### **2. Optimize Database**
```bash
cd backend
php artisan migrate:status
# Ensure all migrations are up to date
```

### **3. Check File Storage**
```bash
cd backend
# Ensure storage is properly linked
php artisan storage:link
# Check permissions
chmod -R 755 storage/app/public
```

## 🔒 **Security Checks**

### **1. Authentication**
```javascript
// Verify JWT token
const token = localStorage.getItem('authToken')
if (!token) {
  // Redirect to login
  window.location.href = '/login'
}
```

### **2. File Validation**
```php
// Backend validation rules
'file' => 'required|file|mimes:docx,doc,pdf,txt,md|max:10240'
```

### **3. CORS Configuration**
```php
// backend/config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
];
```

## 📞 **Getting Help**

### **1. Check Logs**
```bash
# Backend logs
cd backend
tail -f storage/logs/laravel.log

# Frontend console
# Open browser DevTools → Console
```

### **2. Test Individual Components**
```bash
# Test backend health
curl http://localhost:8000/api/health

# Test template endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/templates
```

### **3. Verify Configuration**
```bash
# Backend config
cd backend
php artisan config:show

# Frontend env
cd frontend
cat .env
```

## 🎯 **Success Indicators**

When everything is working correctly, you should see:

✅ **Backend Status**: Green dot in System Status Indicator  
✅ **Template Service**: Online status  
✅ **Upload Works**: Files upload successfully  
✅ **Download Works**: Files download with original names  
✅ **Statistics Load**: Real data in statistics cards  
✅ **Search Works**: Templates filter properly  
✅ **No Errors**: Clean browser console  

## 🚀 **Pro Tips**

1. **Always check the System Status Indicator first**
2. **Use browser DevTools to monitor network requests**
3. **Check Laravel logs for backend errors**
4. **Verify environment variables are set correctly**
5. **Test with sample templates in offline mode**
6. **Use the "Reconnect" button when offline mode is active**

---

**Need more help? Check the main README or contact support!** 🆘



