import webpush from "web-push";
import { ensureDatabase, prisma } from "./prisma";
import { DEFAULT_COURSE, GRAMMAR_COURSE, KIDS_COURSE, MOTIVATION_COURSE, type CourseSlug } from "./courses";

const pushMeta = {
  [DEFAULT_COURSE]: {
    title: "每日一句英文",
    url: "/daily",
  },
  [KIDS_COURSE]: {
    title: "小學生入門英語",
    url: "/kids",
  },
  [MOTIVATION_COURSE]: {
    title: "勵志英語",
    url: "/motivation",
  },
  [GRAMMAR_COURSE]: {
    title: "每日一文法",
    url: "/grammar",
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
