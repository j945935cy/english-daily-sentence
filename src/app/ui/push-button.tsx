"use client";

import { useState } from "react";

type Props = {
  isSignedIn: boolean;
  courseId?: string;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushButton({ isSignedIn, courseId = "daily-english" }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    setMessage("");

    if (!isSignedIn) {
      setMessage("請先註冊或登入。");
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("這個瀏覽器目前不支援 Web Push。");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      setMessage("尚未設定 VAPID public key，請先完成環境變數設定。");
      return;
    }

    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setMessage("通知權限未開啟。");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subscription.toJSON(), courseId }),
      });

      setMessage(response.ok ? "已訂閱每日推送。" : "訂閱失敗，請重新登入後再試。");
    } catch {
      setMessage("訂閱失敗，請確認瀏覽器通知權限與 HTTPS 狀態。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="push-actions">
      <button type="button" className="primary-button" onClick={subscribe} disabled={loading}>
        {loading ? "訂閱中" : "開啟每日推送"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </div>
  );
}
