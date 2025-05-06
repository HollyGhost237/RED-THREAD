<?php

namespace Database\Seeders;

use App\Models\Plante;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Plante::create([
            'nom_local' => 'Artemisia',
            'nom_scientifique' => 'Artemisia annua',
            'description_courte' => 'Plante utilisée contre le paludisme',
            'description_complete' => 'L\'Artemisia est une plante...',
            'lieu_culture' => 'Afrique de l\'Ouest',
            'periode_culture' => 'Saison des pluies',
            'maladies' => ['Paludisme', 'Fièvre'],
            'image_path' => 'plantes/artemisia.jpg'
        ]);
        Plante::create([
            'nom_local' => 'Artemisia',
            'nom_scientifique' => 'Artemisia annua',
            'description_courte' => 'Plante utilisée contre le paludisme',
            'description_complete' => 'L\'Artemisia est une plante...',
            'lieu_culture' => 'Afrique de l\'Ouest',
            'periode_culture' => 'Saison des pluies',
            'maladies' => ['Hepatite', 'Fièvre'],
            'image_path' => 'plantes/artemisia.jpg'
        ]);
        Plante::create([
            'nom_local' => 'Ecorce de citron',
            'nom_scientifique' => 'Citrus limon',
            'description_courte' => 'Plante utilisée contre le paludisme',
            'description_complete' => 'L\'Artemisia est une plante...',
            'lieu_culture' => 'Afrique de l\'Ouest',
            'periode_culture' => 'Saison des pluies',
            'maladies' => ['Ignorance', 'Fièvre'],
            'image_path' => 'plantes/artemisia.jpg'
        ]);
        
    }
}
