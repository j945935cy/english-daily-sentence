import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "首頁",
  "十一個每日英文版本入口：每日一句英文、小學生每日一句英語、每日一勵志英語、每日一文法、每日一片語、每日一句型、每日一AI知識英文學習、每日一旅遊英文學習、每日一生活英文學習、每日一商管英文學習與每日一閒聊英語學習。",
);

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
    title: "每日一勵志英語",
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
  {
    href: "/ai",
    label: "AI English",
    title: "每日一AI知識英文學習",
    description: "每天用一句英文認識 AI 概念、工具、風險與應用情境，同時累積科技英文詞彙。",
    sample: "AI can help people find patterns in data.",
    tone: "ai",
  },
  {
    href: "/travel",
    label: "Travel English",
    title: "每日一旅遊英文學習",
    description: "每天一個旅行會用到的英文句子，從機場、飯店、交通到點餐問路，讓出國溝通更順。",
    sample: "Could you tell me where the train station is?",
    tone: "travel",
  },
  {
    href: "/life",
    label: "Life English",
    title: "每日一生活英文學習",
    description: "每天一個日常生活英文句子，練習居家、購物、工作、社交與健康等實用溝通。",
    sample: "I need to pick up some groceries after work.",
    tone: "life",
  },
  {
    href: "/business",
    label: "Business English",
    title: "每日一商管英文學習",
    description: "每天一個商業管理英文句子，練習會議、簡報、策略、財務、行銷與領導溝通。",
    sample: "We need to align our strategy with customer needs.",
    tone: "business",
  },
  {
    href: "/chat",
    label: "Chat English",
    title: "每日一閒聊英語學習",
    description: "每天一個自然聊天英語句子，練習寒暄、回應、邀約、近況與日常社交。",
    sample: "How has your day been so far?",
    tone: "chat",
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
            這裡整合十一個每日英文版本。選一個適合今天狀態的入口，讀一句、聽一句、練一個重點，慢慢累積英文感覺。
          </p>
        </div>
        <nav className="main-nav portal-nav" aria-label="主要頁面">
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
          <Link href="/chat">每日一閒聊英語學習</Link>
          {user?.isAdmin ? <Link href="/admin">管理後台</Link> : null}
        </nav>
      </section>

      <section className="portal-grid" aria-label="十一個英文學習站">
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
