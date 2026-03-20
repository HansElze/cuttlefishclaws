import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RoadmapSection() {
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

  const roadmapItems = [
    {
      quarter: "2025 (Completed)",
      description: "Cuttlefish Labs founded. Constitutional governance framework designed. Agent architecture built. CuttlefishLabs.io launched.",
      color: "cyan",
      side: "left",
    },
    {
      quarter: "Q1 2026",
      description: "Sovereign cognition engine deployed. Tributary AI agent live. Compute Access Certificate structure finalized. Community building on Discord.",
      color: "teal",
      side: "right",
    },
    {
      quarter: "Q2–Q3 2026",
      description: "Earth 2.0 DAO-REIT (Wyoming DAO LLC) formally established. Seed capital raise for Tributary AI Campus. First CAC memberships open.",
      color: "cyan",
      side: "left",
    },
    {
      quarter: "Q4 2026",
      description: "Tributary AI Campus acquisition — 420K SF, Birmingham AL. Modular AI data cluster buildout begins. Constitutional governance framework published.",
      color: "teal",
      side: "right",
    },
    {
      quarter: "2027",
      description: "Tributary campus operational — 500+ concurrent compute allocations. First hyperscaler leasing agreements. Second campus site identification begins.",
      color: "cyan",
      side: "left",
    },
    {
      quarter: "2028+",
      description: "Multi-campus sovereign compute network. Cross-facility CAC portability. Over/Under infrastructure design deployed. The Earth 2.0 Compute Layer.",
      color: "gradient",
      side: "right",
      special: true,
    },
  ];

  return (
    <section id="roadmap" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Our Roadmap
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From constitutional frameworks to physical campuses. We're building the infrastructure 
            for a new kind of civilization — transparent about where we are and where we're going.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-600 to-teal-400"></div>
          
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div key={index} className="relative flex items-center">
                {item.side === "left" ? (
                  <>
                    <div className="flex-1 pr-8 text-right">
                      <Card className={`glass-effect border-cyan-600/20 hover-lift ${item.special ? 'border-teal-500/50' : ''}`}>
                        <CardContent className="p-6">
                          <h3 className={`text-xl font-semibold mb-2 ${
                            item.color === "cyan" ? "text-cyan-400" : 
                            item.color === "teal" ? "text-teal-400" : 
                            "gradient-text"
                          }`}>
                            {item.quarter}
                          </h3>
                          <p className="text-gray-300">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-4 border-[#0a0a23] z-10 relative ${
                      item.color === "cyan" ? "bg-cyan-400" : 
                      item.color === "teal" ? "bg-teal-400" : 
                      "bg-gradient-to-r from-cyan-400 to-teal-400 animate-glow"
                    }`}></div>
                    <div className="flex-1 pl-8"></div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 pr-8"></div>
                    <div className={`w-4 h-4 rounded-full border-4 border-[#0a0a23] z-10 relative ${
                      item.color === "cyan" ? "bg-cyan-400" : 
                      item.color === "teal" ? "bg-teal-400" : 
                      "bg-gradient-to-r from-cyan-400 to-teal-400 animate-glow"
                    }`}></div>
                    <div className="flex-1 pl-8">
                      <Card className={`glass-effect border-cyan-600/20 hover-lift ${item.special ? 'border-teal-500/50' : ''}`}>
                        <CardContent className="p-6">
                          <h3 className={`text-xl font-semibold mb-2 ${
                            item.color === "cyan" ? "text-cyan-400" : 
                            item.color === "teal" ? "text-teal-400" : 
                            "gradient-text"
                          }`}>
                            {item.quarter}
                          </h3>
                          <p className="text-gray-300">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            onClick={() => scrollToSection("#community")}
            className="gradient-button px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
          >
            <Bell className="mr-2 h-5 w-5" />
            Stay Updated
          </Button>
        </div>
      </div>
    </section>
  );
}
