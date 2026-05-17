import { ensureDatabase, prisma } from "./prisma";
import {
  courses,
  AI_COURSE,
  DEFAULT_COURSE,
  GRAMMAR_COURSE,
  KIDS_COURSE,
  MOTIVATION_COURSE,
  PATTERN_COURSE,
  PHRASE_COURSE,
  type CourseSlug,
} from "./courses";

export {
  courses,
  AI_COURSE,
  DEFAULT_COURSE,
  GRAMMAR_COURSE,
  KIDS_COURSE,
  MOTIVATION_COURSE,
  PATTERN_COURSE,
  PHRASE_COURSE,
  normalizeCourseSlug,
} from "./courses";
export type { CourseSlug } from "./courses";

type SentenceFallback = {
  sentence: string;
  translation: string;
  grammarNote: string;
  usageNote: string;
  vocabulary: string;
  example: string;
};

const fallbackByCourse = {
  [DEFAULT_COURSE]: {
    sentence: "Small steps every day lead to remarkable progress.",
    translation: "每天一小步，會帶來很明顯的進步。",
    grammarNote: "Small steps 是主詞，lead to 表示「導向、帶來」。",
    usageNote: "適合提醒自己，穩定練習比一次衝刺更重要。",
    vocabulary: "remarkable: 明顯的；progress: 進步；lead to: 帶來。",
    example: "Consistent review leads to better speaking confidence.",
  },
  [KIDS_COURSE]: {
    sentence: "I like apples.",
    translation: "我喜歡蘋果。",
    grammarNote: "I like + 名詞，表示「我喜歡某物」。",
    usageNote: "這是很適合小學生練習喜好的基本句型。",
    vocabulary: "I: 我；like: 喜歡；apple: 蘋果。",
    example: "I like bananas.",
  },
  [MOTIVATION_COURSE]: {
    sentence: "Small steps lead to big changes.",
    translation: "小小的步伐會帶來大的改變。",
    grammarNote: "Small steps 是主詞，lead to 表示「導向、帶來」。",
    usageNote: "適合提醒自己不用一次做到完美，只要每天前進一點。",
    vocabulary: "small: 小的；step: 步伐；lead to: 帶來；change: 改變。",
    example: "One small step today can lead to a better tomorrow.",
  },
  [GRAMMAR_COURSE]: {
    sentence: "Present Simple: I study English every day.",
    translation: "一般現在式：我每天讀英文。",
    grammarNote: "一般現在式用來描述習慣、事實與固定狀態。",
    usageNote: "適合描述每天、常常、通常會做的事。",
    vocabulary: "present simple: 一般現在式；habit: 習慣；fact: 事實。",
    example: "She studies English every morning.",
  },
  [PHRASE_COURSE]: {
    sentence: "look up",
    translation: "查詢；抬頭看。",
    grammarNote: "look up 是片語動詞，可接字典、資料或資訊，也可表示往上看。",
    usageNote: "遇到不懂的單字時，可以說 look up the word。",
    vocabulary: "look up: 查詢；word: 單字；dictionary: 字典。",
    example: "I need to look up this word.",
  },
  [PATTERN_COURSE]: {
    sentence: "It is easy to + verb.",
    translation: "做某件事很容易。",
    grammarNote: "It is + 形容詞 + to + 原形動詞，用來說明做某事的感受或難易度。",
    usageNote: "可替換形容詞和動詞，例如 easy、hard、important 搭配 learn、practice、remember。",
    vocabulary: "easy: 容易的；verb: 動詞；pattern: 句型。",
    example: "It is easy to practice English for five minutes.",
  },
  [AI_COURSE]: {
    sentence: "AI can help people find patterns in data.",
    translation: "AI 可以幫助人們在資料中找出模式。",
    grammarNote: "can help + 受詞 + 原形動詞，用來表示某工具能協助某人完成動作。",
    usageNote: "適合說明 AI 的基本能力，例如分析資料、整理資訊或提供建議。",
    vocabulary: "AI: 人工智慧；pattern: 模式；data: 資料。",
    example: "AI can help doctors review medical images.",
  },
} satisfies Record<CourseSlug, SentenceFallback>;

export async function ensureCourses() {
  await ensureDatabase();

  await Promise.all(
    Object.values(courses).map((course) =>
      prisma.course.upsert({
        where: { id: course.id },
        update: {
          slug: course.slug,
          name: course.name,
          description: course.description,
        },
        create: course,
      }),
    ),
  );
}

export async function getTodaySentence(courseSlug: CourseSlug = DEFAULT_COURSE) {
  await ensureCourses();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sentence = await prisma.dailySentence.findFirst({
    where: {
      courseId: courseSlug,
      publishDate: { lte: today },
    },
    orderBy: { publishDate: "desc" },
  });

  if (sentence) {
    return sentence;
  }

  return prisma.dailySentence.create({
    data: {
      ...fallbackByCourse[courseSlug],
      courseId: courseSlug,
      publishDate: today,
    },
  });
}

export async function getRecentSentences(courseSlug: CourseSlug = DEFAULT_COURSE, limit = 7) {
  await ensureCourses();

  return prisma.dailySentence.findMany({
    where: { courseId: courseSlug },
    orderBy: { publishDate: "desc" },
    take: limit,
  });
}

export async function getAllSentences(courseSlug?: CourseSlug) {
  await ensureCourses();

  return prisma.dailySentence.findMany({
    where: courseSlug ? { courseId: courseSlug } : undefined,
    orderBy: [{ courseId: "asc" }, { publishDate: "desc" }],
    include: { course: true },
  });
}
