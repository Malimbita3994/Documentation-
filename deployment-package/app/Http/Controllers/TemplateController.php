<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class TemplateController extends Controller
{
    /**
     * Display a listing of templates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Template::with(['creator']);

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('is_default')) {
            $query->where('is_default', $request->boolean('is_default'));
        }

        if ($request->has('is_custom')) {
            $query->where('is_custom', $request->boolean('is_custom'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $templates = $query->orderBy('is_default', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->paginate(15);

        return response()->json([
            'data' => $templates->items(),
            'pagination' => [
                'current_page' => $templates->currentPage(),
                'last_page' => $templates->lastPage(),
                'per_page' => $templates->perPage(),
                'total' => $templates->total(),
            ]
        ]);
    }

    /**
     * Store a newly created template.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(Template::TYPES)],
            'description' => 'nullable|string',
            'structure' => 'required|array',
            'is_default' => 'boolean',
            'is_custom' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id() ?? 1; // Default to user ID 1 if no auth
        $validated['is_default'] = $validated['is_default'] ?? false;
        $validated['is_custom'] = $validated['is_custom'] ?? true;

        $template = Template::create($validated);

        $template->load('creator');

        return response()->json([
            'message' => 'Template created successfully',
            'data' => $template
        ], 201);
    }

    /**
     * Display the specified template.
     */
    public function show(Template $template): JsonResponse
    {
        $template->load('creator');

        return response()->json([
            'data' => $template
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, Template $template): JsonResponse
    {
        // Prevent updating default templates
        if ($template->is_default) {
            return response()->json([
                'message' => 'Cannot modify default templates'
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => ['sometimes', 'required', Rule::in(Template::TYPES)],
            'description' => 'nullable|string',
            'structure' => 'sometimes|required|array',
            'is_custom' => 'boolean',
        ]);

        $validated['is_custom'] = $validated['is_custom'] ?? true;

        $template->update($validated);

        $template->load('creator');

        return response()->json([
            'message' => 'Template updated successfully',
            'data' => $template
        ]);
    }

    /**
     * Remove the specified template.
     */
    public function destroy(Template $template): JsonResponse
    {
        // Prevent deleting default templates
        if ($template->is_default) {
            return response()->json([
                'message' => 'Cannot delete default templates'
            ], 422);
        }

        // Check if template is in use
        if ($template->usage_count > 0) {
            return response()->json([
                'message' => 'Cannot delete template that is currently in use'
            ], 422);
        }

        $template->delete();

        return response()->json([
            'message' => 'Template deleted successfully'
        ]);
    }
}









