<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plante extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_local',
        'nom_scientifique',
        'description_courte',
        'description_complete',
        'lieu_culture',
        'periode_culture',
        'maladies',
        'image_path'
    ];

    protected $casts = [
        'maladies' => 'array'
    ];
}