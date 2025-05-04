import { motion } from 'framer-motion';
import { FiMessageSquare, FiClock, FiArrowRight, FiLock, FiTrendingUp } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function DiscussionList() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [discussions, setDiscussions] = useState([]);
    const [popularDiscussions, setPopularDiscussions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const discussionsPerPage = 10;

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('auth_token');
            setIsLoggedIn(!!token);
        };

        const fetchDiscussions = async () => {
            try {
                setIsLoading(true);
                const [recentRes, popularRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/discussions?per_page=10'),
                    axios.get('http://localhost:8000/api/discussions?popular=true&limit=3')
                ]);

                setDiscussions(recentRes.data.data);
                setPopularDiscussions(popularRes.data.data);
                setTotalPages(recentRes.data.meta.last_page);
            } catch (error) {
                toast.error('Erreur lors du chargement des discussions');
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
        fetchDiscussions();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        // Configurations pour le formatage en français
        const formatter = new Intl.RelativeTimeFormat('fr', {
            style: 'long',
            numeric: 'auto'
        });

        if (diffInSeconds < 60) {
            return formatter.format(-diffInSeconds, 'second');
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return formatter.format(-diffInMinutes, 'minute');
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return formatter.format(-diffInHours, 'hour');
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return formatter.format(-diffInDays, 'day');
        }
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return formatter.format(-diffInMonths, 'month');
        }
        
        const diffInYears = Math.floor(diffInMonths / 12);
        return formatter.format(-diffInYears, 'year');
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handlePageChange = async (newPage) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/discussions?page=${newPage}`);
            setDiscussions(response.data.data);
            setCurrentPage(newPage);
        } catch (error) {
            toast.error('Erreur lors du changement de page');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#316C40]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-[#DCFCE7] rounded-lg shadow-lg mt-3">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#1F2937]">Discussions récentes</h1>
                
                {isLoggedIn ? (
                    <Link 
                        to="/nouvelle-discussion"
                        className="bg-[#316C40] text-white px-6 py-2 rounded-lg hover:bg-[#294E28] transition flex items-center"
                    >
                        <FiMessageSquare className="mr-2" />
                        Nouvelle discussion
                    </Link>
                ) : (
                    <div className="flex items-center text-[#15803D]">
                        <FiLock className="mr-2" />
                        <span>Connectez-vous pour participer</span>
                    </div>
                )}
            </div>

            {/* Section Discussions Populaires */}
            {popularDiscussions.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-[#15803D] mb-6 flex items-center">
                        <FiTrendingUp className="mr-2 text-[#15803D]" />
                        Discussions populaires
                    </h2>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        {popularDiscussions.map((discussion) => (
                            <motion.div
                                key={`popular-${discussion.id}`}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#15803D] hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-[#15803D] mb-3 line-clamp-2">
                                    <Link to={`/discussion/${discussion.id}`} className="hover:underline">
                                        {discussion.title}
                                    </Link>
                                </h3>
                                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2">
                                    <span>@{discussion.user.name}</span>
                                    <div className="flex items-center">
                                        <FiMessageSquare className="mr-1" />
                                        <span>{discussion.replies_count} réponses</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiClock className="mr-1" />
                                        <span>{formatDate(discussion.created_at)}</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-[#15803D]">
                                    {discussion.views_count} vues
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Section Discussions Récentes */}
            <h2 className="text-2xl font-semibold text-[#15803D] mb-6">Dernières discussions</h2>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-6 mb-8"
            >
                {discussions.length > 0 ? (
                    discussions.map((discussion) => (
                        <motion.div
                            key={discussion.id}
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                            className="pb-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-[#15803D] mb-2 line-clamp-2">
                                        <Link to={`/discussion/${discussion.id}`} className="hover:underline">
                                            {discussion.title}
                                        </Link>
                                    </h2>
                                    
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                                        <span>@{discussion.user.name}</span>
                                        <div className="flex items-center">
                                            <FiMessageSquare className="mr-1" />
                                            <span>{discussion.replies_count} réponses</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-1" />
                                            <span>{formatDate(discussion.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                {discussion.recipe && (
                                    <Link 
                                        to={`/recipes/${discussion.recipe.id}`}
                                        className="bg-[#E2F87B] text-[#316C40] px-3 py-1 rounded-full text-sm hover:bg-[#316C40] hover:text-white transition"
                                    >
                                        {discussion.recipe.title}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Aucune discussion disponible
                    </div>
                )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mb-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                currentPage === page 
                                    ? 'bg-[#316C40] text-white' 
                                    : 'bg-white text-[#294E28] hover:bg-[#E2F87B]'
                            }`}
                        >
                            {page}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Bouton Voir toutes les discussions */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="mt-8 text-center"
            >
                <Link 
                    to="/discussions" 
                    className="inline-flex items-center text-[#316C40] font-medium bg-white px-6 py-3 rounded-lg shadow hover:shadow-md transition"
                >
                    Voir toutes les discussions <FiArrowRight className="ml-2" />
                </Link>
            </motion.div>
        </div>
    );
}