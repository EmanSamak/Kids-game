import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, Continent } from "../types";

const apiKey = process.env.API_KEY || "";

// Define the response schema strictly
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      countryName: {
        type: Type.STRING,
        description: "The name of the country in Danish language.",
      },
      correctCode: {
        type: Type.STRING,
        description: "The 2-letter ISO 3166-1 alpha-2 country code (lowercase).",
      },
      wrongCodes: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of 3 distinct 2-letter ISO country codes (lowercase) that are NOT the correct country. These serve as distractors.",
      },
    },
    required: ["countryName", "correctCode", "wrongCodes"],
  },
};

export const generateQuizQuestions = async (continent: Continent): Promise<QuizQuestion[]> => {
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please provide a valid API key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate a quiz with exactly 10 questions for children (ages 7-10) about flags of countries in ${continent}.
    The countries should be well-known or distinct for that region.
    Ensure the 'countryName' is correctly translated into Danish.
    Ensure the 'correctCode' is the correct ISO 2-letter code for that country.
    Ensure 'wrongCodes' contains 3 other random valid country codes (preferably from the same continent or clearly different flags).
    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7, // Slightly creative but accurate
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    const data = JSON.parse(text) as QuizQuestion[];
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic could go here, but for this exercise, we bubble the error
    throw error;
  }
};