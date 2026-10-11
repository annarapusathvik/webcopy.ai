import express from "express";
import cors from "cors";
import {GoogleGenAI}from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
setInterval(() => {}, 1000);
const PORT = 3001;

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.json({ message: "WebCopy AI server is running!" });
});

app.post("/api/generate", async (req, res) => {
try {
const { business } = req.body;

if (!business?.name?.trim() || !business?.description?.trim()) {
  return res.status(400).json({
    error: "Business name and description are required.",
  });
}

const prompt = `


You are a professional website copywriter and SEO specialist.
QUALITY RULES:
- Write polished, persuasive, natural-sounding copy.
- Make every section specific to the business and its target audience.
- Explain customer benefits, not just features.
- Use clear headings, short paragraphs, and calls to action.
- Avoid generic filler, repetition, and clichés.
- Never invent awards, statistics, prices, certifications, guarantees, or company history.
- Home :Write a benefit-focused headline of 6-12 words, a clear subheading explaining the main
customer benefit, and welcoming paragraph of 2-3 sentences.include a natural call a action.
Use the business name naturally,avoid repetitive wording, and mention only products,sevices,
and benefits supported by the generic openings such as "welcome to..." or invent clints about
freshness,health benefits,prices,delevery speed, or products quality unless the business 
information support them.
- About: explain the business purpose and approach without inventing history.
- Services: explain each service and its practical customer benefit.
- FAQs: provide at least four useful questions with clear, specific answers.
- SEO metadata: create a concise page title, a compelling meta description, and relevant keywords without keyword stuffing.
- Follow the requested language and tone.
- Return valid JSON only, with exactly the five requested properties. Every property value must be a string.
-
Create original website content using this business information:
Business name: ${business.name}
Industry: ${business.industry || "Not specified"}
Description: ${business.description}
Services: ${business.services || "Not specified"}
Target audience: ${business.audience || "Not specified"}
Tone: ${business.tone || "Professional"}
Language: ${business.language || "English"}

Return valid JSON only, with exactly these five string properties:
{
"Home": "Homepage headline, subheading and call to action",
"About": "About page copy",
"Services": "Clear service descriptions",
"FAQs": "At least four useful question-and-answer pairs",
"SEO metadata": "SEO title, meta description and suggested keywords"
}

Make the writing specific to this business, useful to its audience,
natural, original and free of unsupported claims.
`;

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
  },
});

const content = JSON.parse(response.text);

return res.json({ content });

} catch (error) {
console.error("Generation error:", error);


return res.status(500).json({
  error:error.message || "AI generation failed. Check the server terminal and API configuration.",
});

}
});

app.listen(PORT, () => {
  console.log("WebCopy AI server running at http://localhost:"+ PORT);
});  
