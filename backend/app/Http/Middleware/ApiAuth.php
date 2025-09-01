<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ApiAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // For development purposes, let's use a simple token-based auth
        // In production, you should use proper JWT or Sanctum tokens
        
        $token = $request->header('Authorization');
        
        if (!$token) {
            // For development, let's use the first user as authenticated
            $user = User::first();
            if ($user) {
                Auth::login($user);
                return $next($request);
            }
            
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'No authentication token provided'
            ], 401);
        }
        
        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);
        
        // For development, accept any token and use the first user
        $user = User::first();
        if ($user) {
            Auth::login($user);
            return $next($request);
        }
        
        return response()->json([
            'message' => 'Unauthorized',
            'error' => 'Invalid authentication token'
        ], 401);
    }
}












