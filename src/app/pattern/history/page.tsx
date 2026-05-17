import Link from "next/link";
import { getAllSentences, PATTERN_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一句型歷史句子",
  "瀏覽每日一句型的歷史句型、句型拆解、替換用法與例句練習。",
);

export default async function PatternHistoryPage() {
  const patterns = await getAllSentences(PATTERN_COURSE);

  return (
    <main className="shell pattern-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Pattern Archive</p>
          <h1>每日一句型歷史</h1>
        </div>
        <Link href="/pattern" className="ghost-button">
          回到每日一句型
        </Link>
      </section>

      <section className="history-page-list">
        {patterns.map((item) => (
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
                <strong>句型拆解</strong>
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
