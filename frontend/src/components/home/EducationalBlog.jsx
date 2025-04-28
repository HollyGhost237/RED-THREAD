import { useState } from 'react';
import { FiUser, FiClock, FiArrowRight } from 'react-icons/fi';
import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';
import image3 from '../../assets/image3.png';

export default function EducationalBlog() {
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [hoveredCard, setHoveredCard] = useState(null);

    const articles = [
        {
            id: 1,
            title: "10 plantes essentielles pour votre jardin médicinal",
            excerpt: "Découvrez les plantes incontournables pour créer un jardin médicinal efficace et facile à entretenir.",
            author: "Dr. Marie Laurent",
            readingTime: "8 min",
            category: "Jardinage",
            date: "15 juin 2024",
            image: image1
        },
        {
            id: 2,
            title: "Guide complet sur la cueillette des plantes sauvages",
            excerpt: "Apprenez à identifier et récolter les plantes médicinales sauvages en toute sécurité.",
            author: "Pierre Dubois",
            readingTime: "12 min",
            category: "Cueillette",
            date: "8 juin 2024",
            image: image2
        },
        {
            id: 3,
            title: "Les huiles essentielles : bienfaits et précautions",
            excerpt: "Tout ce que vous devez savoir sur l'utilisation sécuritaire des huiles essentielles.",
            author: "Sophie Martin",
            readingTime: "10 min",
            category: "Aromathérapie",
            date: "1 juin 2024",
            image: image3
        }
    ];

    const categories = ['Tous', 'Jardinage', 'Cueillette', 'Aromathérapie'];

    const filteredArticles = activeFilter === 'Tous' 
        ? articles 
        : articles.filter(article => article.category === activeFilter);

    return (
        <section className="py-16 bg-[#FDFFF6]">
            <div className="container mx-auto px-4">
                {/* En-tête avec filtre */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1F2937] mb-4">
                        Blog Éducatif
                    </h1>
                    <p className="text-xl text-[#4B5563] mb-8">
                        Articles et conseils pour approfondir vos connaissances
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeFilter === category
                                ? 'bg-[#316C40] text-[#FDFFF6]'
                                : 'bg-[#E2F87B] text-[#294E28] hover:bg-[#316C40] hover:text-[#FDFFF6]'
                            }`}
                        >
                            {category}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Grille des articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredArticles.map((article) => (
                        <article 
                            key={article.id}
                            className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                                hoveredCard === article.id ? 'shadow-lg -translate-y-1' : ''
                            }`}
                            onMouseEnter={() => setHoveredCard(article.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <img
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-40 object-cover rounded-t-lg mb-4"
                            />
                            {/* Texte de grille */}
                            <div className="p-6">
                                <span className="inline-block px-3 py-1 bg-[#E2F87B] text-[#294E28] rounded-full text-xs font-medium mb-3">
                                    {article.category}
                                </span>
                                
                                <h2 className="text-2xl font-bold text-[#294E28] mb-3">
                                    {article.title}
                                </h2>
                                
                                <p className="text-[#316C40] mb-4">{article.excerpt}</p>
                                
                                <div className="flex items-center justify-between text-[#294E28] text-sm mb-4">
                                    <div className='flex items-center'>
                                        <FiUser className="mr-2" />
                                        <span className="mr-4">{article.author}</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <FiClock className="mr-2" />
                                        <span>{article.readingTime}</span>
                                    </div>
                                </div>
                                
                            <div className="text-xs text-gray-500 mb-4">
                                Publié le {article.date}
                                </div>
                                
                                <a 
                                    href="#"
                                    className="inline-flex items-center text-[#316C40] font-medium hover:text-[#294E28] transition-colors"
                                >
                                    Lire l'article
                                    <FiArrowRight className="ml-2" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Bouton "Voir plus" */}
                <div className="text-center">
                    <button className="px-6 py-3 border-2 border-[#316C40] text-[#316C40] font-medium rounded-lg hover:bg-[#316C40] hover:text-[#FDFFF6] transition-colors flex items-center mx-auto">
                        Voir tous les articles
                        <FiArrowRight className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}