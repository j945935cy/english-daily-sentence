import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_COURSE, getRecentSentences, getTodaySentence } from "@/lib/sentences";
import { pageMetadata } from "@/lib/metadata";
import { AuthPanel } from "../ui/auth-panel";
import { PushButton } from "../ui/push-button";
import { SpeakButton } from "../ui/speak-button";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "每日一句英文",
  "每天一句實用英文，搭配中文解釋、文法重點、單字片語、朗讀與手機推播。",
);

export default async function DailyPage() {
  const [user, todaySentence, recentSentences] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(DEFAULT_COURSE),
    getRecentSentences(DEFAULT_COURSE),
  ]);

  return (
    <main className="shell">
      <section className="topbar" aria-label="主要頁面">
        <div>
          <p className="eyebrow">Daily English</p>
          <h1>每日一句英文</h1>
        </div>
        <AuthPanel user={user} />
      </section>

      <nav className="main-nav" aria-label="主要頁面">
        <Link href="/">入口站</Link>
        <Link href="/daily">今日句子</Link>
        <Link href="/history">歷史句子</Link>
        <Link href="/kids">小學生每日一句英語</Link>
        <Link href="/motivation">每日一勵志英語</Link>
        <Link href="/grammar">每日一文法</Link>
        <Link href="/phrase">每日一片語</Link>
        <Link href="/pattern">每日一句型</Link>
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
          <p className="sentence">{todaySentence.sentence}</p>
          <SpeakButton text={todaySentence.sentence} />
          <p className="translation">{todaySentence.translation}</p>

          <div className="explain-grid">
            <section>
              <h2>文法重點</h2>
              <p>{todaySentence.grammarNote}</p>
            </section>
            <section>
              <h2>自然用法</h2>
              <p>{todaySentence.usageNote}</p>
            </section>
            <section>
              <h2>單字片語</h2>
              <p>{todaySentence.vocabulary}</p>
            </section>
            <section>
              <h2>延伸例句</h2>
              <p>{todaySentence.example}</p>
            </section>
          </div>
        </article>

        <aside className="side-panel">
          <div className="panel-block">
            <h2>手機推送</h2>
            <p>登入後可訂閱每日一句英文通知。手機會收到今天的英文句子，方便固定練習。</p>
            <PushButton isSignedIn={Boolean(user)} />
          </div>

          <div className="panel-block">
            <h2>最近句子</h2>
            <div className="history-list compact">
              {recentSentences.map((item) => (
                <Link key={item.id} href="/history" className="history-item">
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
