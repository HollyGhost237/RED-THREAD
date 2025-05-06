import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import logim from '../assets/logimg.jpg';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const card = cardRef.current;
        const overlay = overlayRef.current;
        
        const handleMouseMove = (e) => {
            if (!card || !overlay) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            overlay.style.setProperty('--mouse-x', `${x}px`);
            overlay.style.setProperty('--mouse-y', `${y}px`);
        };

        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', {
                email: formData.email.toLowerCase().trim(), // Normalisation
                password: formData.password
            });
    
            // Stockage du token
            (rememberMe ? localStorage : sessionStorage).setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
    
            navigate('/dashboard');
            
        } catch (error) {
            if (error.response?.status === 403 && error.response.data?.requires_verification) {
                navigate('/verification-pending');
            } 
            else if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            else {
                alert(error.response?.data?.message || 'Erreur de connexion');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${logim})` }}>
            <div className="flex flex-col lg:flex-row w-full max-w-4xl items-center gap-10 px-4">
                {/* En-tête */}
                <div className="text-center lg:text-left mb-8 lg:mb-0 lg:w-1/2">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4 text-white">WELCOME</h1>
                    <p className="text-lg md:text-xl text-white">
                        Bienvenue à votre bibliothèque de plantes naturelles.<br />
                        Connectez-vous et découvrez ce qu'il y a de meilleur dans la nature près de chez vous.
                    </p>
                </div>

                {/* Carte de connexion */}
                <div 
                    ref={cardRef}
                    className="relative rounded-xl shadow-3xl shadow-xl/30 overflow-hidden lg:w-1/2 min-w-[320px] bg-radial-[at_60%_40%] from-[#031A09] via-[#317643] to-[#031A09] to-80%"
                >
                    {/* Overlay pour l'effet de souris */}
                    <div 
                        ref={overlayRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(226, 248, 123, 0.2) 0%, transparent 150px)',
                            transition: 'background 0.1s ease'
                        }}
                    />
                    
                    <div className="relative backdrop-blur-md rounded-lg p-6 md:p-8 h-full z-10">
                        <h2 className="text-2xl font-bold text-left mb-2" style={{ color: '#E2F87B' }}>Sign In</h2>
                        <p className="text-left mb-6 text-white">Connectez-vous</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Champ Email */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Entrez votre email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#316C40] placeholder:text-white placeholder:font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2F87B]"
                                    style={{ color: 'white' }}
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>}
                            </div>

                            {/* Champ Mot de passe */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#316C40] placeholder:text-white placeholder:font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E2F87B] pr-10"
                                    style={{ color: 'white' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    style={{ color: '#E2F87B' }}
                                >
                                    {showPassword ? <FiEyeOff className='text-[#316C40] '/> : <FiEye className='text-[#316C40] ' />}
                                </button>
                                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password[0]}</p>}
                            </div>

                            {/* Options */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-white">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="rounded border-white mr-2"
                                        style={{ accentColor: '#E2F87B' }}
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="text-sm" style={{ color: '#E2F87B' }}>
                                    Forget password?
                                </Link>
                            </div>

                            {/* Bouton de connexion */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-lg font-bold text-lg transition-colors"
                                style={{
                                    backgroundColor: '#E2F87B',
                                    color: '#031A09',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? 'Connexion en cours...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Lien vers l'inscription */}
                        <div className="mt-6 text-center text-white">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium" style={{ color: '#E2F87B' }}>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles globaux pour les variables CSS */}
            <style jsx global>{`
                :root {
                    --mouse-x: 50%;
                    --mouse-y: 50%;
                }
            `}</style>
        </div>
    );
}