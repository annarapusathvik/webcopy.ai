
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST."
    });
  }

  try {
    const { business } = req.body || {};

    if (!business?.name?.trim() ||
        !business?.description?.trim()) {
      return res.status(400).json({
        error: "Business name and description are required."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are a professional website copywriter and SEO specialist.

Create original website content for this business:
Business name: ${business.name}
Industry: ${business.industry || "Not specified"}
Description: ${business.description}
Services: ${business.services || "Not specified"}
Target audience: ${business.audience || "Not specified"}
Brand tone: ${business.tone || "Professional"}
Language: ${business.language || "English"}

Return valid JSON only, with exactly these five string properties:
{
  "Home": "A headline, subheading, and call to action",
  "About": "Business purpose and approach",
  "Services": "Clear service descriptions and customer benefits",
  "FAQs": "At least four useful questions and answers",
  "SEO metadata": "Page title, meta description, and relevant keywords"
}

Make the content specific, natural, persuasive, and useful.
Do not invent facts, awards, prices, or guarantees.
Write all content in the requested language and tone.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const content = JSON.parse(response.text);

    const required = [
      "Home",
      "About",
      "Services",
      "FAQs",
      "SEO metadata"
    ];

    for (const key of required) {
      if (typeof content[key] !== "string") {
        throw new Error(`Invalid AI output: missing ${key}`);
      }
    }

    return res.status(200).json({ content });

  } catch (error) {
    console.error("Generation error:", error);

    return res.status(500).json({
      error: "Content generation failed. Check the Vercel function logs and AI configuration."
    });
  }
}
