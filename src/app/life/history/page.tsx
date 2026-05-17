import Link from "next/link";
import { getAllSentences, LIFE_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一生活英語學習歷史",
  "瀏覽每日一生活英語學習的歷史內容，複習居家、購物、工作、社交、健康與生活溝通常用英語。",
);

export default async function LifeHistoryPage() {
  const lessons = await getAllSentences(LIFE_COURSE);

  return (
    <main className="shell life-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Life Archive</p>
          <h1>每日一生活英語學習歷史</h1>
        </div>
        <Link href="/life" className="ghost-button">
          回到每日一生活英語學習
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
                <strong>生活情境</strong>
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
