import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});


async function getAIResponse(prompt: string){
const interaction = await ai.interactions.create({
  model: "gemini-3.5-flash",
  input: prompt,
});
  return interaction.output_text
}

export default getAIResponse;