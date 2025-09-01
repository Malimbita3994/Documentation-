<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TemplateController extends Controller
{
    /**
     * Get all templates with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Template::with('user')->active();

        // Apply filters
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('content_type')) {
            $query->byContentType($request->content_type);
        }

        if ($request->has('industry')) {
            $query->byIndustry($request->industry);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        $templates = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $templates,
            'filters' => [
                'categories' => Template::distinct()->pluck('category'),
                'content_types' => Template::distinct()->pluck('content_type'),
                'industries' => Template::distinct()->pluck('industry'),
            ]
        ]);
    }

    /**
     * Upload a new template
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:General,Industry-specific,Custom',
            'content_type' => 'required|string|in:SRS,SDD,Test Cases,User Manual,Progress Report',
            'industry' => 'required|string',
            'standards' => 'nullable|array',
            'tags' => 'nullable|array',
            'file' => 'required|file|mimes:docx,doc,pdf,txt,md|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('templates', $fileName, 'public');

            $template = Template::create([
                'name' => $request->name,
                'description' => $request->description,
                'category' => $request->category,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'file_type' => $file->getClientOriginalExtension(),
                'content_type' => $request->content_type,
                'industry' => $request->industry,
                'standards' => $request->standards,
                'tags' => $request->tags,
                'uploaded_by' => auth()->id(),
                'version' => '1.0.0'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Template uploaded successfully',
                'data' => $template->load('user')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific template
     */
    public function show(Template $template): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $template->load('user')
        ]);
    }

    /**
     * Download a template
     */
    public function download(Template $template): JsonResponse
    {
        try {
            if (!Storage::disk('public')->exists($template->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template file not found'
                ], 404);
            }

            // Increment download count
            $template->incrementDownloadCount();

            $filePath = Storage::disk('public')->path($template->file_path);
            $fileName = $template->file_name;

            return response()->json([
                'success' => true,
                'message' => 'Template ready for download',
                'data' => [
                    'download_url' => route('templates.download.file', $template->id),
                    'file_name' => $fileName,
                    'file_size' => $template->file_size_formatted
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to prepare download',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actual file download endpoint
     */
    public function downloadFile(Template $template)
    {
        try {
            if (!Storage::disk('public')->exists($template->file_path)) {
                abort(404, 'Template file not found');
            }

            $filePath = Storage::disk('public')->path($template->file_path);
            
            return response()->download($filePath, $template->file_name);

        } catch (\Exception $e) {
            abort(500, 'Failed to download template');
        }
    }

    /**
     * Update a template
     */
    public function update(Request $request, Template $template): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|in:General,Industry-specific,Custom',
            'content_type' => 'sometimes|required|string|in:SRS,SDD,Test Cases,User Manual,Progress Report',
            'industry' => 'sometimes|required|string',
            'standards' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $template->update($request->only([
                'name', 'description', 'category', 'content_type', 
                'industry', 'standards', 'tags', 'is_active'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Template updated successfully',
                'data' => $template->load('user')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a template
     */
    public function destroy(Template $template): JsonResponse
    {
        try {
            // Delete the file from storage
            if (Storage::disk('public')->exists($template->file_path)) {
                Storage::disk('public')->delete($template->file_path);
            }

            $template->delete();

            return response()->json([
                'success' => true,
                'message' => 'Template deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get template statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_templates' => Template::count(),
            'active_templates' => Template::active()->count(),
            'total_downloads' => Template::sum('download_count'),
            'by_content_type' => Template::selectRaw('content_type, COUNT(*) as count')
                ->groupBy('content_type')
                ->pluck('count', 'content_type'),
            'by_industry' => Template::selectRaw('industry, COUNT(*) as count')
                ->groupBy('industry')
                ->pluck('count', 'industry'),
            'recent_uploads' => Template::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'most_downloaded' => Template::with('user')
                ->orderBy('download_count', 'desc')
                ->limit(5)
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get templates for document generation
     */
    public function forDocumentGeneration(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content_type' => 'required|string|in:SRS,SDD,Test Cases,User Manual,Progress Report',
            'industry' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = Template::active()->byContentType($request->content_type);

        if ($request->has('industry')) {
            $query->byIndustry($request->industry);
        }

        $templates = $query->orderBy('download_count', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $templates
        ]);
    }
}









