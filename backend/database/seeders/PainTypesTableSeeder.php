<?php

namespace Database\Seeders;

use App\Models\PainType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PainTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $pains = [
            ['name' => 'Migraine', 'slug' => 'migraine'],
            ['name' => 'Douleurs articulaires', 'slug' => 'douleurs-articulaires'],
            ['name' => 'Stress', 'slug' => 'stress'],
            ['name' => 'Insomnie', 'slug' => 'insomnie'],
            ['name' => 'Douleurs musculaires', 'slug' => 'douleurs-musculaires'],
        ];

        foreach ($pains as $pain) {
            PainType::create($pain);
        }
    }
}
