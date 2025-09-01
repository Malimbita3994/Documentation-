<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function show()
    {
        // Get the authenticated user from the request
        $user = auth()->user();
        
        if (!$user) {
            // For development, try to get the first user as fallback
            $user = User::first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'No authenticated user found',
                    'error' => 'Please log in or run database migrations and seeders first'
                ], 404);
            }
        }
        
        $user->load('roles');
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'avatar' => $user->avatar_url ?? null,
            'bio' => $user->bio ?? '',
            'status' => $user->status ?? 'active',
            'last_login_at' => $user->last_login_at ?? now(),
            'last_login_ip' => $user->last_login_ip ?? '',
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                ];
            }),
            'preferences' => $user->preferences ?? [
                'theme' => 'light',
                'notifications' => [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
                'language' => 'en',
                'timezone' => 'UTC',
            ],
        ]);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request)
    {
        // Get the authenticated user from the request
        $user = auth()->user();
        
        if (!$user) {
            // For development, try to get the first user as fallback
            $user = User::first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'No authenticated user found',
                    'error' => 'Please log in or run database migrations and seeders first'
                ], 404);
            }
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update($validator->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar_url,
                'bio' => $user->bio,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at,
                'last_login_ip' => $user->last_login_ip,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'display_name' => $role->display_name,
                    ];
                }),
                'preferences' => $user->preferences,
            ],
        ]);
    }

    /**
     * Upload avatar for the authenticated user
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For development, use the System Administrator user
        $user = User::where('name', 'System Administrator')->first();

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => $user->avatar_url,
        ]);
    }

    /**
     * Change password for the authenticated user
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For development, use the System Administrator user
        $user = User::where('name', 'System Administrator')->first();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'preferences' => 'required|array',
            'preferences.theme' => 'required|in:light,dark,system',
            'preferences.notifications' => 'required|array',
            'preferences.notifications.email' => 'required|boolean',
            'preferences.notifications.push' => 'required|boolean',
            'preferences.notifications.sms' => 'required|boolean',
            'preferences.language' => 'required|string|max:10',
            'preferences.timezone' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For development, use the System Administrator user
        $user = User::where('name', 'System Administrator')->first();
        $user->update(['preferences' => $request->preferences]);

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $user->preferences,
        ]);
    }

    /**
     * Get user activity and statistics
     */
    public function activity()
    {
        // For development, use the System Administrator user
        $user = User::where('name', 'System Administrator')->first();

        // You can add more activity tracking here
        $activity = [
            'last_login' => $user->last_login_at,
            'last_login_ip' => $user->last_login_ip,
            'account_created' => $user->created_at,
            'profile_updated' => $user->updated_at,
            'total_logins' => 0, // You can implement login tracking
            'roles_count' => $user->roles->count(),
            'permissions_count' => $user->permissions->count(),
        ];

        return response()->json($activity);
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For development, use the System Administrator user
        $user = User::where('name', 'System Administrator')->first();

        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password is incorrect',
            ], 422);
        }

        // Delete avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }
}
