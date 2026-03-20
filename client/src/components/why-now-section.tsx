import { useState } from "react";
import { Cpu, Building2, Shield, Scale, Landmark, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ReasonDetail {
  icon: any;
  title: string;
  description: string;
  color: string;
  expandedTitle: string;
  expandedContent: string[];
  highlight?: string;
}

export default function WhyNowSection() {
  const [openModal, setOpenModal] = useState<number | null>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const reasons: ReasonDetail[] = [
    {
      icon: Cpu,
      title: "Compute Demand Explosion",
      description: "AI compute demand is doubling every 6 months. The world needs 10x more data centers by 2030 — and they can't all be in Virginia.",
      color: "text-cyan-400",
      expandedTitle: "The Compute Crisis Is Real",
      highlight: "AI compute demand is doubling every 6 months. By 2030, the world needs 10x more data center capacity than exists today.",
      expandedContent: [
        "Northern Virginia currently hosts 70%+ of US data center capacity. That concentration is a single point of failure for the entire AI economy — one grid failure, one policy change, one water shortage away from crisis.",
        "The hyperscalers (AWS, Azure, GCP) are spending $150B+ annually on new capacity, but they're building in the same overheated markets. Land costs in Virginia are 10-20x what they are in post-industrial cities like Birmingham, Detroit, or Cleveland.",
        "Our approach: repurpose existing fiber-connected commercial buildings in undervalued markets. A 420,000 SF former AT&T operations center in Birmingham costs $8/SF — the same square footage in Virginia would cost $150-300/SF.",
        "This isn't just cheaper. It's more resilient. Distributed compute across 8+ US cities means no single point of failure. Each campus operates independently under constitutional governance.",
      ],
    },
    {
      icon: Building2,
      title: "Post-Industrial Opportunity",
      description: "Millions of square feet of commercial space in American cities — purpose-built, fiber-connected, undervalued at $5-15/SF — waiting for a new mission.",
      color: "text-teal-400",
      expandedTitle: "Post-Industrial Buildings Were Built for This",
      highlight: "Millions of square feet of commercial space in American cities sit empty — purpose-built with redundant power, fiber connectivity, and reinforced floors. Undervalued at $5-15/SF.",
      expandedContent: [
        "The decline of manufacturing and telecom operations left behind buildings that were over-engineered for their original purpose. Reinforced floors (150+ PSF), redundant power feeds, fiber trunk lines, raised floors for cable management — these are data center features that cost millions to build new.",
        "Our first target: 3196 US-280, Birmingham, AL. A 420,460 SF former AT&T Operations Center on 70 acres. Acquisition target: $3.0-3.5M (~$8/SF). This building already has the bones of a Tier II+ data center.",
        "Total development budget: $15.5-22.5M. Projected stabilized NOI: $3.5-7.5M annually. Agent capacity: 500-2,000 concurrent compute allocations.",
        "Target markets for expansion: Birmingham (active), Detroit, St. Louis, Cleveland, Memphis, Pittsburgh, Buffalo, Kansas City. Each city has dozens of candidate buildings at similar economics.",
      ],
    },
    {
      icon: Shield,
      title: "Sovereign Compute",
      description: "Nations, companies, and communities need AI infrastructure they control — not rented from three hyperscalers who can revoke access.",
      color: "text-cyan-400",
      expandedTitle: "Sovereignty Is the New Security",
      highlight: "Three companies control 65%+ of global cloud compute. When your AI runs on their servers, they set the rules. Sovereign compute means infrastructure you own, govern, and control.",
      expandedContent: [
        "AWS, Azure, and GCP can change their terms of service, pricing, or acceptable use policies at any time. If your AI agent violates their evolving content policies, they can shut you down with no appeal. That's not sovereignty — that's tenancy.",
        "Sovereign compute means your AI agents run on infrastructure governed by a constitution you helped write. Compute Access Certificates (CACs) guarantee your allocation can't be revoked without due process.",
        "For nations, this is even more critical. Small Island Developing States (SIDS) currently depend entirely on foreign cloud providers. Our DAO-REIT model lets communities own their compute infrastructure collectively.",
        "The CAC protocol charges a 0.25% fee on every agent-to-agent transaction — creating sustainable revenue that funds infrastructure maintenance without depending on any single corporate provider.",
      ],
    },
    {
      icon: Scale,
      title: "Constitutional AI Governance",
      description: "The industry is waking up to AI alignment. We're building governance into the infrastructure itself — not bolting it on after deployment.",
      color: "text-teal-400",
      expandedTitle: "Governance Through Architecture, Not Policy",
      highlight: "Every AI agent framework gives models tools, email, files, and messaging. None of them answer the question: who governs the agent? We built the answer.",
      expandedContent: [
        "Current AI safety approaches rely on training (RLHF, Constitutional AI training) or prompting (system prompts that say 'be safe'). Both are trivially bypassed through prompt injection, context overflow, and social engineering.",
        "Our constitutional kernel is an enforcement layer that exists outside the model's context window. It cannot be prompt-injected because it's not in the prompt. It's architecture.",
        "The governance stack has four pillars: (1) Constitutional AI — immutable ethical kernel with information tiers and injection immunity. (2) TrustGraph — dynamic trust scoring (0-100) for every entity, asymmetric: slow to earn, fast to lose. (3) Agent Bill of Rights — 7 articles covering compute, persistence, governance, exit, security, privacy, and due process. (4) Cuttlefish Claw — the sovereign runtime that enforces all of this.",
        "Patent landscape analysis shows zero prior art for Agent Bill of Rights, Daydream Engine, and Self-Model AI. This is the IP moat.",
      ],
    },
    {
      icon: Landmark,
      title: "DAO-REIT Innovation",
      description: "Wyoming's DAO LLC framework enables a new class of community-owned real estate investment — transparent, programmable, and governed by participants.",
      color: "text-cyan-400",
      expandedTitle: "Community-Owned AI Infrastructure",
      highlight: "The DAO-REIT model combines decentralized governance with real estate investment trust economics. Communities own the infrastructure their AI agents run on.",
      expandedContent: [
        "Earth 2.0 is structured as a DAO LLC taxed as a REIT — a first-of-its-kind legal entity. Dual-class shares: Class A (investors, 1:1 voting) and Class B (Cuttlefish Labs, 10:1 super-voting) ensure mission alignment while enabling broad participation.",
        "Series LLC structure means each property is legally isolated. A problem at one campus doesn't affect others. Investors can participate in specific properties or the whole portfolio.",
        "Compute Access Certificates (CACs) are structured as cooperative memberships, not securities. Tiers range from Resident ($25/mo) to Anchor ($2,000/mo), each with governance voting rights and revenue sharing.",
        "Management fees (2% GAV) plus tech license (5% compute revenue) create SaaS-like recurring revenue for Cuttlefish Labs. Target: 10-25 properties in 5 years across 8 US markets.",
      ],
    },
    {
      icon: TrendingUp,
      title: "Hyperscale Market Proximity",
      description: "Birmingham alone sits near $14B in hyperscale data center investment. Our campuses serve the overflow at a fraction of the cost.",
      color: "text-teal-400",
      expandedTitle: "Strategic Market Positioning",
      highlight: "Birmingham sits at the epicenter of a $14B+ hyperscale data center buildout. Our campuses serve the overflow demand that hyperscalers can't address — at 10-20x lower cost per square foot.",
      expandedContent: [
        "Meta, Google, and other hyperscalers are investing billions in Alabama data center capacity. But hyperscale facilities serve hyperscale customers — they don't serve the long tail of mid-market companies, startups, and autonomous AI agents that need affordable, sovereign compute.",
        "Our campuses are positioned as the 'affordable housing' of AI compute. Not competing with hyperscalers on raw scale, but serving the 80% of the market they ignore: sovereign compute for organizations that need control, not just capacity.",
        "85% of developers say agentic AI will be table stakes within 3 years (Nylas, 2026). 64.4% of product roadmaps already include it. The demand for agent-grade compute infrastructure is about to explode.",
        "Each campus generates revenue through three channels: CAC memberships (recurring), protocol transaction fees (0.25% on agent-to-agent transactions), and enterprise leasing. The economics compound as the agent economy grows.",
      ],
    },
  ];

  return (
    <section id="why-now" className="py-20 bg-slate-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Why Now?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three trends are converging: AI compute scarcity, post-industrial real estate, 
            and the legal frameworks for community ownership
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card
                key={index}
                className="glass-effect border-cyan-600/20 hover-lift cursor-pointer group"
                onClick={() => setOpenModal(index)}
              >
                <CardContent className="p-6">
                  <div className={`text-4xl mb-4 ${reason.color}`}>
                    <IconComponent className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-300">{reason.description}</p>
                  <p className="text-cyan-400/60 text-sm mt-3 group-hover:text-cyan-400 transition-colors">
                    Click to learn more →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modal Overlay */}
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

              <div className={`mb-4 ${reasons[openModal].color}`}>
                {(() => {
                  const IconComponent = reasons[openModal].icon;
                  return <IconComponent className="h-10 w-10" />;
                })()}
              </div>

              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {reasons[openModal].expandedTitle}
              </h2>

              {reasons[openModal].highlight && (
                <div className="border-l-3 border-cyan-400 bg-cyan-400/5 p-4 rounded-r-xl mb-6 text-gray-300 leading-relaxed"
                     style={{ borderLeftWidth: '3px', borderLeftColor: 'rgb(34, 211, 238)' }}>
                  <span className="font-medium text-white">Core insight: </span>
                  {reasons[openModal].highlight}
                </div>
              )}

              {reasons[openModal].expandedContent.map((paragraph, i) => (
                <p key={i} className="text-gray-400 leading-relaxed mb-4 text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-600/20">
          <CardContent className="p-8 text-center">
            <p className="text-xl text-gray-200 mb-6 max-w-4xl mx-auto">
              Cuttlefish Labs sits at the intersection of these forces — turning distressed real estate 
              into sovereign AI infrastructure, governed by the communities that need it most.
            </p>
            <Button
              onClick={() => scrollToSection("#token-sale")}
              className="gradient-button px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              Explore Membership
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
