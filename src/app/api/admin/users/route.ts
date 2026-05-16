import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await ensureDatabase();

  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    return NextResponse.json({ error: "需要管理員權限。" }, { status: 403 });
  }

  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim() || null;
  const isAdmin = Boolean(body.isAdmin ?? true);

  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json(
      { error: "請輸入有效 Email，密碼至少 8 個字元。" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, isAdmin },
    create: { email, passwordHash, name, isAdmin },
    select: { id: true, email: true, name: true, isAdmin: true },
  });

  return NextResponse.json({ user });
}
