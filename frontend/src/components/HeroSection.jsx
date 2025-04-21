import { useState } from 'react';
import hero from '../assets/hero.jpg'; 
import { FiSearch } from 'react-icons/fi';

export default function HeroSection() {
    const [hoveredBtn, setHoveredBtn] = useState(null);

    return (
        <section 
            className="relative h-screen flex items-center justify-center bg-[#294E28] bg-cover bg-center"
            style={{ backgroundImage: `url(${hero})` }}
        >
            <div className="absolute inset-0 bg-[#294E28]/30" />
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-[#FDFFF6] mb-8">
                Découvrez le pouvoir des plantes médicinales
                </h1>
                
                <p className="text-xl text-white mb-12">
                Votre encyclopedie complète, et les plantes médicinales, leurs bienfaits et leurs utilisations thérapeutiques
                </p>

                <form className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
                    <div className='rounded-4xl w-full sm:w-96 max-w-full bg-white/50 '>
                    <input 
                        type="search" 
                        placeholder="Rechercher une plante..." 
                        className="px-4 py-2 text-black font-bold focus:outline-none"  // Largeur ajustable
                    />
                    <button type="submit" className=" pl-6 py-2 rounded-lg hover:scale-110 transition cursor-pointer text-white/80">
                        <FiSearch className="h-5 w-5" />
                    </button>

                    </div>
                </form>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                {['Explorer les plantes', 'Recettes médicinales'].map((text, index) => (
                    <button
                    key={index}
                    className={`px-8 py-3 rounded-full border-2 font-medium transition-all duration-300 ${
                        hoveredBtn === index 
                        ? 'bg-[#FDFFF6] text-[#316C40] border-[#FDFFF6]' 
                        : 'bg-transparent text-[#FDFFF6] border-[#FDFFF6]'
                    }`}
                    onMouseEnter={() => setHoveredBtn(index)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    >
                    {text}
                    </button>
                ))}
                </div>
            </div>
        </section>
    );
}