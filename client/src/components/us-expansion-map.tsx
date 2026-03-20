import { useState, useCallback } from "react";
import { US_STATES } from "./us-states-paths";

interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  status: "active" | "planned";
  description: string;
}

const CITIES: CityData[] = [
  {
    id: "birmingham",
    name: "Birmingham",
    state: "AL",
    lat: 33.5207,
    lng: -86.8025,
    status: "active",
    description:
      "Tributary AI Campus — 420,460 SF former AT&T Operations Center. First physical node of the Cuttlefish Network.",
  },
  {
    id: "detroit",
    name: "Detroit",
    state: "MI",
    lat: 42.3314,
    lng: -83.0458,
    status: "planned",
    description:
      "Post-industrial revival — sovereign compute in America's comeback city.",
  },
  {
    id: "stlouis",
    name: "St. Louis",
    state: "MO",
    lat: 38.627,
    lng: -90.1994,
    status: "planned",
    description: "Gateway to the heartland compute corridor.",
  },
  {
    id: "cleveland",
    name: "Cleveland",
    state: "OH",
    lat: 41.4993,
    lng: -81.6944,
    status: "planned",
    description:
      "Rust belt to compute belt — affordable infrastructure, strong grid access.",
  },
  {
    id: "memphis",
    name: "Memphis",
    state: "TN",
    lat: 35.1495,
    lng: -90.049,
    status: "planned",
    description:
      "Logistics hub meets AI infrastructure — strategic southern node.",
  },
  {
    id: "pittsburgh",
    name: "Pittsburgh",
    state: "PA",
    lat: 40.4406,
    lng: -79.9959,
    status: "planned",
    description:
      "Carnegie Mellon pipeline — AI talent meets sovereign compute.",
  },
  {
    id: "buffalo",
    name: "Buffalo",
    state: "NY",
    lat: 42.8864,
    lng: -78.8784,
    status: "planned",
    description:
      "Niagara power advantage — cheap clean energy for AI operations.",
  },
  {
    id: "kansascity",
    name: "Kansas City",
    state: "MO",
    lat: 39.0997,
    lng: -94.5786,
    status: "planned",
    description:
      "Central US backbone — low-latency nationwide connectivity.",
  },
];

// Albers Equal Area projection for continental US
function project(lat: number, lng: number): [number, number] {
  const lng0 = -96;
  const lat0 = 38.5;
  const phi = (lat * Math.PI) / 180;
  const lam = (lng * Math.PI) / 180;
  const phi0 = (lat0 * Math.PI) / 180;
  const lam0 = (lng0 * Math.PI) / 180;
  const phi1 = (29.5 * Math.PI) / 180;
  const phi2 = (45.5 * Math.PI) / 180;
  const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
  const c = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
  const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;
  const rho = Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
  const theta = n * (lam - lam0);
  const x = rho * Math.sin(theta);
  const y = rho0 - rho * Math.cos(theta);
  const scale = 1050;
  const tx = 450;
  const ty = 260;
  return [x * scale + tx, -y * scale + ty];
}

export default function USExpansionMap() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const handleCityClick = useCallback(
    (city: CityData) => {
      setSelectedCity(selectedCity?.id === city.id ? null : city);
    },
    [selectedCity]
  );

  const birmingham = CITIES.find((c) => c.id === "birmingham")!;
  const [bhX, bhY] = project(birmingham.lat, birmingham.lng);

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#06b6d4]">
            Cuttlefish Labs
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Sovereign Compute Network
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            DAO-REIT campus expansion across the United States
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06b6d4] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#06b6d4]" />
            </span>
            <span className="text-sm text-gray-300">Active (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#14b8a6]" />
            <span className="text-sm text-gray-300">Planned (7)</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        className="relative overflow-hidden rounded-lg border border-white/10"
        style={{ backgroundColor: "#0a1628" }}
        onClick={() => setSelectedCity(null)}
      >
        <svg
          viewBox="0 0 900 560"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow-active" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="#06b6d4" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-planned" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#14b8a6" floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="pulse-grad">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* State boundaries */}
          {US_STATES.map((state) => (
            <path
              key={state.id}
              d={state.d}
              fill="rgba(10, 30, 60, 0.5)"
              stroke="rgba(148, 180, 200, 0.15)"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          ))}

          {/* Hub-and-spoke connection lines from Birmingham */}
          {CITIES.filter((c) => c.status === "planned").map((city) => {
            const [cx, cy] = project(city.lat, city.lng);
            const isHighlighted =
              hoveredCity === city.id || selectedCity?.id === city.id;
            return (
              <line
                key={`line-${city.id}`}
                x1={bhX}
                y1={bhY}
                x2={cx}
                y2={cy}
                stroke={
                  isHighlighted
                    ? "rgba(6, 182, 212, 0.5)"
                    : "rgba(6, 182, 212, 0.15)"
                }
                strokeWidth={isHighlighted ? "1.5" : "1"}
                strokeDasharray="6 4"
                style={{
                  transition: "all 0.4s ease",
                }}
              />
            );
          })}

          {/* City markers */}
          {CITIES.map((city) => {
            const [cx, cy] = project(city.lat, city.lng);
            const isActive = city.status === "active";
            const isHovered = hoveredCity === city.id;
            const isSelected = selectedCity?.id === city.id;

            return (
              <g
                key={city.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCityClick(city);
                }}
                onMouseEnter={() => setHoveredCity(city.id)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Active pulse rings */}
                {isActive && (
                  <>
                    <circle cx={cx} cy={cy} r="20" fill="url(#pulse-grad)">
                      <animate
                        attributeName="r"
                        values="12;24;12"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0.1;0.6"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx={cx} cy={cy} r="14" fill="url(#pulse-grad)">
                      <animate
                        attributeName="r"
                        values="8;18;8"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.2;0.8"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* Outer ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 10 : isHovered || isSelected ? 8 : 6}
                  fill={
                    isActive
                      ? "rgba(6, 182, 212, 0.15)"
                      : "rgba(20, 184, 166, 0.1)"
                  }
                  stroke={isActive ? "#06b6d4" : "#14b8a6"}
                  strokeWidth={isActive ? 1.5 : 1}
                  filter={
                    isActive ? "url(#glow-active)" : "url(#glow-planned)"
                  }
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* Inner dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 4 : 3}
                  fill={isActive ? "#06b6d4" : "#14b8a6"}
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* White core */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 1.5 : 1}
                  fill="white"
                  opacity="0.8"
                />

                {/* City label */}
                <text
                  x={cx + (isActive ? 16 : 12)}
                  y={cy + 4}
                  fill={
                    isActive || isHovered || isSelected
                      ? "#e2e8f0"
                      : "rgba(148, 180, 200, 0.7)"
                  }
                  fontSize={isActive ? "13" : "11"}
                  fontWeight={isActive ? "700" : "500"}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  className="pointer-events-none select-none"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {isActive
                    ? city.name.toUpperCase()
                    : `${city.name}, ${city.state}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Card */}
      {selectedCity && (
        <div
          className="mt-4 rounded-lg border border-white/10 p-5"
          style={{ backgroundColor: "#0d1f35" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {selectedCity.name}, {selectedCity.state}
                </h3>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor:
                      selectedCity.status === "active"
                        ? "rgba(6, 182, 212, 0.15)"
                        : "rgba(20, 184, 166, 0.15)",
                    color:
                      selectedCity.status === "active"
                        ? "#06b6d4"
                        : "#14b8a6",
                  }}
                >
                  {selectedCity.status === "active" ? "Active" : "Planned"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {selectedCity.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedCity(null)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
