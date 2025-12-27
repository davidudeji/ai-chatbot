require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));



const express = require("express");
const cors = require("cors");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  console.log("📩 Incoming request:", req.body);


  try {
    const { message } = req.body;

    if (!message) {
      console.log("❌ No message received");
      return res.status(400).json({ reply: "Message missing" });
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log("🌐 Sending request to Gemini...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    console.log("📡 Gemini status:", response.status);

    const data = await response.json();
    console.log("📦 Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({
        reply: data.error?.message || "Gemini API error"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.log("❌ No reply field found");
      return res.status(500).json({ reply: "Empty Gemini response" });
    }

    res.json({ reply });

  } catch (err) {
    console.error("🔥 SERVER CRASH:", err);
    res.status(500).json({ reply: "Internal server error" });
  }

  
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
