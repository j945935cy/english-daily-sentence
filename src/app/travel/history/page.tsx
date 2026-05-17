import Link from "next/link";
import { getAllSentences, TRAVEL_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一旅遊英文學習歷史",
  "瀏覽每日一旅遊英文學習的歷史內容，複習機場、飯店、交通、點餐、問路與購物等常用旅遊英文。",
);

export default async function TravelHistoryPage() {
  const lessons = await getAllSentences(TRAVEL_COURSE);

  return (
    <main className="shell travel-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Travel Archive</p>
          <h1>每日一旅遊英文學習歷史</h1>
        </div>
        <Link href="/travel" className="ghost-button">
          回到每日一旅遊英文學習
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
                <strong>旅遊情境</strong>
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
