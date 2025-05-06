import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiArrowLeft, FiUser, FiClock } from 'react-icons/fi';
import { useState, useEffect } from "react";
import {  FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const [pendingCount, setPendingCount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Animation pour le hover des liens
    const linkHoverAnimation = {
        initial: { scale: 1 },
        hover: { scale: 1.02 }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        // Animation de sortie avant la déconnexion
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Charge le nombre de professionnels en attente
    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/admin/pending-professionals`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                setPendingCount(data.stats?.total_pending || 0);
            } catch (error) {
                console.error("Erreur lors du chargement des stats:", error);
            }
        };

        if (user?.role === 'admin') {
            fetchPendingCount();
        }
    }, [user]);

    // Vérification des permissions
    if (!user || user.role !== 'admin') {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 mb-4 flex justify-center">
                        <FiUser className="h-12 w-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h1>
                    <p className="text-gray-600 mb-6">
                        Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-[#316C40] text-white rounded-lg hover:bg-[#294E28] transition"
                    >
                        <FiArrowLeft className="mr-2" />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Bouton de menu mobile */}
            <div className="md:hidden fixed top-4 left-4 z-20">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-white rounded-full shadow-md text-gray-700"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </motion.button>
            </div>
            
            {/* Sidebar - Animation d'entrée/sortie */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-64 bg-white shadow-lg fixed md:relative z-10 h-full flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-[#316C40]">Tableau d'administration</h1>
                            <motion.div 
                                className="flex items-center mt-3 p-2 bg-gray-50 rounded-lg"
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <div className="bg-[#E2F87B] text-[#316C40] p-2 rounded-full mr-3 shadow-sm">
                                    <FiUser className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 truncate">{user.name}</span>
                            </motion.div>
                        </div>
                        
                        <nav className="p-4 space-y-2 flex-grow">
                            {/* Bouton Retour vers le dashboard */}
                            <motion.div
                                variants={linkHoverAnimation}
                                initial="initial"
                                whileHover="hover"
                            >
                                <Link
                                    to="/dashboard"
                                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                                >
                                    <FiArrowLeft className="mr-3 group-hover:text-[#316C40]" />
                                    <span className="group-hover:text-[#316C40] font-medium">Retour au dashboard</span>
                                    <motion.div
                                        className="ml-auto opacity-0 group-hover:opacity-100"
                                        initial={{ x: -5 }}
                                        whileHover={{ x: 0 }}
                                    >
                                        <FiChevronRight size={16} />
                                    </motion.div>
                                </Link>
                            </motion.div>
                            
                            {/* Lien vers la gestion des professionnels */}
                            <motion.div
                                variants={linkHoverAnimation}
                                initial="initial"
                                whileHover="hover"
                            >
                                <Link
                                    to="/admin/professionals"
                                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                        location.pathname.includes('professionals')
                                            ? 'bg-[#316C40] text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-50 group'
                                    }`}
                                >
                                    <FiUser className={`mr-3 ${!location.pathname.includes('professionals') && 'group-hover:text-[#316C40]'}`} />
                                    <span className={`${!location.pathname.includes('professionals') && 'group-hover:text-[#316C40] font-medium'}`}>
                                        Professionnels en attente
                                    </span>
                                    {pendingCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-sm"
                                        >
                                            {pendingCount}
                                        </motion.span>
                                    )}
                                    {!location.pathname.includes('professionals') && (
                                        <motion.div
                                            className="ml-auto opacity-0 group-hover:opacity-100"
                                            initial={{ x: -5 }}
                                            whileHover={{ x: 0 }}
                                        >
                                            <FiChevronRight size={16} />
                                        </motion.div>
                                    )}
                                </Link>
                            </motion.div>
                            
                            {/* Autres liens admin */}
                            <motion.div
                                variants={linkHoverAnimation}
                                initial="initial"
                                whileHover="hover"
                            >
                                <Link
                                    to="/admin/activity"
                                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                        location.pathname.includes('activity')
                                            ? 'bg-[#316C40] text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-50 group'
                                    }`}
                                >
                                    <FiClock className={`mr-3 ${!location.pathname.includes('activity') && 'group-hover:text-[#316C40]'}`} />
                                    <span className={`${!location.pathname.includes('activity') && 'group-hover:text-[#316C40] font-medium'}`}>
                                        Activité récente
                                    </span>
                                    {!location.pathname.includes('activity') && (
                                        <motion.div
                                            className="ml-auto opacity-0 group-hover:opacity-100"
                                            initial={{ x: -5 }}
                                            whileHover={{ x: 0 }}
                                        >
                                            <FiChevronRight size={16} />
                                        </motion.div>
                                    )}
                                </Link>
                            </motion.div>
                        </nav>
                        
                        {/* Bouton de déconnexion en bas */}
                        <div className="p-4 mt-auto">
                            <motion.button
                                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center p-3 text-gray-700 hover:text-[#316C40] bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 border border-gray-200"
                            >
                                <FiLogOut className="mr-2" />
                                <span className="font-medium">Déconnexion</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Contenu principal - Animation d'entrée */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 p-6 md:p-8 bg-gray-100 pt-16 md:pt-6"
            >
                {/* Contenu dynamique */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
}