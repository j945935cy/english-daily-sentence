import Link from "next/link";
import { CHAT_COURSE, getRecentSentences, getTodaySentence } from "@/lib/sentences";
import { getCurrentUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一閒聊英語學習",
  "每天學一個自然閒聊英語句子，練習寒暄、聊天回應、邀約、近況、興趣與日常社交常用英文。",
);

export default async function ChatPage() {
  const [user, todayLesson, recentLessons] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(CHAT_COURSE),
    getRecentSentences(CHAT_COURSE),
  ]);

  return (
    <main className="shell chat-shell">
      <section className="topbar" aria-label="頁首">
        <div>
          <p className="eyebrow">Chat English</p>
          <h1>每日一閒聊英語學習</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主選單">
        <Link href="/">首頁</Link>
        <Link href="/chat">今日閒聊英語</Link>
        <Link href="/chat/history">閒聊英語歷史</Link>
        <Link href="/daily">每日一句英文</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/phrase">每日一片語</Link>
        <Link href="/pattern">每日一句型</Link>
        <Link href="/ai">每日一AI知識英文學習</Link>
        <Link href="/travel">每日一旅遊英文學習</Link>
        <Link href="/life">每日一生活英文學習</Link>
        <Link href="/business">每日一商管英文學習</Link>
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
          <p className="sentence chat-title">{todayLesson.sentence}</p>
          <SpeakButton text={todayLesson.sentence} />
          <p className="translation">{todayLesson.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>句型重點</h2>
              <p>{todayLesson.grammarNote}</p>
            </section>
            <section>
              <h2>閒聊情境</h2>
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
            <h2>訂閱閒聊英語</h2>
            <p>登入後可以訂閱每日閒聊英語推播，每天練一個自然聊天會用到的英文句子。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={CHAT_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近閒聊英語</h2>
            <div className="history-list compact">
              {recentLessons.map((item) => (
                <Link key={item.id} href="/chat/history" className="history-item">
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
