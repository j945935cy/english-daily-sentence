import Link from "next/link";
import { CHAT_COURSE, getAllSentences } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一閒聊英語學習歷史",
  "瀏覽每日一閒聊英語學習的歷史內容，複習寒暄、聊天回應、邀約、近況、興趣與日常社交常用英文。",
);

export default async function ChatHistoryPage() {
  const lessons = await getAllSentences(CHAT_COURSE);

  return (
    <main className="shell chat-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Chat Archive</p>
          <h1>每日一閒聊英語學習歷史</h1>
        </div>
        <Link href="/chat" className="ghost-button">
          回到每日一閒聊英語學習
        </Link>
      </section>

      <section className="history-page-list">
        {lessons.map((item) => (
          <article key={item.id} className="history-card">
            <time>
              {item.publishDate.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </time>
            <h2>{item.sentence}</h2>
            <p className="translation">{item.translation}</p>
            <div className="mini-grid">
              <div>
                <strong>閒聊情境</strong>
                <p>{item.usageNote}</p>
              </div>
              <div>
                <strong>替換例句</strong>
                <p>{item.example}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
