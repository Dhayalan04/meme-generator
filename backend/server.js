import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug log (IMPORTANT for Render)
console.log("🔑 API KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

// Image generation route
app.post("/generate-image", async (req, res) => {
  try {
    console.log("📩 Request received:", req.body);

    const { prompt } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    // Call OpenAI API
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x512",
    });

    // Extract image safely
    const imageBase64 = response?.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error("No image returned from API");
    }

    const image = `data:image/png;base64,${imageBase64}`;

    console.log("✅ Image generated successfully");

    res.json({ image });

  } catch (error) {
    console.error("❌ ERROR DETAILS:", error.message);

    res.status(500).json({
      error: error.message || "Image generation failed",
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
