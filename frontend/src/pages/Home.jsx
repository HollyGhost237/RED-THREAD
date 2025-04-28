import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import MedicinalRecipes from '../components/home/MedicinalRecipes';
import EducationalBlog from '../components/home/EducationalBlog';

export default function Home() {
    return (
        <main>
            <HeroSection />
            <FeaturesGrid />
            <MedicinalRecipes />
            <EducationalBlog />
        </main>
    );
}