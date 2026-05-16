import Link from "next/link";
import { getAllSentences, GRAMMAR_COURSE } from "@/lib/sentences";

export const dynamic = "force-dynamic";

export default async function GrammarHistoryPage() {
  const sentences = await getAllSentences(GRAMMAR_COURSE);

  return (
    <main className="shell grammar-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Grammar Archive</p>
          <h1>每日一文法歷史單元</h1>
        </div>
        <Link href="/grammar" className="ghost-button">
          回到每日一文法
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
