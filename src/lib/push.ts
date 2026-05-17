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
  type CourseSlug,
} from "./courses";

const pushMeta = {
  [DEFAULT_COURSE]: {
    title: "每日一句英文",
    url: "/daily",
  },
  [KIDS_COURSE]: {
    title: "小學生每日一句英語",
    url: "/kids",
  },
  [MOTIVATION_COURSE]: {
    title: "每日一勵志英語",
    url: "/motivation",
  },
  [GRAMMAR_COURSE]: {
    title: "每日一文法",
    url: "/grammar",
  },
  [PHRASE_COURSE]: {
    title: "每日一片語",
    url: "/phrase",
  },
  [PATTERN_COURSE]: {
    title: "每日一句型",
    url: "/pattern",
  },
  [AI_COURSE]: {
    title: "每日一AI知識英文學習",
    url: "/ai",
  },
  [TRAVEL_COURSE]: {
    title: "每日一旅遊英文學習",
    url: "/travel",
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
  });
  let sent = 0;
  let failed = 0;

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
      } catch {
        failed += 1;
      }
    }),
  );

  return { sent, failed, skipped: false };
}
