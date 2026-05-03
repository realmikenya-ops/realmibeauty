import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedVendors } from "@/components/FeaturedVendors";
import { HowItWorks } from "@/components/HowItWorks";
import { VendorCTA } from "@/components/VendorCTA";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <Categories />
      <FeaturedVendors />
      <HowItWorks />
      <VendorCTA />
    </main>
    <Footer />
  </div>
);

export default Index;
