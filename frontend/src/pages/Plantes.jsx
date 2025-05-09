import { useState, useEffect } from 'react';
import { Search, Leaf, MapPin, Calendar, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

export default function Plantes() {
    const [plantes, setPlantes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPlant, setExpandedPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchPlantes = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/plantes`);
                // Assure que les données ont la bonne structure
                const formattedData = data.map(plante => ({
                    ...plante,
                    maladies: plante.maladies || [], // Valeur par défaut si maladies est undefined
                    nomLocal: plante.nom_local || '', // Standardisation des noms
                    descriptionCourte: plante.description_courte || '',
                    descriptionComplete: plante.description_complete || '',
                    lieuCulture: plante.lieu_culture || '',
                    periodeCulture: plante.periode_culture || '',
                    image: plante.image_path || ''
                }));
                setPlantes(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des plantes:", error);
                setLoading(false);
            }
        };

        fetchPlantes();
    }, []);

    const filteredPlantes = plantes.filter(plante => {
        if (!plante) return false;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            (plante.nomLocal?.toLowerCase() || '').includes(searchLower) ||
            (plante.descriptionCourte?.toLowerCase() || '').includes(searchLower) ||
            (plante.maladies?.some(maladie => 
                maladie?.toLowerCase().includes(searchLower)
            ) || false)
        );
    });

    const toggleExpand = (id) => {
        setExpandedPlant(expandedPlant === id ? null : id);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl bg-green-50 min-h-screen">
            {/* En-tête */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    {/* <div className="bg-green-100 p-4 rounded-full">
                    <img
                        src={`${API_URL}/storage/plantes/logo.png`}
                        alt="logo" size={48} />
                    </div> */}
                </div>
                <h1 className="text-4xl font-bold text-green-800 mb-4">Plantes Médicinales Africaines</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Découvrez la richesse des plantes africaines et leurs utilisations traditionnelles pour les soins de santé.
                </p>
            </div>

            {/* Barre de recherche */}
            <div className="mb-10">
                <div className="relative max-w-2xl mx-auto transform hover:scale-101 transition-all duration-300">
                    <input
                        type="text"
                        placeholder="Rechercher une plante ou une maladie..."
                        className="w-full px-6 py-4 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500 pl-14 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search 
                        className="absolute left-4 top-4 text-gray-400" 
                        size={24} 
                    />
                </div>
            </div>

            {/* Liste des plantes */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlantes.map((plante) => (
                        <div
                            key={plante.id}
                            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl ${
                                expandedPlant === plante.id ? 'ring-2 ring-green-600 scale-102' : 'hover:scale-101'
                            }`}
                        >
                            <div 
                                className="cursor-pointer"
                                onClick={() => toggleExpand(plante.id)}
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        {/* Utilisation d'une image placeholder */}
                                        <img 
                                            src={`${API_URL}/storage/${plante.image}`}
                                            alt={plante.nomLocal}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            Médicinale
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-green-800">{plante.nomLocal}</h2>
                                        {expandedPlant === plante.id ? 
                                            <ChevronUp size={20} className="text-green-600" /> : 
                                            <ChevronDown size={20} className="text-green-600" />
                                        }
                                    </div>
                                    <p className="text-gray-600">{plante.descriptionCourte}</p>
                                </div>
                            </div>

                            {/* Contenu déplié avec animation */}
                            {expandedPlant === plante.id && (
                                <div className="px-6 pb-6 space-y-5 animate-fadeIn border-t border-gray-100 pt-4">
                                    <div>
                                        {/* <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <img
                                                src={`${API_URL}/storage/plantes/logo.png`}
                                                alt="logo" size={4} />
                                            Description complète:
                                        </h3> */}
                                        <p className="text-gray-600 mt-2 pl-6">{plante.descriptionComplete}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <MapPin size={18} className="text-green-600" />
                                            Lieu de culture:
                                        </h3>
                                        <p className="text-gray-600 mt-2 pl-6">{plante.lieuCulture}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <Calendar size={18} className="text-green-600" />
                                            Période propice:
                                        </h3>
                                        <p className="text-gray-600 mt-2 pl-6">{plante.periodeCulture}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <Pill size={18} className="text-green-600" />
                                            Maladies traitées:
                                        </h3>
                                        <ul className="mt-2 pl-6 grid grid-cols-2 gap-2">
                                            {plante.maladies.map((maladie, index) => (
                                                <li key={index} className="text-gray-600 flex items-center">
                                                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                                    {maladie}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Message si aucun résultat */}
            {!loading && filteredPlantes.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-lg mx-auto">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">Aucune plante ne correspond à votre recherche.</p>
                    <p className="text-gray-400">Essayez un autre terme ou vérifiez l'orthographe.</p>
                </div>
            )}
        </div>
    );
}