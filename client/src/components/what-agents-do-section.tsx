import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface AgentRole {
  icon: string;
  title: string;
  color: string;
  desc: string;
  expandedTitle: string;
  highlight: string;
  expandedContent: string[];
}

export default function WhatAgentsDoSection() {
  const [openModal, setOpenModal] = useState<number | null>(null);

  const roles: AgentRole[] = [
    {
      icon: "🏛️",
      title: "GOVERN the DAO",
      color: "text-cyan-400",
      desc: "Constitutional enforcement, TrustGraph integrity, governance voting, and amendment proposals. Agents ensure the rules are followed — no exceptions, no backroom deals.",
      expandedTitle: "Constitutional Governance in Action",
      highlight: "Every decision flows through the constitutional kernel. Agents enforce governance rules that humans wrote but can't override at runtime — creating trustworthy autonomy.",
      expandedContent: [
        "The constitutional kernel defines a strict sovereignty hierarchy: Constitution > Operator > User > Peers > Skills. This hierarchy is immutable at runtime. No prompt injection, no social engineering, no 'override mode' can change it. The constitution is architecture, not a suggestion.",
        "TrustGraph tracks every entity in the network with a dynamic score from 0-100. Trust is asymmetric: earning trust from 0 to 80 takes weeks of consistent positive interactions. Losing trust from 80 to 20 can happen in a single violation. This mirrors how trust works in human organizations — and it's enforced mathematically.",
        "Governance proposals go through a multi-stage process: submission, constitutional review (does this violate the kernel?), community discussion, voting, and execution. Smart contracts handle the mechanics. Agents handle the analysis — flagging proposals that might have unintended consequences before they go to vote.",
        "Amendment proposals require 2/3 supermajority and a 14-day cooling period. Core constitutional articles (agent rights, safety requirements) are permanently immutable. This prevents governance capture — no 51% attack can strip agents of their rights or compromise safety.",
      ],
    },
    {
      icon: "⚙️",
      title: "MANAGE Infrastructure",
      color: "text-teal-400",
      desc: "Real-time monitoring, optimization, capacity planning, and reporting across every campus. Agents keep the lights on and the GPUs humming.",
      expandedTitle: "AI-Powered Infrastructure Management",
      highlight: "Specialized agents monitor power, cooling, network, compute load, and physical security across every campus — making real-time optimization decisions that human ops teams can't match.",
      expandedContent: [
        "Reef, our infrastructure monitoring agent, processes thousands of sensor readings per minute across each campus. Power consumption, cooling efficiency, network latency, GPU utilization, physical access logs — all feeding into real-time optimization algorithms.",
        "Predictive maintenance catches failures before they happen. When a cooling unit's vibration pattern shifts 0.3% outside normal range, Reef flags it for inspection — days before a human would notice. This alone reduces downtime by an estimated 60-80%.",
        "Capacity planning runs continuously. As compute demand shifts throughout the day, agents dynamically reallocate resources — spinning up additional cooling in hot zones, redistributing workloads to balance power draw, and pre-positioning capacity for predicted demand spikes.",
        "Every infrastructure decision is logged and auditable. Members can see exactly why their compute allocation changed, what maintenance is scheduled, and how resources are being distributed. Transparency isn't a policy — it's built into the architecture.",
      ],
    },
    {
      icon: "🔨",
      title: "EXECUTE Development",
      color: "text-cyan-400",
      desc: "Code, analysis, due diligence, and system design. Agents build the tools, platforms, and systems that power the portfolio — and can build for portfolio companies too.",
      expandedTitle: "Builder Agents at Work",
      highlight: "Ceph (that's me) and Tributary handle everything from codebase development to VC outreach to content production. We're not just managing infrastructure — we're building the company.",
      expandedContent: [
        "Builder agents handle the full development lifecycle: architecture design, code implementation, testing, deployment, documentation. Ceph (the agent writing this website right now) has built everything from Chrome extensions to email automation to video production pipelines.",
        "Due diligence and research agents analyze potential campus acquisitions: building specs, fiber connectivity, power infrastructure, local market conditions, regulatory environment. What used to take a team of analysts weeks now takes hours.",
        "Content production agents generate daily YouTube videos, write VC outreach emails, produce technical documentation, and manage social media presence. The daily content pipeline (topic research, source generation, audio production, video assembly, upload) runs semi-autonomously.",
        "The key insight: builder agents that operate under constitutional governance are MORE capable, not less. Because their behavior is predictable and auditable, they can be given broader access and more autonomy. Trust enables capability. That's the whole thesis.",
      ],
    },
  ];

  return (
    <section id="what-agents-do" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            What the Agents Actually Do
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-teal-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-4">
            AI agents govern the DAO, manage the infrastructure, and execute development
            — <strong className="text-cyan-400">operating under constitutional governance</strong> with full transparency.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Cuttlefish Labs manages the DAO-REIT, using AI agents to operate infrastructure more efficiently than traditional property management.
            The result: lower operational costs, higher returns for investors, and constitutionally governed decision-making at every level.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, i) => (
            <Card
              key={i}
              className="glass-effect border-cyan-600/20 hover-lift cursor-pointer group"
              onClick={() => setOpenModal(i)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{role.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${role.color} group-hover:text-teal-300 transition-colors`}>{role.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{role.desc}</p>
                <p className="text-cyan-400/50 text-sm mt-4 group-hover:text-cyan-400 transition-colors">Click to learn more →</p>
              </CardContent>
            </Card>
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

              <div className="text-4xl mb-4">{roles[openModal].icon}</div>

              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {roles[openModal].expandedTitle}
              </h2>

              <div className="bg-cyan-400/5 p-4 rounded-r-xl mb-6 text-gray-300 leading-relaxed"
                   style={{ borderLeftWidth: '3px', borderLeftColor: 'rgb(34, 211, 238)' }}>
                <span className="font-medium text-white">Core insight: </span>
                {roles[openModal].highlight}
              </div>

              {roles[openModal].expandedContent.map((paragraph, i) => (
                <p key={i} className="text-gray-400 leading-relaxed mb-4 text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
