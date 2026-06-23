import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyResellHub } from "@/components/home/WhyResellHub";
import { Testimonials } from "@/components/home/Testimonials";
import { SustainabilitySection } from "@/components/home/SustainabilitySection";
import { CTASection } from "@/components/home/CTASection";
import { SiteFooter } from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedListings />
      <HowItWorks />
      <WhyResellHub />
      <Testimonials />
      <SustainabilitySection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}
