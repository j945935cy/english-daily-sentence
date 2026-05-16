import webpush from "web-push";
import { prisma } from "./prisma";

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

export async function sendDailySentencePush() {
  if (!configureWebPush()) {
    return { sent: 0, failed: 0, skipped: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sentence = await prisma.dailySentence.findFirst({
    where: { publishDate: { lte: today } },
    orderBy: { publishDate: "desc" },
  });

  if (!sentence) {
    return { sent: 0, failed: 0, skipped: true };
  }

  const subscriptions = await prisma.pushSubscription.findMany();
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
            title: "今日一句英文",
            body: sentence.sentence,
            url: "/",
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
