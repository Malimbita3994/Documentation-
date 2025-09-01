<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint (no authentication required)
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('api.auth')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User management routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
    });

    // Project routes
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::get('/{project}', [ProjectController::class, 'show']);
        Route::put('/{project}', [ProjectController::class, 'update']);
        Route::delete('/{project}', [ProjectController::class, 'destroy']);
    });

    // Document routes
    Route::prefix('documents')->group(function () {
        Route::get('/', [DocumentController::class, 'index']);
        Route::post('/', [DocumentController::class, 'store']);
        Route::get('/{document}', [DocumentController::class, 'show']);
        Route::put('/{document}', [DocumentController::class, 'update']);
        Route::delete('/{document}', [DocumentController::class, 'destroy']);
        Route::post('/{id}/restore', [DocumentController::class, 'restore']);
        Route::delete('/{id}/force', [DocumentController::class, 'forceDelete']);
    });

    // Requirement routes
    Route::prefix('requirements')->group(function () {
        Route::get('/', [RequirementController::class, 'index']);
        Route::post('/', [RequirementController::class, 'store']);
        Route::get('/{requirement}', [RequirementController::class, 'show']);
        Route::put('/{requirement}', [RequirementController::class, 'update']);
        Route::delete('/{requirement}', [RequirementController::class, 'destroy']);
    });

    // Template routes
    Route::middleware('api.auth')->prefix('templates')->group(function () {
        Route::get('/', [TemplateController::class, 'index']);
        Route::post('/', [TemplateController::class, 'store']);
        Route::get('/statistics', [TemplateController::class, 'statistics']);
        Route::get('/for-generation', [TemplateController::class, 'forDocumentGeneration']);
        Route::get('/{template}', [TemplateController::class, 'show']);
        Route::put('/{template}', [TemplateController::class, 'update']);
        Route::delete('/{template}', [TemplateController::class, 'destroy']);
        Route::get('/{template}/download', [TemplateController::class, 'download']);
        Route::get('/{template}/download-file', [TemplateController::class, 'downloadFile'])->name('templates.download.file');
    });

    // Knowledge base routes
    Route::prefix('knowledge')->group(function () {
        Route::get('/query', [KnowledgeBaseController::class, 'query']);
        Route::get('/cache-stats', [KnowledgeBaseController::class, 'getCacheStats']);
    });

    // Permission routes
    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/', [PermissionController::class, 'store']);
        Route::get('/{permission}', [PermissionController::class, 'show']);
        Route::put('/{permission}', [PermissionController::class, 'update']);
        Route::delete('/{permission}', [PermissionController::class, 'destroy']);
    });

    // Role routes
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/', [RoleController::class, 'store']);
        Route::get('/{role}', [RoleController::class, 'show']);
        Route::put('/{role}', [RoleController::class, 'update']);
        Route::delete('/{role}', [RoleController::class, 'destroy']);
    });

    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
    });
});