import React, { useState } from 'react';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import profil from '../../assets/profil.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Configuration des liens (peut être externalisée dans un fichier de config)
    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Recette', path: '/recettes' },
        { name: 'Plantes', path: '/plantes' },
        { name: 'Blog', path: '/blog' },
        { name: 'Forum', path: '/forum' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Recherche:', searchQuery)
        // ( rediriger vers une page de résultats)
        setSearchQuery(''); // Réinitialiser le champ de recherche après la soumission
        };

    return (
        <header className="bg-[#031A09] shadow-sm sticky top-0 w-full z-50">
            {/* Barre de navigation principale */}
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo avec lien vers l'accueil */}
                <a href="/">
                    <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
                </a>

                {/* Menu Desktop */}
                <nav className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name}
                            href={link.path}
                            className="text-white hover:text-[#E2F87B] hover:underline active:text-[#E2F87B] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Barre de recherche et connexion (desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                    {showSearch ? (
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="px-3 py-2 rounded-l-lg focus:outline-none text-[#294E28] w-48 transition-all duration-300"
                            />
                            <button 
                                type="submit"
                                className="bg-[#E2F87B] text-[#316C40] px-3 py-2 rounded-r-lg hover:bg-[#316C40] hover:text-[#E2F87B] transition-colors"
                            >
                                <FiSearch className="h-5 w-5" />
                            </button>
                        </form>
                    ) : (
                        <button 
                            onClick={() => setShowSearch(true)}
                            className="text-white hover:text-[#E2F87B]"
                        >
                            <FiSearch className="h-5 w-5" />
                        </button>
                    )}

                    <a 
                        href="/login" 
                        className="bg-[#E2F87B] flex items-center text-[#316C40] px-4 py-2 rounded-lg hover:bg-[#316C40] hover:text-[#E2F87B] transition-colors"
                    >
                        <img src={profil} alt="profil" className="h-5 w-5 mr-2" />
                        Connexion
                    </a>
                </div>

                {/* Menu Mobile */}
                <button 
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu mobile"
                >
                    {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </button>
            </div>

            {/* Menu Mobile (contenu) */}
            {isOpen && (
                <div className="md:hidden bg-[#031A09] px-4 pb-4">
                    {/* Barre de recherche mobile */}
                    <form onSubmit={handleSearch} className="flex mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none text-[#294E28]"
                        />
                        <button 
                            type="submit"
                            className="bg-[#E2F87B] text-[#316C40] px-3 py-2 rounded-r-lg"
                        >
                            <FiSearch className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-white hover:text-[#E2F87B] py-2 border-b border-[#294E28]"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    
                    <a 
                        href="/connexion"
                        className="w-full bg-[#E2F87B] flex items-center justify-center text-[#316C40] px-4 py-2 rounded-lg mt-4"
                    >
                        <img src={profil} alt="profil" className="h-5 w-5 mr-2" />
                        Connexion
                    </a>
                </div>
            )}
        </header>
    );
}