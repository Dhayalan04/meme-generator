import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// image generation route
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "512x512",
    });

    const image = response.data[0].url;

    res.json({ image });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
