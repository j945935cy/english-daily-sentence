import Link from "next/link";
import { getAllSentences } from "@/lib/sentences";

export default async function HistoryPage() {
  const sentences = await getAllSentences();

  return (
    <main className="shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Archive</p>
          <h1>歷史句子</h1>
        </div>
        <Link href="/" className="ghost-button">
          回到首頁
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
                <strong>文法</strong>
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
