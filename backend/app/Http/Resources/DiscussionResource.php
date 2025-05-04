<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscussionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar_url,
                'role' => $this->user->display_role
            ],
            'recipe' => $this->whenLoaded('recipe', fn() => [
                'id' => $this->recipe->id,
                'title' => $this->recipe->title,
                'slug' => $this->recipe->slug
            ]),
            'replies_count' => $this->whenCounted('replies'),
            'links' => [
                'self' => route('api.discussions.show', $this->id),
                'replies' => route('api.discussions.replies.index', $this->id)
            ]
        ];
    }
}