<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AdminPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role === 'admin';
    }

    public function verifyProfessional(User $admin, User $professional)
    {
        return $admin->role === 'admin' && 
            $professional->role === 'health_professional' &&
            !$professional->is_verified;
    }

    public function rejectProfessional(User $admin, User $professional)
    {
        return $this->verifyProfessional($admin, $professional);
    }
}