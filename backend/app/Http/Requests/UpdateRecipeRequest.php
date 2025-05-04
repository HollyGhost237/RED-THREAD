<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends StoreRecipeRequest
{
    public function rules()
    {
        return [
            ...parent::rules(),
            'cover_image' => 'sometimes|image|max:2048',
        ];
    }
}