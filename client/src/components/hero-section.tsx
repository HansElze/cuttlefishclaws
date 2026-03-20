import { ChevronDown, FileText, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="relative min-h-screen flex items-center justify-center bg-[var(--abyss-black)] overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-cyan-400/5 to-transparent opacity-50"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 text-center pt-20 sm:pt-0">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          The New Protocol for{" "}
          <span className="gradient-text">
            Civilization
          </span>
        </h1>
        
        <div className="text-base sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-slide-up space-y-1 sm:space-y-2">
          <p>Sovereign AI compute campuses.</p>
          <p>Constitutional governance.</p>
          <p>Community ownership.</p>
          <p>Built on the bones of America's industrial past.</p>
        </div>
        
        <p className="text-sm sm:text-lg mb-8 sm:mb-12 text-gray-300 max-w-4xl mx-auto animate-slide-up">
          The AI revolution demands unprecedented computing power, but today's infrastructure is 
          centralized, extractive, and excludes the communities it displaces. Cuttlefish Labs is 
          building something different — sovereign AI campuses in post-industrial American cities, 
          governed by constitutional frameworks and owned by the people who participate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/whitepapers/Cuttlefish_White_Paper.pdf';
              link.download = 'Cuttlefish_Labs_White_Paper.pdf';
              link.click();
            }}
            className="gradient-button px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            <FileText className="mr-2 h-5 w-5" />
            Read the White Paper
          </Button>
          
          <Button
            onClick={() => scrollToSection("#community")}
            variant="outline"
            className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold hover:bg-white hover:text-[#0a0a23] transition-colors duration-200"
          >
            <Users className="mr-2 h-5 w-5" />
            Join the Community
          </Button>
          
          <Button
            onClick={() => scrollToSection("#about")}
            variant="secondary"
            className="glass-effect border border-white/20 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold hover:bg-white/10 transition-colors duration-200"
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection("#about")}
          className="text-white/70 hover:text-white transition-colors duration-200"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </header>
  );
}
