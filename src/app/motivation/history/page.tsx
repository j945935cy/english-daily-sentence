import Link from "next/link";
import { getAllSentences, MOTIVATION_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一勵志英語歷史句子",
  "瀏覽每日一勵志英語的歷史句子、中文解釋、句型重點與單字片語。",
);

export default async function MotivationHistoryPage() {
  const sentences = await getAllSentences(MOTIVATION_COURSE);

  return (
    <main className="shell motivation-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Motivation Archive</p>
          <h1>每日一勵志英語歷史句子</h1>
        </div>
        <Link href="/motivation" className="ghost-button">
          回到每日一勵志英語
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
