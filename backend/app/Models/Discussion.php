<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'recipe_id', 'title', 'content'];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

    public function replies()
    {
        return $this->hasMany(Reply::class);
    }

    public function interactions()
    {
        return $this->morphMany(Interaction::class, 'interactable');
    }
}