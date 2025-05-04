<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interaction extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'type', 'interactable_id', 'interactable_type'];

    // Relation polymorphique
    public function interactable()
    {
        return $this->morphTo();
    }

    // Relation utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}