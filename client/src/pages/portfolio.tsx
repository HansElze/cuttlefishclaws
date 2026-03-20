import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import MapSection from "@/components/map-section";

interface CampusProject {
  id: string;
  name: string;
  location: string;
  status: "active" | "target";
  category: string;
  details: string;
  stats: string;
  keyMetrics: string[];
  image?: string;
}

const campusProjects: CampusProject[] = [
  {
    id: "birmingham",
    name: "Tributary AI Campus",
    location: "Birmingham, AL",
    status: "active",
    category: "AI Infrastructure",
    details: "420,460 SF former AT&T Operations Center on 70 acres. First Cuttlefish facility, near $14B hyperscale data center market.",
    stats: "Phase: Active Development",
    keyMetrics: ["500-2,000 agent capacity", "420K SF", "70 acres"],
  },
  {
    id: "detroit",
    name: "Detroit Industrial Hub",
    location: "Detroit, MI",
    status: "target",
    category: "Post-Industrial",
    details: "Massive post-industrial inventory. Affordable commercial space with strong fiber infrastructure and proximity to Canadian border.",
    stats: "Phase: Target Market",
    keyMetrics: ["$5-12/SF avg cost", "Fiber ready", "Canadian proximity"],
  },
  {
    id: "stlouis",
    name: "Central US Hub",
    location: "St. Louis, MO",
    status: "target",
    category: "Logistics",
    details: "Central US hub with abundant warehouse and industrial space. Strong university research corridor and low cost of living.",
    stats: "Phase: Target Market",
    keyMetrics: ["Central connectivity", "University corridor", "Low COL"],
  },
  {
    id: "cleveland",
    name: "Great Lakes Research",
    location: "Cleveland, OH",
    status: "target",
    category: "Research",
    details: "Great Lakes region with undervalued commercial real estate. Healthcare and research ecosystem provides talent pipeline.",
    stats: "Phase: Target Market",
    keyMetrics: ["Research corridor", "Healthcare hub", "Talent pipeline"],
  },
  {
    id: "memphis",
    name: "Logistics Capital",
    location: "Memphis, TN",
    status: "target",
    category: "Logistics",
    details: "Logistics hub of the US. FedEx headquarters city with massive warehouse infrastructure ready for conversion.",
    stats: "Phase: Target Market",
    keyMetrics: ["FedEx hub", "Warehouse ready", "Conversion ready"],
  },
  {
    id: "pittsburgh",
    name: "AI Talent Hub",
    location: "Pittsburgh, PA",
    status: "target",
    category: "AI Infrastructure",
    details: "AI and robotics talent from CMU and University of Pittsburgh. Post-steel industrial buildings available at scale.",
    stats: "Phase: Target Market",
    keyMetrics: ["CMU partnership", "AI talent", "Industrial scale"],
  },
  {
    id: "buffalo",
    name: "Clean Energy Campus",
    location: "Buffalo, NY",
    status: "target",
    category: "Energy",
    details: "Cheap hydroelectric power from Niagara Falls. Cold climate ideal for data center cooling. Major revitalization underway.",
    stats: "Phase: Target Market",
    keyMetrics: ["Cheap clean energy", "Natural cooling", "Revitalization"],
  },
  {
    id: "kansascity",
    name: "Connectivity Hub",
    location: "Kansas City, MO",
    status: "target",
    category: "Connectivity",
    details: "Google Fiber city with strong connectivity. Central location minimizes latency across the US. Growing tech scene.",
    stats: "Phase: Target Market",
    keyMetrics: ["Google Fiber", "Low latency", "Tech growth"],
  },
];

const categories = ["All", "AI Infrastructure", "Post-Industrial", "Logistics", "Research", "Energy", "Connectivity"];

function PortfolioHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Our Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Sovereign AI campuses across post-industrial America, converting undervalued infrastructure 
          into the backbone of distributed intelligence.
        </p>
      </div>
    </section>
  );
}

function PortfolioGrid({ projects, selectedCategory }: { projects: CampusProject[], selectedCategory: string }) {
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group"
        >
          <div className="p-6">
            {/* Status badge and category */}
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {project.status === 'active' ? '🦑 Active' : '📍 Target'}
              </span>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-md border border-cyan-500/30">
                {project.category}
              </span>
            </div>

            {/* Project info */}
            <h3 className="text-xl font-bold mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-400 text-sm mb-3">{project.location}</p>
            
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {project.details}
            </p>

            {/* Key metrics */}
            <div className="space-y-2 mb-4">
              {project.keyMetrics.map((metric, index) => (
                <div key={index} className="flex items-center text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                  {metric}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs font-semibold text-teal-400">{project.stats}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="bg-[#0a0a23] text-white font-['Inter'] min-h-screen">
      <Navigation />
      <PortfolioHero />
      
      <section className="py-20 px-4 max-w-7xl mx-auto">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-cyan-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <PortfolioGrid projects={campusProjects} selectedCategory={selectedCategory} />

        {/* Summary stats */}
        <div className="mt-20 glass-effect rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-6 gradient-text">Network Overview</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">8</div>
              <div className="text-gray-300">Total Markets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">1</div>
              <div className="text-gray-300">Active Campus</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">7</div>
              <div className="text-gray-300">Target Markets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">420K+</div>
              <div className="text-gray-300">Total Sq Ft</div>
            </div>
          </div>
        </div>
      </section>

      <MapSection />
      <Footer />
    </div>
  );
}