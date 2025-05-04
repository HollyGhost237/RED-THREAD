<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'ingredients',
        'preparation_steps',
        'preparation_time',
        'cover_image',
        'is_approved'
    ];

    protected $casts = [
        'ingredients' => 'array',
        'is_approved' => 'boolean'
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function painTypes()
    {
        return $this->belongsToMany(PainType::class, 'pain_recipe');
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function interactions()
    {
        return $this->morphMany(Interaction::class, 'interactable');
    }

    // Accesseurs
    public function getLikesCountAttribute()
    {
        return $this->interactions()->where('type', 'like')->count();
    }

    public function getIsSavedAttribute()
    {
        if (!auth()->check()) return false;
        return $this->interactions()
            ->where('type', 'save')
            ->where('user_id', auth()->id())
            ->exists();
    }

    // Pour les URLs propres
    public function getRouteKeyName()
    {
        return 'slug';
    }
}