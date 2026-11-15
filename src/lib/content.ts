import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import type {
  CommandRef,
  LearningPath,
  Lesson,
  LessonFrontmatter,
  PathId,
  QuizQuestion,
  RoadmapContent,
  TerminalContent,
} from "@/lib/types";

/**
 * لایه بارگذاری محتوا — فقط در سمت سرور اجرا می‌شود.
 * همه محتوا از پوشه content/ خوانده می‌شود و هیچ داده‌ای در کامپوننت‌ها hardcode نشده است.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonFile<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

/* --------------------------------- مسیرها --------------------------------- */

export const getLearningPaths = cache((): LearningPath[] => {
  return readJsonFile<LearningPath[]>("paths.json").sort((a, b) => a.order - b.order);
});

export const getLearningPath = cache((id: PathId): LearningPath | undefined => {
  return getLearningPaths().find((p) => p.id === id);
});

/* ---------------------------------- درس‌ها ---------------------------------- */

function readLessonFile(pathId: PathId, slug: string): Lesson {
  const filePath = path.join(CONTENT_DIR, "lessons", pathId, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as LessonFrontmatter;
  return {
    frontmatter: { ...frontmatter, slug: frontmatter.slug || slug, path: pathId },
    body: content.trim(),
  };
}

/** همه درس‌های یک مسیر، مرتب بر اساس order */
export const getLessonsForPath = cache((pathId: PathId): Lesson[] => {
  const learningPath = getLearningPath(pathId);
  if (!learningPath) return [];
  return learningPath.lessonSlugs
    .map((slug) => readLessonFile(pathId, slug))
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
});

/** یک درس مشخص؛ اگر نبود null */
export const getLesson = cache((pathId: PathId, slug: string): Lesson | null => {
  try {
    const lesson = readLessonFile(pathId, slug);
    // فقط درس‌هایی که واقعاً در فهرست مسیر تعریف شده‌اند معتبرند
    const learningPath = getLearningPath(pathId);
    if (!learningPath?.lessonSlugs.includes(slug)) return null;
    return lesson;
  } catch {
    return null;
  }
});

/** درس قبلی و بعدی برای ناوبری پایین صفحه درس */
export function getLessonNeighbors(
  pathId: PathId,
  slug: string,
): { prev: Lesson | null; next: Lesson | null } {
  const lessons = getLessonsForPath(pathId);
  const index = lessons.findIndex((l) => l.frontmatter.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

/** بررسی اینکه مقدار داده‌شده یکی از شناسه‌های مسیر معتبر است (برای صفحات داینامیک) */
export function isPathId(value: string): value is PathId {
  return getLearningPaths().some((p) => p.id === value);
}

/** پارامترهای استاتیک همه مسیرهای [path] برای prerender در زمان build */
export function getAllPathIds(): PathId[] {
  return getLearningPaths().map((p) => p.id);
}

/** پارامترهای استاتیک همه درس‌ها [path]/[lesson] برای prerender در زمان build */
export function getAllLessonParams(): { path: PathId; lesson: string }[] {
  return getLearningPaths().flatMap((p) =>
    p.lessonSlugs.map((slug) => ({ path: p.id, lesson: slug })),
  );
}

/* ------------------------------- مرجع دستورات ------------------------------- */

export const getReferenceCommands = cache((): CommandRef[] => {
  return readJsonFile<CommandRef[]>("reference.json");
});

/* ----------------------------------- آزمون ----------------------------------- */

export const getQuizQuestions = cache((pathId?: PathId): QuizQuestion[] => {
  const questions = readJsonFile<QuizQuestion[]>("quiz.json");
  return pathId ? questions.filter((q) => q.path === pathId) : questions;
});

/* ---------------------------------- ترمینال ---------------------------------- */

export const getTerminalContent = cache((): TerminalContent => {
  return readJsonFile<TerminalContent>("terminal.json");
});

/* --------------------------------- نقشه راه --------------------------------- */

export const getRoadmap = cache((): RoadmapContent => {
  const content = readJsonFile<RoadmapContent>("roadmap.json");
  return { ...content, levels: [...content.levels].sort((a, b) => a.order - b.order) };
});
