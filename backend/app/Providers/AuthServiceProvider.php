<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        $this->registerPolicies();

        // Définition des gates
        Gate::define('viewAnyUser', function (User $user) {
            return $user->isAdmin();
        });

        Gate::define('verifyProfessional', function (User $user, User $professional) {
            return $user->isAdmin() && $professional->isHealthProfessional();
        });

        Gate::define('rejectProfessional', function (User $user, User $professional) {
            return $user->isAdmin() && $professional->isHealthProfessional();
        });
    }
}