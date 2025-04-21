import HeroSection from '../components/HeroSection';
import FeaturesGrid from '../components/FeaturesGrid';
import MedicinalRecipes from '../components/MedicinalRecipes';
import EducationalBlog from '../components/EducationalBlog';

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