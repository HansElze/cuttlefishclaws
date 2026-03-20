import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Server, Zap, Users, Clock, Shield } from "lucide-react";

// Mock data for the dashboard
const keyStats = [
  { label: "Total Compute Capacity", value: "2.4 PetaFLOPS", icon: Server },
  { label: "Active Agents", value: "847", icon: Users },
  { label: "Campuses Online", value: "1", subtitle: "7 in pipeline", icon: Activity },
  { label: "Inference Requests (24h)", value: "1.2M", icon: Zap },
  { label: "Network Uptime", value: "99.97%", icon: Clock },
  { label: "CAC Holders", value: "312 agents", icon: Shield },
];

const campuses = [
  {
    name: "Birmingham",
    status: "Active",
    utilization: 78,
    agentCount: 247,
    computeAllocation: "890 TFLOPs"
  },
  {
    name: "Detroit",
    status: "Pipeline",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Planned: 1.2 PFLOPs"
  },
  {
    name: "St. Louis",
    status: "Pipeline",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Planned: 850 TFLOPs"
  },
  {
    name: "Cleveland",
    status: "Target",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Target: 1.1 PFLOPs"
  },
  {
    name: "Memphis",
    status: "Target",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Target: 750 TFLOPs"
  },
  {
    name: "Pittsburgh",
    status: "Target",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Target: 950 TFLOPs"
  },
  {
    name: "Buffalo",
    status: "Target",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Target: 680 TFLOPs"
  },
  {
    name: "Kansas City",
    status: "Target",
    utilization: 0,
    agentCount: 0,
    computeAllocation: "Target: 820 TFLOPs"
  },
];

const cacTiers = [
  { tier: "Resident", count: 156, color: "bg-cyan-400" },
  { tier: "Builder", count: 89, color: "bg-blue-400" },
  { tier: "Sovereign", count: 52, color: "bg-purple-400" },
  { tier: "Anchor", count: 15, color: "bg-yellow-400" },
];

const governanceActivity = [
  {
    proposal: "Proposal #12: Expand Birmingham Phase 2 compute wing",
    status: "Passed",
    approval: "87%",
    timeLeft: null
  },
  {
    proposal: "Proposal #11: Onboard Grok-3 as secondary inference provider",
    status: "Active",
    approval: "74%",
    timeLeft: "3 days left"
  },
  {
    proposal: "Proposal #10: Constitutional Amendment - Article VIII ratification",
    status: "Passed",
    approval: "94%",
    timeLeft: null
  },
  {
    proposal: "Proposal #9: Increase compute allocation for research projects",
    status: "Passed",
    approval: "82%",
    timeLeft: null
  },
  {
    proposal: "Proposal #8: Deploy additional inference nodes in Birmingham",
    status: "Passed",
    approval: "91%",
    timeLeft: null
  },
];

const networkActivity = [
  {
    message: "Agent ceph-v2 completed 1,247 inference requests (Builder tier)",
    timestamp: "2 minutes ago"
  },
  {
    message: "New Sovereign CAC registered: agent-nexus-7",
    timestamp: "5 minutes ago"
  },
  {
    message: "Birmingham campus: 78% compute utilization",
    timestamp: "8 minutes ago"
  },
  {
    message: "Constitutional validator: 312 agents verified compliant",
    timestamp: "12 minutes ago"
  },
  {
    message: "Agent fleet-omega processed 3,892 compute tasks",
    timestamp: "15 minutes ago"
  },
  {
    message: "Network health check: All systems operational",
    timestamp: "18 minutes ago"
  },
  {
    message: "CAC tier promotion: agent-delta-9 elevated to Builder",
    timestamp: "22 minutes ago"
  },
  {
    message: "Inference throughput: 150% of baseline performance",
    timestamp: "25 minutes ago"
  },
];

function HeroBanner() {
  return (
    <section className="hero-section py-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Network Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Real-time visibility into the health and activity of the Cuttlefish compute network.
          Monitor campus operations, agent performance, and network governance.
        </p>
      </div>
    </section>
  );
}

function KeyStatsCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Network Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {keyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="glass-effect hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.label}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-cyan-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-400">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CampusStatusGrid() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Pipeline":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      case "Target":
        return <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-700">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Campus Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campuses.map((campus, index) => (
            <Card key={index} className="glass-effect hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-cyan-400">{campus.name}</CardTitle>
                  {getStatusBadge(campus.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Utilization</span>
                      <span className="text-cyan-400">{campus.utilization}%</span>
                    </div>
                    <Progress value={campus.utilization} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Agents</span>
                    <span className="text-gray-300">{campus.agentCount}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Compute: </span>
                    <span className="text-gray-300">{campus.computeAllocation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CacTierDistribution() {
  const totalAgents = cacTiers.reduce((sum, tier) => sum + tier.count, 0);
  const [animated, setAnimated] = useState(false);
  const [counts, setCounts] = useState(cacTiers.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          // Animate counts
          const duration = 1500;
          const steps = 40;
          const interval = duration / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(cacTiers.map(t => Math.round(t.count * eased)));
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section className="py-16 px-4" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">CAC Tier Distribution</h2>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Agent Distribution by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cacTiers.map((tier, index) => {
                const percentage = (tier.count / totalAgents) * 100;
                const displayCount = counts[index];
                const displayPct = ((displayCount / totalAgents) * 100).toFixed(1);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{tier.tier}</span>
                      <span className="text-cyan-400">{displayCount} agents ({displayPct}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`${tier.color} h-3 rounded-full animate-glow`}
                        style={{
                          width: animated ? `${percentage}%` : '0%',
                          transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function GovernanceActivity() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Passed":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Active":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Recent Governance Activity</h2>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Proposals & Voting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {governanceActivity.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-700 rounded-lg hover:border-cyan-400/50 transition-colors">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p className="text-gray-300 font-medium mb-1">{item.proposal}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-cyan-400">{item.approval} approval</span>
                      {item.timeLeft && (
                        <span className="text-yellow-400">• {item.timeLeft}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function NetworkActivityFeed() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Network Activity Feed</h2>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Live Network Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {networkActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border-l-2 border-cyan-400/30 hover:border-cyan-400 transition-colors">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ComputeUtilization() {
  const activeCampuses = campuses.filter(campus => campus.status === "Active");
  const pipelineCampuses = campuses.filter(campus => campus.status === "Pipeline");

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Compute Utilization</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Campuses */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-cyan-400">Active Campuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCampuses.map((campus, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{campus.name}</span>
                      <span className="text-cyan-400">{campus.utilization}%</span>
                    </div>
                    <Progress value={campus.utilization} className="h-3" />
                    <p className="text-sm text-gray-400">{campus.computeAllocation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Campuses */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400">Pipeline Campuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineCampuses.map((campus, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{campus.name}</span>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">Coming Soon</Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-yellow-400/30 h-3 rounded-full w-full animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-400">{campus.computeAllocation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <HeroBanner />
      <KeyStatsCards />
      <CampusStatusGrid />
      <CacTierDistribution />
      <GovernanceActivity />
      <NetworkActivityFeed />
      <ComputeUtilization />
      <Footer />
    </div>
  );
}