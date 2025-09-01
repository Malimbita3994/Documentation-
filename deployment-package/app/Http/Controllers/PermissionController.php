<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Permission::with(['roles']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('display_name', 'like', "%{$search}%");
            });
        }

        // Filter by module
        if ($request->has('module')) {
            $query->where('module', $request->get('module'));
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $permissions = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'permissions' => $permissions,
            'modules' => Permission::distinct()->pluck('module'),
            'grouped_permissions' => Permission::getGroupedByModule()
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        $permission = Permission::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'module' => $validated['module'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $permission->load('roles');

        return response()->json([
            'message' => 'Permission created successfully',
            'permission' => $permission
        ], 201);
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): JsonResponse
    {
        $permission->load(['roles.users']);

        return response()->json([
            'permission' => $permission,
            'roles_with_permission' => $permission->roles()->withCount('users')->get()
        ]);
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        $permission->update([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'module' => $validated['module'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $permission->load('roles');

        return response()->json([
            'message' => 'Permission updated successfully',
            'permission' => $permission
        ]);
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): JsonResponse
    {
        // Prevent deletion of permissions that are assigned to roles
        if ($permission->roles()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete permission that is assigned to roles'
            ], 422);
        }

        $permission->delete();

        return response()->json([
            'message' => 'Permission deleted successfully'
        ]);
    }

    /**
     * Get permission statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_permissions' => Permission::count(),
            'active_permissions' => Permission::where('is_active', true)->count(),
            'inactive_permissions' => Permission::where('is_active', false)->count(),
            'permissions_by_module' => Permission::selectRaw('module, count(*) as count')
                ->groupBy('module')
                ->get(),
            'most_used_permissions' => Permission::withCount('roles')
                ->orderBy('roles_count', 'desc')
                ->limit(10)
                ->get(),
            'modules' => Permission::distinct()->pluck('module')
        ];

        return response()->json($stats);
    }

    /**
     * Get permissions grouped by module.
     */
    public function getGroupedByModule(): JsonResponse
    {
        $groupedPermissions = Permission::getGroupedByModule();

        return response()->json([
            'grouped_permissions' => $groupedPermissions,
            'modules' => array_keys($groupedPermissions->toArray())
        ]);
    }

    /**
     * Bulk create permissions for a module.
     */
    public function bulkCreate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module' => 'required|string|max:255',
            'permissions' => 'required|array',
            'permissions.*.name' => 'required|string|max:255',
            'permissions.*.display_name' => 'required|string|max:255',
            'permissions.*.description' => 'nullable|string'
        ]);

        $createdPermissions = [];

        foreach ($validated['permissions'] as $permissionData) {
            $permission = Permission::create([
                'name' => $permissionData['name'],
                'display_name' => $permissionData['display_name'],
                'description' => $permissionData['description'] ?? null,
                'module' => $validated['module'],
                'is_active' => true,
            ]);

            $createdPermissions[] = $permission;
        }

        return response()->json([
            'message' => count($createdPermissions) . ' permissions created successfully',
            'permissions' => $createdPermissions
        ], 201);
    }

    /**
     * Get permissions for a specific role.
     */
    public function getForRole(Role $role): JsonResponse
    {
        $role->load('permissions');

        return response()->json([
            'role' => $role,
            'assigned_permissions' => $role->permissions,
            'all_permissions' => Permission::getGroupedByModule()
        ]);
    }
}


