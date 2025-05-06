<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\API\DiscussionController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ReplyController;
use App\Http\Controllers\API\RecipeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlanteController;
use Illuminate\Support\Facades\Route;

// Authentification
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('resend-verification', [AuthController::class, 'resendVerification']);
    });
});

// Routes publiques
Route::get('recipes/public', [RecipeController::class, 'indexPublic']);
Route::get('recipes/public/{recipe}', [RecipeController::class, 'showPublic']);
Route::get('discussions', [DiscussionController::class, 'index']);
Route::get('discussions/{discussion}', [DiscussionController::class, 'show']);

// Routes protégées (utilisateurs connectés)
Route::middleware('auth:sanctum')->group(function () {
    // Profil
    Route::prefix('user')->group(function () {
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
    });
    
    // Recettes
    Route::prefix('recipes')->group(function () {
        Route::get('/', [RecipeController::class, 'index']);
        Route::post('/', [RecipeController::class, 'store']);
        Route::get('/{recipe}', [RecipeController::class, 'show']);
        Route::put('/{recipe}', [RecipeController::class, 'update']);
        Route::delete('/{recipe}', [RecipeController::class, 'destroy']);
        Route::post('/{recipe}/like', [RecipeController::class, 'toggleLike']);
        Route::get('/saved', [RecipeController::class, 'savedRecipes']);
    });
    
    // Forum
    Route::prefix('discussions')->group(function () {
        Route::post('/', [DiscussionController::class, 'store']);
        Route::put('/{discussion}', [DiscussionController::class, 'update']);
        Route::delete('/{discussion}', [DiscussionController::class, 'destroy']);
        Route::post('/{discussion}/replies', [ReplyController::class, 'store']);
    });
    
    // Réponses
    Route::prefix('replies')->group(function () {
        Route::put('/{reply}', [ReplyController::class, 'update']);
        Route::delete('/{reply}', [ReplyController::class, 'destroy']);
    });
});

// Routes admin
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('pending-professionals', [AdminController::class, 'getPendingProfessionals']);
    Route::put('professionals/{user}/verify', [AdminController::class, 'verifyProfessional']);
    Route::put('professionals/{user}/reject', [AdminController::class, 'rejectProfessional']);
    Route::get('stats', [AdminController::class, 'getStats']);
});

Route::get('/plantes', [PlanteController::class, 'index']);