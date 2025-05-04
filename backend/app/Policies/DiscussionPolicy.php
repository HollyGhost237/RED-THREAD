<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Discussion;

class DiscussionPolicy
{
    public function create(User $user): bool
    {
        return $user !== null; // Tout utilisateur connecté
    }

    public function update(User $user, Discussion $discussion): bool
    {
        return $user->id === $discussion->user_id || $user->isAdmin();
    }

    public function delete(User $user, Discussion $discussion): bool
    {
        return $user->id === $discussion->user_id || $user->isAdmin();
    }
}