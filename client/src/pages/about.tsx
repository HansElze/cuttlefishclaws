import Navigation from "@/components/navigation";
import AboutSection from "@/components/about-section";
import TeamSection from "@/components/team-section";
import WhyNowSection from "@/components/why-now-section";
import Footer from "@/components/footer";

// Create a hero banner for the About page
function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          About Cuttlefish Labs
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          We're building the infrastructure for community-owned, AI-powered compute campuses 
          that put communities first and create sustainable, thriving operational environments.
        </p>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <AboutHero />
      <AboutSection />
      <WhyNowSection />
      <TeamSection />
      <Footer />
    </div>
  );
}