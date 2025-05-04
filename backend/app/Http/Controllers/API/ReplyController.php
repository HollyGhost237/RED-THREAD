<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Reply;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReplyRequest;
use App\Http\Requests\UpdateReplyRequest;
use App\Http\Resources\ReplyResource;

class ReplyController extends Controller
{
    /**
     * Liste des réponses pour une discussion
     */
    public function index(Discussion $discussion)
    {
        return ReplyResource::collection(
            $discussion->replies()
                ->with('user')
                ->latest()
                ->paginate(10)
        );
    }

    /**
     * Crée une nouvelle réponse
     */
    public function store(StoreReplyRequest $request, Discussion $discussion)
    {
        $reply = $discussion->replies()->create([
            'content' => $request->content,
            'user_id' => $request->user()->id
        ]);

        return new ReplyResource(
            $reply->load('user')
        );
    }

    /**
     * Met à jour une réponse
     */
    public function update(UpdateReplyRequest $request, Reply $reply)
    {
        $this->authorize('update', $reply);

        $reply->update($request->validated());

        return new ReplyResource(
            $reply->fresh('user')
        );
    }

    /**
     * Supprime une réponse
     */
    public function destroy(Reply $reply)
    {
        $this->authorize('delete', $reply);

        $reply->delete();

        return response()->json(null, 204);
    }
}