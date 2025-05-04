<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\PainType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\RecipeResource;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;

class RecipeController extends Controller
{
    /**
     * Affiche la liste des recettes (publique)
     */
    public function indexPublic()
    {
        $recipes = Recipe::with(['user', 'painTypes'])
            ->where('is_approved', true)
            ->withCount(['interactions as likes_count' => function($query) {
                $query->where('type', 'like');
            }])
            ->latest()
            ->paginate(10);

        return RecipeResource::collection($recipes);
    }

    /**
     * Affiche une recette spécifique (publique)
     */
    public function showPublic(Recipe $recipe)
    {
        if (!$recipe->is_approved) {
            abort(404);
        }

        return new RecipeResource(
            $recipe->load(['user', 'painTypes', 'discussions.user'])
        );
    }

    /**
     * Liste des recettes (pour utilisateurs connectés)
     */
    public function index(Request $request)
    {
        $query = Recipe::with(['user', 'painTypes'])
        ->withCount(['interactions as likes_count' => function($query) {
            $query->where('type', 'like');
        }]);

        // Pour les recettes sauvegardées
        if ($request->has('saved')) {
            return $request->user()
                ->interactions()
                ->where('type', 'save')
                ->with(['recipe.user', 'recipe.painTypes'])
                ->latest()
                ->paginate(4)
                ->through(function ($interaction) {
                    return $interaction->recipe;
                });
            }

        // Filtre pour les admins
        if (!$request->user()->isAdmin()) {
            $query->where('is_approved', true);
        }

        return RecipeResource::collection(
            $query->latest()->paginate(10)
        );

    }


    public function savedRecipes(Request $request)
{
    $recipes = $request->user()
        ->interactions()
        ->where('type', 'save')
        ->with(['recipe.user', 'recipe.painTypes'])
        ->latest()
        ->paginate(4);

    return RecipeResource::collection(
        $recipes->pluck('recipe')
    );
}

    /**
     * Crée une nouvelle recette
     */
    public function store(StoreRecipeRequest $request)
    {
        // Validation est gérée par StoreRecipeRequest
        $validated = $request->validated();

        // Upload de l'image
        $imagePath = $request->file('cover_image')->store('recipes', 'public');
        $validated['cover_image'] = $imagePath;

        // Création de la recette
        $recipe = $request->user()->recipes()->create($validated);

        // Association des types de douleur
        if ($request->has('pain_types')) {
            $recipe->painTypes()->sync($request->pain_types);
        }

        return new RecipeResource(
            $recipe->load(['user', 'painTypes'])
        );
    }

    /**
     * Affiche une recette spécifique
     */
    public function show(Request $request, Recipe $recipe)
    {
        // Vérification d'accès
        if (!$recipe->is_approved && !$request->user()->isAdmin()) {
            abort(404);
        }

        return new RecipeResource(
            $recipe->load([
                'user', 
                'painTypes',
                'discussions.user',
                'interactions' => function($query) use ($request) {
                    $query->where('user_id', $request->user()->id);
                }
            ])
        );
    }

    /**
     * Met à jour une recette
     */
    public function update(UpdateRecipeRequest $request, Recipe $recipe)
    {
        // Autorisation gérée par la RecipePolicy
        $this->authorize('update', $recipe);

        $validated = $request->validated();

        // Gestion de l'image
        if ($request->hasFile('cover_image')) {
            // Suppression ancienne image
            Storage::disk('public')->delete($recipe->cover_image);
            // Upload nouvelle image
            $validated['cover_image'] = $request->file('cover_image')
                ->store('recipes', 'public');
        }

        $recipe->update($validated);

        // Mise à jour des types de douleur
        if ($request->has('pain_types')) {
            $recipe->painTypes()->sync($request->pain_types);
        }

        return new RecipeResource(
            $recipe->fresh(['user', 'painTypes'])
        );
    }

    /**
     * Supprime une recette
     */
    public function destroy(Recipe $recipe)
    {
        $this->authorize('delete', $recipe);

        // Suppression de l'image
        Storage::disk('public')->delete($recipe->cover_image);

        $recipe->delete();

        return response()->json(null, 204);
    }

    /**
     * Like/Unlike une recette
     */
    public function like(Request $request, Recipe $recipe)
    {
        $interaction = $recipe->interactions()
            ->where('user_id', $request->user()->id)
            ->where('type', 'like')
            ->first();

        if ($interaction) {
            $interaction->delete();
            $message = 'Like retiré';
        } else {
            $recipe->interactions()->create([
                'user_id' => $request->user()->id,
                'type' => 'like'
            ]);
            $message = 'Recette likée';
        }

        return response()->json([
            'message' => $message,
            'likes_count' => $recipe->interactions()->where('type', 'like')->count()
        ]);
    }
}