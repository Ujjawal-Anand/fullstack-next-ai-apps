import { generateQuestion } from "@/utils/ai/quizAI";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const quiz = await generateQuestion();

  return NextResponse.json({ data: quiz });
};
