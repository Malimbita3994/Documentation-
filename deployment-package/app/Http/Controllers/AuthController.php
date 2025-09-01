<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and return token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // For development, we'll use a simple approach
        // In production, you'd want to use Laravel Sanctum or Passport
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Check if user is active
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Account is not active',
            ], 403);
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Generate a simple token (in production, use proper JWT or Sanctum)
        $token = bin2hex(random_bytes(32));

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'avatar' => $user->avatar_url,
                'status' => $user->status,
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
            ],
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        // In a real application, you'd invalidate the token
        // For now, we'll just return a success message
        
        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        // For development, return the manager user
        // In production, you'd get the user from the token
        $user = User::where('username', 'manager')->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        
        $user->load('roles');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'avatar' => $user->avatar_url,
                'status' => $user->status,
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
            ],
        ]);
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => strtolower(str_replace(' ', '', $request->name)), // Generate username from name
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        // Assign default role (User role)
        $userRole = \App\Models\Role::where('name', 'user')->first();
        if ($userRole) {
            $user->roles()->attach($userRole->id);
        }

        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
            ],
        ], 201);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        // For development, generate a new token
        // In production, you'd validate the current token and issue a new one
        $token = bin2hex(random_bytes(32));

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $token,
        ]);
    }
}
