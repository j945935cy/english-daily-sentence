import { NextResponse } from "next/server";
import { sendDailySentencePush } from "@/lib/push";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (secret) {
    const authorization = request.headers.get("authorization");

    if (authorization !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await sendDailySentencePush();
  return NextResponse.json(result);
}
