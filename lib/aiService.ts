import { GoogleGenerativeAI } from "@google/generative-ai";
import fallbackQuestions from './fallbackQuestions';
import { Question } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Cache object to store generated questions
const questionCache: { [key: string]: Question[] } = {};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  backoff = 1000,
  maxBackoff = 10000
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      const nextBackoff = Math.min(backoff * 2, maxBackoff);
      console.log(`Retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return retryWithBackoff(operation, retries - 1, nextBackoff, maxBackoff);
    } else {
      throw error;
    }
  }
}

async function generateQuestionsWithGemini(difficulty: string): Promise<Question[]> {
  if (!genAI) throw new Error("Gemini API key not set");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Generate 10 nba basketball trivia questions with ${difficulty} difficulty. Each question should have 4 possible answers, with one correct answer. Format the response as a JSON array of objects, where each object has the following structure: { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }. Do not include any markdown formatting or code blocks in your response.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(text);
}

export async function generateQuestions(difficulty: string): Promise<Question[]> {
  console.log(`Generating questions for difficulty: ${difficulty}`);

  // Check cache first
  if (questionCache[difficulty]) {
    console.log("Returning cached questions");
    return questionCache[difficulty];
  }

  try {
    if (genAI) {
      console.log("Attempting to use Gemini API");
      const questions = await retryWithBackoff(() => generateQuestionsWithGemini(difficulty));
      // Cache the generated questions
      questionCache[difficulty] = questions;
      return questions;
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
  }

  console.log("Using fallback questions");
  return fallbackQuestions[difficulty as keyof typeof fallbackQuestions] || fallbackQuestions.medium;
}