import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: "AIzaSyBve-Vr9yzKbK9_nhNU-P6RFZF38qXnZzk" });

async function AIConnection(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
  });

  return response.text
    ? response.text
    : "No response text available. Please check the API key and model configuration.";
  
}

export default AIConnection;