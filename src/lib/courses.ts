export const DEFAULT_COURSE = "daily-english";
export const KIDS_COURSE = "kids-english";

export const courses = {
  [DEFAULT_COURSE]: {
    id: DEFAULT_COURSE,
    slug: DEFAULT_COURSE,
    name: "每日一句英文",
    description: "每天一句實用英文，累積自然語感。",
  },
  [KIDS_COURSE]: {
    id: KIDS_COURSE,
    slug: KIDS_COURSE,
    name: "小學生入門英語",
    description: "短句、基礎單字和生活化例句，適合小學生每天學一點。",
  },
} as const;

export type CourseSlug = keyof typeof courses;

export function normalizeCourseSlug(value: unknown): CourseSlug {
  return value === KIDS_COURSE ? KIDS_COURSE : DEFAULT_COURSE;
}
