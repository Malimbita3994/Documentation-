# Authentication System

A comprehensive authentication system for the SDD (Software Design Document) application with login, registration, and protected routes.

## Features

### 🔐 Authentication Features
- **User Login**: Secure login with email and password
- **User Registration**: New user account creation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token-based Authentication**: JWT-like token system for session management
- **Logout Functionality**: Secure session termination
- **Remember Me**: Optional persistent login
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error messages and user feedback

### 🎨 UI/UX Features
- **Modern Design**: Beautiful gradient backgrounds with animated elements
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during authentication processes
- **Password Visibility Toggle**: Show/hide password functionality
- **Social Login Options**: Google and Twitter integration (UI ready)
- **Accessibility**: Proper ARIA labels and keyboard navigation

## File Structure

### Frontend Components

```
frontend/src/
├── pages/
│   ├── Login.tsx              # Login page component
│   └── Register.tsx           # Registration page component
├── components/
│   └── ProtectedRoute.tsx     # Route protection component
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
└── App.tsx                    # Main app with routing
```

### Backend Components

```
backend/
├── app/Http/Controllers/
│   └── AuthController.php     # Authentication controller
├── app/Models/
│   ├── User.php              # User model (existing)
│   ├── Role.php              # Role model (existing)
│   └── Permission.php        # Permission model (existing)
└── routes/
    └── api.php               # API routes
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | User login | `{ email, password }` |
| POST | `/api/auth/register` | User registration | `{ name, email, username, password, password_confirmation }` |
| POST | `/api/auth/logout` | User logout | None |
| GET | `/api/auth/me` | Get current user | None |
| POST | `/api/auth/refresh` | Refresh token | None |

### Request/Response Examples

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&color=7C3AED&background=EBF4FF",
    "status": "active",
    "roles": [
      {
        "id": 1,
        "name": "user",
        "display_name": "User"
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
}
```

#### Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "username": "janedoe",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "janedoe"
  }
}
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PHP (v8.0 or higher)
- Laravel (v11)
- MySQL/PostgreSQL database

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Start Development Server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Install Dependencies:**
```bash
cd backend
composer install
```

2. **Environment Configuration:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Setup:**
```bash
php artisan migrate:fresh --seed
```

4. **Start Development Server:**
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

## Usage

### Authentication Flow

1. **Access Protected Route**: When a user tries to access a protected route without authentication, they are automatically redirected to `/login`

2. **Login Process**:
   - User enters email and password
   - Form validation occurs on both client and server
   - On successful login, user data and token are stored in localStorage
   - User is redirected to the originally requested page or dashboard

3. **Registration Process**:
   - User fills out registration form with validation
   - Account is created with default "user" role
   - User is redirected to login page with success message

4. **Logout Process**:
   - User clicks logout in header dropdown
   - Token and user data are cleared from localStorage
   - User is redirected to login page

### Protected Routes

All application routes (except `/login` and `/register`) are protected by the `ProtectedRoute` component:

```tsx
<Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="documents" element={<Documents />} />
  {/* ... other routes */}
</Route>
```

### Authentication Context

The `AuthContext` provides authentication state and methods throughout the application:

```tsx
const { user, token, isAuthenticated, login, logout } = useAuth()
```

## Security Features

### Frontend Security
- **Form Validation**: Client-side validation prevents invalid data submission
- **Password Requirements**: Minimum 6 characters with confirmation
- **Token Storage**: Secure localStorage management
- **Route Protection**: Automatic redirection for unauthenticated users

### Backend Security
- **Password Hashing**: Laravel's Hash facade for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Unique Constraints**: Email and username uniqueness validation
- **Status Checking**: Only active users can log in
- **Token Generation**: Secure random token generation

## Customization

### Styling
The authentication pages use Tailwind CSS with custom animations. You can customize:

- **Colors**: Modify gradient classes in the background divs
- **Animations**: Update the CSS keyframes in the `<style>` blocks
- **Layout**: Adjust the responsive classes and spacing

### Validation Rules
Modify validation rules in both frontend and backend:

**Frontend (Login.tsx/Register.tsx):**
```tsx
const validateForm = (): boolean => {
  // Custom validation logic
}
```

**Backend (AuthController.php):**
```php
$validator = Validator::make($request->all(), [
    'email' => 'required|email',
    'password' => 'required|string|min:6',
    // Add custom rules
]);
```

### User Roles
The system automatically assigns the "user" role to new registrations. Modify in `AuthController.php`:

```php
// Assign default role (User role)
$userRole = \App\Models\Role::where('name', 'user')->first();
if ($userRole) {
    $user->roles()->attach($userRole->id);
}
```

## Testing

### Manual Testing

1. **Login Test**:
   - Navigate to `/login`
   - Enter valid credentials
   - Verify successful login and redirect

2. **Registration Test**:
   - Navigate to `/register`
   - Fill out form with valid data
   - Verify account creation and redirect to login

3. **Protected Route Test**:
   - Try to access `/` without authentication
   - Verify redirect to login page
   - Login and verify access to protected routes

4. **Logout Test**:
   - Login to the application
   - Click logout in header
   - Verify logout and redirect to login

### API Testing

Test the authentication endpoints using curl or Postman:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"password123","password_confirmation":"password123"}'
```

## Troubleshooting

### Common Issues

1. **Login Not Working**:
   - Check if backend server is running on port 8000
   - Verify database connection and user exists
   - Check browser console for API errors

2. **Registration Fails**:
   - Ensure all required fields are filled
   - Check password confirmation matches
   - Verify email and username are unique

3. **Protected Routes Not Working**:
   - Check if AuthProvider wraps the app
   - Verify ProtectedRoute component is properly configured
   - Check localStorage for token and user data

4. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check if all required CSS classes are available
   - Verify CSS animations are working

### Development Tips

1. **Clear Browser Data**: Clear localStorage when testing authentication flows
2. **Check Network Tab**: Monitor API requests in browser developer tools
3. **Database Reset**: Use `php artisan migrate:fresh --seed` to reset database
4. **Token Debugging**: Check localStorage for token and user data

## Future Enhancements

### Planned Features
- **Email Verification**: Send verification emails for new registrations
- **Password Reset**: Forgot password functionality
- **Two-Factor Authentication**: Additional security layer
- **Social Login**: Google, GitHub, and other OAuth providers
- **Session Management**: Multiple device login handling
- **Remember Me**: Persistent login functionality

### Production Considerations
- **HTTPS**: Enable SSL/TLS for all authentication requests
- **Rate Limiting**: Implement API rate limiting
- **Token Expiration**: Add token expiration and refresh logic
- **Audit Logging**: Log authentication events for security
- **Password Policies**: Implement stronger password requirements

## Support

For issues or questions about the authentication system:

1. Check the troubleshooting section above
2. Review the API documentation
3. Test with the provided examples
4. Check browser console and Laravel logs for errors

The authentication system is designed to be secure, user-friendly, and easily extensible for future requirements.











