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
  title: {
    default: "每日英文學習入口站",
    template: "%s",
  },
  description: "整合每日一句英文、小學生每日一句英語、每日一勵志英語、每日一文法、每日一片語、每日一句型、每日一AI知識英文學習與每日一旅遊英文學習的英文學習網站。",
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
