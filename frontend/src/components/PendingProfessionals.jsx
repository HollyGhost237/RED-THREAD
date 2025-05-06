import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PendingProfessionals() {
    const [data, setData] = useState({
        professionals: [],
        stats: { total_pending: 0 },
        loading: true,
        rejectionReason: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
                if (!token) {
                throw new Error('No authentication token found');
                }
        
            const { data: response } = await axios.get(`${API_URL}/api/admin/pending-professionals`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Réponse API:', response); // Debug
            
            setData(prev => ({
                ...prev,
                professionals: response.professionals?.data || response.professionals || [],
                stats: response.stats || { total_pending: 0 },
                loading: false
            }));
        } catch (error) {
            console.error('Erreur API:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            },
            console.error('Authentication error:', error) 
        );
            toast.error(error.response?.data?.message || 'Erreur lors du chargement des professionnels');
            setData(prev => ({ ...prev, loading: false }));
        }
    };
    
    const handleAction = async (action, user, reason = null) => {
        try {
            const endpoint = action === 'verify' 
                ? `${API_URL}/api/admin/professionals/${user.id}/verify`
                : `${API_URL}/api/admin/professionals/${user.id}/reject`;

            console.log('Endpoint appelé:', endpoint); // Debug

            const config = {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.put(
                endpoint, 
                action === 'reject' ? { reason } : {}, 
                config
            );

            console.log('Réponse action:', response.data); // Debug

            toast.success(action === 'verify' 
                ? 'Professionnel validé !' 
                : 'Professionnel rejeté'
            );
            fetchData(); // Rafraîchir les données
        } catch (error) {
            console.error('Erreur action:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    if (data.loading) return (
        <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#316C40]"></div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Professionnels en attente</h1>
                <span className="bg-[#316C40] text-white px-3 py-1 rounded-full text-sm">
                    {data.stats.total_pending} en attente
                </span>
            </div>

            {!data.professionals.length ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Aucune demande en attente</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.professionals.map(professional => (
                        <div key={professional.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-[#316C40]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-medium">{professional.name}</h3>
                                    <p className="text-sm text-gray-600">{professional.email}</p>
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold">Spécialité :</span> {professional.professional_title}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col">
                                    <span className="text-sm">
                                        <span className="font-semibold">Recettes :</span> {professional.recipes_count}
                                    </span>
                                    <span className="text-sm">
                                        <span className="font-semibold">Discussions :</span> {professional.discussions_count}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-2">
                                        Inscrit le {new Date(professional.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 justify-end">
                                    <button
                                        onClick={() => handleAction('verify', professional)}
                                        className="bg-[#316C40] text-white px-4 py-2 rounded hover:bg-[#294E28]"
                                    >
                                        Valider
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = prompt('Motif du rejet :');
                                            if (reason) handleAction('reject', professional, reason);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Rejeter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}