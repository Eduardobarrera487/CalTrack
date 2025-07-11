import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: "AIzaSyAhwDQ_sibrzuIEbTS_EztqDmR6_JXRdbg" });

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