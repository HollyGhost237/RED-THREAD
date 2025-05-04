<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'professional_title' => $this->whenNotNull($this->professional_title),
            'avatar_url' => $this->avatar ? asset("storage/{$this->avatar}") : null,
            'role' => $this->when($request->user()?->isAdmin(), $this->role),
            'is_verified' => $this->when($request->user()?->isAdmin(), $this->is_verified),
            'stats' => $this->when(
                $request->routeIs('api.users.show'),
                fn() => [
                    'recipes_count' => $this->recipes_count,
                    'discussions_count' => $this->discussions_count
                ]
            )
        ];
    }
}