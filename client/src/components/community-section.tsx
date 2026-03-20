import { Rocket, Mail, MessageCircle, Send, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunitySection() {
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

  const communityLinks = [
    {
      name: "Discord",
      description: "Join daily discussions about AI infrastructure, governance, and campus development.",
      icon: MessageCircle,
      color: "text-cyan-400 group-hover:text-teal-400",
      href: "https://discord.gg/cuttlefishlabs",
    },
    {
      name: "Telegram",
      description: "Real-time updates and connect with the global Cuttlefish community.",
      icon: Send,
      color: "text-teal-400 group-hover:text-cyan-400",
      href: "https://t.me/CuttlefishDAO_Bot",
    },
    {
      name: "X (Twitter)",
      description: "Follow for project updates, campus progress, and industry insights.",
      icon: Twitter,
      color: "text-cyan-400 group-hover:text-teal-400",
      href: "https://x.com/cuttlefishlabs",
    },
    {
      name: "GitHub",
      description: "Explore our open-source constitutional governance and agent frameworks.",
      icon: Github,
      color: "text-teal-400 group-hover:text-cyan-400",
      href: "https://github.com/HansElze",
    },
  ];

  return (
    <section id="community" className="py-20 bg-slate-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Join the Community
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Builders, researchers, investors, and city planners — there's a place for you in the 
            protocol for civilization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {communityLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Card key={index} className="glass-effect border-cyan-600/20 hover-lift text-center group">
                <CardContent className="p-6">
                  <div className={`text-4xl mb-4 ${link.color} group-hover:scale-110 transition-all duration-200`}>
                    <IconComponent className="h-10 w-10 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{link.name}</h3>
                  <p className="text-gray-300 mb-4">{link.description}</p>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-teal-400 transition-colors duration-200 font-medium"
                  >
                    Join {link.name} →
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-600/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4 gradient-text">
              Ready to Build the Future?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Whether you're an AI researcher, infrastructure investor, city planner, or someone 
              who believes technology should serve communities — we're building this together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection("#whitepaper")}
                className="gradient-button px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                onClick={() => window.location.href = 'mailto:info@cuttlefishlabs.io'}
                variant="outline"
                className="border-2 border-cyan-600 text-cyan-400 px-8 py-3 text-lg font-semibold hover:bg-cyan-600 hover:text-white transition-colors duration-200"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
