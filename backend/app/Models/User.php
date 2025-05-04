<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'professional_title',
        'avatar',
        'bio',
        'is_verified'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime'
    ];

    // Relations
    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function savedRecipes()
{
    return $this->belongsToMany(Recipe::class, 'interactions')
        ->wherePivot('type', 'save')
        ->withTimestamps();
}

// Méthode pour compter les contributions
public function getContributionsAttribute()
{
    return [
        'recipes_count' => $this->recipes()->count(),
        'discussions_count' => $this->discussions()->count(),
        'replies_count' => $this->replies()->count()
    ];
}

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function interactions()
    {
        return $this->hasMany(Interaction::class);
    }

    // Méthodes pratiques
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isHealthProfessional()
    {
        return $this->role === 'health_professional';
    }

    public function getDisplayRoleAttribute()
    {
        return match($this->role) {
            'admin' => 'Administrateur',
            'health_professional' => $this->professional_title ?? 'Professionnel de santé',
            default => 'Utilisateur'
        };
    }

    public function scopeHealthProfessionals($query)
    {
        return $query->where('role', 'health_professional');
    }
    
    public function scopeNeedsVerification($query)
    {
        return $query->where('is_verified', false);
    }
}