import Navigation from "@/components/navigation";
import CommunitySection from "@/components/community-section";
import PartnersSection from "@/components/partners-section";
import RoadmapSection from "@/components/roadmap-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mail, MessageCircle, Twitter, Github } from "lucide-react";

function CommunityHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Join Our Community
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Be part of the movement to create community-owned, AI-powered compute campuses. 
          Connect with community members, developers, and innovators building the future of AI infrastructure.
        </p>
      </div>
    </section>
  );
}

function JoinCTASection() {
  const socialLinks = [
    {
      name: "Discord",
      icon: MessageCircle,
      href: "#",
      description: "Join our developer and member community",
      color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30"
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      description: "Follow updates and announcements",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
    },
    {
      name: "GitHub",
      icon: Github,
      href: "#",
      description: "Contribute to open source development",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30"
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:hello@cuttlefishlabs.io",
      description: "Contact us directly",
      color: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
    }
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          Get Involved
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Multiple ways to join the community and contribute to the future of community-owned compute campuses.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`glass-effect rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 border ${link.color}`}
          >
            <link.icon className="w-8 h-8 mx-auto mb-4" />
            <h3 className="font-bold mb-2">{link.name}</h3>
            <p className="text-sm text-gray-300">{link.description}</p>
          </a>
        ))}
      </div>

      {/* Call-to-action cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 gradient-text">For Members</h3>
          <p className="text-gray-300 mb-6">
            Interested in joining our AI compute network? Join our community ambassador program 
            and help shape the future of AI infrastructure.
          </p>
          <Button className="gradient-button">
            Become a Community Ambassador
          </Button>
        </div>
        
        <div className="glass-effect rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 gradient-text">For Developers</h3>
          <p className="text-gray-300 mb-6">
            Help build the AI agent infrastructure that powers AI compute campuses. 
            Contribute to open source projects and earn rewards.
          </p>
          <Button className="gradient-button">
            Join Development Team
          </Button>
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="mt-16 glass-effect rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 gradient-text">Stay Updated</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Get the latest updates on campus deployments, technology developments, and community milestones.
        </p>
        <div className="flex max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
          />
          <Button className="gradient-button rounded-l-none px-6 py-3">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Community() {
  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <CommunityHero />
      <JoinCTASection />
      <CommunitySection />
      <PartnersSection />
      <RoadmapSection />
      <Footer />
    </div>
  );
}