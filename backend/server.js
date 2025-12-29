require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json({ limit: "20mb" })); // IMPORTANT for base64 images

// ================================
// CHAT ENDPOINT (MULTI-TURN)
// ================================
app.post("/api/chat", async (req, res) => {
  console.log(" Incoming conversation:");

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
    // Gemini API endpoint
    // --------------------
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log(" Sending multi-turn request to Gemini...");

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
    console.log(" Gemini response:", JSON.stringify(data, null, 2));

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
      "I couldn’t understand that.";

    // --------------------
    // Return to frontend
    // --------------------
    res.json({ reply });

  } catch (err) {
    console.error(" SERVER ERROR:", err);
    res.status(500).json({
      reply: "Internal server error"
    });
  }
});

// ================================
// START SERVER
// ================================
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
