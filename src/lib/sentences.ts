import { prisma } from "./prisma";

export async function getTodaySentence() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sentence = await prisma.dailySentence.findFirst({
    where: { publishDate: { lte: today } },
    orderBy: { publishDate: "desc" },
  });

  if (sentence) {
    return sentence;
  }

  return prisma.dailySentence.create({
    data: {
      sentence: "Small steps every day lead to remarkable progress.",
      translation: "每天小小前進，會累積成很驚人的進步。",
      grammarNote:
        "Small steps 是主詞，lead to 表示「導致、帶來」，後面接名詞 remarkable progress。",
      usageNote:
        "這句適合鼓勵自己或別人持續學習，語氣自然、正面，也常用在讀書或工作目標。",
      vocabulary:
        "remarkable: 顯著的、值得注意的；progress: 進步；lead to: 帶來、導致。",
      example: "Consistent review leads to better speaking confidence.",
      publishDate: today,
    },
  });
}

export async function getRecentSentences(limit = 7) {
  return prisma.dailySentence.findMany({
    orderBy: { publishDate: "desc" },
    take: limit,
  });
}

export async function getAllSentences() {
  return prisma.dailySentence.findMany({
    orderBy: { publishDate: "desc" },
  });
}
