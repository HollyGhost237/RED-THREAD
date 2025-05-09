<?php

namespace Database\Seeders;

use App\Models\Plante;
use Illuminate\Database\Seeder;

class PlanteSeeder extends Seeder
{
    public function run()
    {
        $plantes = [
            [
                'nom_local' => 'Citron',
                'nom_scientifique' => 'Citrus limon',
                'description_courte' => 'Antiseptique et riche en vitamine C',
                'description_complete' => 'Le citron est un agrume aux multiples vertus médicinales. Son zeste et son jus sont utilisés pour stimuler l\'immunité, faciliter la digestion et désinfecter.',
                'lieu_culture' => 'Régions méditerranéennes',
                'periode_culture' => 'Toute l\'année',
                'maladies' => ['Refroidissements', 'Troubles digestifs', 'Infections'],
                'image_path' => 'plantes/citron.jpg'
            ],
            [
                'nom_local' => 'Ail',
                'nom_scientifique' => 'Allium sativum',
                'description_courte' => 'Antibiotique naturel et hypotenseur',
                'description_complete' => 'L\'ail est un puissant antibactérien et antiviral. Il aide à réduire la tension artérielle et le cholestérol. Consommé cru, il maximise ses bienfaits.',
                'lieu_culture' => 'Climat tempéré',
                'periode_culture' => 'Automne/Printemps',
                'maladies' => ['Hypertension', 'Infections respiratoires', 'Parasites intestinaux'],
                'image_path' => 'plantes/ail.jpg'
            ],
            [
                'nom_local' => 'Gingembre',
                'nom_scientifique' => 'Zingiber officinale',
                'description_courte' => 'Anti-inflammatoire et stimulant digestif',
                'description_complete' => 'Le gingembre est efficace contre les nausées, les douleurs musculaires et articulaires. Il stimule la circulation sanguine et renforce l\'immunité.',
                'lieu_culture' => 'Zones tropicales',
                'periode_culture' => 'Saison chaude',
                'maladies' => ['Nausées', 'Arthrite', 'Rhume'],
                'image_path' => 'plantes/gingembre.jpg'
            ],
            [
                'nom_local' => 'Menthe poivrée',
                'nom_scientifique' => 'Mentha × piperita',
                'description_courte' => 'Digestive et décongestionnante',
                'description_complete' => 'La menthe poivrée soulage les troubles digestifs, les maux de tête et dégage les voies respiratoires. Son huile essentielle est particulièrement puissante.',
                'lieu_culture' => 'Climat tempéré',
                'periode_culture' => 'Printemps/Été',
                'maladies' => ['Migraines', 'Ballonnements', 'Congestion nasale'],
                'image_path' => 'plantes/menthe.jpg'
            ],
            [
                'nom_local' => 'Aloe Vera',
                'nom_scientifique' => 'Aloe barbadensis',
                'description_courte' => 'Cicatrisant et hydratant cutané',
                'description_complete' => 'Le gel d\'aloe vera apaise les brûlures, les coups de soleil et les irritations cutanées. En usage interne, il soutient la digestion et détoxifie l\'organisme.',
                'lieu_culture' => 'Climat aride',
                'periode_culture' => 'Toute l\'année',
                'maladies' => ['Brûlures', 'Eczéma', 'Constipation'],
                'image_path' => 'plantes/aloe.jpg'
            ],
            [
                'nom_local' => 'Artemisia',
                'nom_scientifique' => 'Artemisia annua',
                'description_courte' => 'Traitement traditionnel du paludisme',
                'description_complete' => 'L\'artemisia contient de l\'artémisinine, un composé antipaludéen puissant. Elle est également utilisée contre les fièvres et les parasites intestinaux.',
                'lieu_culture' => 'Afrique de l\'Ouest',
                'periode_culture' => 'Saison des pluies',
                'maladies' => ['Paludisme', 'Fièvre', 'Parasitose'],
                'image_path' => 'plantes/artemisia.jpg'
            ]
        ];

        foreach ($plantes as $plante) {
            Plante::create($plante);
        }
    }
}