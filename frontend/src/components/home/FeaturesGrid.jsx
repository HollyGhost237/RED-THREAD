import React from "react";
import plant from "../../assets/plant.jpg";
import im1 from "../../assets/im1.png";
import im2 from "../../assets/im2.png";
import im3 from "../../assets/im3.png";
import im4 from "../../assets/im4.png";
import im5 from "../../assets/im5.png";
import im11 from "../../assets/im11.png";
import im22 from "../../assets/im22.png";
import im33 from "../../assets/im33.png";
import im44 from "../../assets/im44.png";
import im55 from "../../assets/im55.png";

const features = [
    {
        title: "Recettes Médicinales",
        description: "Découvrez des créatures de recettes à base de plantes pour traiter divers rituels et améliorer votre bain-duc.",
        link: "/recettes",
        imgtitle: im11,
        imageUrl: im1
    },
    {
        title: "Recherche Avancée",
        description: "Trouvez rapidement des plantes par symptôme, projetés en une zone prise métier de recherche spécialisé.",
        link: "/recherche",
        imgtitle: im22,
        imageUrl: im2
    },
    {
        title: "Blog Éducatif",
        description: "Apercez-en davantage sur la phytothérapie grâce à nos articles intégrés par des experts.",
        link: "/blog",
        imgtitle: im33,
        imageUrl: im3
    },
    {
        title: "Espace Utilisateur",
        description: "Enregistrez vos plantes et recettez précédent dans votre espace personnel.",
        link: "/dashboard",
        imgtitle: im44,
        imageUrl: im4
    },
    {
        title: "Forum Communautaire",
        description: "Partagez vos expériences notre communauté passionnée",
        link: "/forum",
        imgtitle: im55,
        imageUrl: im5
    }
];
    
    export default function FeaturesGrid() {
        return (
            <section className="py-20 bg-[#FDFFF6]">
                <div className="container mx-auto px-0">
                    <h2 className="text-3xl font-bold text-black text-center mb-4">
                        Ce que nous vous proposons
                    </h2>
                    
                    <p className="text-center text-[#316C40] max-w-2xl mx-auto mb-16">
                        Tout ce dont vous avez besoin pour explorer le monde des plantes médicinales
                    </p>
            
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                        ))}
                        <img src={plant} alt="plante" className="hidden md:flex justify-self-center h-50 " />
                    </div>
                </div>
            </section>
        );
    }
    
    function FeatureCard({ title, description, link, imgtitle, imageUrl }) {
        return (
            <a 
                href={link}
                className="block group relative bg-[#F9FAFB] rounded-xl shadow-lg shadow-[#294E28]  hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ height: "100%" }} /* Fixe la hauteur */
            >
                {/* Conteneur flex pour l'image et le texte */}
                <div className="flex items-start h-full "
                    
                >
                
        
                {/* Texte qui se rétracte */}
                <div className="flex-1 text-justify transition-all duration-500 ml-4 group-hover:translate-x-2 pt-8 pb-8 pr-2">
                    <img
                        src={imgtitle}
                        alt="Image d'entréé"
                        className="w-10 h-10 mb-5" 
                    />
                    <h3 className="text-xl font-bold text-[#1F2937] mb-3">{title}</h3>
                    <p className="text-[#4B5563] ">{description}</p>
                </div>
                
                {/* Image (cachée puis glisse) */}
                <div className=" w-0 h-full overflow-hidden transition-all duration-500 group-hover:w-20 group-hover:h-full">
                    <img 
                    src= {imageUrl} 
                    alt="" 
                    className="h-full w-20 object-cover"
                    />
                </div>
                </div>
            </a>
        );
    }