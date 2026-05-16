import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendDailySentencePush } from "@/lib/push";

export async function POST() {
  const user = await getCurrentUser();

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "需要管理員權限。" }, { status: 403 });
  }

  const result = await sendDailySentencePush();
  return NextResponse.json(result);
}
