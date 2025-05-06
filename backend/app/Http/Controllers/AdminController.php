<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\ProfessionalVerificationResendNotification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Notifications\ProfessionalVerifiedNotification;
use App\Notifications\ProfessionalVerifiedAdminNotification;
use App\Notifications\ProfessionalRejectedNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AdminController extends Controller
{
    use AuthorizesRequests;
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    //     $this->middleware('can:viewAny,App\Models\User');
    //     $this->middleware('can:verifyProfessional,user')->only(['verifyProfessional']);
    //     $this->middleware('can:rejectProfessional,user')->only(['rejectProfessional']);
    }

    public function getPendingProfessionals()
    {
        $professionals = User::where('role', 'health_professional')
            ->where('is_verified', false)
            ->with(['recipes', 'discussions'])
            ->withCount(['recipes', 'discussions'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

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
        $this->authorize('verifyProfessional', $user);

        $user->update([
            'is_verified' => true,
            'verified_at' => now()
        ]);

        $user->notify(new ProfessionalVerifiedNotification());

        // Notifier les autres admins
        User::where('role', 'admin')
            ->where('id', '!=', auth()->id())
            ->each(function ($admin) use ($user) {
                $admin->notify(new ProfessionalVerifiedAdminNotification($user));
            });

        return response()->json([
            'message' => 'Professionnel vérifié avec succès',
            'user' => $user->fresh()
        ]);
    }

    public function rejectProfessional(Request $request, User $user)
    {
        $this->authorize('rejectProfessional', $user);

        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $user->notify(new ProfessionalRejectedNotification($request->reason));

        return response()->json(['message' => 'Demande professionnelle rejetée']);
    }

    public function getStats()
{
    return response()->json([
        'pending_count' => User::where('role', 'health_professional')
            ->where('is_verified', false)
            ->count(),
        'verified_today' => User::where('role', 'health_professional')
            ->whereDate('verified_at', today())
            ->count()
    ]);
}

// App\Http\Controllers\AuthController.php
public function resendVerification()
{
    $user = auth()->user();
    
    if ($user->role !== 'health_professional' || $user->is_verified) {
        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    // Envoyer la notification
    $user->notify(new ProfessionalVerificationResendNotification());

    return response()->json(['message' => 'Demande renvoyée avec succès']);
}
}