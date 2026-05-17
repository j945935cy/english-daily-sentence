import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRecentSentences, getTodaySentence, PATTERN_COURSE } from "@/lib/sentences";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";

export default async function PatternPage() {
  const [user, todayPattern, recentPatterns] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(PATTERN_COURSE),
    getRecentSentences(PATTERN_COURSE),
  ]);

  return (
    <main className="shell pattern-shell">
      <section className="topbar" aria-label="主選單">
        <div>
          <p className="eyebrow">Sentence Pattern</p>
          <h1>每日一句型</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主選單">
        <Link href="/">回首頁</Link>
        <Link href="/pattern">今日句型</Link>
        <Link href="/pattern/history">歷史句型</Link>
        <Link href="/daily">每日一句英文</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/phrase">每日一片語</Link>
        {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
      </nav>

      <section className="learning-layout">
        <article className="lesson">
          <div className="lesson-date">
            {todayPattern.publishDate.toLocaleDateString("zh-TW", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <p className="sentence pattern-title">{todayPattern.sentence}</p>
          <SpeakButton text={todayPattern.example} />
          <p className="translation">{todayPattern.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>句型拆解</h2>
              <p>{todayPattern.grammarNote}</p>
            </section>
            <section>
              <h2>替換用法</h2>
              <p>{todayPattern.usageNote}</p>
            </section>
            <section>
              <h2>關鍵詞</h2>
              <p>{todayPattern.vocabulary}</p>
            </section>
            <section>
              <h2>例句練習</h2>
              <p>{todayPattern.example}</p>
            </section>
          </div>
        </article>

        <aside className="side-panel">
          <div className="panel-block">
            <h2>手機提醒</h2>
            <p>登入後可以訂閱每日一句型推播，讓手機每天收到一個可替換、可練習的英文句型。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={PATTERN_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近句型</h2>
            <div className="history-list compact">
              {recentPatterns.map((item) => (
                <Link key={item.id} href="/pattern/history" className="history-item">
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
