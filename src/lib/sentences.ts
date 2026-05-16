import { ensureDatabase, prisma } from "./prisma";
import {
  courses,
  DEFAULT_COURSE,
  GRAMMAR_COURSE,
  KIDS_COURSE,
  MOTIVATION_COURSE,
  type CourseSlug,
} from "./courses";

export { courses, DEFAULT_COURSE, GRAMMAR_COURSE, KIDS_COURSE, MOTIVATION_COURSE, normalizeCourseSlug } from "./courses";
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
    grammarNote: "一般現在式用來描述習慣、事實與固定狀態。主詞是 he、she、it 時，動詞通常加 s 或 es。",
    usageNote: "適合描述每天、常常、通常會做的事。",
    vocabulary: "present simple: 一般現在式；habit: 習慣；fact: 事實。",
    example: "She studies English every morning.",
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
