<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDiscussionRequest;
use App\Http\Requests\UpdateDiscussionRequest;
use App\Http\Resources\DiscussionResource;
use Illuminate\Support\Facades\Cache;

class DiscussionController extends Controller
{
    // Cache duration
    const CACHE_DURATION = 60; // 1 minute
    
    /**
     * Liste des discussions
     */
    public function index(Request $request)
    {
        try {
            $cacheKey = $this->buildCacheKey($request);
            
            return Cache::remember($cacheKey, self::CACHE_DURATION, function() use ($request) {
                if ($request->has('recent_activity')) {
                    return $this->handleRecentActivity($request);
                }

                $query = Discussion::with(['user', 'recipe'])
                    ->withCount(['replies', 'views'])
                    ->when($request->has('recipe_id'), function($query) use ($request) {
                        $query->where('recipe_id', $request->recipe_id);
                    })
                    ->when($request->has('popular'), function($query) {
                        $query->orderByRaw('(replies_count * 2 + views_count) DESC');
                    })
                    ->latest();

                if ($request->has('per_page')) {
                    return DiscussionResource::collection($query->paginate($request->per_page));
                }

                return DiscussionResource::collection($query->get());
            });
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Crée une nouvelle discussion
     */
    public function store(StoreDiscussionRequest $request)
    {
        try {
            $validated = $request->validated();

            if (isset($validated['recipe_id'])) {
                Recipe::findOrFail($validated['recipe_id']);
            }

            $discussion = $request->user()->discussions()->create($validated);

            // Clear relevant caches
            $this->clearDiscussionCaches();

            return new DiscussionResource(
                $discussion->load(['user', 'recipe'])
            );
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Affiche une discussion spécifique
     */
    public function show(Discussion $discussion)
    {
        try {
            // Track view
            $discussion->increment('views_count');
            
            return new DiscussionResource(
                $discussion->load([
                    'user', 
                    'recipe',
                    'replies' => function($query) {
                        $query->with('user')
                            ->orderBy('created_at', 'desc');
                    }
                ])
            );
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Met à jour une discussion
     */
    public function update(UpdateDiscussionRequest $request, Discussion $discussion)
    {
        try {
            $this->authorize('update', $discussion);

            $discussion->update($request->validated());

            // Clear relevant caches
            $this->clearDiscussionCaches();

            return new DiscussionResource(
                $discussion->fresh(['user', 'recipe'])
            );
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    /**
     * Supprime une discussion
     */
    public function destroy(Discussion $discussion)
    {
        try {
            $this->authorize('delete', $discussion);

            $discussion->delete();

            // Clear relevant caches
            $this->clearDiscussionCaches();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    // Helper methods
    private function handleRecentActivity(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['data' => []]);
        }
    
        // Vérifiez que les relations existent
        if (!method_exists($user, 'discussions') || !method_exists($user, 'replies')) {
            throw new \Exception("Les relations discussions/replies ne sont pas définies pour le modèle User");
        }
        
        $discussions = $user->discussions()
            ->select('id', 'title', 'created_at', 'recipe_id')
            ->with('recipe:id,title')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'discussion',
                    'title' => $item->title,
                    'created_at' => $item->created_at,
                    'recipe_id' => $item->recipe_id,
                    'recipe_title' => $item->recipe->title ?? null
                ];
            });

        $replies = $user->replies()
            ->select('id', 'discussion_id', 'created_at')
            ->with('discussion:id,title')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'reply',
                    'discussion_id' => $item->discussion_id,
                    'title' => $item->discussion->title,
                    'created_at' => $item->created_at
                ];
            });

        return response()->json([
            'data' => $discussions->concat($replies)
                ->sortByDesc('created_at')
                ->values()
                ->all()
        ]);
    }

    private function buildCacheKey(Request $request)
    {
        return 'discussions_' . md5(json_encode($request->all()));
    }

    private function clearDiscussionCaches()
    {
        Cache::forget('discussions_popular');
        // Add other cache keys as needed
    }

    private function handleError(\Exception $e)
    {
        report($e); // Log the error
        
        return response()->json([
            'message' => 'Une erreur est survenue',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], 500);
    }
}