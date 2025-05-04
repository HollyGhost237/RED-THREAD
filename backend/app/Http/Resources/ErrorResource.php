<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ErrorResource extends JsonResource
{
    public static $wrap = 'error';

    public function toArray($request)
    {
        return [
            'message' => $this->resource['message'] ?? 'Une erreur est survenue',
            'code' => $this->resource['code'] ?? 400,
            'errors' => $this->resource['errors'] ?? [],
        ];
    }

    public function toResponse($request)
    {
        return parent::toResponse($request)
            ->setStatusCode($this->resource['code'] ?? 400);
    }
}