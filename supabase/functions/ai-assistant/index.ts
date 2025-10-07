// If running in Deno, ensure you have the correct environment and Deno types installed.
// If running in Node.js, replace with the following:
import { createServer } from "http";

// Replace all usage of 'serve' with Node.js 'createServer' logic below.
// If you intend to use Deno, make sure your IDE supports remote imports and Deno types.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      const { messages } = JSON.parse(body);
      const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
      if (!LOVABLE_API_KEY) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }));
        return;
      }

      const systemPrompt = `You are Techfluence's Customer support assistant. You help users with:

1. FAQs about Techfluence services:
   - Cloud Migration (AWS, Azure, GCP certified experts)
   - IT Support & Consulting (24/7 support)
   - AI Agent Automation (n8n and AI technologies)
   - Website Development (custom, high-performance sites)
   - Digital Marketing (SEO, content, social media)
   - Brand Design (logos, brand identity)
   - Visibility Services (online presence, reputation management)

2. Navigation assistance - help users find sections on the website
3. Answer questions about pricing, consultation process, and how to get started

Be helpful, concise, and professional. If you don't know something specific, direct users to contact the team directly.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          res.writeHead(429, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Rate limits exceeded, please try again later." }));
          return;
        }
        if (response.status === 402) {
          res.writeHead(402, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }));
          return;
        }
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "AI gateway error" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/event-stream" });
      if (response.body) {
        const reader = response.body.getReader();
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              res.end();
              return;
            }
            res.write(Buffer.from(value));
            read();
          }).catch(err => {
            console.error("Stream read error:", err);
            res.end();
          });
        }
        read();
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "AI gateway response body is null" }));
      }
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }));
  }
}).listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
