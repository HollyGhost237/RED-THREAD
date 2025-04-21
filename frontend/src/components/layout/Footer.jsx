import React from 'react'
import footerBg from '../../assets/footer.jpg'
import send from '../../assets/send.png'
import logo from '../../assets/logo.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import twitter from '../../assets/twitter.png';
import whatsaap from '../../assets/whatsapp.png';
import position from '../../assets/position.png';
import phone from '../../assets/phone.png';
import enveloppe from '../../assets/enveloppe.png';


export default function Footer() {
    return (
        <footer className="text-black py-8 relative bg-cover bg-center bg-no-repeat contrast-100"
            style={{ backgroundImage: `url(${footerBg})` }}>
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
            <div className="container mx-auto px-4 text-center relative z-10 text-white">
                {/* Contenu principal centré */}
                <div className="max-w-4xl mx-auto">  {/* Container pour centrage */}
                    {/* Formulaire centré et responsive */}
                    <form className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <div className='rounded-4xl w-full sm:w-96 max-w-full bg-white'>
                        <input 
                            type="search" 
                            placeholder="Entrez votre commentaire" 
                            className="px-4 py-2 text-[#316C40] font-bold focus:outline-none"  // Largeur ajustable
                        />
                        <button type="submit" className=" pl-6 py-2 rounded-lg hover:scale-110 transition ">
                            <img src={send} alt="Envoyer" className="h-5 w-5 inline-block" />
                        </button>

                        </div>
                    </form>

                    <h2 className="text-3xl font-bold mb-4 mt-4">Rejoignez-nous</h2>
                    
                </div>
            </div>
            <div className='flex  flex-row items-star justify-between relative px-4 text-white z-10'>
                <div className='space-y-4'>
                    <img src={logo} alt="Logo" className='h-8 sm:h-10 w-auto'/>
                    <p>Votre source fiable d'informations sur les <br />plantes médicinales et leurs bienfaits<br />pour la santé. </p>
                    <div className='flex flex-row items-center justify-start gap-4 mt-4'>
                        <img src={facebook} alt='facebook' className='h-6 w-6 '/>
                        <img src={instagram} alt='instagram' className='h-6 w-6 '/>
                        <img src={twitter} alt='twitter' className='h-6 w-6'/>
                        <img src={whatsaap} alt='whatsapp' className='h-6 w-6 '/>
                    </div>
                </div>
                <div className='space-y-4'>
                    <h2 className="text-3xl font-bold mb-4">Lien Rapide</h2>
                    <ul className='space-y-2'>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Accueil</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Plantes Medecinales</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Recette</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Blog</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Forum</a></li>
                    </ul>
                </div>
                <div className='space-y-4'>
                    <h2 className="text-3xl font-bold mb-4">Ressource</h2>
                    <ul className='space-y-2'>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Guide du débutant</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Identification des plantes</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Calendrier de cueillette</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">Précautions d'usage</a></li>
                        <li><a href="#" className="hover:text-[#E2F87B] hover:underline active:text-[#E2F87B]">FAQ</a></li>
                    </ul>
                </div>
                <div className='space-y-4'>
                    <h2 className="text-3xl font-bold mb-4">Contact</h2>
                    <ul className='space-y-2'>
                        <li className='flex'><img src={position} alt='position' className='h-6 w-6 mr-2'/>123 Rue des Plantes, 75000 Paris,<br/>France </li>
                        <li className='flex'><img src={phone} alt='phone' className='h-6 w-6 mr-2'/>+33 1 23 45 67 89</li>
                        <li className='flex'><img src={enveloppe} alt='enveloppe' className='h-6 w-6 mr-2'/>contact@herbarium.fr</li>
                    </ul>
                </div>
            </div>

            {/* Footer bas */}
            <div className="flex justify-between mt-12 ml-4 mr-4 pt-6 border-t border-white/40 text-white relative">
                <p>© {new Date().getFullYear()} NaturalMedecine.InchClass Tous droits réservés.</p>
                <div className="flex space-x-5">
                    <p>Mentions légales</p>
                    <p>Politique de confidentialité</p>
                    <p>Conditions d'utilisation</p>
                </div>
            </div>
</footer>
        )
    }