<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new \Illuminate\Routing\Controllers\Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $field = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|integer|exists:users,id',
            'category_id' => 'required|integer|exists:categories,id',
            'image_path' => 'nullable|string|max:255',
        ]);
        $post = $request->user()->post->create($field);

        return ['post' => $post];
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return $post;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        Gate::authorize('modify', $post);

        $field = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|integer|exists:users,id',
            'category_id' => 'required|integer|exists:categories,id',
            'image_path' => 'nullable|string|max:255',
        ]);
        $post->update($field);

        return $post;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('modify', $post);

        $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
