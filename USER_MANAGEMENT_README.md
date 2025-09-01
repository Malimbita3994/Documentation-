# User Management Module

A comprehensive user management system with roles and permissions for the SDD (Software Design Document) application.

## Features

### 🎯 Core Functionality
- **User Management**: Create, edit, delete, and manage user accounts
- **Role Management**: Define and manage user roles with specific permissions
- **Permission Management**: Granular permission system organized by modules
- **User Status Management**: Active, inactive, and suspended user states
- **Avatar Support**: User profile pictures with automatic fallback
- **Search & Filtering**: Advanced search and filtering capabilities
- **Bulk Operations**: Bulk status updates for multiple users

### 🔐 Security Features
- **Role-Based Access Control (RBAC)**: Assign roles to users with specific permissions
- **Permission Inheritance**: Users inherit permissions from their assigned roles
- **Module-Based Permissions**: Permissions organized by system modules
- **Admin Protection**: Prevents deletion of the last admin user
- **Role Protection**: Prevents deletion of roles with assigned users
- **Permission Protection**: Prevents deletion of permissions assigned to roles

### 📊 User Interface
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Tabbed Interface**: Separate tabs for Users, Roles, and Permissions
- **Modal Forms**: Inline editing with modal dialogs
- **Real-time Search**: Instant search across all entities
- **Pagination**: Efficient data loading with pagination
- **Status Indicators**: Visual status indicators with colors and icons

## Database Structure

### Tables
1. **users** - User accounts with extended fields
2. **roles** - User roles with descriptions
3. **permissions** - System permissions organized by modules
4. **user_role** - Many-to-many relationship between users and roles
5. **role_permission** - Many-to-many relationship between roles and permissions

### Key Fields

#### Users Table
- `id` - Primary key
- `name` - Full name
- `username` - Unique username (optional)
- `email` - Unique email address
- `phone` - Phone number (optional)
- `avatar` - Profile picture path (optional)
- `status` - User status (active/inactive/suspended)
- `last_login_at` - Last login timestamp
- `last_login_ip` - Last login IP address
- `bio` - User biography (optional)
- `preferences` - JSON field for user preferences
- `created_at`, `updated_at` - Timestamps

#### Roles Table
- `id` - Primary key
- `name` - Unique role identifier (e.g., 'admin', 'user')
- `display_name` - Human-readable role name
- `description` - Role description
- `is_active` - Whether the role is active
- `created_at`, `updated_at` - Timestamps

#### Permissions Table
- `id` - Primary key
- `name` - Unique permission identifier (e.g., 'create_user')
- `display_name` - Human-readable permission name
- `description` - Permission description
- `module` - Module category (e.g., 'users', 'projects')
- `is_active` - Whether the permission is active
- `created_at`, `updated_at` - Timestamps

## Installation & Setup

### 1. Run Migrations
```bash
cd backend
php artisan migrate
```

### 2. Seed the Database
```bash
php artisan db:seed
```

This will create:
- 3 default roles (Admin, Manager, User)
- 22 default permissions across 6 modules
- 3 sample users with different roles

### 3. Default Users
After seeding, you can log in with:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@example.com | password | Administrator |
| manager | manager@example.com | password | Project Manager |
| user | user@example.com | password | Regular User |

## API Endpoints

### Users
- `GET /api/users` - List users with pagination and filters
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/{id}/avatar` - Upload user avatar
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/bulk-status` - Bulk update user status

### Roles
- `GET /api/roles` - List roles with pagination and filters
- `POST /api/roles` - Create new role
- `GET /api/roles/{id}` - Get role details
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role
- `GET /api/roles/stats` - Get role statistics
- `POST /api/roles/{id}/permissions` - Assign permissions to role
- `GET /api/roles/{id}/permissions` - Get role permissions

### Permissions
- `GET /api/permissions` - List permissions with pagination and filters
- `POST /api/permissions` - Create new permission
- `GET /api/permissions/{id}` - Get permission details
- `PUT /api/permissions/{id}` - Update permission
- `DELETE /api/permissions/{id}` - Delete permission
- `GET /api/permissions/stats` - Get permission statistics
- `GET /api/permissions/grouped` - Get permissions grouped by module
- `POST /api/permissions/bulk` - Bulk create permissions

## Usage Examples

### Check User Permissions
```php
// In your controller or middleware
if ($user->hasPermission('create_user')) {
    // User can create users
}

if ($user->hasAnyPermission(['edit_user', 'delete_user'])) {
    // User can edit or delete users
}

if ($user->hasRole('admin')) {
    // User has admin role
}
```

### Check Role Permissions
```php
$role = Role::find(1);
if ($role->hasPermission('view_users')) {
    // Role has permission to view users
}
```

### Assign Roles to User
```php
$user = User::find(1);
$user->assignRoles([1, 2]); // Assign roles by ID
```

### Assign Permissions to Role
```php
$role = Role::find(1);
$role->assignPermissions([1, 2, 3]); // Assign permissions by ID
```

## Frontend Components

### Main Components
- `UserManagement.tsx` - Main page with tabbed interface
- `UsersTab.tsx` - User management interface
- `RolesTab.tsx` - Role management interface
- `PermissionsTab.tsx` - Permission management interface

### Modal Components
- `UserModal.tsx` - Create/edit user modal
- `UserDetailsModal.tsx` - View user details modal
- `RoleModal.tsx` - Create/edit role modal
- `PermissionModal.tsx` - Create/edit permission modal

## Customization

### Adding New Modules
1. Add new permissions to the seeder
2. Update the module options in `PermissionModal.tsx`
3. Add module colors in `PermissionsTab.tsx`

### Adding New Permissions
1. Create the permission via API or seeder
2. Assign to appropriate roles
3. Use in your controllers/middleware

### Custom Validation
Modify validation rules in the controllers:
- `UserController.php` - User validation
- `RoleController.php` - Role validation
- `PermissionController.php` - Permission validation

## Security Considerations

### Best Practices
1. **Always check permissions** before allowing actions
2. **Use middleware** for route protection
3. **Validate role assignments** to prevent privilege escalation
4. **Log sensitive operations** for audit trails
5. **Regular permission audits** to ensure proper access control

### Middleware Example
```php
// Create a permission middleware
public function handle($request, Closure $next, $permission)
{
    if (!auth()->user()->hasPermission($permission)) {
        abort(403, 'Unauthorized action.');
    }
    
    return $next($request);
}
```

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Ensure all migrations are in the correct order
   - Check for foreign key constraints

2. **Permission Not Working**
   - Verify the permission exists in the database
   - Check if the user has the correct role
   - Ensure the role has the required permission

3. **Role Assignment Issues**
   - Verify the role exists and is active
   - Check for unique constraints on role names

4. **API Errors**
   - Check API routes are properly registered
   - Verify controller methods exist
   - Check for validation errors

### Debug Commands
```bash
# Check database tables
php artisan tinker
>>> App\Models\User::count()
>>> App\Models\Role::count()
>>> App\Models\Permission::count()

# Check user roles
>>> $user = App\Models\User::find(1)
>>> $user->roles

# Check role permissions
>>> $role = App\Models\Role::find(1)
>>> $role->permissions
```

## Contributing

When adding new features to the User Management Module:

1. **Follow the existing patterns** for consistency
2. **Add proper validation** for all inputs
3. **Include error handling** for edge cases
4. **Update documentation** for new features
5. **Add tests** for new functionality
6. **Consider security implications** of changes

## License

This User Management Module is part of the SDD application and follows the same license terms.












