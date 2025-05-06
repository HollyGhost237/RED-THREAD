import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function VerificationPending() {
    const [userEmail, setUserEmail] = useState('');
    const [isResent, setIsResent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupération sécurisée de l'email
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserEmail(parsedUser?.email || '');
            } catch (error) {
                console.error("Erreur de parsing des données utilisateur", error);
            }
        }
    }, []);
    
    const handleResendEmail = async () => {
        setIsLoading(true);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
            `${apiUrl}/api/auth/resend-verification`, 
            {},  
            
            //     const handleResendEmail = async () => {
            //     setIsLoading(true);
            //     try {
            //         const token = localStorage.getItem('auth_token');
            //         if (!token) throw new Error('No authentication token found');

            //         const response = await axios.post(
            //             `${process.env.REACT_APP_API_URL}/auth/resend-verification`,
            //             {},
            //             {
            //                 headers: {
            //                     'Authorization': `Bearer ${token}`,
            //                     'Content-Type': 'application/json'
            //                 }
            //             }
            //         );
                    
            //         setIsResent(true);
            //         toast.success(response.data.message);
            //     } catch (error) {
            //         toast.error(error.response?.data?.message || error.message);
            //     } finally {
            //         setIsLoading(false);
            //     }
            // };
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                }
            };
            setIsResent(true);
            toast.success('Demande renvoyée avec succès');
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
            >
                <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                    className="flex justify-center mb-6"
                >
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <FiClock className="h-12 w-12 text-yellow-500" />
                    </div>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-[#316C40] mb-4"
                >
                    Validation Professionnelle Requise
                </motion.h1>
                
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-yellow-50 p-5 rounded-xl mb-8 text-left border-l-4 border-yellow-400"
                >
                    <div className="flex items-start">
                        <FiAlertCircle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-700 text-sm">
                            Votre compte professionnel{' '}
                            {userEmail ? (
                                <span className="font-semibold">{userEmail}</span>
                            ) : (
                                <span className="italic">(chargement...)</span>
                            )}{' '}
                            nécessite une validation manuelle par notre équipe.
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResendEmail}
                        disabled={isLoading || isResent}
                        className={`w-full px-6 py-3 rounded-xl font-medium flex items-center justify-center transition duration-300 ${
                            isResent 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#316C40] hover:bg-[#294E28]'
                        } text-white shadow-md`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Envoi en cours...
                            </>
                        ) : isResent ? (
                            <>
                                <FiCheckCircle className="mr-2 h-5 w-5" /> Email envoyé avec succès
                            </>
                        ) : (
                            <>
                                <FiMail className="mr-2 h-5 w-5" /> Renvoyer la demande
                            </>
                        )}
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:border-gray-400 transition duration-300 font-medium"
                    >
                        Se déconnecter
                    </motion.button>
                </div>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 text-xs mt-8"
                >
                    Pour toute question, contactez notre support
                </motion.p>
            </motion.div>
        </div>
    );
}