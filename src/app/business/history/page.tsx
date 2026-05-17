import Link from "next/link";
import { BUSINESS_COURSE, getAllSentences } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一商管英文學習歷史",
  "瀏覽每日一商管英文學習的歷史內容，複習會議、簡報、策略、財務、行銷、營運與領導常用英文。",
);

export default async function BusinessHistoryPage() {
  const lessons = await getAllSentences(BUSINESS_COURSE);

  return (
    <main className="shell business-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Business Archive</p>
          <h1>每日一商管英文學習歷史</h1>
        </div>
        <Link href="/business" className="ghost-button">
          回到每日一商管英文學習
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
                <strong>商管情境</strong>
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
