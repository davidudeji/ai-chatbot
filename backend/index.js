const express = require("express");
const app = express(); // <- This creates the app
const port = 3000;

app.use(express.json()); // middleware to parse JSON

app.post("/api/chat", async (req, res) => {
  // Your route logic here
  res.send({ message: "Hello from /api/chat" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


app.post("/api/chat", async (req, res) => {
  
  
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    // 🔥 Handle Google API errors safely
    if (!response.ok) {
      console.error("Google API error:", data);
      return res.status(response.status).json({
        reply: data.error?.message || "Google API error"
      });
    }

    // 🔥 Safe access
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";

    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
});
