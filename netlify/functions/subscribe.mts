import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const { name, email, interests } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers,
      });
    }

    const store = getStore("subscriptions");

    // Use email as key for dedup
    const existing = await store.get(email);
    if (existing) {
      // Update interests if re-subscribing
      const data = JSON.parse(existing);
      const merged = {
        ...data,
        interests: [...new Set([...(data.interests || []), ...(interests || [])])],
        updatedAt: new Date().toISOString(),
      };
      await store.set(email, JSON.stringify(merged));
      return new Response(JSON.stringify({ success: true, message: "Updated" }), {
        status: 200,
        headers,
      });
    }

    const subscription = {
      name: name || "",
      email,
      interests: interests || ["waitlist"],
      createdAt: new Date().toISOString(),
    };

    await store.set(email, JSON.stringify(subscription));

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers,
    });
  }
};
