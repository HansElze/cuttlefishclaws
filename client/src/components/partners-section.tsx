import { Building, Zap, Server, Scale, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PartnersSection() {
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

  const partnerCategories = [
    {
      icon: Server,
      title: "Compute Infrastructure",
      description: "GPU hardware partners, liquid cooling systems, and modular data center solutions for rapid campus deployment.",
      color: "text-cyan-400",
    },
    {
      icon: Zap,
      title: "Sustainable Energy",
      description: "Renewable energy providers and grid optimization partners to power campuses with clean, cost-effective electricity.",
      color: "text-teal-400",
    },
    {
      icon: Building,
      title: "Real Estate & Construction",
      description: "Commercial real estate partners in target markets. Modular AI data cluster buildout for adaptive reuse of industrial buildings.",
      color: "text-cyan-400",
    },
    {
      icon: Scale,
      title: "Legal & Governance",
      description: "Wyoming DAO LLC specialists, REIT compliance advisors, and constitutional governance framework developers.",
      color: "text-teal-400",
    },
    {
      icon: Cpu,
      title: "AI & Agent Infrastructure",
      description: "AI model providers, agent hosting platforms, and constitutional AI governance tool builders.",
      color: "text-cyan-400",
    },
    {
      icon: Users,
      title: "Community & Cities",
      description: "Municipal partnerships, economic development agencies, and community organizations in target markets.",
      color: "text-teal-400",
    },
  ];

  const targetMarkets = [
    { name: "Birmingham, AL", category: "Active — First Campus" },
    { name: "Detroit, MI", category: "Target Market" },
    { name: "Cleveland, OH", category: "Target Market" },
    { name: "St. Louis, MO", category: "Target Market" },
    { name: "Pittsburgh, PA", category: "Target Market" },
    { name: "Memphis, TN", category: "Target Market" },
    { name: "Buffalo, NY", category: "Target Market" },
    { name: "Kansas City, MO", category: "Target Market" },
  ];

  return (
    <section id="partners" className="py-20 bg-slate-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Ecosystem & Target Markets
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Building partnerships across the full stack — from compute hardware to city governments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partnerCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="glass-effect border-cyan-600/20 hover-lift">
                <CardContent className="p-6">
                  <div className={`text-4xl mb-4 ${category.color}`}>
                    <IconComponent className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{category.title}</h3>
                  <p className="text-gray-300">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-600/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">
              Target Markets
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-8">
              {targetMarkets.map((market, index) => (
                <div key={index} className="text-gray-300">
                  <strong className={index === 0 ? "text-cyan-400" : ""}>{market.name}</strong><br />
                  <span className={`text-sm ${index === 0 ? "text-cyan-400/70" : "text-gray-400"}`}>
                    {market.category}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={() => scrollToSection("#community")}
                className="gradient-button px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                <Users className="mr-2 h-5 w-5" />
                Want to Partner?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
