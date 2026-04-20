import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  const { games, totalHours } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Context: User's Steam Library. Games: [${games.join(", ")}], Total Hours: [${totalHours}].\nIdentity: You are a savage Senior QA Lead.\nTask: Roast the user's life choices based on these games.\nTone: Brutal, witty, sarcastic, technical.\nLength: Max 280 characters (tweet-sized).`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 280,
  });

  return NextResponse.json({ roast: completion.choices[0].message.content });
}
