<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'ingredients' => $this->whenNotNull($this->ingredients),
            'preparation_steps' => $this->preparation_steps,
            'preparation_time' => $this->preparation_time,
            'cover_image_url' => $this->cover_image ? asset("storage/{$this->cover_image}") : null,
            'is_approved' => $this->when($request->user()?->isAdmin(), $this->is_approved),
            'likes_count' => $this->whenCounted('interactions'),
            'is_liked' => $this->when(
                $request->user(),
                fn() => $this->interactions
                    ->where('user_id', $request->user()->id)
                    ->where('type', 'like')
                    ->isNotEmpty()
            ),
            'author' => new UserResource($this->whenLoaded('user')),
            'pain_types' => PainTypeResource::collection($this->whenLoaded('painTypes')),
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'links' => [
                'self' => route('api.recipes.show', $this->slug),
                'discussions' => route('api.recipes.discussions.index', $this->slug),
            ]
        ];
    }
}