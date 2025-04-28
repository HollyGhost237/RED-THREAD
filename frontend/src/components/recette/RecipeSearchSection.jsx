import { FiSearch, FiFilter, FiX, FiHeart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";
import hero4 from "../../assets/hero4.jpg";
import hero5 from "../../assets/hero5.jpg";
import hero6 from "../../assets/hero6.jpg";

const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};

const hoverEffect = {
    scale: 1.03,
    transition: { duration: 0.3 }
};

export default function RecipeSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        category: 'Toutes',
        healthIssue: 'Tous'
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [recipes, setRecipes] = useState([]);

    // Chargement initial des recettes
    useEffect(() => {
        // En production, remplacer par un appel API
        const sampleRecipes = [
        {
            id: 1,
            type: 'Tisane',
            title: 'Tisane au thym et miel',
            effect: 'Respiratoire',
            description: 'Soulage la toux et les maux de gorge',
            image: hero1
        },
        {
            id: 2,
            type: 'Cataplasme',
            title: "Cataplasme d'argile verte",
            effect: 'Douleur',
            description: 'Soulage les douleurs articulaires et musculaires',
            image: hero2
        },
        {
            id: 3,
            type: 'Huile',
            title: 'Sirop de gingembre et citron',
            effect: 'Peau',
            description: 'Renforce l\'immunité et aide à combattre les infections',
            image: hero3
        },
        {
            id: 4,
            type: 'Sirops',
            title: 'Huile de calendula',
            effect: 'Immunité',
            description: 'Apaise et répare la peau irritée',
            image: hero4
        },
        {
            id: 5,
            type: 'Teintures',
            title: 'Teinture de valériane',
            effect: 'Sommeil',
            description: 'Favorise un sommeil naturel et réparateur',
            image: hero5
        },
        {
            id: 6,
            type: 'Baumes',
            title: 'Baume à la lavande',
            effect: 'Stress',
            description: 'Apaise le stress et favorise la relaxation',
            image: hero6
        }
        ];
        setRecipes(sampleRecipes);
        
        // Charger les favoris depuis le localStorage
        const savedFavorites = localStorage.getItem('recipeFavorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }, []);

    // Sauvegarder les favoris
    useEffect(() => {
        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const filters = {
        category: ['Toutes', 'Plantes', 'Huiles', 'Tisanes', 'Cataplasmes', 'Teintures', 'Sirops'],
        healthIssue: ['Tous', 'Digestion', 'Immunité', 'Sommeil', 'Stress', 'Douleur', 'Peau']
    };

    // Recherche et filtrage fonctionnels
    const filteredRecipes = recipes.filter(recipe => {
        const searchMatch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const categoryMatch = activeFilters.category === 'Toutes' || 
                            recipe.type.toLowerCase() === activeFilters.category.toLowerCase();
        
        const healthMatch = activeFilters.healthIssue === 'Tous' || 
                        recipe.effect.toLowerCase() === activeFilters.healthIssue.toLowerCase();
        
        return searchMatch && categoryMatch && healthMatch;
    });

    const toggleFavorite = (id) => {
        setFavorites(prev => 
        prev.includes(id) 
            ? prev.filter(item => item !== id) 
            : [...prev, id]
        );
    };

    return (
        <section className="bg-[#DCFCE7] py-8 px-4">
        <div className="container mx-auto max-w-6xl">
            
            {/* Barre de recherche fonctionnelle */}

                <div className="relative mb-6">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par mot-clé..."
                            className="flex-grow px-4 py-3 focus:outline-none text-[#294E28]"
                        />
                        <button 
                            className="px-4 py-3 bg-[#E2F87B] text-[#294E28] hover:bg-[#316C40] hover:text-[#FDFFF6] transition-colors"
                            onClick={() => console.log('Recherche:', searchQuery)} // Ajouter logique de recherche
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>
                    </div>
                
                    <button 
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="md:hidden flex items-center mt-4 text-[#316C40]"
                    >
                        <FiFilter className="mr-2" />
                        Filtres
                        {(activeFilters.category !== 'Toutes' || activeFilters.healthIssue !== 'Tous') && (
                        <span className="ml-2 bg-[#DCFCE7] text-[#294E28] px-2 py-1 rounded-full text-xs">
                            {[activeFilters.category, activeFilters.healthIssue]
                            .filter(f => !['Toutes', 'Tous'].includes(f)).length}
                        </span>
                        )}
                    </button>
                </div>

            {/* Filtres Desktop */}
            <div className="hidden md:flex gap-6 mb-8">
            {Object.entries(filters).map(([filterType, options]) => (
                <div key={filterType} className="flex-1">
                <h3 className="text-lg font-semibold text-[#316C40] mb-2 capitalize">
                    {filterType === 'healthIssue' ? 'Problème de santé' : 'Catégorie'}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                    <button
                        key={option}
                        onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        [filterType]: option
                        }))}
                        className={`px-4 py-2 rounded-full text-sm ${
                        activeFilters[filterType] === option
                            ? 'bg-[#316C40] text-[#FDFFF6]'
                            : 'bg-[#BBF7D0] text-[#294E28] hover:bg-[#316C40] hover:text-[#FDFFF6]'
                        } transition-colors`}
                    >
                        {option}
                    </button>
                    ))}
                </div>
                </div>
            ))}
            </div>

            {/* Résultats avec boutons favoris */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                    <div>
                        <motion.div key={recipe.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-[#E2F87B] overflow-hidden hover:shadow-md transition-shadow">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-t-xl" />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block px-3 py-1 bg-[#E2F87B] text-[#294E28] rounded-full text-sm font-medium">
                                    {recipe.type}
                                    </span>
                                    <motion.button 
                                        onClick={() => toggleFavorite(recipe.id)}
                                        whileTap={{ scale: 1.3 }}
                                        className="text-[#316C40] hover:text-red-500 transition-colors"
                                        aria-label={favorites.includes(recipe.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                    >
                                    <FiHeart className={`w-5 h-5 ${favorites.includes(recipe.id) ? 'fill-current text-red-500' : ''}`} />
                                    </motion.button>
                                </div>
                                
                                <h3 className="text-xl font-bold text-[#294E28] my-3">{recipe.title}</h3>
                                <p className="text-[#316C40] mb-4">{recipe.description}</p>
                                <span className="text-sm bg-[#DBEAFE] text-[#1E40AF] rounded-sm px-2">{recipe.effect}</span>
                            </div>
                        </motion.div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                <p className="text-xl text-[#294E28]">
                    {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucune recette disponible'}
                </p>
                </div>
            )}
            </div>
        </div>

        {/* Filtres Mobile */}
        {showMobileFilters && (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }} 
                className="md:hidden fixed inset-0 bg-white z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#294E28]">Filtres</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                <FiX className="w-6 h-6 text-[#294E28]" />
                </button>
            </div>
            
            {Object.entries(filters).map(([filterType, options]) => (
                <div key={filterType} className="mb-8">
                <h3 className="text-lg font-semibold text-[#316C40] mb-4 capitalize">
                    {filterType === 'healthIssue' ? 'Problème de santé' : 'Catégorie'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {options.map(option => (
                    <button
                        key={option}
                        onClick={() => {
                        setActiveFilters(prev => ({
                            ...prev,
                            [filterType]: option
                        }));
                        setShowMobileFilters(false);
                        }}
                        className={`px-4 py-3 rounded-lg ${
                        activeFilters[filterType] === option
                            ? 'bg-[#316C40] text-[#FDFFF6]'
                            : 'bg-[#E2F87B] text-[#294E28]'
                        }`}
                    >
                        {option}
                    </button>
                    ))}
                </div>
                </div>
            ))}
            </motion.div>
        )}
        </section>
    );
}