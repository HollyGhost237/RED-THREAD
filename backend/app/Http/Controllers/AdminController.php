<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Notifications\ProfessionalVerifiedNotification;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin'); 
    }

    public function getPendingProfessionals()
    {
        $professionals = User::where('role', 'health_professional')
                            ->where('is_verified', false)
                            ->with(['recipes', 'discussions'])
                            ->withCount(['recipes', 'discussions'])
                            ->orderBy('created_at', 'desc')
                            ->paginate(10); // Pagination pour de meilleures performances

        return response()->json([
            'professionals' => $professionals,
            'stats' => [
                'total_pending' => User::where('role', 'health_professional')
                                    ->where('is_verified', false)
                                    ->count()
            ]
        ]);
    }

    public function verifyProfessional(User $user)
    {
        if ($user->role !== 'health_professional') {
            return response()->json(['message' => 'Cet utilisateur n\'est pas un professionnel'], 400);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'Ce professionnel est déjà vérifié'], 400);
        }

        $user->update([
            'is_verified' => true,
            'verified_at' => now()
        ]);

        // Notification à l'utilisateur
        $user->notify(new ProfessionalVerifiedNotification());

        // Notification aux autres admins
        Admin::where('id', '!=', auth()->id())->each->notify(
            new ProfessionalVerifiedAdminNotification($user)
        );

        return response()->json([
            'message' => 'Professionnel vérifié avec succès',
            'user' => $user->fresh()
        ]);
    }

    public function rejectProfessional(Request $request, User $user)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        if ($user->role !== 'health_professional' || $user->is_verified) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        // Notification à l'utilisateur avec la raison
        $user->notify(new \App\Notifications\ProfessionalRejectedNotification($request->reason));

        // Optionnel : Supprimer le compte si nécessaire
        // $user->delete();

        return response()->json(['message' => 'Demande professionnelle rejetée']);
    }
}