# User Profile Management System

## Overview

The User Profile Management System provides a comprehensive interface for users to manage their personal information, security settings, preferences, and notifications. This feature is integrated with the existing User Management module and provides a seamless user experience.

## Features

### 🎯 Core Features

1. **Personal Information Management**
   - Edit profile details (name, username, email, phone, bio)
   - Upload and manage profile avatars
   - View account creation and last login information

2. **Security Settings**
   - Change password with current password verification
   - Account deletion with password confirmation

3. **User Preferences**
   - Theme selection (Light, Dark, System)
   - Language preferences
   - Timezone settings

4. **Notification Settings**
   - Email notifications toggle
   - Push notifications toggle
   - SMS notifications toggle

### 🎨 User Interface

- **Tabbed Interface**: Organized into 4 main sections (Profile, Security, Preferences, Notifications)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Avatar Management**: Drag-and-drop or click-to-upload avatar functionality

## File Structure

### Frontend Components

```
frontend/src/
├── pages/
│   └── UserProfile.tsx          # Main profile page component
├── components/
│   └── Header.tsx               # Updated with profile link
└── App.tsx                      # Added profile route
```

### Backend Components

```
backend/
├── app/Http/Controllers/
│   └── ProfileController.php    # Profile management controller
├── app/Http/Middleware/
│   └── ApiAuth.php             # Simple API authentication
├── routes/
│   └── api.php                 # Profile API routes
└── bootstrap/
    └── app.php                 # Middleware registration
```

## API Endpoints

### Profile Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile information |
| PUT | `/api/profile` | Update user profile |
| POST | `/api/profile/avatar` | Upload profile avatar |
| PUT | `/api/profile/password` | Change password |
| PUT | `/api/profile/preferences` | Update user preferences |
| GET | `/api/profile/activity` | Get user activity statistics |
| DELETE | `/api/profile` | Delete user account |

### Request/Response Examples

#### Get Profile
```bash
GET /api/profile
Authorization: Bearer your-token
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "avatar": "http://localhost:8000/storage/avatars/avatar.jpg",
  "bio": "Software Developer",
  "status": "active",
  "last_login_at": "2024-01-15T10:30:00Z",
  "roles": [
    {
      "id": 1,
      "name": "admin",
      "display_name": "Administrator"
    }
  ],
  "preferences": {
    "theme": "light",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "language": "en",
    "timezone": "UTC"
  }
}
```

#### Update Profile
```bash
PUT /api/profile
Authorization: Bearer your-token
Content-Type: application/json

{
  "name": "John Doe Updated",
  "username": "johndoe_updated",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "bio": "Updated bio information"
}
```

#### Upload Avatar
```bash
POST /api/profile/avatar
Authorization: Bearer your-token
Content-Type: multipart/form-data

avatar: [file]
```

## Installation & Setup

### 1. Backend Setup

1. **Run Migrations** (if not already done):
   ```bash
   php artisan migrate
   ```

2. **Create Storage Link**:
   ```bash
   php artisan storage:link
   ```

3. **Start Laravel Server**:
   ```bash
   php artisan serve
   ```

### 2. Frontend Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

### 3. Access the Profile

1. Navigate to your application: `http://localhost:3000`
2. Click on your profile avatar in the header
3. Select "Your Profile" from the dropdown menu
4. Or directly visit: `http://localhost:3000/profile`

## Usage

### Profile Management

1. **Edit Personal Information**:
   - Click the "Edit" button in the Profile tab
   - Modify your information
   - Click "Save Changes"

2. **Upload Avatar**:
   - Click the camera icon on your avatar
   - Select an image file
   - Click "Save" to upload

3. **Change Password**:
   - Go to the Security tab
   - Enter current password
   - Enter new password and confirmation
   - Click "Update Password"

4. **Update Preferences**:
   - Go to the Preferences tab
   - Select your preferred theme, language, and timezone
   - Click "Save Preferences"

5. **Manage Notifications**:
   - Go to the Notifications tab
   - Toggle notification types on/off
   - Click "Save Notification Settings"

## Security Features

- **Password Verification**: Current password required for changes
- **File Validation**: Avatar uploads are validated for type and size
- **Input Sanitization**: All user inputs are validated and sanitized
- **Authentication**: All profile routes require authentication

## Customization

### Adding New Preferences

1. **Update User Model**:
   ```php
   // In User.php
   protected $casts = [
       'preferences' => 'array',
   ];
   ```

2. **Update ProfileController**:
   ```php
   // Add validation rules in updatePreferences method
   'preferences.new_setting' => 'required|string',
   ```

3. **Update Frontend**:
   ```typescript
   // Add to UserProfile interface
   preferences: {
       // ... existing preferences
       new_setting: string;
   }
   ```

### Styling Customization

The profile page uses Tailwind CSS classes. You can customize the appearance by:

1. **Modifying Colors**: Update color classes in the components
2. **Changing Layout**: Adjust grid and flex classes
3. **Adding Animations**: Include additional transition classes

## Troubleshooting

### Common Issues

1. **Avatar Not Uploading**:
   - Ensure storage link is created: `php artisan storage:link`
   - Check file permissions on storage directory
   - Verify file size is under 2MB

2. **API Authentication Errors**:
   - Check if middleware is properly registered
   - Verify Authorization header is included in requests

3. **Profile Not Loading**:
   - Check browser console for API errors
   - Verify backend server is running
   - Check database connection

### Development Notes

- The current authentication is simplified for development
- In production, implement proper JWT or Sanctum authentication
- Add rate limiting for API endpoints
- Implement proper error handling and logging

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Social media profile integration
- [ ] Profile completion percentage
- [ ] Activity timeline
- [ ] Profile export functionality
- [ ] Advanced notification preferences
- [ ] Profile templates/themes

## Support

For issues or questions about the User Profile system, please refer to the main project documentation or create an issue in the project repository.
