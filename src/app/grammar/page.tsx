import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRecentSentences, getTodaySentence, GRAMMAR_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一文法",
  "每天一個英文文法小單元，用規則、例句、用法與練習建立英文句子能力。",
);

export default async function GrammarPage() {
  const [user, todaySentence, recentSentences] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(GRAMMAR_COURSE),
    getRecentSentences(GRAMMAR_COURSE),
  ]);

  return (
    <main className="shell grammar-shell">
      <section className="topbar" aria-label="主要頁面">
        <div>
          <p className="eyebrow">Grammar English</p>
          <h1>每日一文法</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主要頁面">
        <Link href="/">入口站</Link>
        <Link href="/grammar">今日文法</Link>
        <Link href="/grammar/history">歷史文法</Link>
        <Link href="/daily">每日一句英文</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/phrase">每日一片語</Link>
        <Link href="/pattern">每日一句型</Link>
        <Link href="/ai">每日一AI知識英文學習</Link>
        <Link href="/travel">每日一旅遊英文學習</Link>
        <Link href="/life">每日一生活英文學習</Link>
        {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
      </nav>

      <section className="learning-layout">
        <article className="lesson">
          <div className="lesson-date">
            {todaySentence.publishDate.toLocaleDateString("zh-TW", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <p className="sentence grammar-title">{todaySentence.sentence}</p>
          <SpeakButton text={todaySentence.example} />
          <p className="translation">{todaySentence.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>文法規則</h2>
              <p>{todaySentence.grammarNote}</p>
            </section>
            <section>
              <h2>用法與練習</h2>
              <p>{todaySentence.usageNote}</p>
            </section>
            <section>
              <h2>關鍵字</h2>
              <p>{todaySentence.vocabulary}</p>
            </section>
            <section>
              <h2>例句朗讀</h2>
              <p>{todaySentence.example}</p>
            </section>
          </div>
        </article>

        <aside className="side-panel">
          <div className="panel-block">
            <h2>手機推送</h2>
            <p>登入後可訂閱每日一文法通知。每天一個小規則，慢慢把句子看懂、寫對、說自然。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={GRAMMAR_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近文法</h2>
            <div className="history-list compact">
              {recentSentences.map((item) => (
                <Link key={item.id} href="/grammar/history" className="history-item">
                  <time>
                    {item.publishDate.toLocaleDateString("zh-TW", {
                      month: "numeric",
                      day: "numeric",
                    })}
                  </time>
                  <p>{item.sentence}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
