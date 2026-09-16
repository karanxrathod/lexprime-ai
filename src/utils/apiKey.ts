import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = "user_gemini_api_key";
const VALIDATION_MODEL = "gemini-3.6-flash";

export function getGeminiApiKey(): string | null {
  // 1. Try localStorage (User override preference)
  if (typeof window !== "undefined") {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) return storedKey;
  }

  // 2. Try .env
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  // Ignore placeholder value or empty string
  if (envKey && !envKey.startsWith("your_gemini_api_key") && envKey.trim() !== "") {
    return envKey;
  }

  return null;
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, key);
  }
}

export function removeGeminiApiKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function validateGeminiApiKey(key: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: VALIDATION_MODEL,
      contents: "Reply with OK",
    });
    return Boolean(response && response.text);
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
}
