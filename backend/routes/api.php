<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User Management routes
Route::middleware('api.auth')->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/stats', [UserController::class, 'statistics']);
    Route::post('/bulk-status', [UserController::class, 'bulkUpdateStatus']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
    Route::post('/{user}/avatar', [UserController::class, 'uploadAvatar']);
});

// Role Management routes
Route::middleware('api.auth')->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::post('/', [RoleController::class, 'store']);
    Route::get('/stats', [RoleController::class, 'statistics']);
    Route::get('/{role}', [RoleController::class, 'show']);
    Route::put('/{role}', [RoleController::class, 'update']);
    Route::delete('/{role}', [RoleController::class, 'destroy']);
    Route::post('/{role}/permissions', [RoleController::class, 'assignPermissions']);
    Route::get('/{role}/permissions', [RoleController::class, 'getPermissions']);
});

// Permission Management routes
Route::middleware('api.auth')->prefix('permissions')->group(function () {
    Route::get('/', [PermissionController::class, 'index']);
    Route::post('/', [PermissionController::class, 'store']);
    Route::post('/bulk', [PermissionController::class, 'bulkCreate']);
    Route::get('/stats', [PermissionController::class, 'statistics']);
    Route::get('/grouped', [PermissionController::class, 'getGroupedByModule']);
    Route::get('/{permission}', [PermissionController::class, 'show']);
    Route::put('/{permission}', [PermissionController::class, 'update']);
    Route::delete('/{permission}', [PermissionController::class, 'destroy']);
    Route::get('/role/{role}', [PermissionController::class, 'getForRole']);
});

// Profile Management routes
Route::middleware('api.auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences']);
    Route::get('/profile/activity', [ProfileController::class, 'activity']);
    Route::delete('/profile', [ProfileController::class, 'deleteAccount']);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

// Test route
Route::get('/test-profile', function () {
    return response()->json(['message' => 'Profile test route works']);
});

// Simple test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Document routes
Route::prefix('documents')->group(function () {
    Route::get('/', [DocumentController::class, 'index']);
    Route::post('/', [DocumentController::class, 'store']);
    Route::get('/stats', [DocumentController::class, 'stats']);
    Route::get('/{document}', [DocumentController::class, 'show']);
    Route::put('/{document}', [DocumentController::class, 'update']);
    Route::delete('/{document}', [DocumentController::class, 'destroy']);
});

// Project routes
Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::post('/', [ProjectController::class, 'store']);
    Route::get('/{project}', [ProjectController::class, 'show']);
    Route::put('/{project}', [ProjectController::class, 'update']);
    Route::delete('/{project}', [ProjectController::class, 'destroy']);
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
Route::prefix('templates')->group(function () {
    Route::get('/', [TemplateController::class, 'index']);
    Route::post('/', [TemplateController::class, 'store']);
    Route::get('/{template}', [TemplateController::class, 'show']);
    Route::put('/{template}', [TemplateController::class, 'update']);
    Route::delete('/{template}', [TemplateController::class, 'destroy']);
});


