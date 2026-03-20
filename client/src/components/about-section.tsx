import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
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

  const stats = [
    { value: "$14B+", label: "Hyperscale Market Near Birmingham", color: "text-cyan-400" },
    { value: "420K", label: "SF First Campus", color: "text-teal-400" },
    { value: "70", label: "Acres at Tributary", color: "text-cyan-400" },
    { value: "8+", label: "Target Cities", color: "text-teal-400" },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Why Cuttlefish Labs?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              AI demands massive compute, but today's data centers are concentrated in a few hands, 
              built in places with no community benefit, and governed by no one but shareholders. 
              Meanwhile, post-industrial American cities sit on millions of square feet of 
              undervalued commercial space — purpose-built infrastructure waiting for a new mission.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Cuttlefish Labs connects these two realities. We acquire distressed commercial 
              buildings in cities like Birmingham, Detroit, and Cleveland, and convert them into 
              sovereign AI compute campuses — governed by constitutional frameworks, powered by 
              sustainable energy, and owned by the communities that participate through our 
              Earth 2.0 DAO-REIT structure.
            </p>
          </div>
          
          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">Earth 2.0 DAO-REIT</h3>
              <p className="text-gray-300 text-sm">
                Wyoming DAO LLC taxed as REIT. Community-owned real estate meets sovereign AI compute. 
                Each property is an isolated series — risk-contained and independently governed.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-teal-400">Constitutional Governance</h3>
              <p className="text-gray-300 text-sm">
                Every agent and campus operates under an immutable ethical kernel. TrustGraph scoring, 
                Agent Bill of Rights, and information tier controls — governance you can verify, not just trust.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">Over/Under Architecture</h3>
              <p className="text-gray-300 text-sm">
                Building above and below existing infrastructure. Terraced sunken data centers, 
                elevated parks, mixed-use eco-districts. Modular AI data cluster buildout for rapid deployment.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => scrollToSection("#whitepaper")}
            className="gradient-button px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Discover Our Vision
          </Button>
        </div>
      </div>
    </section>
  );
}
