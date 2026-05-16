import webpush from "web-push";
import { ensureDatabase, prisma } from "./prisma";
import { DEFAULT_COURSE, type CourseSlug } from "./courses";

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
            title: courseId === DEFAULT_COURSE ? "今日一句英文" : "今日小學生英語",
            body: sentence.sentence,
            url: courseId === DEFAULT_COURSE ? "/" : "/kids",
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
