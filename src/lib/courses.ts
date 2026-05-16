export const DEFAULT_COURSE = "daily-english";
export const KIDS_COURSE = "kids-english";
export const MOTIVATION_COURSE = "motivational-english";
export const GRAMMAR_COURSE = "grammar-english";

export const courses = {
  [DEFAULT_COURSE]: {
    id: DEFAULT_COURSE,
    slug: DEFAULT_COURSE,
    name: "每日一句英文",
    description: "每天一句實用英文，搭配文法、用法、單字與延伸例句。",
  },
  [KIDS_COURSE]: {
    id: KIDS_COURSE,
    slug: KIDS_COURSE,
    name: "小學生入門英語",
    description: "適合小學生的日常與課堂英語，每天用短句建立英文信心。",
  },
  [MOTIVATION_COURSE]: {
    id: MOTIVATION_COURSE,
    slug: MOTIVATION_COURSE,
    name: "勵志英語",
    description: "每天一句短而有力量的英文，陪你練習語感，也練習往前走。",
  },
  [GRAMMAR_COURSE]: {
    id: GRAMMAR_COURSE,
    slug: GRAMMAR_COURSE,
    name: "每日一文法",
    description: "每天一個英文文法小單元，用規則、例句與練習慢慢建立句子能力。",
  },
} as const;

export type CourseSlug = keyof typeof courses;

export function normalizeCourseSlug(value: unknown): CourseSlug {
  return typeof value === "string" && value in courses ? (value as CourseSlug) : DEFAULT_COURSE;
}
