<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class HelpController extends Controller
{
    /**
     * Get help categories and sections
     */
    public function getHelpSections(): JsonResponse
    {
        $helpSections = [
            [
                'id' => 1,
                'title' => 'Getting Started',
                'description' => 'Learn the basics of using IDAP',
                'icon' => 'academic-cap',
                'items' => [
                    'Creating your first project',
                    'Understanding document types',
                    'Setting up user roles and permissions',
                    'Navigating the dashboard'
                ]
            ],
            [
                'id' => 2,
                'title' => 'Document Creation',
                'description' => 'Master document generation with AI',
                'icon' => 'document-text',
                'items' => [
                    'SRS IEEE 830 compliance',
                    'SDD development workflow',
                    'Test case generation',
                    'User manual creation'
                ]
            ],
            [
                'id' => 3,
                'title' => 'User Management',
                'description' => 'Manage users, roles, and permissions',
                'icon' => 'book-open',
                'items' => [
                    'Adding new users',
                    'Role-based access control',
                    'Permission management',
                    'User profile settings'
                ]
            ],
            [
                'id' => 4,
                'title' => 'Troubleshooting',
                'description' => 'Common issues and solutions',
                'icon' => 'question-mark-circle',
                'items' => [
                    'Login problems',
                    'Document generation errors',
                    'Permission issues',
                    'System performance'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $helpSections
        ]);
    }

    /**
     * Get FAQ data
     */
    public function getFaqs(): JsonResponse
    {
        $faqs = [
            [
                'id' => 1,
                'question' => 'How do I create my first SRS document?',
                'answer' => 'Navigate to Documents > SRS IEEE 830, fill in the project details, and our AI will generate a comprehensive SRS document following IEEE 830-1998 standards.',
                'category' => 'documents'
            ],
            [
                'id' => 2,
                'question' => 'Can I customize document templates?',
                'answer' => 'Yes! Go to Templates section to modify existing templates or create new ones tailored to your organization\'s needs.',
                'category' => 'templates'
            ],
            [
                'id' => 3,
                'question' => 'How do I manage user permissions?',
                'answer' => 'Access User Management to create roles, assign permissions, and control access to different features and documents.',
                'category' => 'user-management'
            ],
            [
                'id' => 4,
                'question' => 'Is my data secure?',
                'answer' => 'Absolutely. We use enterprise-grade encryption and follow industry best practices for data security and privacy.',
                'category' => 'security'
            ],
            [
                'id' => 5,
                'question' => 'Can I export documents in different formats?',
                'answer' => 'Yes, you can export documents as PDF, Word, or HTML formats from the document viewer.',
                'category' => 'documents'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Get support contact information
     */
    public function getSupportInfo(): JsonResponse
    {
        $supportInfo = [
            'email' => 'support@idap.com',
            'phone' => '+1 (555) 123-4567',
            'live_chat' => true,
            'business_hours' => 'Monday - Friday, 9:00 AM - 6:00 PM EST',
            'response_time' => 'Within 24 hours',
            'emergency_contact' => '+1 (555) 999-8888'
        ];

        return response()->json([
            'success' => true,
            'data' => $supportInfo
        ]);
    }

    /**
     * Submit a support ticket
     */
    public function submitTicket(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'category' => 'required|string|in:technical,billing,general,feature-request',
            'priority' => 'required|string|in:low,medium,high,urgent'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real application, you would save this to a database
        // For now, we'll just return a success response
        $ticketData = $request->all();
        $ticketData['ticket_id'] = 'TICKET-' . strtoupper(uniqid());
        $ticketData['status'] = 'open';
        $ticketData['created_at'] = now();

        return response()->json([
            'success' => true,
            'message' => 'Support ticket submitted successfully',
            'data' => [
                'ticket_id' => $ticketData['ticket_id'],
                'estimated_response_time' => '24 hours'
            ]
        ], 201);
    }

    /**
     * Search help articles
     */
    public function searchHelp(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required'
            ], 400);
        }

        // Mock search results - in a real app, you'd search a database
        $searchResults = [
            [
                'id' => 1,
                'title' => 'How to create SRS documents',
                'excerpt' => 'Learn how to create Software Requirements Specification documents...',
                'url' => '/help/srs-creation',
                'category' => 'documents'
            ],
            [
                'id' => 2,
                'title' => 'User management guide',
                'excerpt' => 'Complete guide to managing users, roles, and permissions...',
                'url' => '/help/user-management',
                'category' => 'user-management'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'query' => $query,
                'results' => $searchResults,
                'total_results' => count($searchResults)
            ]
        ]);
    }

    /**
     * Get system status and health
     */
    public function getSystemStatus(): JsonResponse
    {
        $systemStatus = [
            'status' => 'operational',
            'uptime' => '99.9%',
            'last_incident' => null,
            'services' => [
                'api' => 'operational',
                'database' => 'operational',
                'ai_services' => 'operational',
                'file_storage' => 'operational'
            ],
            'last_updated' => now()->toISOString()
        ];

        return response()->json([
            'success' => true,
            'data' => $systemStatus
        ]);
    }
}

