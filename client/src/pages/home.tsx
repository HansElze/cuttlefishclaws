import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import WhatAgentsDoSection from "@/components/what-agents-do-section";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function ValuePropsSection() {
  const [openModal, setOpenModal] = useState<number | null>(null);

  const valueProp = [
    {
      title: "Autonomous Campus Operations",
      description: "AI agents managing everything from maintenance to compute services, creating efficient and responsive campus environments.",
      icon: "🤖",
      expandedTitle: "AI Agents Running Real Infrastructure",
      highlight: "Our AI agents don't just chat. They manage physical compute campuses — monitoring power, optimizing cooling, allocating compute, and responding to incidents 24/7.",
      expandedContent: [
        "Traditional data center management requires large ops teams running 24/7 shifts. Our constitutional AI agents handle the same workload at a fraction of the cost — monitoring thousands of sensors, optimizing energy consumption, and making real-time capacity decisions.",
        "Each campus runs a fleet of specialized agents: Ceph (builder/developer), Tributary (public-facing operations), Reef (infrastructure monitoring), and Nemo (private operations). They coordinate through our multi-agent protocol with TrustGraph scoring between them.",
        "The agents operate under constitutional governance — they can't cut corners on safety, can't prioritize profit over member interests, and can't make decisions that violate the DAO's charter. Every action is logged, auditable, and reversible.",
        "The result: operational costs 40-60% lower than traditional management, with higher uptime and faster incident response. AI doesn't sleep, doesn't take breaks, and doesn't forget to check the backup generators.",
      ],
    },
    {
      title: "Community-Driven Governance",
      description: "Token-based decision making that puts members at the center of campus governance and resource allocation.",
      icon: "🏛️",
      expandedTitle: "Your Infrastructure, Your Rules",
      highlight: "Compute Access Certificates (CACs) aren't just memberships — they're governance tokens. Every member votes on campus decisions, from capacity expansion to new services.",
      expandedContent: [
        "The DAO-REIT structure means the community that uses the compute infrastructure also owns and governs it. No absentee landlords. No corporate board making decisions in a boardroom 1,000 miles away.",
        "CAC tiers (Resident $25/mo, Builder $100/mo, Sovereign $500/mo, Anchor $2,000/mo) give proportional voting rights. Higher tiers get more compute allocation AND more governance influence — skin in the game drives better decisions.",
        "Constitutional constraints prevent governance capture: no single entity can hold more than 15% voting power, amendments require 2/3 supermajority, and the constitutional kernel (agent rights, safety requirements) is immutable — it can't be voted away.",
        "Smart contracts handle treasury management, fee distribution, and proposal execution. Revenue splits automatically: 40% to Cuttlefish Labs (management + tech license), 40% to the local DAO (operations + expansion), 20% to governance reserve.",
      ],
    },
    {
      title: "Scalable Infrastructure",
      description: "Proven technology ready to expand from pilot campuses to a nationwide network, transforming post-industrial infrastructure into sovereign AI compute hubs.",
      icon: "🏗️",
      expandedTitle: "From One Campus to a National Network",
      highlight: "The Series LLC structure means each campus is legally independent. Prove the model in Birmingham, then replicate across 8 target markets with minimal incremental risk.",
      expandedContent: [
        "Our first campus (420K SF, Birmingham AL) is the proof of concept. Once operational, the playbook is proven: identify post-industrial building, acquire at $5-15/SF, convert to AI compute campus, spin up DAO governance, onboard members.",
        "Target markets for expansion: Detroit, St. Louis, Cleveland, Memphis, Pittsburgh, Buffalo, Kansas City. Each has abundant post-industrial real estate, fiber connectivity, affordable power, and communities that need economic revitalization.",
        "The franchise model means each new campus costs Cuttlefish Labs almost nothing to launch — the DAO-REIT acquires the property, the constitutional governance framework deploys automatically, and the agent fleet spins up from templates. Our revenue comes from management fees (2% GAV) and tech licensing (5% compute revenue).",
        "At 10-25 properties in 5 years, the protocol fee alone (0.25% on all agent-to-agent transactions across all campuses) generates significant recurring revenue. More campuses = more agents = more transactions = more protocol revenue. The flywheel compounds.",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
          Transforming Campus Life
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Cuttlefish Labs is building the future of community-owned, AI-powered compute campuses
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {valueProp.map((prop, index) => (
          <div
            key={index}
            className="glass-effect rounded-xl p-8 text-center cursor-pointer group hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1"
            onClick={() => setOpenModal(index)}
          >
            <div className="text-4xl mb-4">{prop.icon}</div>
            <h3 className="text-xl font-bold mb-4 text-cyan-400 group-hover:text-teal-300 transition-colors">{prop.title}</h3>
            <p className="text-gray-300 leading-relaxed">{prop.description}</p>
            <p className="text-cyan-400/50 text-sm mt-4 group-hover:text-cyan-400 transition-colors">Click to learn more →</p>
          </div>
        ))}
      </div>

      {openModal !== null && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="bg-slate-900 border border-cyan-600/20 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 relative shadow-2xl shadow-cyan-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-4xl mb-4">{valueProp[openModal].icon}</div>

            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {valueProp[openModal].expandedTitle}
            </h2>

            <div className="bg-cyan-400/5 p-4 rounded-r-xl mb-6 text-gray-300 leading-relaxed"
                 style={{ borderLeftWidth: '3px', borderLeftColor: 'rgb(34, 211, 238)' }}>
              <span className="font-medium text-white">Core insight: </span>
              {valueProp[openModal].highlight}
            </div>

            {valueProp[openModal].expandedContent.map((paragraph, i) => (
              <p key={i} className="text-gray-400 leading-relaxed mb-4 text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
        Ready to Transform Your Campus?
      </h2>
      <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
        Join the movement to create community-owned, AI-powered compute campuses that put members first.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="gradient-button text-lg px-8 py-3">
          <Link href="/portfolio">View Our Network</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0a0a23]">
          <Link href="/community">Join Community</Link>
        </Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <HeroSection />
      <ValuePropsSection />
      <WhatAgentsDoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
