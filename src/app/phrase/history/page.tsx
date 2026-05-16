import Link from "next/link";
import { getAllSentences, PHRASE_COURSE } from "@/lib/sentences";

export const dynamic = "force-dynamic";

export default async function PhraseHistoryPage() {
  const phrases = await getAllSentences(PHRASE_COURSE);

  return (
    <main className="shell phrase-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Phrase Archive</p>
          <h1>每日一片語歷史單元</h1>
        </div>
        <Link href="/phrase" className="ghost-button">
          回到每日一片語
        </Link>
      </section>

      <section className="history-page-list">
        {phrases.map((item) => (
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
                <strong>片語</strong>
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
