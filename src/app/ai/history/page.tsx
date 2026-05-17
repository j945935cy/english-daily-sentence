import Link from "next/link";
import { getAllSentences, AI_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一AI知識英文學習歷史",
  "瀏覽每日一AI知識英文學習的歷史內容、AI 概念、應用情境、關鍵詞與例句。",
);

export default async function AIHistoryPage() {
  const lessons = await getAllSentences(AI_COURSE);

  return (
    <main className="shell ai-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">AI Archive</p>
          <h1>每日一AI知識英文學習歷史</h1>
        </div>
        <Link href="/ai" className="ghost-button">
          回到每日一AI知識英文學習
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
                <strong>AI概念</strong>
                <p>{item.grammarNote}</p>
              </div>
              <div>
                <strong>例句</strong>
                <p>{item.example}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
