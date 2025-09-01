<?php

namespace App\Http\Controllers;

use App\Models\Requirement;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class RequirementController extends Controller
{
    /**
     * Display a listing of requirements.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Requirement::with(['project', 'assignedUser', 'parent', 'children']);

        // Apply filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $requirements = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $requirements->items(),
            'pagination' => [
                'current_page' => $requirements->currentPage(),
                'last_page' => $requirements->lastPage(),
                'per_page' => $requirements->perPage(),
                'total' => $requirements->total(),
            ]
        ]);
    }

    /**
     * Store a newly created requirement.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => ['required', Rule::in(Requirement::TYPES)],
            'priority' => ['required', Rule::in(Requirement::PRIORITIES)],
            'status' => ['required', Rule::in(Requirement::STATUSES)],
            'project_id' => 'required|exists:projects,id',
            'document_id' => 'nullable|exists:documents,id',
            'parent_id' => 'nullable|exists:requirements,id',
            'assigned_to' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'acceptance_criteria' => 'nullable|array',
            'acceptance_criteria.*' => 'string',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'exists:requirements,id',
        ]);

        $requirement = Requirement::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'status' => $validated['status'],
            'project_id' => $validated['project_id'],
            'document_id' => $validated['document_id'],
            'parent_id' => $validated['parent_id'],
            'assigned_to' => $validated['assigned_to'],
            'tags' => $validated['tags'] ?? [],
            'acceptance_criteria' => $validated['acceptance_criteria'] ?? [],
            'dependencies' => $validated['dependencies'] ?? [],
        ]);

        $requirement->load(['project', 'assignedUser', 'parent', 'children']);

        return response()->json([
            'message' => 'Requirement created successfully',
            'data' => $requirement
        ], 201);
    }

    /**
     * Display the specified requirement.
     */
    public function show(Requirement $requirement): JsonResponse
    {
        $requirement->load([
            'project',
            'assignedUser',
            'parent',
            'children',
            'document'
        ]);

        return response()->json([
            'data' => $requirement
        ]);
    }

    /**
     * Update the specified requirement.
     */
    public function update(Request $request, Requirement $requirement): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => ['sometimes', 'required', Rule::in(Requirement::TYPES)],
            'priority' => ['sometimes', 'required', Rule::in(Requirement::PRIORITIES)],
            'status' => ['sometimes', 'required', Rule::in(Requirement::STATUSES)],
            'project_id' => 'sometimes|required|exists:projects,id',
            'document_id' => 'nullable|exists:documents,id',
            'parent_id' => 'nullable|exists:requirements,id',
            'assigned_to' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'acceptance_criteria' => 'nullable|array',
            'acceptance_criteria.*' => 'string',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'exists:requirements,id',
        ]);

        $requirement->update($validated);

        $requirement->load(['project', 'assignedUser', 'parent', 'children']);

        return response()->json([
            'message' => 'Requirement updated successfully',
            'data' => $requirement
        ]);
    }

    /**
     * Remove the specified requirement.
     */
    public function destroy(Requirement $requirement): JsonResponse
    {
        // Check if requirement has children
        if ($requirement->children()->exists()) {
            return response()->json([
                'message' => 'Cannot delete requirement with child requirements'
            ], 422);
        }

        $requirement->delete();

        return response()->json([
            'message' => 'Requirement deleted successfully'
        ]);
    }
}















