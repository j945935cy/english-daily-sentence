import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await ensureDatabase();

  const user = await getCurrentUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "需要管理員權限。" }, { status: 403 });
  }

  const body = await request.json();
  const publishDate = new Date(String(body.publishDate));
  publishDate.setHours(0, 0, 0, 0);

  const sentenceText = String(body.sentence ?? "").trim();
  const translation = String(body.translation ?? "").trim();

  if (!sentenceText || !translation || Number.isNaN(publishDate.getTime())) {
    return NextResponse.json({ error: "請填寫有效日期、英文句子與中文翻譯。" }, { status: 400 });
  }

  const sentence = await prisma.dailySentence.upsert({
    where: { publishDate },
    update: {
      sentence: sentenceText,
      translation,
      grammarNote: String(body.grammarNote ?? "").trim(),
      usageNote: String(body.usageNote ?? "").trim(),
      vocabulary: String(body.vocabulary ?? "").trim(),
      example: String(body.example ?? "").trim(),
    },
    create: {
      sentence: sentenceText,
      translation,
      grammarNote: String(body.grammarNote ?? "").trim(),
      usageNote: String(body.usageNote ?? "").trim(),
      vocabulary: String(body.vocabulary ?? "").trim(),
      example: String(body.example ?? "").trim(),
      publishDate,
    },
  });

  return NextResponse.json({ sentence });
}
