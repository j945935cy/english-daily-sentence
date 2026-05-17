import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getRecentSentences, getTodaySentence, TRAVEL_COURSE } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一旅遊英文學習",
  "每天學一個旅遊情境英文句子，練習機場、飯店、交通、點餐、問路與購物等出國常用英文。",
);

export default async function TravelPage() {
  const [user, todayLesson, recentLessons] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(TRAVEL_COURSE),
    getRecentSentences(TRAVEL_COURSE),
  ]);

  return (
    <main className="shell travel-shell">
      <section className="topbar" aria-label="頁首">
        <div>
          <p className="eyebrow">Travel English</p>
          <h1>每日一旅遊英文學習</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主選單">
        <Link href="/">首頁</Link>
        <Link href="/travel">今日旅遊英文</Link>
        <Link href="/travel/history">旅遊英文歷史</Link>
        <Link href="/daily">每日一句英文</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/phrase">每日一片語</Link>
        <Link href="/pattern">每日一句型</Link>
        <Link href="/ai">每日一AI知識英文學習</Link>
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
          <p className="sentence travel-title">{todayLesson.sentence}</p>
          <SpeakButton text={todayLesson.sentence} />
          <p className="translation">{todayLesson.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>句型重點</h2>
              <p>{todayLesson.grammarNote}</p>
            </section>
            <section>
              <h2>旅遊情境</h2>
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
            <h2>訂閱旅遊英文</h2>
            <p>登入後可以訂閱每日旅遊英文推播，每天練一個出國會用到的英文句子。</p>
            <PushButton isSignedIn={Boolean(user)} courseId={TRAVEL_COURSE} />
          </div>

          <div className="panel-block">
            <h2>最近旅遊英文</h2>
            <div className="history-list compact">
              {recentLessons.map((item) => (
                <Link key={item.id} href="/travel/history" className="history-item">
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
