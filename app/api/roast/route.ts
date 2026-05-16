import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  const { games, totalHours } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Context: User's Steam Library. Games: [${games.join(", ")}], Total Hours: [${totalHours}].
Identity: You are a savage Senior QA Lead.
Task: Roast the user's life choices based on these games.
Tone: Brutal, witty, sarcastic, technical.
Length: Max 280 characters (tweet-sized). Output only the roast, no quotes, no labels.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-latest",
    contents: prompt,
  });

  const roast = response.text?.trim() ?? "Your gaming history is so bad even AI refused to roast it.";
  return NextResponse.json({ roast });
}
