import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BUSINESS_COURSE, getRecentSentences, getTodaySentence } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一商管英文學習",
  "每天學一個商業管理英文句子，練習會議、簡報、策略、財務、行銷、營運與領導常用英文。",
);

export default async function BusinessPage() {
  const [user, todayLesson, recentLessons] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(BUSINESS_COURSE),
    getRecentSentences(BUSINESS_COURSE),
  ]);

  return (
    <main className="shell business-shell">
      <section className="topbar" aria-label="頁首">
        <div>
          <p className="eyebrow">Business English</p>
          <h1>每日一商管英文學習</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主選單">
        <Link href="/">首頁</Link>
        <Link href="/business">今日商管英文</Link>
        <Link href="/business/history">商管英文歷史</Link>
        <Link href="/daily">每日一句英語</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/phrase">每日一片語</Link>
        <Link href="/pattern">每日一句型</Link>
        <Link href="/ai">每日一AI知識英文學習</Link>
        <Link href="/travel">每日一旅遊英語學習</Link>
        <Link href="/life">每日一生活英語學習</Link>
        <Link href="/chat">每日一閒聊英語學習</Link>
        {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
      </nav>

      <section className="learning-layout">
        <article className="lesson">
          <div className="lesson-date">
            {todayLesson.publishDate.toLocaleDateString("zh-TW", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <p className="sentence business-title">{todayLesson.sentence}</p>
          <SpeakButton text={todayLesson.sentence} />
          <p className="translation">{todayLesson.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>句型重點</h2>
              <p>{todayLesson.grammarNote}</p>
            </section>
            <section>
              <h2>商管情境</h2>
              <p>{todayLesson.usageNote}</p>
            </section>
            <section>
              <h2>實用單字</h2>
              <p>{todayLesson.vocabulary}</p>
            </section>
            <section>
              <h2>替換例句</h2>
              <p>{todayLesson.example}</p>
            </section>
          </div>
        </article>

        <aside className="side-panel">
          <div className="panel-block">
            <h2>訂閱商管英文</h2>
            <p>登入後可以訂閱每日商管英文推播，每天練一個工作與管理溝通會用到的英文句子。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={BUSINESS_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近商管英文</h2>
            <div className="history-list compact">
              {recentLessons.map((item) => (
                <Link key={item.id} href="/business/history" className="history-item">
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
