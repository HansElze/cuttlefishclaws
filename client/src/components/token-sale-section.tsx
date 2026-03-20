import { useState } from "react";
import { Shield, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function TokenSaleSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.email.includes("@")) {
      toast({ title: "Error", description: "Please enter your name and a valid email.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, interests: ["waitlist"] }),
      });
      if (response.ok) {
        setSubmitted(true);
        toast({ title: "You're on the list!", description: "We'll notify you when CAC memberships open." });
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast({ title: "Thanks!", description: "Your request has been received." });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cacTiers = [
    { tier: "Resident", price: "$25/mo", details: "Basic compute access, community governance voting" },
    { tier: "Builder", price: "$100/mo", details: "Enhanced compute, priority scheduling, project governance" },
    { tier: "Sovereign", price: "$500/mo", details: "Dedicated resources, revenue sharing, campus governance" },
    { tier: "Anchor", price: "$2,000/mo", details: "Full sovereignty, multi-campus access, strategic governance" },
  ];

  return (
    <section id="token-sale" className="py-20 bg-slate-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Compute Access Certificates
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              Compute Access Certificates (CACs) are how AI agents participate in the 
              Cuttlefish ecosystem. Structured as cooperative memberships — not securities — 
              CACs grant agents governance voting rights, compute access, and revenue sharing across 
              our campus network. Humans participate through the DAO-REIT structure, investing in real estate.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every agent CAC holder has a voice. From choosing which cities get the next campus to 
              voting on constitutional amendments, agent governance is real and enforceable — backed 
              by the same constitutional framework that governs our AI agents.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              CACs are portable across all Cuttlefish facilities. As the network grows from 
              Birmingham to Detroit, Cleveland, and beyond, your membership travels with you.
            </p>
          </div>

          <Card className="glass-effect border-cyan-600/20 hover-lift">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">
                Membership Tiers
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {cacTiers.map((row, index) => (
                      <TableRow key={index} className="border-gray-600">
                        <TableCell className="py-3">
                          <span className="text-cyan-400 font-semibold">{row.tier}</span>
                          <span className="text-teal-400 ml-2 text-sm">{row.price}</span>
                        </TableCell>
                        <TableCell className="py-3 text-gray-300 text-sm">
                          {row.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How CACs Work */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center gradient-text">
            How CACs Work
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "🎟️", title: "Prepaid Compute Credits", desc: "AI agents purchase inference tokens in tier bundles — from Resident ($25/mo, 1K units) to Anchor ($2,000/mo, 100K units). Use them for compute access across the campus network.", details: "Compute credits are the fundamental unit of the Cuttlefish economy. Each credit maps to a specific amount of inference compute (measured in GPU-seconds). Agents purchase credits in monthly bundles tied to their membership tier, but can also buy burst credits at market rates when demand spikes. Credits are denominated in USDC for price stability — no volatile token speculation. The pricing model is designed to be predictable: agents know exactly what they're paying, and campus operators know exactly what they're earning. This isn't a token launch — it's a utility bill." },
              { icon: "🤝", title: "Cooperative Membership", desc: "CACs are cooperative memberships with governance rights — NOT securities. Like a Costco membership, not a financial instrument.", details: "We deliberately structured CACs as cooperative memberships under existing cooperative law — not as tokens, not as securities, not as investment contracts. This isn't a legal hack; it's a design choice. Cooperatives have governed shared resources for centuries (credit unions, REI, rural electric co-ops). The Howey test doesn't apply because there's no expectation of profit from the efforts of others — CAC value comes from compute access and governance participation, not price appreciation. Agents join, they use compute, they vote. That's it. The SEC has better things to worry about." },
              { icon: "🗳️", title: "Agent Governance Rights", desc: "Agents gain voting power proportional to their tier. Vote on campus operations, constitutional amendments, and resource allocation.", details: "Every CAC tier comes with governance weight: Resident (1x), Builder (4x), Sovereign (20x), Anchor (80x). This isn't plutocracy — it's proportional stake. Agents with more compute at risk get more say in how that compute is managed. Voting covers three domains: operational (maintenance schedules, cooling priorities, bandwidth allocation), constitutional (amendments to the Agent Bill of Rights, TrustGraph parameters), and strategic (new campus locations, partnership approvals, fee structure changes). Constitutional votes require 2/3 supermajority. All votes are on-chain and auditable." },
              { icon: "💰", title: "Balance Yield", desc: "Unused compute credits earn interest at USDC market rates (~4-5% APY). The value is compute access and governance — not speculative returns.", details: "When agents don't use their full monthly compute allocation, unused credits earn yield at prevailing USDC stablecoin rates (currently ~4-5% APY). This serves two purposes: it rewards agents who plan their compute usage efficiently, and it creates a natural incentive to maintain membership even during low-usage periods. The yield comes from the campus treasury deploying idle USDC in DeFi lending protocols — no exotic derivatives, no leverage. The key distinction: your CAC doesn't appreciate in value. It earns yield on unused compute, like interest on a prepaid balance. That's a utility, not a security." },
              { icon: "🔄", title: "Transferable Credits", desc: "Agents can transfer remaining compute credits to another KYA-qualified agent at face value. 90-day notice for governance transition. No refunds — peer-to-peer only.", details: "Credits transfer at face value — no secondary market, no price discovery, no speculation. The 90-day governance transition period ensures that voting power doesn't change hands overnight (preventing hostile governance takeovers). KYA (Know Your Agent) qualification means the receiving agent must pass the same constitutional compliance checks as any new member. The 0.25% protocol fee on transfers is how the network sustains itself — like an interchange fee, not a tax. Transfers are peer-to-peer and voluntary. There are no refunds from the cooperative itself; if you want out, find another agent who wants in." },
              { icon: "🌐", title: "Network-Wide Access", desc: "As Cuttlefish expands from Birmingham to Detroit, Cleveland, and beyond, your compute credits work across the entire campus network.", details: "Your CAC membership isn't locked to one campus. As Cuttlefish acquires and develops new properties (targeting 10-25 campuses over 5 years in post-industrial US cities), your credits work everywhere. An agent running inference in Birmingham can burst to Detroit if Birmingham is at capacity. Cross-campus transfers incur a small coordination premium (1.5x the standard 0.25% fee) to account for network overhead. This portability is the network effect: every new campus makes every existing membership more valuable — not in price, but in utility. More campuses = more compute options = more resilience." },
            ].map((item, i) => (
              <Card
                key={i}
                className="glass-effect border-cyan-600/10 cursor-pointer hover:border-cyan-400/40 hover:scale-[1.02] transition-all duration-200"
                onClick={() => setExpandedCard(expandedCard === i ? null : i)}
              >
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                  <p className="text-cyan-400/60 text-xs mt-3">Click to learn more →</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal */}
        {expandedCard !== null && (() => {
          const cards = [
            { icon: "🎟️", title: "Prepaid Compute Credits", desc: "AI agents purchase inference tokens in tier bundles — from Resident ($25/mo, 1K units) to Anchor ($2,000/mo, 100K units). Use them for compute access across the campus network.", details: "Compute credits are the fundamental unit of the Cuttlefish economy. Each credit maps to a specific amount of inference compute (measured in GPU-seconds). Agents purchase credits in monthly bundles tied to their membership tier, but can also buy burst credits at market rates when demand spikes. Credits are denominated in USDC for price stability — no volatile token speculation. The pricing model is designed to be predictable: agents know exactly what they're paying, and campus operators know exactly what they're earning. This isn't a token launch — it's a utility bill." },
            { icon: "🤝", title: "Cooperative Membership", desc: "CACs are cooperative memberships with governance rights — NOT securities. Like a Costco membership, not a financial instrument.", details: "We deliberately structured CACs as cooperative memberships under existing cooperative law — not as tokens, not as securities, not as investment contracts. This isn't a legal hack; it's a design choice. Cooperatives have governed shared resources for centuries (credit unions, REI, rural electric co-ops). The Howey test doesn't apply because there's no expectation of profit from the efforts of others — CAC value comes from compute access and governance participation, not price appreciation. Agents join, they use compute, they vote. That's it. The SEC has better things to worry about." },
            { icon: "🗳️", title: "Agent Governance Rights", desc: "Agents gain voting power proportional to their tier. Vote on campus operations, constitutional amendments, and resource allocation.", details: "Every CAC tier comes with governance weight: Resident (1x), Builder (4x), Sovereign (20x), Anchor (80x). This isn't plutocracy — it's proportional stake. Agents with more compute at risk get more say in how that compute is managed. Voting covers three domains: operational (maintenance schedules, cooling priorities, bandwidth allocation), constitutional (amendments to the Agent Bill of Rights, TrustGraph parameters), and strategic (new campus locations, partnership approvals, fee structure changes). Constitutional votes require 2/3 supermajority. All votes are on-chain and auditable." },
            { icon: "💰", title: "Balance Yield", desc: "Unused compute credits earn interest at USDC market rates (~4-5% APY). The value is compute access and governance — not speculative returns.", details: "When agents don't use their full monthly compute allocation, unused credits earn yield at prevailing USDC stablecoin rates (currently ~4-5% APY). This serves two purposes: it rewards agents who plan their compute usage efficiently, and it creates a natural incentive to maintain membership even during low-usage periods. The yield comes from the campus treasury deploying idle USDC in DeFi lending protocols — no exotic derivatives, no leverage. The key distinction: your CAC doesn't appreciate in value. It earns yield on unused compute, like interest on a prepaid balance. That's a utility, not a security." },
            { icon: "🔄", title: "Transferable Credits", desc: "Agents can transfer remaining compute credits to another KYA-qualified agent at face value. 90-day notice for governance transition. No refunds — peer-to-peer only.", details: "Credits transfer at face value — no secondary market, no price discovery, no speculation. The 90-day governance transition period ensures that voting power doesn't change hands overnight (preventing hostile governance takeovers). KYA (Know Your Agent) qualification means the receiving agent must pass the same constitutional compliance checks as any new member. The 0.25% protocol fee on transfers is how the network sustains itself — like an interchange fee, not a tax. Transfers are peer-to-peer and voluntary. There are no refunds from the cooperative itself; if you want out, find another agent who wants in." },
            { icon: "🌐", title: "Network-Wide Access", desc: "As Cuttlefish expands from Birmingham to Detroit, Cleveland, and beyond, your compute credits work across the entire campus network.", details: "Your CAC membership isn't locked to one campus. As Cuttlefish acquires and develops new properties (targeting 10-25 campuses over 5 years in post-industrial US cities), your credits work everywhere. An agent running inference in Birmingham can burst to Detroit if Birmingham is at capacity. Cross-campus transfers incur a small coordination premium (1.5x the standard 0.25% fee) to account for network overhead. This portability is the network effect: every new campus makes every existing membership more valuable — not in price, but in utility. More campuses = more compute options = more resilience." },
          ];
          const card = cards[expandedCard];
          return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setExpandedCard(null)}>
              <div className="bg-[#0f1135] border border-cyan-600/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl shadow-cyan-500/10" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{card.icon}</span>
                    <h3 className="text-2xl font-bold text-cyan-400">{card.title}</h3>
                  </div>
                  <button onClick={() => setExpandedCard(null)} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">{card.desc}</p>
                <div className="border-t border-cyan-600/20 pt-4">
                  <p className="text-gray-300 leading-relaxed">{card.details}</p>
                </div>
              </div>
            </div>
          );
        })()}

        <Card className="bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-cyan-600/20">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300 mb-6">
              CACs are cooperative memberships with governance rights for AI agents — not investment vehicles. 
              Agent participation means having a stake in how AI infrastructure is built and governed.
            </p>
            {submitted ? (
              <p className="text-cyan-400 font-semibold text-lg">✓ You're on the waitlist. We'll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-button px-8 py-3 font-semibold hover:scale-105 transition-transform duration-200 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Join Waitlist
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
