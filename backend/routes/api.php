<?php

// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PostController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// // Route::get('/user', function (Request $request) {
// //     return $request->user();
// // })->middleware('auth:sanctum');

// Route::apiResource('posts', PostController::class);

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); -->


use App\Http\Controllers\AdminController;
use App\Http\Controllers\API\DiscussionController;
// use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ReplyController;
use App\Http\Controllers\API\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\RecipeController;

// Authentification
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
});

// Routes publiques
Route::get('public/recipes', [RecipeController::class, 'indexPublic']);
Route::get('public/recipes/{recipe}', [RecipeController::class, 'showPublic']);
Route::get('discussions', [DiscussionController::class, 'index']);
Route::get('discussions/{discussion}', [DiscussionController::class, 'show']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('saved-recipes', [RecipeController::class, 'savedRecipes']);
        Route::get('recent-activity', [DiscussionController::class, 'index']);
    });
    
    // Profil
    Route::post('user/profile', [ProfileController::class, 'update']);
    Route::get('user/profile', [ProfileController::class, 'show']);
    
    // Recettes
    Route::prefix('recipes')->group(function () {
        Route::get('/', [RecipeController::class, 'index']);
        Route::post('/', [RecipeController::class, 'store']);
        Route::get('/{recipe}', [RecipeController::class, 'show']);
        Route::put('/{recipe}', [RecipeController::class, 'update']);
        Route::delete('/{recipe}', [RecipeController::class, 'destroy']);
        Route::post('/{recipe}/like', [RecipeController::class, 'like']);
    });
    
    // Forum
    Route::apiResource('discussions', DiscussionController::class)->except(['index', 'show']);
    Route::apiResource('discussions.replies', ReplyController::class)->shallow();
    
    // Réponses
    Route::get('discussions/{discussion}/replies', [ReplyController::class, 'index']);
    Route::post('discussions/{discussion}/replies', [ReplyController::class, 'store']);
    Route::put('replies/{reply}', [ReplyController::class, 'update']);
    Route::delete('replies/{reply}', [ReplyController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/pending-professionals', [AdminController::class, 'getPendingProfessionals']);
    Route::put('/verify-professional/{user}', [AdminController::class, 'verifyProfessional']);
});


Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('professionals/pending', [AdminController::class, 'getPendingProfessionals']);
    Route::put('professionals/{user}/verify', [AdminController::class, 'verifyProfessional']);
    Route::put('professionals/{user}/reject', [AdminController::class, 'rejectProfessional']);
    Route::get('notifications', [AdminController::class, 'getNotifications']);
});