"use client";

import { FormEvent, useState } from "react";
import {
  DEFAULT_COURSE,
  AI_COURSE,
  GRAMMAR_COURSE,
  KIDS_COURSE,
  MOTIVATION_COURSE,
  PATTERN_COURSE,
  PHRASE_COURSE,
  TRAVEL_COURSE,
} from "@/lib/courses";

type Props = {
  defaultDate?: string;
};

export function AdminSentenceForm({ defaultDate }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/admin/sentences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "儲存失敗。");
      return;
    }

    setMessage("已儲存每日內容。");
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div>
        <p className="eyebrow">Admin</p>
        <h2>新增或更新每日內容</h2>
      </div>

      <label>
        課程
        <select name="courseId" defaultValue={DEFAULT_COURSE}>
          <option value={DEFAULT_COURSE}>每日一句英文</option>
          <option value={KIDS_COURSE}>小學生每日一句英語</option>
          <option value={MOTIVATION_COURSE}>每日一勵志英語</option>
          <option value={GRAMMAR_COURSE}>每日一文法</option>
          <option value={PHRASE_COURSE}>每日一片語</option>
          <option value={PATTERN_COURSE}>每日一句型</option>
          <option value={AI_COURSE}>每日一AI知識英文學習</option>
          <option value={TRAVEL_COURSE}>每日一旅遊英文學習</option>
        </select>
      </label>
      <label>
        發布日期
        <input name="publishDate" type="date" defaultValue={defaultDate} required />
      </label>
      <label>
        英文句子、片語或標題
        <input name="sentence" required />
      </label>
      <label>
        中文翻譯或說明
        <textarea name="translation" required />
      </label>
      <label>
        文法或片語重點
        <textarea name="grammarNote" required />
      </label>
      <label>
        用法或練習
        <textarea name="usageNote" required />
      </label>
      <label>
        單字片語
        <textarea name="vocabulary" required />
      </label>
      <label>
        延伸例句
        <input name="example" required />
      </label>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "儲存中" : "儲存內容"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
