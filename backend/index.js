const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  // 🔐 API key safely stored here
  const API_KEY = "AIzaSyBHxmnvJM5Iae7vQ6HxyZ1T6uglJcwcO1o";
  const API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
