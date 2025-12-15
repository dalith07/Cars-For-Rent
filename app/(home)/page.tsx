import FeaturesSection from "@/components/features-section";
import Hero from "@/components/hero";
import LogoCars from "@/components/logo-cars";
import PopularCars from "@/components/popular-cars";

export default function Home() {
    return (
        <div >
            <Hero />
            <FeaturesSection />
            <LogoCars />
            <PopularCars />
        </div>
    );
}
