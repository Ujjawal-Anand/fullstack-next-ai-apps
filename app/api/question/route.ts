import { qa } from "@/utils/ai";
import { getUserFromClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { question } = await request.json();
  const user = await getUserFromClerkID();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true, // Add the 'id' property
      content: true,
      createdAt: true,
    },
  });

  const formattedEntries = entries.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(), // Convert createdAt to string
  }));

  const answer = await qa(question, formattedEntries);
  return NextResponse.json({ data: answer });
};
