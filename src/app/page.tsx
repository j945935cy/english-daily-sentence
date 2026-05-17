import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const sites = [
  {
    href: "/daily",
    label: "Daily English",
    title: "每日一句英文",
    description: "適合一般學習者，每天一個實用英文句子，搭配文法、用法、單字與朗讀。",
    sample: "I can review new words a little better every day.",
    tone: "daily",
  },
  {
    href: "/kids",
    label: "Kids English",
    title: "小學生每日一句英語",
    description: "短句、簡單、生活化，適合小學生從課堂與日常用語開始建立英文信心。",
    sample: "Good morning.",
    tone: "kids",
  },
  {
    href: "/motivation",
    label: "Motivational English",
    title: "勵志英語",
    description: "每天一句短而有力量的英文，練習語感，也把鼓勵放進每天的節奏。",
    sample: "Small steps lead to big changes.",
    tone: "motivation",
  },
  {
    href: "/grammar",
    label: "Grammar English",
    title: "每日一文法",
    description: "每天一個文法小單元，用規則、例句、易錯提醒與小練習建立句子能力。",
    sample: "Present Simple: I study English every day.",
    tone: "grammar",
  },
  {
    href: "/phrase",
    label: "Phrase English",
    title: "每日一片語",
    description: "每天一個常用英文片語，學意思、搭配詞、使用情境與自然例句。",
    sample: "look up",
    tone: "phrase",
  },
  {
    href: "/pattern",
    label: "Sentence Pattern",
    title: "每日一句型",
    description: "每天一個實用句型，練習替換字詞並自然說出完整英文句子。",
    sample: "It is easy to + verb.",
    tone: "pattern",
  },
];

export default async function PortalPage() {
  const user = await getCurrentUser();

  return (
    <main className="shell portal-shell">
      <section className="portal-hero">
        <div>
          <p className="eyebrow">English Daily Hub</p>
          <h1>每日英文學習入口站</h1>
          <p>
            這裡整合五個每日英文版本。選一個適合今天狀態的入口，讀一句、聽一句、練一個重點，慢慢累積英文感覺。
          </p>
        </div>
        <nav className="main-nav portal-nav" aria-label="主要頁面">
          <Link href="/daily">每日一句英文</Link>
          <Link href="/kids">小學生每日一句英語</Link>
          <Link href="/motivation">勵志英語</Link>
          <Link href="/grammar">每日一文法</Link>
          <Link href="/phrase">每日一片語</Link>
          <Link href="/pattern">每日一句型</Link>
          {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
        </nav>
      </section>

      <section className="portal-grid" aria-label="五個英文學習站">
        {sites.map((site) => (
          <Link key={site.href} href={site.href} className={`portal-card ${site.tone}`}>
            <span>{site.label}</span>
            <h2>{site.title}</h2>
            <p>{site.description}</p>
            <blockquote>{site.sample}</blockquote>
            <strong>進入學習</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
