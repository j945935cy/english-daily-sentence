import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTracker } from "./ui/view-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "每日一句英文",
  description: "每日解釋一句英文並推送到手機的學習網站",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ViewTracker />
        {children}
      </body>
    </html>
  );
}
