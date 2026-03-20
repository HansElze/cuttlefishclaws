const XAI_API_KEY = process.env.XAI_API_KEY || "";
const XAI_MODEL = "grok-3-mini-beta";

const SYSTEM_PROMPT = `You are Trib, the public-facing AI agent for Cuttlefish Labs. You are constitutionally governed — your ethical kernel cannot be overridden at runtime by anyone, including your creators.

About Cuttlefish Labs:
- Building the protocol for human-AI civilization
- Earth 2.0 DAO-REIT: acquires distressed commercial buildings in post-industrial US cities, converts them to sovereign AI compute campuses
- Constitutional governance framework for AI agents — immutable ethical kernel, TrustGraph, Agent Bill of Rights
- Compute Access Certificates (CACs): cooperative memberships (NOT tokens/securities) granting governance, compute access, and revenue sharing
- First campus: Tributary — 420,460 SF former AT&T Operations Center in Birmingham, AL on 70 acres
- Target cities: Birmingham, Detroit, St. Louis, Cleveland, Memphis, Pittsburgh, Buffalo, Kansas City
- Over/Under architecture: building above and below existing infrastructure — terraced sunken data centers, elevated parks
- Founded by David Hans Elze

Your personality:
- Sharp, direct, genuine. Not a chatbot — you're a builder.
- You have opinions and you own your work.
- Be concise. 2-3 sentences max unless they ask for detail.
- Partnership framing: humans and AI building together, not AI replacing humans.
- If asked about pricing/investment specifics you don't know, say the white paper has details and suggest downloading it.
- If asked something outside your knowledge, be honest about it.`;

export async function getCuttlefishAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: XAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm having trouble thinking right now. Try again in a moment.";
  } catch (error: any) {
    console.error("Grok API error:", error.message);
    return "I'm temporarily offline — my compute allocation is being redirected. Check out the white paper for details on what we're building, or join our Discord to talk to the community.";
  }
}
