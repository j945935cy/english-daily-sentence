import type { Metadata } from "next";

const siteName = "每日英文學習入口站";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title: `${title}｜${siteName}`,
    description,
  };
}
