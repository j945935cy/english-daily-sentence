import { ensureDatabase, prisma } from "./prisma";
import { courses, DEFAULT_COURSE, KIDS_COURSE, type CourseSlug } from "./courses";
export { courses, DEFAULT_COURSE, KIDS_COURSE, normalizeCourseSlug } from "./courses";
export type { CourseSlug } from "./courses";

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

  const fallback =
    courseSlug === KIDS_COURSE
      ? {
          sentence: "I like apples.",
          translation: "我喜歡蘋果。",
          grammarNote: "I like + 名詞，表示「我喜歡……」。",
          usageNote: "這是很基礎的喜好句型，適合用來談食物、顏色、動物或活動。",
          vocabulary: "I: 我；like: 喜歡；apple: 蘋果。",
          example: "I like bananas.",
        }
      : {
          sentence: "Small steps every day lead to remarkable progress.",
          translation: "每天小小前進，會累積成很驚人的進步。",
          grammarNote:
            "Small steps 是主詞，lead to 表示「導致、帶來」，後面接名詞 remarkable progress。",
          usageNote: "這句適合鼓勵自己或別人持續學習，語氣自然、正面，也常用在讀書或工作目標。",
          vocabulary: "remarkable: 顯著的、值得注意的；progress: 進步；lead to: 帶來、導致。",
          example: "Consistent review leads to better speaking confidence.",
        };

  return prisma.dailySentence.create({
    data: {
      ...fallback,
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
