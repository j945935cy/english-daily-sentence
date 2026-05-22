import webpush from "web-push";
import { ensureDatabase, prisma } from "./prisma";
import {
  DEFAULT_COURSE,
  AI_COURSE,
  GRAMMAR_COURSE,
  KIDS_COURSE,
  MOTIVATION_COURSE,
  PATTERN_COURSE,
  PHRASE_COURSE,
  TRAVEL_COURSE,
  LIFE_COURSE,
  BUSINESS_COURSE,
  CHAT_COURSE,
  type CourseSlug,
} from "./courses";

const pushMeta = {
  [DEFAULT_COURSE]: {
    title: "每日一句英語",
    url: "/daily",
  },
  [KIDS_COURSE]: {
    title: "小學生每日英語",
    url: "/kids",
  },
  [MOTIVATION_COURSE]: {
    title: "每日勵志英文",
    url: "/motivation",
  },
  [GRAMMAR_COURSE]: {
    title: "每日文法英文",
    url: "/grammar",
  },
  [PHRASE_COURSE]: {
    title: "每日片語英文",
    url: "/phrase",
  },
  [PATTERN_COURSE]: {
    title: "每日句型英文",
    url: "/pattern",
  },
  [AI_COURSE]: {
    title: "每日 AI 知識英文",
    url: "/ai",
  },
  [TRAVEL_COURSE]: {
    title: "每日旅遊英文",
    url: "/travel",
  },
  [LIFE_COURSE]: {
    title: "每日生活英文",
    url: "/life",
  },
  [BUSINESS_COURSE]: {
    title: "每日商管英文",
    url: "/business",
  },
  [CHAT_COURSE]: {
    title: "每日閒聊英文",
    url: "/chat",
  },
} satisfies Record<CourseSlug, { title: string; url: string }>;

export function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@example.com";

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function sendDailySentencePush(courseId: CourseSlug = DEFAULT_COURSE) {
  await ensureDatabase();

  if (!configureWebPush()) {
    return { sent: 0, failed: 0, skipped: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sentence = await prisma.dailySentence.findFirst({
    where: {
      courseId,
      publishDate: { lte: today },
    },
    orderBy: { publishDate: "desc" },
  });

  if (!sentence) {
    return { sent: 0, failed: 0, skipped: true };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { courseId },
    include: {
      user: {
        select: { email: true },
      },
    },
  });
  let sent = 0;
  let failed = 0;
  let cleaned = 0;
  const failures: Array<{ email: string; statusCode?: number; reason: string }> = [];

  await Promise.all(
    subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: item.endpoint,
            keys: { p256dh: item.p256dh, auth: item.auth },
          },
          JSON.stringify({
            title: pushMeta[courseId].title,
            body: sentence.sentence,
            url: pushMeta[courseId].url,
          }),
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode =
          typeof error === "object" && error !== null && "statusCode" in error
            ? Number(error.statusCode)
            : undefined;
        const reason = error instanceof Error ? error.message : "Unknown push error";

        failures.push({ email: item.user.email, statusCode, reason });

        if (statusCode === 403 || statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: item.id } });
          cleaned += 1;
        }
      }
    }),
  );

  return { sent, failed, cleaned, skipped: false, failures };
}
