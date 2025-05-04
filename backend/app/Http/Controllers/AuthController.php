<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Notifications\NewProfessionalNotification;
use App\Notifications\WelcomeNotification;
use App\Notifications\NewUserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:user,health_professional',
            'professional_title' => 'required_if:role,health_professional'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'user',
            'professional_title' => $validated['professional_title'] ?? null,
            'is_verified' => $validated['role'] === 'health_professional' ? false : true
        ]);

            // Envoyer une notification aux admins si professionnel
        if ($user->role === 'health_professional') {
            Admin::all()->each->notify(
                new NewProfessionalNotification($user)
            );
        }

        // Envoyer un email de bienvenue différent selon le rôle
        $user->notify(new WelcomeNotification(
            user: $user,
            role: $user->role
        ));
        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
            'token_type' => 'Bearer'
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Vérification pour les professionnels de santé
        if ($user->role === 'health_professional' && !$user->is_verified) {
            return response()->json([
                'message' => 'Votre compte professionnel est en attente de vérification'
            ], 403);
        }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
            'token_type' => 'Bearer'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->loadCount(['recipes', 'discussions']),
            'permissions' => [
                'create_recipe' => $request->user()->isHealthProfessional(),
                'moderate_content' => $request->user()->isAdmin()
            ]
        ]);
    }
}