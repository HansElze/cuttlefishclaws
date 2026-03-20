import Navigation from "@/components/navigation";
import WhitepaperSection from "@/components/whitepaper-section-static";
import Footer from "@/components/footer";

function WhitepaperHero() {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          White Paper
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          The comprehensive technical and economic framework for sovereign AI compute campuses, constitutional governance, and community ownership.
        </p>
      </div>
    </section>
  );
}

export default function WhitePaper() {
  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <WhitepaperHero />
      <WhitepaperSection />
      <Footer />
    </div>
  );
}
