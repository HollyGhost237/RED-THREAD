import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiMail, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

export default function VerificationPending() {
    const [isResent, setIsResent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();

    const handleResendEmail = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/auth/resend-verification');
            setIsResent(true);
        } catch (error) {
            console.error("Erreur lors de l'envoi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#E5F4E4] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <FiClock className="h-12 w-12 text-yellow-500" />
                </div>
                
                <h1 className="text-2xl font-bold text-[#316C40] mb-4">
                    Validation Professionnelle Requise
                </h1>
                
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left">
                    <div className="flex items-start">
                        <FiAlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-700">
                            Votre compte professionnel (<span className="font-semibold">{state?.email}</span>) 
                            nécessite une validation manuelle par notre équipe.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleResendEmail}
                    disabled={isLoading || isResent}
                    className={`mb-4 w-full px-6 py-2 rounded-lg ${
                        isResent ? 'bg-green-500' : 'bg-[#316C40] hover:bg-[#294E28]'
                    } text-white transition`}
                >
                    {isLoading ? 'Envoi...' : isResent ? 'Email envoyé ✓' : 'Renvoyer la demande'}
                </button>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition w-full"
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}