import { useState } from 'react';
import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';
import img3 from '../../assets/img3.png';

export default function MedicinalRecipes() {
    const recipes = [
        {
            title: "Inclusion au Trym pour le Rhume",
            tags: ["Rhume", "Rifusion", "Foule"],
            link: "#", 
            tete1: img1
        },
        {
            title: "Boisson glacé au citron",
            tags: ["Couverture", "Castagneux", "Warmdichte"],
            link: "#",
            tete1: img2
        },
        {
            title: "Tisane de Valériane pour l'insomnie",
            tags: ["Insomnie", "Tisane", "Faille"],
            link: "#",
            tete1: img3
        }
    ];

    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <section className="py-16 bg-[#F0FDF4]">
            <div className="container mx-auto px-4">
                {/* En-tête */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#294E28] mb-4">
                        Recettes Médicinales
                    </h1>
                    <p className="text-xl text-[#316C40]">
                        Des remèdes naturels pour soulager vos maux quotidiens
                    </p>
                </div>

                {/* Grille des recettes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {recipes.map((recipe, index) => (
                        <div 
                            key={index}
                            className={`relative bg-white rounded-xl shadow-md transition-all duration-300 ${hoveredCard === index ? 'shadow-lg -translate-y-2' : ''}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Image de la recette */}
                            <div>
                                <img 
                                    src={recipe.tete1} 
                                    alt={recipe.title} 
                                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                                />
                            </div>
                            <div className='pl-6 pb-6 pr-6'>
                                <h2 className="text-2xl font-bold text-[#316C40] mb-3">{recipe.title}</h2>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {recipe.tags.map((tag, i) => (
                                    <span 
                                        key={i} 
                                        className="px-3 py-1 bg-[#E2F87B] text-[#294E28] rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                    ))}
                                </div>
                                <a 
                                    href={recipe.link} 
                                    className="inline-block mt-4 px-6 py-2 bg-[#316C40] text-[#FDFFF6] rounded-lg hover:bg-[#294E28] transition-colors"
                                >
                                    Voir la recette
                                </a>
                            </div>
                            
                        </div>
                    ))}
                </div>

                {/* Bouton "Voir plus" */}
                <div className="text-center">
                    <button className="px-8 py-3 border-2 border-[#316C40] text-[#316C40] font-medium rounded-lg hover:bg-[#316C40] hover:text-[#FDFFF6] transition-colors">
                        Voir plus de recettes
                    </button>
                </div>
            </div>
        </section>
    );
}