<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RecipeCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => RecipeResource::collection($this->collection),
            'meta' => [
                'current_page' => $this->currentPage(),
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'links' => [
                    'next' => $this->nextPageUrl(),
                    'previous' => $this->previousPageUrl(),
                ],
            ],
        ];
    }
}