<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        // try {
            // Début du code de débogage (à ajouter)
            \Log::debug('Request data:', [
                'input' => $request->all(),
                'files' => $request->file() ? ['has_files' => true] : ['has_files' => false],
                'headers' => $request->headers->all()
            ]);
            // Fin du code de débogage

            $user = $request->user();

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,'.$user->id,
                'professional_title' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:7048',
                'current_password' => 'sometimes|required_with:password',
                'password' => 'sometimes|confirmed|min:8'
            ]);
    
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'professional_title' => $validated['professional_title'] ?? null,
                'bio' => $validated['bio'] ?? null,
            ];
    
            // Gestion de l'upload d'image
            if ($request->hasFile('avatar')) {
                // Supprimer l'ancienne image si elle existe
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                
                // Stocker la nouvelle image
                $path = $request->file('avatar')->store('avatars', 'public');
                $updateData['avatar'] = $path;
            }
    
            // Mise à jour du mot de passe
            if ($request->filled('password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'message' => 'Le mot de passe actuel est incorrect'
                    ], 422);
                }
                $updateData['password'] = Hash::make($validated['password']);
            }
    
            $user->update($updateData);
    
            return response()->json([
                'user' => $user->fresh(),
                'message' => 'Profil mis à jour avec succès',
                'avatar_url' => $user->avatar ? asset("storage/{$user->avatar}") : null
            ]);
    
        // } catch (\Exception $e) {
        //     \Log::error('Profile update error: '.$e->getMessage());
        //     return response()->json([
        //         'message' => 'Erreur lors de la mise à jour du profil',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
    }

    public function show(Request $request)
{
    return response()->json([
        'user' => $request->user()->load('recipes', 'discussions'),
        'stats' => [
            'recipes_count' => $request->user()->recipes()->count(),
            'discussions_count' => $request->user()->discussions()->count()
        ]
    ]);
}
}