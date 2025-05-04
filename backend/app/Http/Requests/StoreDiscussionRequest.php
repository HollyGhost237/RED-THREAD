<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscussionRequest extends FormRequest
{
    public function authorize()
    {
        return true; // L'autorisation réelle est gérée par les Policies
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'recipe_id' => 'nullable|exists:recipes,id'
        ];
    }
}