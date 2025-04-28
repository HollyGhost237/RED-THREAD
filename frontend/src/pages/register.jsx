import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Pour les icônes SHOW
import '../index.css';
import bgsign from '../assets/bgsign.jpg';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        password: '',
        password_confirmation: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await axios.post('http://localhost:8000/api/register', {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`
            });
            
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Registration error:', error);
                alert('Une erreur est survenue lors de l\'inscription');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.firstName && 
                    formData.lastName && 
                    formData.role && 
                    formData.password && 
                    formData.password === formData.password_confirmation;

    return (
        <div className="max-h-screen md:px-20  flex flex-col md:flex-row bg-[#E5F4E4]">
            {/* Partie formulaire */}
            <div className="relative left-8 w-full md:w-1/2  flex items-center justify-center p-4 bg-white md:ml-12 md:py-10 rounded-2xl shadow-xl/30 md:self-center">
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 ">
                    <h1 className="text-2xl font-bold text-[#316C40] text-left mb-2">Sign In</h1>
                    <h2 className="text-lg text-[#316C40] text-left mb-4 font-medium">Créez votre compte</h2>

                    {/* Champ Prénom */}
                    <div>
                        <label className="text-gray-700 mb-2 hidden">Entrez votre prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Entrez votre prénom"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#E2F87B] placeholder:font-bold placeholder:text-[#316C40] shadow-lg shadow-[#316C40]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316C40]"
                            required
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName[0]}</p>}
                    </div>

                    {/* Champ Nom */}
                    <div>
                        <label className="hidden text-gray-700 mb-2">Entrez votre nom</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Entrez votre nom"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#E2F87B] placeholder:font-bold placeholder:text-[#316C40] shadow-lg shadow-[#316C40]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316C40]"
                            required
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName[0]}</p>}
                    </div>

                    {/* Champ Fonction */}
                    <div>
                        <label className="hidden text-gray-700 mb-2">Votre Fonction</label>
                        <select
                            name="role"
                            value={formData.role}
                            placeholder="Sélectionnez votre fonction"
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#316C40] placeholder:text-white placeholder:font-bold text-white font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316C40]"
                            required
                        >
                            <option value="">Amateur</option>
                            <option value="herboriste">Herboriste</option>
                            <option value="particulier">Particulier</option>
                            <option value="professionnel">Professionnel de santé</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>}
                    </div>

                    {/* Champ Mot de passe avec toggle */}
                    <div>
                        <label className="hidden text-gray-700 mb-2">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                placeholder="Entrez votre mot de passe"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#316C40] placeholder:text-white placeholder:font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316C40] pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#316C40]"
                            >
                                {showPassword ? <FiEyeOff className="text-[#E2F87B]"/> : <FiEye className="text-[#E2F87B]"/>}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                    </div>

                    {/* Confirmation mot de passe avec toggle */}
                    <div>
                        <label className="hidden text-gray-700 mb-2">Confirmez le Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                placeholder="Confirmez votre mot de passe"
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#316C40] placeholder:text-white placeholder:font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316C40] pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#316C40]"
                            >
                                {showConfirmPassword ? <FiEyeOff className="text-[#E2F87B]"/> : <FiEye className="text-[#E2F87B]"/>}
                            </button>
                        </div>
                        {formData.password && formData.password !== formData.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>
                        )}
                    </div>

                    {/* Bouton d'inscription */}
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
                            !isFormValid || isLoading ? 'bg-gray-400' : 'bg-[#316C40] hover:bg-[#294E28]'
                        } transition-colors`}
                    >
                        {isLoading ? 'Inscription en cours...' : 'Sign In'}
                    </button>

                    {/* Lien vers login */}
                    <div className="text-center text-gray-600 font-medium">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-[#316C40] hover:underline font-medium">
                            Login
                        </Link>
                    </div>
                </form>
            </div>

            {/* Partie illustration */}
            <div 
                className="hidden md:flex md:w-1/2   mr-12  rounded-lg bg-cover self-center bg-center h-screen"
    
            >
                <div className="text-white pl-10 content-center items-center text-left max-w-xl h-6/7 shadow-xl/30 rounded-2xl bg-cover self-center bg-center"
                    style={{ backgroundImage: `url(${bgsign})` }}>
                    <h1 className="text-5xl font-bold uppercase mb-6 px-10">WELCOME</h1>
                    <p className="text-lg px-10 leading-relaxed">
                        Bienvenue à votre bibliothèque de plantes naturelles.<br />
                        Créez votre compte et découvrez ce qu'il y a de meilleur dans la nature près de chez vous.
                    </p>
                </div>
            </div>
        </div>
    );
}