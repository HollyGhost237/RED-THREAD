import React from 'react';
import recette from '../../assets/recette.png';

export default function RecipeHero() {
    return (
        <section className="bg-white  overflow-hidden flex justify-between">
            <div className="flex items-stretch h-full w-full justify-between pl-4 ">
                {/* Partie texte */}
                <div className="ml-0 md:ml-5 w-full md:w-1/2 lg:w-2/5 mx-auto flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <div className="max-w-md"> {/* Conteneur interne pour mieux contrôler la largeur */}
                        <h1 className="text-3xl md:text-5xl font-bold text-[#294E28] mb-6">
                        Recettes médicinales
                        </h1>
                        <p className="text-xl md:text-2xl text-[#294E28] leading-relaxed">
                        Découvrez notre collection de remèdes naturels...
                        </p>
                    </div>
                </div>

                {/* Partie image - occupe tout l'espace restant avec inclinaison */}
                <div className="hidden md:flex flex-grow relative">
                    <div 
                        className="absolute inset-0 "
                        style={{ 
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)',
                        left: '-1px' // Compensation du bord
                        }}
                    >
                        <img 
                        src={recette} 
                        alt="recette" 
                        className="w-full h-full object-cover object-center"
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)'
                        }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}