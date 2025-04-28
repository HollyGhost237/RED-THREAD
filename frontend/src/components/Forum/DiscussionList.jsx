// import { motion } from 'framer-motion';
// import { FiMessageSquare, FiClock, FiArrowRight, FiLock } from 'react-icons/fi';
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function DiscussionList() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false); // À remplacer par votre logique d'authentification réelle
//     const [discussions, setDiscussions] = useState([]);

//     // Simulation de chargement depuis l'API
//     useEffect(() => {
//         // En production : remplacer par fetch('/api/discussions')
//         const mockDiscussions = [
//         {
//             id: 1,
//             title: "Comment cultiver de la camomille en appartement ?",
//             author: "JuliePlantes",
//             replies: 14,
//             time: "Il y a 2 heures"
//         },
//         {
//             id: 2,
//             title: "Quelles plantes pour soulager l'arthrite naturellement ?",
//             author: "NatureTonic",
//             replies: 23,
//             time: "Il y a 1 jour"
//         },
//         // ... autres discussions comme dans votre image
//         ];
//         setDiscussions(mockDiscussions);
//     }, []);

//     // Animation des éléments
//     const itemVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0 }
//     };

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-8 bg-[#DCFCE7] rounded-lg shadow-lg mt-3">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold text-[#294E28]">Discussions récentes</h1>
                
//                 {isLoggedIn ? (
//                 <Link 
//                     to="/nouvelle-discussion"
//                     className="bg-[#316C40] text-white px-6 py-2 rounded-lg hover:bg-[#294E28] transition"
//                 >
//                     Nouvelle discussion
//                 </Link>
//                 ) : (
//                 <div className="flex items-center text-[#316C40]">
//                     <FiLock className="mr-2" />
//                     <span>Connectez-vous pour participer</span>
//                 </div>
//                 )}
//             </div>

//             <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
//                 className="space-y-6 "
//             >
//                 {discussions.map((discussion) => (
//                 <motion.div
//                     key={discussion.id}
//                     variants={itemVariants}
//                     whileHover={{ x: 5 }}
//                     className=" pb-6 bg-white p-4 rounded-lg shadow-md"
//                 >
//                     <h2 className="text-xl font-semibold text-[#294E28] mb-2">
//                     <Link to={`/discussion/${discussion.id}`} className="hover:underline">
//                         {discussion.title}
//                     </Link>
//                     </h2>
                    
//                     <div className="flex items-center text-sm text-gray-600">
//                     <span className="mr-4">@{discussion.author}</span>
//                     <div className="flex items-center mr-4">
//                         <FiMessageSquare className="mr-1" />
//                         <span>{discussion.replies} réponses</span>
//                     </div>
//                     <div className="flex items-center">
//                         <FiClock className="mr-1" />
//                         <span>{discussion.time}</span>
//                     </div>
//                     </div>
//                 </motion.div>
//                 ))}
//             </motion.div>

//             <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="mt-8 text-center"
//             >
//                 <Link 
//                 to="/discussions" 
//                 className="inline-flex items-center text-[#316C40] font-medium"
//                 >
//                 Voir toutes les discussions <FiArrowRight className="ml-2" />
//                 </Link>
//             </motion.div>
//         </div>
//     );
//     }

import { motion } from 'framer-motion';
import { FiMessageSquare, FiClock, FiArrowRight, FiLock, FiTrendingUp } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DiscussionList() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [discussions, setDiscussions] = useState([]);
    const [popularDiscussions, setPopularDiscussions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const discussionsPerPage = 3;

    // Simulation de chargement depuis l'API
    useEffect(() => {
        // Données de test
        const mockDiscussions = [
            { id: 1, title: "Comment cultiver de la camomille en appartement ?", author: "JuliePlantes", replies: 14, time: "Il y a 2 heures", views: 150 },
            { id: 2, title: "Quelles plantes pour soulager l'arthrite naturellement ?", author: "NatureTonic", replies: 23, time: "Il y a 1 jour", views: 320 },
            { id: 3, title: "Identification : cette plante est-elle de la menthe sauvage ?", author: "Herboriste78", replies: 8, time: "Il y a 3 jours", views: 95 },
            { id: 4, title: "Recette de sirop pour la toux à base de thym", author: "SantéVerte", replies: 19, time: "Il y a 5 jours", views: 275 },
            { id: 5, title: "Mon plant de basilic jaunit, que faire ?", author: "JardinierBio", replies: 12, time: "Il y a 1 semaine", views: 180 },
            { id: 6, title: "Quand récolter les fleurs de calendula ?", author: "PlantesMédi", replies: 7, time: "Il y a 2 semaines", views: 120 }
        ];

        setDiscussions(mockDiscussions);
        setTotalPages(Math.ceil(mockDiscussions.length / discussionsPerPage));
        
        // Trouver les discussions les plus populaires (plus de réponses + vues)
        const popular = [...mockDiscussions]
            .sort((a, b) => (b.replies * 2 + b.views) - (a.replies * 2 + a.views))
            .slice(0, 3);
        setPopularDiscussions(popular);
    }, []);

    // Animation des éléments
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Pagination
    const paginatedDiscussions = discussions.slice(
        (currentPage - 1) * discussionsPerPage,
        currentPage * discussionsPerPage
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 bg-[#DCFCE7] rounded-lg shadow-lg mt-3">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#1F2937]">Discussions récentes</h1>
                
                {isLoggedIn ? (
                    <Link 
                        to="/nouvelle-discussion"
                        className="bg-[#316C40] text-white px-6 py-2 rounded-lg hover:bg-[#294E28] transition"
                    >
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
                    {/* Entrer des valeurs sous forme de tableau */}
                    {popularDiscussions.map((discussion) => (
                        <motion.div
                            key={`popular-${discussion.id}`}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#15803D]"
                        >
                            <h3 className="text-lg font-semibold text-[#15803D] mb-3">
                                <Link to={`/discussion/${discussion.id}`} className="hover:underline">
                                    {discussion.title}
                                </Link>
                            </h3>
                            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2">
                                <span>@{discussion.author}</span>
                                <div className="flex items-center">
                                    <FiMessageSquare className="mr-1" />
                                    <span>{discussion.replies} réponses</span>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="mr-1" />
                                    <span>{discussion.time}</span>
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-[#15803D]">
                                {discussion.views} vues
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Section Discussions Récentes  */}

            <h2 className="text-2xl font-semibold text-[#15803D] mb-6">Dernières discussions</h2>
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-6 mb-8"
            >
                {/* Entrer des valeurs sous forme de tableau */}
                {paginatedDiscussions.map((discussion) => (
                    <motion.div
                        key={discussion.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className="pb-6 bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-[#15803D] mb-2">
                            <Link to={`/discussion/${discussion.id}`} className="hover:underline">
                                {discussion.title}
                            </Link>
                        </h2>
                        
                        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                            <span>@{discussion.author}</span>
                            <div className="flex items-center">
                                <FiMessageSquare className="mr-1" />
                                <span>{discussion.replies} réponses</span>
                            </div>
                            <div className="flex items-center">
                                <FiClock className="mr-1" />
                                <span>{discussion.time}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
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