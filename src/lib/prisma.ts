import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const log: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  const connectionString = process.env.DATABASE_URL;

  if (connectionString?.startsWith("postgres")) {
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
      log,
    });
  }

  return new PrismaClient({ log });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

let setupPromise: Promise<void> | null = null;

export async function ensureDatabase() {
  setupPromise ??= setupDatabase();
  await setupPromise;
}

async function setupDatabase() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Course" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Course_slug_key" ON "Course"("slug");`);
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Course" ("id", "slug", "name", "description", "updatedAt")
    VALUES
      ('daily-english', 'daily-english', '每日一句英語', '每天一句實用英語，累積自然語感。', CURRENT_TIMESTAMP),
      ('kids-english', 'kids-english', '小學生每日一句英語', '短句、基礎單字和生活化例句，適合小學生每天學一點。', CURRENT_TIMESTAMP)
    ON CONFLICT ("id") DO UPDATE SET
      "slug" = EXCLUDED."slug",
      "name" = EXCLUDED."name",
      "description" = EXCLUDED."description",
      "updatedAt" = CURRENT_TIMESTAMP;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "name" TEXT,
      "passwordHash" TEXT NOT NULL,
      "isAdmin" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DailySentence" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "courseId" TEXT NOT NULL DEFAULT 'daily-english',
      "sentence" TEXT NOT NULL,
      "translation" TEXT NOT NULL,
      "grammarNote" TEXT NOT NULL,
      "usageNote" TEXT NOT NULL,
      "vocabulary" TEXT NOT NULL,
      "example" TEXT NOT NULL,
      "publishDate" TIMESTAMP(3) NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "DailySentence" ADD COLUMN IF NOT EXISTS "courseId" TEXT NOT NULL DEFAULT 'daily-english';`,
  );
  await prisma.$executeRawUnsafe(`UPDATE "DailySentence" SET "courseId" = 'daily-english' WHERE "courseId" IS NULL;`);
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "DailySentence_publishDate_key";`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "DailySentence_courseId_publishDate_key" ON "DailySentence"("courseId", "publishDate");`,
  );
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "DailySentence_courseId_idx" ON "DailySentence"("courseId");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PushSubscription" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "courseId" TEXT NOT NULL DEFAULT 'daily-english',
      "endpoint" TEXT NOT NULL,
      "p256dh" TEXT NOT NULL,
      "auth" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PushSubscription_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "PushSubscription" ADD COLUMN IF NOT EXISTS "courseId" TEXT NOT NULL DEFAULT 'daily-english';`,
  );
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "PushSubscription_endpoint_key";`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_courseId_key" ON "PushSubscription"("endpoint", "courseId");`,
  );
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PushSubscription_courseId_idx" ON "PushSubscription"("courseId");`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LearningHistory" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "sentenceId" TEXT NOT NULL,
      "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LearningHistory_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "LearningHistory_sentenceId_fkey"
        FOREIGN KEY ("sentenceId") REFERENCES "DailySentence" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "LearningHistory_userId_sentenceId_key" ON "LearningHistory"("userId", "sentenceId");`,
  );

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PageView" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "path" TEXT NOT NULL,
      "visitorId" TEXT,
      "userAgent" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");`,
  );
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");`);
}
