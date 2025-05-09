import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Plus, Clock, Upload, FileText } from 'lucide-react';

export default function RecipeFormModal({ show, onClose, onRecipeCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Tisane',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        preparation_steps: '',
        preparation_time: '',
        effect: '',
        pain_types: [],
        cover_image: null,
    });

    // Gestion dynamique des ingrédients
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        // setFormData(prev => ({ ...prev, cover_image: e.target.files[0] }));
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, cover_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [painTypes, setPainTypes] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/pain-types")
        .then(response => {
            console.log("Réponse API pain-types:", response.data);
            setPainTypes(response.data.data ?? response.data);
        })
            .catch(error => console.error('Error fetching pain types:', error));
    }, []);

    const isValid = 
        formData.title &&
        formData.type &&
        formData.description &&
        formData.ingredients.every(i => i.name && i.quantity) &&
        formData.preparation_steps &&
        formData.preparation_time &&
        formData.effect &&
        formData.pain_types.length > 0 &&
        formData.cover_image;


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }
        setIsSubmitting(true);
        
        // Simuler un délai de chargement
        setTimeout(() => {
            console.log("Formulaire soumis:", formData);
            setIsSubmitting(false);
            // onClose();
        }, 1000);
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
        formDataToSend.append('preparation_steps', formData.preparation_steps);
        formDataToSend.append('preparation_time', formData.preparation_time);
        formDataToSend.append('effect', formData.effect);
        formDataToSend.append('pain_types', JSON.stringify(formData.pain_types));
        formDataToSend.append('cover_image', formData.cover_image);
        
        try {
            await axios.post('http://localhost:8000/api/recipes', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });
            toast.success('Recette créée !');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur');
        }
    };    
    
    if (!show) return null;
    
    return (
        <div 
        className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        style={{
            animation: 'fadeIn 0.3s ease-out'
        }}
        >
        <div 
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{
            animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
        >
            <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 
                className="text-2xl font-bold text-[#316C40] flex items-center"
                style={{
                    animation: 'slideInRight 0.5s ease-out'
                }}
                >
                <Plus className="mr-2 text-[#316C40]" size={22} />
                Nouvelle Recette
                </h2>
                <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                style={{
                    transition: 'transform 0.2s ease'
                }}
                    onMouseOver={(e) =>{
                        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
                        e.currentTarget.style.transition = 'transform 0.3s ease';
                    }}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                <X size={20} />
                </button>
            </div>
    
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Type */}
                <div 
                    className="relative"
                    style={{
                        animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: '0.1s',
                    opacity: 0
                    }}
                >
                    <label className="block mb-1 font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="required w-full p-2 pl-3 pr-10 border border-gray-300 rounded-lg transition-shadow focus:ring-2 focus:ring-[#316C40]/30 focus:border-[#316C40] focus:outline-none"
                    >
                        <option value="Huile">Huile</option>
                        <option value="Tisane">Tisane</option>
                        <option value="Décoction">Décoction</option>
                        <option value="Cataplasme">Cataplasme</option>
                    </select>
                </div>

                {/* Effet principale */}
                <div 
                    className="md:col-span-2"
                    style={{
                    animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: '0.4s',
                    opacity: 0
                    }}
                >
                    <label className="block mb-1 font-medium text-gray-700">Effet principal</label>
                    <input
                        type="text"
                        name="effect"
                        value={formData.effect}
                        onChange={handleChange}
                        className="required w-full p-2 border border-gray-300 rounded-lg transition-shadow focus:ring-2 focus:ring-[#316C40]/30 focus:border-[#316C40] focus:outline-none"
                        placeholder="Ex: Relaxant, Anti-inflammatoire..."
                        required
                    />
                </div>
                </div>

                Types de douleur
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700">Douleurs ciblées*</label>
                    <select
                        name="pain_types"
                        multiple
                        value={formData.pain_types}
                        onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData(prev => ({ ...prev, pain_types: options }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg h-[120px]"
                        required
                    >
                        Ces valeurs doivent correspondre aux IDs de votre table pain_types */}
                        <option value="1">Migraine</option>
                        <option value="2">Douleurs articulaires</option>
                        <option value="3">Stress</option>
                        <option value="4">Insomnie</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                        Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs options
                    </p>
                </div>
    
                {/* Temps de préparation */}
                <div 
                    className="relative"
                    style={{
                    animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: '0.2s',
                    opacity: 0
                    }}
                >
                    <label className="block mb-1 font-medium text-gray-700">Temps de préparation</label>
                    <div className="relative">
                    <input
                        type="text"
                        name="preparation_time"
                        value={formData.preparation_time}
                        onChange={handleChange}
                        className="required w-full p-2 pl-9 border border-gray-300 rounded-lg transition-shadow focus:ring-2 focus:ring-[#316C40]/30 focus:border-[#316C40] focus:outline-none"
                        placeholder="Ex: 30 minutes"
                    />
                    <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
    
                {/* Titre */}
                <div 
                    className="md:col-span-2"
                    style={{
                    animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: '0.3s',
                    opacity: 0
                    }}
                    >
                    <label className="block mb-1 font-medium text-gray-700">Titre</label>
                    <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="required w-full p-2 border border-gray-300 rounded-lg transition-shadow focus:ring-2 focus:ring-[#316C40]/30 focus:border-[#316C40] focus:outline-none"
                    placeholder="Nom de votre recette"
                    />
                </div>

                {/* Ingrédients améliorés */}
                <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Ingrédients*</label>
                <div className="space-y-2">
                    {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <input
                        type="text"
                        placeholder="Nom"
                        className="col-span-5 p-2 border rounded-md border-gray-300 focus:border-[#316C40] focus:ring-2 focus:ring-[#316C40]/30"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        />
                        <input
                        type="text"
                        placeholder="Quantité"
                        className="col-span-5 p-2 border rounded-md border-gray-300 focus:border-[#316C40] focus:ring-2 focus:ring-[#316C40]/30"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        />
                        <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                            ...prev,
                            ingredients: prev.ingredients.filter((_, i) => i !== index),
                            }))
                        }
                        className="col-span-2 text-red-500 hover:text-white hover:bg-red-500 transition-colors p-2 rounded-md text-sm"
                        title="Supprimer"
                        >
                        <X size={16} />
                        </button>
                    </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() =>
                    setFormData((prev) => ({
                        ...prev,
                        ingredients: [...prev.ingredients, { name: '', quantity: '' }],
                    }))
                    }
                    className="mt-3 inline-block text-sm text-[#316C40] hover:underline"
                >
                    + Ajouter un ingrédient
                </button>
                </div>


    
                {/* Description */}
                <div 
                    style={{
                        animation: 'fadeInUp 0.4s ease-out forwards',
                        animationDelay: '0.5s',
                        opacity: 0
                    }}
                >
                <label className="mb-1 font-medium text-gray-700 flex items-center">
                    <FileText size={16} className="mr-1" />
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="required w-full p-3 border border-gray-300 rounded-lg transition-shadow focus:ring-2 focus:ring-[#316C40]/30 focus:border-[#316C40] focus:outline-none"
                    placeholder="Décrivez votre recette..."
                />
                </div>

                {/* Douleurs ciblées améliorées */}
                <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Types de douleurs traitées*</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {painTypes.map((pain) => (
                    <label key={pain.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        value={pain.id}
                        // name="pain_types"
                        checked={formData.pain_types.includes(String(pain.id))}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                            const updated = prev.pain_types.includes(value)
                                ? prev.pain_types.filter((id) => id !== value)
                                : [...prev.pain_types, value];
                            return { ...prev, pain_types: updated };
                            });
                        }}
                        className="accent-[#316C40]"
                        />
                        <span className="text-sm text-gray-700">{pain.name}</span>
                    </label>
                    ))}
                </div>
                </div>


    
                {/* Image */}
                <div 
                style={{
                    animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: '0.6s',
                    opacity: 0
                }}
                >
                <label className="block mb-1 font-medium text-gray-700">Image de couverture</label>
                <div className="relative">
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${previewUrl ? 'border-[#316C40]' : 'border-gray-300 hover:border-gray-400'}`}>
                    {previewUrl ? (
                        <div className="relative">
                        <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded" />
                        <button 
                            type="submit" 
                            onClick={() => {
                            setPreviewUrl(null);
                            setFormData(prev => ({ ...prev, cover_image: null }));
                            }}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                            <X size={16} />
                        </button>
                        </div>
                    ) : (
                        <div className="py-4">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-500">Cliquez ou glissez une image</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previewUrl ? 'pointer-events-none' : ''}`}
                    />
                    </div>
                </div>
                </div>
    
                <div 
                className="flex justify-end space-x-3 pt-4"
                style={{
                    animation: 'fadeIn 0.5s ease-out forwards',
                    animationDelay: '0.7s',
                    opacity: 0
                }}
                >
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{
                    transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isValid}
                    className="px-4 py-2 bg-[#316C40] text-white rounded-lg hover:bg-[#265232] transition-colors flex items-center"
                    style={{
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isSubmitting ? (
                    <>
                        <div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        style={{
                            animation: 'spin 1s linear infinite'
                        }}
                        />
                        Traitement...
                    </>
                    ) : (
                    'Publier la recette'
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
        
        <style jsx>{`
            @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
            }
            
            @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes slideInRight {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
            }
        `}</style>
        </div>
    );
}; 