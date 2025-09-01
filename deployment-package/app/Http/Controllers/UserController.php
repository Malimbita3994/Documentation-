<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['roles']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filter by role
        if ($request->has('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->get('role'));
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'users' => $users,
            'roles' => Role::active()->get(),
            'statuses' => ['active', 'inactive', 'suspended']
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'status' => 'required|in:active,inactive,suspended',
            'bio' => 'nullable|string',
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'],
            'bio' => $validated['bio'] ?? null,
        ]);

        if (!empty($validated['role_ids'])) {
            $user->assignRoles($validated['role_ids']);
        }

        $user->load('roles');

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['roles.permissions']);

        return response()->json([
            'user' => $user,
            'roles' => Role::active()->get(),
            'permissions' => $user->permissions()
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id)
            ],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:active,inactive,suspended',
            'bio' => 'nullable|string',
            'role_ids' => 'array',
            'role_ids.*' => 'exists:roles,id'
        ]);

        $updateData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
            'bio' => $validated['bio'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        if (isset($validated['role_ids'])) {
            $user->assignRoles($validated['role_ids']);
        }

        $user->load('roles');

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        // Prevent deletion of the last admin user
        if ($user->hasRole('admin') && User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->count() <= 1) {
            return response()->json([
                'message' => 'Cannot delete the last admin user'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Upload user avatar.
     */
    public function uploadAvatar(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'avatar_url' => $user->avatar_url
        ]);
    }

    /**
     * Get user statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'inactive_users' => User::where('status', 'inactive')->count(),
            'suspended_users' => User::where('status', 'suspended')->count(),
            'users_by_role' => Role::withCount('users')->get(),
            'recent_logins' => User::whereNotNull('last_login_at')
                ->orderBy('last_login_at', 'desc')
                ->limit(5)
                ->get(['name', 'email', 'last_login_at'])
        ];

        return response()->json($stats);
    }

    /**
     * Bulk update user status.
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'status' => 'required|in:active,inactive,suspended'
        ]);

        User::whereIn('id', $validated['user_ids'])
            ->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Users status updated successfully'
        ]);
    }
}







