<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KnowledgeBaseController extends Controller
{
    /**
     * Proxy arXiv API requests to avoid CORS issues
     */
    public function arxivSearch(Request $request): JsonResponse
    {
        try {
            $query = $request->get('query');
            $maxResults = $request->get('max_results', 5);
            
            if (!$query) {
                return response()->json([
                    'error' => 'Query parameter is required'
                ], 400);
            }

            // Build arXiv API URL
            $baseUrl = 'https://export.arxiv.org/api/query';
            $params = [
                'search_query' => "all:{$query}",
                'start' => 0,
                'max_results' => $maxResults,
                'sortBy' => 'relevance',
                'sortOrder' => 'descending'
            ];

            $url = $baseUrl . '?' . http_build_query($params);
            
            Log::info('arXiv API request', ['url' => $url]);

            // Make request to arXiv API
            $response = Http::withHeaders([
                'Accept' => 'application/atom+xml, application/xml, text/xml, */*',
                'User-Agent' => 'IDAP-KnowledgeBase/1.0'
            ])->timeout(30)->get($url);

            if (!$response->successful()) {
                Log::warning('arXiv API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return response()->json([
                    'error' => 'arXiv API request failed',
                    'status' => $response->status()
                ], $response->status());
            }

            $xmlContent = $response->body();
            
            // Parse XML response
            $xml = simplexml_load_string($xmlContent);
            
            if (!$xml) {
                Log::error('Failed to parse arXiv XML response');
                return response()->json([
                    'error' => 'Failed to parse arXiv response'
                ], 500);
            }

            // Extract entries
            $entries = [];
            if (isset($xml->entry)) {
                foreach ($xml->entry as $entry) {
                    $entries[] = [
                        'id' => (string) $entry->id,
                        'title' => (string) $entry->title,
                        'summary' => (string) $entry->summary,
                        'published' => (string) $entry->published,
                        'authors' => array_map(function($author) {
                            return (string) $author->name;
                        }, (array) $entry->author)
                    ];
                }
            }

            Log::info('arXiv API response processed', [
                'query' => $query,
                'results_count' => count($entries)
            ]);

            return response()->json([
                'success' => true,
                'query' => $query,
                'results' => $entries,
                'total_results' => count($entries)
            ]);

        } catch (\Exception $e) {
            Log::error('arXiv API proxy error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Health check for knowledge base services
     */
    public function healthCheck(): JsonResponse
    {
        $services = [
            'arxiv' => false,
            'wikipedia' => false,
            'github' => false
        ];

        try {
            // Test arXiv API
            $arxivResponse = Http::timeout(10)->get('https://export.arxiv.org/api/query?search_query=test&max_results=1');
            $services['arxiv'] = $arxivResponse->successful();
        } catch (\Exception $e) {
            Log::warning('arXiv health check failed', ['error' => $e->getMessage()]);
        }

        try {
            // Test Wikipedia API
            $wikiResponse = Http::timeout(10)->get('https://en.wikipedia.org/api/rest_v1/page/summary/Test');
            $services['wikipedia'] = $wikiResponse->successful();
        } catch (\Exception $e) {
            Log::warning('Wikipedia health check failed', ['error' => $e->getMessage()]);
        }

        try {
            // Test GitHub API
            $githubResponse = Http::timeout(10)->get('https://api.github.com/zen');
            $services['github'] = $githubResponse->successful();
        } catch (\Exception $e) {
            Log::warning('GitHub health check failed', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'services' => $services
        ]);
    }
}


