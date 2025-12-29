require("dotenv").config();

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" })); // IMPORTANT for images

app.post("/api/chat", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  try {
    const { message, file } = req.body;

    if (!message && !file?.data) {
      return res.status(400).json({ reply: "Message or image required" });
    }

    // Build Gemini Vision parts
    const parts = [];

    // 1Text input
    if (message) {
      parts.push({ text: message });
    }

    // 2️⃣ Image input (Vision)
    if (file?.data && file?.mime_type) {
      parts.push({
        inline_data: {
          mime_type: file.mime_type,
          data: file.data,
        },
      });
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    console.log(" Sending request to Gemini Vision...");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(" Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({
        reply: data.error?.message || "Gemini API error",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn’t understand that.";

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
