// Chat through a Cuttlefish Claw instance (Tributary)
// The agent runs the full constitutional stack: ethical kernel, TrustGraph, 
// Observational Memory, Daydream engine — this isn't a wrapper, it's the real thing.

const CLAW_ENDPOINT = import.meta.env.VITE_CLAW_ENDPOINT || "/v1/chat/completions";
const CLAW_TOKEN = import.meta.env.VITE_CLAW_TOKEN || "test123";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const conversationHistory: ChatMessage[] = [];

export async function sendChatMessage(message: string): Promise<string> {
  conversationHistory.push({ role: "user", content: message });

  // Keep last 10 exchanges to manage context
  const recentMessages = conversationHistory.slice(-20);

  try {
    const response = await fetch(CLAW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLAW_TOKEN}`,
      },
      body: JSON.stringify({
        model: "tributary",
        messages: recentMessages,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble right now. Try again in a moment.";
    
    conversationHistory.push({ role: "assistant", content: reply });
    return reply;
  } catch (error) {
    console.error("Claw chat error:", error);
    return "I'm temporarily offline — my gateway is restarting. Check out the white paper for details on what we're building, or join our Discord.";
  }
}
