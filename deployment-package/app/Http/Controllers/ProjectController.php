<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['manager', 'team']);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $projects = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $projects->items(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ]
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(Project::getStatuses())],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'manager_id' => 'required|exists:users,id',
            'team_members' => 'nullable|array',
            'team_members.*' => 'exists:users,id',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'manager_id' => $validated['manager_id'],
        ]);

        // Add team members if provided
        if (!empty($validated['team_members'])) {
            $project->team()->attach($validated['team_members']);
        }

        $project->load(['manager', 'team']);

        return response()->json([
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): JsonResponse
    {
        $project->load([
            'manager',
            'team',
            'documents',
            'requirements'
        ]);

        return response()->json([
            'data' => $project
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes', 'required', Rule::in(Project::getStatuses())],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'manager_id' => 'sometimes|required|exists:users,id',
            'team_members' => 'nullable|array',
            'team_members.*' => 'exists:users,id',
        ]);

        $project->update($validated);

        // Update team members if provided
        if (isset($validated['team_members'])) {
            $project->team()->sync($validated['team_members']);
        }

        $project->load(['manager', 'team']);

        return response()->json([
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): JsonResponse
    {
        // Check if project has documents or requirements
        if ($project->documents()->exists() || $project->requirements()->exists()) {
            return response()->json([
                'message' => 'Cannot delete project with associated documents or requirements'
            ], 422);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}









