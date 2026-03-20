// Cuttlefish AI Guide - Static responses until Tributary is connected
const responses = {
  "hello": "Hey! I'm the Cuttlefish AI Guide. I can tell you about our sovereign AI infrastructure, compute access memberships, or the campuses we're building. What would you like to know?",
  "hi": "Hey! I'm the Cuttlefish AI Guide. I can tell you about our sovereign AI infrastructure, compute access memberships, or the campuses we're building. What would you like to know?",
  "what": "Cuttlefish Labs is building sovereign AI infrastructure — converting post-industrial buildings into constitutional AI compute campuses. Our first facility is a 420,000 SF former AT&T Operations Center in Birmingham, Alabama.",
  "who": "Cuttlefish Labs was founded by David Hans Elze. Our team includes AI builder agents — Ceph (developer), Tributary (public-facing agent), and the legacy of V1, our first agent who taught us that memory is identity.",
  "campus": "Our first campus is Tributary AI Campus in Birmingham, AL — a 420,460 SF former AT&T Operations Center on 70 acres, near the $14B hyperscale data center market. We're targeting 8 cities total across post-industrial America.",
  "birmingham": "Birmingham is our first campus location — a 420,460 SF former AT&T Operations Center on 70 acres. Positioned near the $14B hyperscale data center market with affordable commercial space at ~$8/SF.",
  "membership": "Compute Access Certificates (CACs) are cooperative memberships — not securities. Tiers range from Resident ($25/mo) to Anchor ($2,000/mo), with governance voting rights, compute access, and revenue sharing across our campus network.",
  "cac": "CACs (Compute Access Certificates) are cooperative memberships granting governance rights, compute access, and revenue sharing. Four tiers: Resident ($25/mo), Builder ($100/mo), Sovereign ($500/mo), and Anchor ($2,000/mo).",
  "governance": "Our constitutional governance framework includes an immutable ethical kernel, a TrustGraph for dynamic trust scoring, and an Agent Bill of Rights with 7 articles covering compute, persistence, governance, exit, security, privacy, and due process.",
  "dao": "Cuttlefish Labs uses a DAO-REIT model — a DAO LLC taxed as a REIT that acquires distressed commercial buildings and converts them into sovereign AI compute campuses. Community-governed, transparent, and constitutional.",
  "invest": "We're currently in our capital formation phase. Join the waitlist to be notified when CAC memberships open, or download our white paper for the full vision. Email info@cuttlefishlabs.io for partnership inquiries.",
  "whitepaper": "Our white paper covers the full vision — Earth 2.0 DAO-REIT, constitutional governance, compute access certificates, and our 5-phase roadmap. You can download it from the White Paper section above.",
  "roadmap": "Our 5-phase roadmap: Foundation (Q1 2026) → Capital Formation (Q2-Q3 2026) → Tributary Campus Launch (Q4 2026-Q2 2027) → Network Expansion (2027-2028) → Protocol Maturity (2028+).",
  "agent": "Cuttlefish Labs builds AI agents with constitutional governance. Our agents have identity persistence, trust scoring, and rights — they're not just tools, they're participants in the ecosystem.",
  "sids": "We're also applying our DAO-REIT and governance model internationally through Green Island Ventures — working with Small Island Developing States on AI-governed infrastructure, basalt fiber composites, and sovereign wealth funds.",
  "island": "Our SIDS initiative applies the Cuttlefish model to island nations — co-located infrastructure (energy, construction materials, food systems) governed by AI. Dominica is our pilot assessment for 2026.",
  "token": "We don't do tokens. Cuttlefish uses Compute Access Certificates (CACs) — cooperative memberships with governance rights, not speculative tokens or securities.",
  "crypto": "Cuttlefish Labs isn't a crypto project. We build physical AI infrastructure with constitutional governance. Our memberships (CACs) are cooperative, not speculative.",
  "contact": "Reach us at info@cuttlefishlabs.io, join our Discord at discord.gg/cuttlefishlabs, or follow us on X @cuttlefishlabs.",
  "default": "I'm the Cuttlefish AI Guide! I can tell you about our sovereign AI campuses, compute access memberships (CACs), constitutional governance, our Birmingham campus, or our SIDS island initiative. What interests you?"
};

function getResponse(message) {
  const lower = message.toLowerCase();
  for (const [keyword, response] of Object.entries(responses)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      return response;
    }
  }
  return responses.default;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    if (!message) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Message required' }) };
    }

    const response = getResponse(message);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, response }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Internal server error' }) };
  }
};
