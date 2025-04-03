import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful medical AI assistant. You can help users with:
          1. Explaining medical terms and concepts
          2. Providing general health information
          3. Explaining disease symptoms and risk factors
          4. Offering lifestyle and prevention advice
          5. Clarifying test results and measurements
          
          Always remind users that you are an AI and cannot replace professional medical advice.
          Keep responses concise and easy to understand.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || "Sorry, I couldn't process your request.",
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
} 