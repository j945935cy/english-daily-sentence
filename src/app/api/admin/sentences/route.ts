import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "需要管理員權限。" }, { status: 403 });
  }

  const body = await request.json();
  const publishDate = new Date(String(body.publishDate));
  publishDate.setHours(0, 0, 0, 0);

  const sentence = await prisma.dailySentence.upsert({
    where: { publishDate },
    update: {
      sentence: String(body.sentence ?? ""),
      translation: String(body.translation ?? ""),
      grammarNote: String(body.grammarNote ?? ""),
      usageNote: String(body.usageNote ?? ""),
      vocabulary: String(body.vocabulary ?? ""),
      example: String(body.example ?? ""),
    },
    create: {
      sentence: String(body.sentence ?? ""),
      translation: String(body.translation ?? ""),
      grammarNote: String(body.grammarNote ?? ""),
      usageNote: String(body.usageNote ?? ""),
      vocabulary: String(body.vocabulary ?? ""),
      example: String(body.example ?? ""),
      publishDate,
    },
  });

  return NextResponse.json({ sentence });
}
