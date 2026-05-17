export const DEFAULT_COURSE = "daily-english";
export const KIDS_COURSE = "kids-english";
export const MOTIVATION_COURSE = "motivational-english";
export const GRAMMAR_COURSE = "grammar-english";
export const PHRASE_COURSE = "phrase-english";
export const PATTERN_COURSE = "pattern-english";
export const AI_COURSE = "ai-knowledge-english";

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
    name: "小學生每日一句英語",
    description: "適合小學生的日常與課堂英語，每天用短句建立英文信心。",
  },
  [MOTIVATION_COURSE]: {
    id: MOTIVATION_COURSE,
    slug: MOTIVATION_COURSE,
    name: "每日一勵志英語",
    description: "每天一句短而有力量的英文，陪你練習語感，也練習往前走。",
  },
  [GRAMMAR_COURSE]: {
    id: GRAMMAR_COURSE,
    slug: GRAMMAR_COURSE,
    name: "每日一文法",
    description: "每天一個英文文法小單元，用規則、例句與練習慢慢建立句子能力。",
  },
  [PHRASE_COURSE]: {
    id: PHRASE_COURSE,
    slug: PHRASE_COURSE,
    name: "每日一片語",
    description: "每天一個常用英文片語，學意思、用法、搭配詞與自然例句。",
  },
  [PATTERN_COURSE]: {
    id: PATTERN_COURSE,
    slug: PATTERN_COURSE,
    name: "每日一句型",
    description: "每天拆解一個實用英文句型，練會替換主詞、動詞和情境。",
  },
  [AI_COURSE]: {
    id: AI_COURSE,
    slug: AI_COURSE,
    name: "每日一AI知識英文學習",
    description: "每天用一句英文認識 AI 概念、工具、風險與應用情境。",
  },
} as const;

export type CourseSlug = keyof typeof courses;

export function normalizeCourseSlug(value: unknown): CourseSlug {
  return typeof value === "string" && value in courses ? (value as CourseSlug) : DEFAULT_COURSE;
}
