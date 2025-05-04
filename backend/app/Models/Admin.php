<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends User
{
    use HasFactory;

    protected $table = 'users'; // Utilise la même table que User

    public static function boot()
    {
        parent::boot();

        static::addGlobalScope('admin', function ($builder) {
            $builder->where('role', 'admin');
        });
    }

    // Méthodes spécifiques aux admins
    public function pendingProfessionals()
    {
        return User::healthProfessionals()->needsVerification();
    }

    public function sendNotificationToAll($notification)
    {
        User::where('role', 'admin')
            ->where('id', '!=', $this->id)
            ->each->notify($notification);
    }
}