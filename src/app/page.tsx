import { getCurrentUser } from "@/lib/auth";
import { getRecentSentences, getTodaySentence } from "@/lib/sentences";
import { AuthPanel } from "./ui/auth-panel";
import { PushButton } from "./ui/push-button";
import { AdminSentenceForm } from "./ui/admin-sentence-form";

export default async function Home() {
  const [user, todaySentence, recentSentences] = await Promise.all([
    getCurrentUser(),
    getTodaySentence(),
    getRecentSentences(),
  ]);

  return (
    <main className="shell">
      <section className="topbar" aria-label="網站導覽">
        <div>
          <p className="eyebrow">Daily English</p>
          <h1>每日一句英文</h1>
        </div>
        <AuthPanel user={user} />
      </section>

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
            <p>登入後可訂閱每日一句英文通知，網站會儲存你的推播訂閱資料。</p>
            <PushButton isSignedIn={Boolean(user)} />
          </div>

          <div className="panel-block">
            <h2>最近句子</h2>
            <div className="history-list">
              {recentSentences.map((item) => (
                <div key={item.id} className="history-item">
                  <time>
                    {item.publishDate.toLocaleDateString("zh-TW", {
                      month: "numeric",
                      day: "numeric",
                    })}
                  </time>
                  <p>{item.sentence}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {user?.isAdmin ? (
        <section className="admin-band">
          <AdminSentenceForm />
        </section>
      ) : null}
    </main>
  );
}
