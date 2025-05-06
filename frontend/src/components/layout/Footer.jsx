import React from 'react'
import footerBg from '../../assets/footer.jpg'
// import send from '../../assets/send.png'
import logo from '../../assets/logo.png';
// import facebook from '../../assets/facebook.png';
// import instagram from '../../assets/instagram.png';
// import twitter from '../../assets/twitter.png';
// import whatsaap from '../../assets/whatsapp.png';
// import position from '../../assets/position.png';
// import phone from '../../assets/phone.png';
// import enveloppe from '../../assets/enveloppe.png';
import { useState } from 'react';
import { Send, Facebook, Instagram, Twitter, MessageCircle, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';


export default function Footer() {
    
    const [commentaire, setCommentaire] = useState('');
    const [isColumnOpen, setIsColumnOpen] = useState({
        links: false,
        resources: false,
        contact: false
    });
    
    const handleCommentSubmit = () => {
        // Fonction pour traiter le commentaire
        console.log("Commentaire envoyé:", commentaire);
        setCommentaire('');
    };
    
    const toggleColumn = (column) => {
        setIsColumnOpen(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };
    
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="text-white relative bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${footerBg})` }}>
            {/* Background avec overlay amélioré */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" aria-hidden="true" />
        
            {/* Contenu principal */}
            <div className="container mx-auto px-4 relative z-10 pt-12 pb-6">
                {/* Formulaire de commentaire */}
                <div className="max-w-2xl mx-auto mb-16">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <div className="w-full rounded-xl overflow-hidden shadow-lg bg-white/95 flex items-center border-2 border-white">
                            <input 
                                type="text" 
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                placeholder="Partagez votre commentaire..." 
                                className="flex-grow px-5 py-3 text-gray-800 font-medium focus:outline-none bg-transparent w-full"
                            />
                            <button 
                                onClick={handleCommentSubmit}
                                className="bg-green-700 hover:bg-green-800 p-3 m-1 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center"
                            >
                                <Send size={20} className="text-white" />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-center mt-10 mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-yellow-300">
                        Rejoignez-nous
                    </span>
                    </h2>
                </div>
                
                {/* Section principale du footer - Structure responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {/* Logo et informations */}
                    <div className="space-y-6">
                        <div className="bg-white/90 p-3 rounded-xl inline-block shadow-lg">
                            {/* Logo sur fond blanc pour contraste */}
                            <div className="h-10 w-36  rounded-lg flex items-center justify-center">
                                <img src={logo} alt="Logo" className='h-8 sm:h-10 w-auto'/>
                            </div>
                        </div>
                        <p className="text-gray-100 leading-relaxed">
                            Votre source fiable d'informations sur les plantes médicinales et leurs bienfaits pour la santé.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6">
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110">
                            <Facebook size={22} />
                            </a>
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110">
                            <Instagram size={22} />
                            </a>
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110">
                            <Twitter size={22} />
                            </a>
                            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110">
                            <MessageCircle size={22} />
                            </a>
                        </div>
                    </div>

                    {/* Liens Rapides - Collapsible sur mobile */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => toggleColumn('links')}
                            className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none"
                        >
                            <h3 className="text-2xl font-bold text-yellow-300">Liens Rapides</h3>
                            <span className="md:hidden">
                            {isColumnOpen.links ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </span>
                        </button>
                        <div className={`space-y-3 transition-all duration-300 ${isColumnOpen.links ? 'max-h-60' : 'max-h-0 overflow-hidden md:max-h-60'}`}>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Accueil
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Plantes Médicinales
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Recettes
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Blog
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Forum
                            </a>
                        </div>
                    </div>

                    {/* Ressources - Collapsible sur mobile */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => toggleColumn('resources')}
                            className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none"
                        >
                            <h3 className="text-2xl font-bold text-yellow-300">Ressources</h3>
                            <span className="md:hidden">
                            {isColumnOpen.resources ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </span>
                        </button>
                        <div className={`space-y-3 transition-all duration-300 ${isColumnOpen.resources ? 'max-h-60' : 'max-h-0 overflow-hidden md:max-h-60'}`}>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Guide du débutant
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Identification des plantes
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Calendrier de cueillette
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            Précautions d'usage
                            </a>
                            <a href="#" className="block py-1 hover:translate-x-2 transition-transform duration-300 hover:text-yellow-300">
                            FAQ
                            </a>
                        </div>
                    </div>

                    {/* Contact - Collapsible sur mobile */}
                    <div className="space-y-4">
                    <button 
                        onClick={() => toggleColumn('contact')}
                        className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none"
                    >
                        <h3 className="text-2xl font-bold text-yellow-300">Contact</h3>
                        <span className="md:hidden">
                        {isColumnOpen.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </span>
                    </button>
                    <div className={`space-y-4 transition-all duration-300 ${isColumnOpen.contact ? 'max-h-60' : 'max-h-0 overflow-hidden md:max-h-60'}`}>
                        <div className="flex items-start">
                            <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-yellow-200" />
                            <p>123 Rue des Plantes, 75000 Paris, France</p>
                        </div>
                        <div className="flex items-center">
                            <Phone size={20} className="mr-3 flex-shrink-0 text-yellow-200" />
                            <p>+237 686 09 41 21</p>
                        </div>
                        <div className="flex items-center">
                            <Mail size={20} className="mr-3 flex-shrink-0 text-yellow-200" />
                            <p>contact@herbarium.fr</p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Footer bas - Responsive */}
                <div className="mt-16 pt-6 border-t border-white/20">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-gray-300 text-sm text-center sm:text-left">
                            © {currentYear} NaturalMedecine.InchClass - Tous droits réservés.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
                            <a href="#" className="hover:text-yellow-300 transition-colors">Mentions légales</a>
                            <a href="#" className="hover:text-yellow-300 transition-colors">Politique de confidentialité</a>
                            <a href="#" className="hover:text-yellow-300 transition-colors">Conditions d'utilisation</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
    }