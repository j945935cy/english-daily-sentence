import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRecentSentences, getTodaySentence, PHRASE_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一片語",
  "每天一個常用英文片語，學意思、搭配詞、使用情境、自然例句與朗讀練習。",
);

export default async function PhrasePage() {
  const [user, todayPhrase, recentPhrases] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(PHRASE_COURSE),
    getRecentSentences(PHRASE_COURSE),
  ]);

  return (
    <main className="shell phrase-shell">
      <section className="topbar" aria-label="主要頁面">
        <div>
          <p className="eyebrow">Phrase English</p>
          <h1>每日一片語</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主要頁面">
        <Link href="/">入口站</Link>
        <Link href="/phrase">今日片語</Link>
        <Link href="/phrase/history">歷史片語</Link>
        <Link href="/daily">每日一句英文</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/pattern">每日一句型</Link>
        <Link href="/ai">每日一AI知識英文學習</Link>
        <Link href="/travel">每日一旅遊英文學習</Link>
        <Link href="/life">每日一生活英文學習</Link>
        <Link href="/business">每日一商管英文學習</Link>
        <Link href="/chat">每日一閒聊英語學習</Link>
        {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
      </nav>

      <section className="learning-layout">
        <article className="lesson">
          <div className="lesson-date">
            {todayPhrase.publishDate.toLocaleDateString("zh-TW", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <p className="sentence phrase-title">{todayPhrase.sentence}</p>
          <SpeakButton text={todayPhrase.example} />
          <p className="translation">{todayPhrase.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>片語重點</h2>
              <p>{todayPhrase.grammarNote}</p>
            </section>
            <section>
              <h2>自然用法</h2>
              <p>{todayPhrase.usageNote}</p>
            </section>
            <section>
              <h2>搭配單字</h2>
              <p>{todayPhrase.vocabulary}</p>
            </section>
            <section>
              <h2>例句朗讀</h2>
              <p>{todayPhrase.example}</p>
            </section>
          </div>
        </article>

        <aside className="side-panel">
          <div className="panel-block">
            <h2>手機推送</h2>
            <p>登入後可訂閱每日一片語通知。每天學一個常見搭配，讓英文更自然。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={PHRASE_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近片語</h2>
            <div className="history-list compact">
              {recentPhrases.map((item) => (
                <Link key={item.id} href="/phrase/history" className="history-item">
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
