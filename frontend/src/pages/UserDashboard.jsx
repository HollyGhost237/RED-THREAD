import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RecipeFormModal from './RecipeFormModal';
import { FiSettings, FiEdit2, FiMessageSquare, FiClock, FiBookmark, FiUser } from 'react-icons/fi';

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDiscussionForm, setShowDiscussionForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [canCreateRecipes, setCanCreateRecipes] = useState(false);

    // Initialisation correcte du formData avec les données utilisateur
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        professionalTitle: '',
        bio: '',
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
        avatarFile: null,
        avatarPreview: ''
    });

    
    // Mise à jour du formData quand l'utilisateur est chargé
    useEffect(() => {
        if (user) {
            // const nameParts = user.name.split(' ');
            setFormData({
                // firstName: nameParts[0] || '',
                name: user.name || '',
                email: user.email || '',
                professionalTitle: user.professional_title || '',
                bio: user.bio || '',
                currentPassword: '',
                password: '',
                passwordConfirmation: '',
                avatarFile: null,
                avatarPreview: user.avatar || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                toast.error('Veuillez sélectionner une image valide (JPEG, PNG, JPG, GIF)');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatarPreview: reader.result,
                    avatarFile: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const formDataToSend = new FormData();
            const lastName = formData?.lastName ? ` ${formData.lastName}` : '';
            // Ajout des champs texte
            formDataToSend.append('name', formData.name + lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('professional_title', formData.professionalTitle);
            formDataToSend.append('bio', formData.bio);
            
            // Ajout du fichier si présent
            if (formData.avatarFile) {
                formDataToSend.append('avatar', formData.avatarFile);
            }
            
            // Ajout des champs mot de passe si remplis
            if (formData.password) {
                formDataToSend.append('current_password', formData.currentPassword);
                formDataToSend.append('password', formData.password);
                formDataToSend.append('password_confirmation', formData.passwordConfirmation);
            }

            // Debug: Affiche le contenu de FormData
            console.log('Données envoyées:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(
                `${API_URL}/api/user/profile`,                
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                }
            );

            // Mise à jour de l'état utilisateur
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setShowEditForm(false);
            toast.success('Profil mis à jour avec succès!');
            
        } catch (error) {
            console.error('Erreur détaillée:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key][0]);
                });
            } else if (error.response?.status === 413) {
                toast.error('Fichier trop volumineux (max 2MB)');
            } else {
                toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
                });
                setUser(data.user);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    navigate('/login');
                    return;
                }
    
                setUser(data.user);
                setCanCreateRecipes(
                    data.user.role === 'admin' || 
                    (data.user.role === 'health_professional' && data.user.is_verified)
                );

                // 1. Fetch user data
                const { data: userData } = await axios.get('http://localhost:8000/api/auth/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userData.user);

                // 2. Fetch saved recipes
                const { data: recipesData } = await axios.get('http://localhost:8000/api/recipes', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { saved: true }
                });
                console.log('Recipes response:', recipesData); // Debug
                setSavedRecipes(recipesData.data || []); // Fallback to empty array

                // 3. Fetch recent activity
                const fetchRecentActivity = async () => {
                    try {
                            const { data: activityData } = await axios.get('http://localhost:8000/api/discussions', {
                                headers: { Authorization: `Bearer ${token}` },
                                params: { recent_activity: true }
                            });
                            return activityData.data || []; // Fallback to empty array
                        } catch (error) {
                            console.error("Error fetching recent activity:", error);
                            return []; // Retourne un tableau vide en cas d'erreur
                        }
                };
                const activity = await fetchRecentActivity();
                setRecentActivity(activity);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                if (err.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Dans votre composant de dashboard ou layout principal
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return navigate('/login');

            try {
                const { data } = await axios.get('/api/user');
                if (data.role === 'health_professional' && !data.is_verified) {
                    navigate('/verification-pending', {
                        state: { email: data.email }
                    });
                }
            } catch (error) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            }
        };

        checkAuthStatus();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#316C40]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">Erreur: {error}</div>
            </div>
        );
    }

    // Fonction helper pour vérifier si un tableau est vide
    const isEmpty = (array) => !array || array.length === 0;
    return (
        <div className="min-h-screen bg-[#E5F4E4] p-4 md:p-8">
            {/* Formulaire d'édition de profil (modal) */}
            {showEditForm && (
                    <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div 
                            className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                        <div className="p-6">
                            {/* En-tête avec bouton de fermeture */}
                            <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#316C40]">Modifier mon profil</h2>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Section Informations de base */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Prénom */}
                                {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                    required
                                />
                                </div> */}

                                {/* Nom */}
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                    required
                                />
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                    required
                                />
                                </div>
                            </div>

                            {/* Section Mot de passe */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-[#316C40] mb-4">Changer le mot de passe</h3>
                            
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            name="passwordConfirmation"
                                            value={formData.passwordConfirmation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section Profession (conditionnelle) */}
                            {user?.role === 'health_professional' && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-[#316C40] mb-4">Informations professionnelles</h3>
                                
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Titre professionnel */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre professionnel</label>
                                            <input
                                                type="text"
                                                name="professionalTitle"
                                                value={formData.professionalTitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                                required
                                            />
                                        </div>

                                        {/* Spécialité */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                                            <select
                                                name="specialty"
                                                value={formData.specialty}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                            >
                                                <option value="">Sélectionnez...</option>
                                                <option value="phytotherapie">Phytothérapie</option>
                                                <option value="naturopathie">Naturopathie</option>
                                                <option value="aromathérapie">Aromathérapie</option>
                                            </select>
                                        </div>

                                        {/* Bio */}
                                        <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#316C40] focus:border-[#316C40]"
                                        />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section Photo de profil */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-[#316C40] mb-4">Photo de profil</h3>
                                
                                <div className="flex items-center space-x-6">
                                    <div className="shrink-0">
                                        <img
                                            className="h-16 w-16 rounded-full object-cover"
                                            src={formData.avatarPreview || user?.avatar || '/default-avatar.jpg'}
                                            alt="Photo de profil"
                                        />
                                    </div>
                                    <label className="block">
                                        <span className="sr-only">Choisir une photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-[#E2F87B] file:text-[#316C40]
                                                hover:file:bg-[#316C40] hover:file:text-[#E2F87B]"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                type="button"
                                onClick={() => setShowEditForm(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                Annuler
                                </button>
                                <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg text-white ${isSubmitting ? 'bg-gray-400' : 'bg-[#316C40] hover:bg-[#294E28]'} transition-colors`}
                                >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                    </span>
                                ) : 'Enregistrer les modifications'}
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
            )}

            {/* Formulaire de discussion (modal) */}
            {showDiscussionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Nouvelle discussion</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block mb-2">Titre</label>
                                <input type="text" className="w-full p-2 border rounded" />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Message</label>
                                <textarea className="w-full p-2 border rounded" rows="4"></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowDiscussionForm(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-[#316C40] text-white rounded"
                                >
                                    Publier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Formulaire de création de recette (modal) */}
            {showRecipeForm && (
                <RecipeFormModal
                    show={showRecipeForm}
                    onClose={() => setShowRecipeForm(false)}
                    onRecipeCreated={(newRecipe) => {
                        setSavedRecipes(prev => [newRecipe, ...prev]);
                    }}
                />
            )}

            <div className="max-w-6xl mx-auto">
                {/* Header Profil */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Photo de profil */}
                        <div className="relative">
                            {user?.avatar ? (
                                <img 
                                    src={`/storage/avatars/${user.avatar}`}
                                    className="w-20 h-20 rounded-full object-cover"
                                    alt="Photo de profil"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = '/default-avatar.jpg';
                                    }}
                                />
                            ) : (
                                <div className="bg-[#316C40] text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl">
                                    <FiUser className="inline" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </p>
                            {user?.professional_title && (
                                <span className="inline-block mt-2 px-3 py-1 bg-[#E2F87B] text-[#316C40] rounded-full text-sm font-medium">
                                    {user.professional_title}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowEditForm(true)}
                            className="flex items-center px-4 py-2 bg-[#316C40] text-white rounded-lg hover:bg-[#294E28] transition"
                        >
                            <FiEdit2 className="mr-2" /> Modifier le profil
                        </button>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne 1: Recettes sauvegardées */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section Recettes */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FiBookmark /> Recettes sauvegardées
                                </h2>
                                <Link to="/recipes" className="text-sm text-[#316C40] hover:underline">
                                    Voir toutes
                                </Link>
                            </div>
                            
                            {!isEmpty(savedRecipes) ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {savedRecipes.map(recipe => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Aucune recette sauvegardée</p>
                                    <Link to="/recettes" className="mt-2 inline-block text-[#316C40] hover:underline">
                                        Explorer les recettes
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Section Activité */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                                <FiClock /> Activité récente
                            </h2>
                            {!isEmpty(recentActivity) ? (
                                <ul className="space-y-3">
                                    {recentActivity.map(activity => (
                                        <ActivityItem key={activity.id} activity={activity} />
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Aucune activité récente
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Colonne 2: Actions rapides */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
                            <ul className="space-y-3">

                                {/* Bouton recette */}

                                <li>
                                    <button 
                                        onClick={() => {
                                            if (!canCreateRecipes) {
                                                toast.error('Seuls les professionnels vérifiés peuvent créer des recettes');
                                                return;
                                            }
                                            setShowRecipeForm(true);
                                        }}
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition w-full text-left"
                                    >
                                        <span className="w-8 h-8 bg-[#E2F87B] rounded-full flex items-center justify-center">
                                            ✏️
                                        </span>
                                        <span>Créer une recette</span>
                                    </button>
                                </li>
                                <li>
                                    <Link 
                                        onClick={() => setShowDiscussionForm(true)}  
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition"
                                    >
                                        <span className="w-8 h-8 bg-[#E2F87B] rounded-full flex items-center justify-center">
                                            💬
                                        </span>
                                        <span>Démarrer une discussion</span>
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem('auth_token');
                                            localStorage.removeItem('user');
                                            navigate('/login');
                                        }}
                                        className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                                    >
                                        <span className="w-8 h-8 bg-[#E2F87B] rounded-full flex items-center justify-center">
                                            🚪
                                        </span>
                                        <span>Déconnexion</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Statistiques */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Votre contribution</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard 
                                    value={user?.recipes_count || 0} 
                                    label="Recettes publiées" 
                                />
                                <StatCard 
                                    value={user?.discussions_count || 0} 
                                    label="Discussions" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Option admin */}
                    {user?.role === 'admin' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Administration</h2>
                            <ul className="space-y-3">
                                <li>
                                    <Link 
                                        to="/admin/professionals"
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition"
                                    >
                                        <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                                            👨‍⚕️
                                        </span>
                                        <span>Professionnels en attente</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/admin/recipes"
                                        className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition"
                                    >
                                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                            📝
                                        </span>
                                        <span>Modérer les recettes</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

        // Composants enfants
        function RecipeCard({ recipe }) {
            return (
                <Link 
                    to={`/recipes/${recipe.slug}`}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                    <div className="h-40 bg-gray-100 relative">
                        {recipe.cover_image && (
                            <img 
                                src={recipe.cover_image} 
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium line-clamp-1">{recipe.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Sauvegardée le {new Date(recipe.created_at).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                </Link>
            );
        }

        function ActivityItem({ activity }) {
            return (
                <li className="border-b pb-3 last:border-0">
                    <div className="flex gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {activity.type === 'discussion' ? '💬' : '💬'}
                        </div>
                        <div>
                            <p className="text-sm">
                                {activity.type === 'discussion' 
                                    ? 'Vous avez démarré une discussion'
                                    : 'Vous avez répondu à une discussion'}
                            </p>
                            <Link 
                                to={`/discussions/${activity.discussion_id}`}
                                className="text-[#316C40] hover:underline text-sm font-medium"
                            >
                                {activity.title}
                            </Link>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(activity.created_at).toLocaleString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </li>
            );
        }

function StatCard({ value, label }) {
    return (
        <div className="bg-[#F5F5F5] p-3 rounded-lg">
            <p className="text-2xl font-bold text-[#316C40]">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}