import Link from "next/link";
import { getAllSentences, KIDS_COURSE } from "@/lib/sentences";

export const dynamic = "force-dynamic";

export default async function KidsHistoryPage() {
  const sentences = await getAllSentences(KIDS_COURSE);

  return (
    <main className="shell kids-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Kids Archive</p>
          <h1>小學生英語歷史句子</h1>
        </div>
        <Link href="/kids" className="ghost-button">
          回到小學生版
        </Link>
      </section>

      <section className="history-page-list">
        {sentences.map((item) => (
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
                <strong>句型</strong>
                <p>{item.grammarNote}</p>
              </div>
              <div>
                <strong>單字</strong>
                <p>{item.vocabulary}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
