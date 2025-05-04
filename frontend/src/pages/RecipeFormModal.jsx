import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RecipeFormModal({ show, onClose, onRecipeCreated }) {
    const [formData, setFormData] = useState({
        type: 'Huile',
        title: '',
        effect: '',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        preparation_steps: '',
        preparation_time: '',
        cover_image: null,
        pain_types: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, cover_image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'ingredients' || key === 'pain_types') {
                        formDataToSend.append(key, JSON.stringify(value));
                    } else if (key !== 'cover_image') {
                        formDataToSend.append(key, value);
                    }
                }
            });

            if (formData.cover_image) {
                formDataToSend.append('cover_image', formData.cover_image);
            }

            const response = await axios.post('/api/recipes', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Recette créée avec succès!');
            onRecipeCreated(response.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la création');
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#316C40]">Nouvelle Recette</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                                <label className="block mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="Huile">Huile</option>
                                    <option value="Tisane">Tisane</option>
                                    <option value="Décoction">Décoction</option>
                                </select>
                            </div>

                            {/* Titre */}
                            <div className="md:col-span-2">
                                <label className="block mb-1">Titre</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            {/* Effet */}
                            <div>
                                <label className="block mb-1">Effet principal</label>
                                <input
                                    type="text"
                                    name="effect"
                                    value={formData.effect}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            {/* Temps de préparation */}
                            <div>
                                <label className="block mb-1">Temps de préparation</label>
                                <input
                                    type="text"
                                    name="preparation_time"
                                    value={formData.preparation_time}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block mb-1">Image de couverture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#316C40] text-white rounded"
                            >
                                Publier la recette
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}