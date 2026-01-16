require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ================================
// SERVERLESS FUNCTION FOR VERCEL
// ================================
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  console.log("Incoming conversation:");

  try {
    const { contents } = req.body;

    // --------------------
    // Validate input
    // --------------------
    if (!Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({
        reply: "Conversation history is required."
      });
    }

    // --------------------
    // Check API key
    // --------------------
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return res.status(500).json({
        reply: "Server configuration error: API key not set"
      });
    }

    // --------------------
    // Gemini API endpoint
    // --------------------
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("Sending multi-turn request to Gemini...");

    // --------------------
    // Send FULL conversation
    // --------------------
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents
      })
    });

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    // --------------------
    // Handle Gemini errors
    // --------------------
    if (!response.ok) {
      return res.status(response.status).json({
        reply: data.error?.message || "Gemini API error"
      });
    }

    // --------------------
    // Extract assistant reply
    // --------------------
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't understand that.";

    // --------------------
    // Return to frontend
    // --------------------
    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      reply: "Internal server error"
    });
  }
}
