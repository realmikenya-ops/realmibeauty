import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => (
  <div className="bg-background min-h-screen">
    <Navbar />
    <section className="container py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">About Realmi Kenya</p>
        <h1 className="font-display mt-3 text-4xl font-bold md:text-5xl">
          We make booking beauty <span className="text-gradient-gold">effortless</span>
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
          Realmi Kenya is a marketplace connecting customers with the best salons and barbershops across Kenya.
          Our mission is simple: make it easy to look great, support local beauty businesses, and pay seamlessly with M-Pesa.
        </p>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Founded in Nairobi, we're building the most trusted way to discover, book, and pay for beauty
          and grooming services in East Africa.
        </p>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;