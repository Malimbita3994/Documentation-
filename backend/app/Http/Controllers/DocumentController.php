<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Project;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class DocumentController extends Controller
{
    /**
     * Display a listing of the documents.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Document::with(['project', 'creator', 'lastModifier']);

        // Include trashed if requested
        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        } elseif ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        // Filter by project
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $documents = $query->orderBy('updated_at', 'desc')->paginate(15);

        return response()->json([
            'data' => $documents->items(),
            'pagination' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
        ]);
    }

    /**
     * Restore a soft-deleted document.
     */
    public function restore(int $id): JsonResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        if (!$document->trashed()) {
            return response()->json([
                'message' => 'Document is not deleted',
            ], 422);
        }
        $document->restore();
        return response()->json([
            'message' => 'Document restored successfully',
            'data' => $document->fresh(['project', 'creator', 'lastModifier']),
        ]);
    }

    /**
     * Permanently delete a document.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $document = Document::withTrashed()->findOrFail($id);
        // Allow force delete only if currently soft-deleted or still draft
        if (!$document->trashed() && !$document->isDraft()) {
            return response()->json([
                'message' => 'Only draft or trashed documents can be permanently deleted',
            ], 422);
        }
        $document->forceDelete();
        return response()->json([
            'message' => 'Document permanently deleted',
        ]);
    }

    /**
     * Store a newly created document in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => ['required', Rule::in(Document::getTypes())],
            'project_id' => 'required|exists:projects,id',
            'template_id' => 'nullable|exists:templates,id',
            'metadata' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        // Get template if provided
        $template = null;
        if ($request->has('template_id')) {
            $template = Template::findOrFail($request->template_id);
        }

        // Create document
        $document = Document::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'project_id' => $validated['project_id'],
            'status' => Document::STATUS_DRAFT,
            'version' => '1.0',
            'content' => $template ? $this->generateContentFromTemplate($template) : [],
            'metadata' => $validated['metadata'] ?? $this->getDefaultMetadata($validated['type']),
            'created_by' => auth()->id(),
            'last_modified_by' => auth()->id(),
            'tags' => $validated['tags'] ?? [],
        ]);

        // Increment template usage count
        if ($template) {
            $template->incrementUsageCount();
        }

        return response()->json([
            'message' => 'Document created successfully',
            'data' => $document->load(['project', 'creator']),
        ], 201);
    }

    /**
     * Display the specified document.
     */
    public function show(Document $document): JsonResponse
    {
        $document->load([
            'project',
            'creator',
            'lastModifier',
            'requirements',
            'sections',
            'diagrams',
            'tables',
            'attachments',
        ]);

        return response()->json([
            'data' => $document,
        ]);
    }

    /**
     * Update the specified document in storage.
     */
    public function update(Request $request, Document $document): JsonResponse
    {
        // Check if document can be edited
        if (!$document->canBeEdited()) {
            return response()->json([
                'message' => 'Document cannot be edited in its current status',
            ], 422);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|array',
            'metadata' => 'sometimes|array',
            'tags' => 'sometimes|array',
            'status' => ['sometimes', Rule::in(Document::getStatuses())],
        ]);

        // Increment version if content is updated
        if (isset($validated['content'])) {
            $document->incrementVersion();
        }

        $document->update([
            ...$validated,
            'last_modified_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Document updated successfully',
            'data' => $document->fresh(['project', 'creator', 'lastModifier']),
        ]);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(Document $document): JsonResponse
    {
        // Soft delete allowed for any document
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully',
        ]);
    }

    /**
     * Get document statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Document::count(),
            'by_type' => Document::selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'by_status' => Document::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'recent' => Document::with(['project', 'creator'])
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Generate content structure from template.
     */
    private function generateContentFromTemplate(Template $template): array
    {
        $sections = $template->getStructureSections();
        
        return [
            'sections' => collect($sections)->map(function ($section) {
                return [
                    'id' => uniqid(),
                    'title' => $section['title'],
                    'content' => $section['content_template'] ?? '',
                    'level' => $section['level'] ?? 1,
                    'order' => $section['order'] ?? 1,
                    'parent_id' => $section['parent_id'] ?? null,
                ];
            })->toArray(),
            'diagrams' => [],
            'tables' => [],
            'attachments' => [],
        ];
    }

    /**
     * Get default metadata for document type.
     */
    private function getDefaultMetadata(string $type): array
    {
        $defaults = [
            'systemName' => '',
            'purpose' => '',
            'scope' => '',
            'stakeholders' => [],
            'assumptions' => [],
            'constraints' => [],
            'references' => [],
            'glossary' => [],
            'acronyms' => [],
        ];

        // Add type-specific defaults
        if ($type === Document::TYPE_SRS) {
            $defaults['systemName'] = 'System Name';
            $defaults['purpose'] = 'Define system requirements';
            $defaults['scope'] = 'System scope description';
        } elseif ($type === Document::TYPE_SDD) {
            $defaults['systemName'] = 'System Name';
            $defaults['purpose'] = 'Define system design';
            $defaults['scope'] = 'System design scope';
        }

        return $defaults;
    }
}















