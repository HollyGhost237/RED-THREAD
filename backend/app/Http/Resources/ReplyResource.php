<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReplyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'created_at' => $this->created_at->format('d/m/Y H:i'),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar_url,
                'role' => $this->user->display_role
            ],
            'discussion_id' => $this->discussion_id,
            'links' => [
                'self' => route('api.replies.show', $this->id),
                'discussion' => route('api.discussions.show', $this->discussion_id)
            ]
        ];
    }
}