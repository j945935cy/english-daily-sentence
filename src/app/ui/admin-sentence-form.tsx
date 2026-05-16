"use client";

import { FormEvent, useState } from "react";

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

    setMessage("已儲存每日句子。");
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div>
        <p className="eyebrow">Admin</p>
        <h2>新增或更新每日一句</h2>
      </div>

      <label>
        發布日期
        <input name="publishDate" type="date" defaultValue={defaultDate} required />
      </label>
      <label>
        英文句子
        <input name="sentence" required />
      </label>
      <label>
        中文翻譯
        <textarea name="translation" required />
      </label>
      <label>
        文法重點
        <textarea name="grammarNote" required />
      </label>
      <label>
        自然用法
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
        {loading ? "儲存中" : "儲存句子"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
