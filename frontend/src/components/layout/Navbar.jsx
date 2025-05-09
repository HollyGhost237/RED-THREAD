import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Vérifier l'authentification au montage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Recette', path: '/recettes' },
        { name: 'Plantes', path: '/plantes' },
        { name: 'Blog', path: '/blog' },
        { name: 'Forum', path: '/forum' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Recherche:', searchQuery);
        setSearchQuery('');
    };

    return (
        <header className="bg-[#031A09] shadow-sm sticky top-0 w-full z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
                </Link>

                <nav className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            to={link.path}
                            className="text-white hover:text-[#E2F87B] hover:underline active:text-[#E2F87B] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    {showSearch ? (
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="px-3 py-2 rounded-l-lg focus:outline-none text-[#294E28] w-48"
                            />
                            <button 
                                type="submit"
                                className="bg-[#E2F87B] text-[#316C40] px-3 py-2 rounded-r-lg hover:bg-[#316C40] hover:text-[#E2F87B]"
                            >
                                <FiSearch className="h-5 w-5" />
                            </button>
                        </form>
                    ) : (
                        <button onClick={() => setShowSearch(true)} className="text-white hover:text-[#E2F87B]">
                            <FiSearch className="h-5 w-5" />
                        </button>
                    )}

                {user ? (
                    <div className="relative group">
                        <button className="flex items-center space-x-2">
                            {user.avatar ? (
                                <img 
                                src={`http://localhost:8000/storage/${user.avatar?.replace('public/', '')}`} 
                                    alt="Photo de profil"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-[#E2F87B]"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#E2F87B] flex items-center justify-center">
                                    <FiUser className="text-[#316C40]" />
                                </div>
                            )}
                            <span className="text-white">{user.name.split(' ')[0]}</span>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-300">
                        <Link 
                                to="/dashboard" 
                                className="block px-4 py-2 text-gray-800 hover:bg-[#E2F87B] transition-colors"
                            >
                                Mon dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-[#E2F87B] transition-colors flex items-center"
                            >
                                <FiLogOut className="mr-2" /> Déconnexion
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="bg-[#E2F87B] flex items-center text-[#316C40] px-4 py-2 rounded-lg hover:bg-[#316C40] hover:text-[#E2F87B] transition-colors"
                    >
                        <FiUser className="h-5 w-5 mr-2" />
                        Connexion
                    </Link>
                )}
                </div>

                <button 
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-[#031A09] px-4 pb-4">
                    <form onSubmit={handleSearch} className="flex mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none text-[#294E28]"
                        />
                        <button type="submit" className="bg-[#E2F87B] text-[#316C40] px-3 py-2 rounded-r-lg">
                            <FiSearch className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-white hover:text-[#E2F87B] py-2 border-b border-[#294E28]"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    
                    {user ? (
                        <>
                            <Link 
                                to="/dashboard"
                                className="w-full bg-[#E2F87B] flex items-center justify-center text-[#316C40] px-4 py-2 rounded-lg mt-4"
                            >
                                Mon compte
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center text-white px-4 py-2 rounded-lg mt-2 border border-white"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login"
                            className="w-full bg-[#E2F87B] flex items-center justify-center text-[#316C40] px-4 py-2 rounded-lg mt-4"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}