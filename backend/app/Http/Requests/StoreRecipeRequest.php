<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'nullable|array',
            'ingredients.*.name' => 'required|string',
            'ingredients.*.quantity' => 'required|string',
            'preparation_steps' => 'required|string',
            'preparation_time' => 'required|string|max:50',
            'cover_image' => 'required|image|max:2048',
            'pain_types' => 'required|array|min:1',
            'pain_types.*' => 'exists:pain_types,id'
        ];
    }
}