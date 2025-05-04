<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Recipe;

class RecipePolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Tous les utilisateurs peuvent voir les recettes
    }

    public function view(User $user, Recipe $recipe): bool
    {
        return true; // Lecture accessible à tous
    }

    public function create(User $user): bool
    {
        // Seuls les professionnels de santé vérifiés peuvent créer
        return $user->isHealthProfessional() && $user->is_verified;
    }

    public function update(User $user, Recipe $recipe): bool
    {
        // L'auteur ou un admin peut modifier
        return $user->id === $recipe->user_id || $user->isAdmin();
    }

    public function delete(User $user, Recipe $recipe): bool
    {
        // L'auteur ou un admin peut supprimer
        return $user->id === $recipe->user_id || $user->isAdmin();
    }

    public function like(User $user, Recipe $recipe): bool
    {
        // Tout utilisateur connecté peut liker
        return $user !== null;
    }
}