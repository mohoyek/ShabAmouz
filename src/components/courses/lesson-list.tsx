"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { pathStyles } from "@/lib/path-styles";
import { faNum, faPercent } from "@/lib/format";
import { useProgressStore } from "@/lib/store";
import type { ColorKey, PathId } from "@/lib/types";
import type { PathCardLesson } from "@/components/home/path-card";

interface LessonListProps {
  pathId: PathId;
  color: ColorKey;
  lessons: PathCardLesson[];
}

/** فهرست درس‌های یک مسیر با وضعیت تکمیل زنده (از store) و نوار پیشرفت مسیر */
export function LessonList({ pathId, color, lessons }: LessonListProps) {
  const style = pathStyles[color];
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const done = lessons.filter(
    (lesson) => completedLessons[`${pathId}/${lesson.slug}`],
  ).length;
  const percent =
    lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold">پیشرفت این مسیر</span>
          <span className={`font-extrabold ${style.chipText}`}>
            {faNum(done)} از {faNum(lessons.length)} درس ({faPercent(percent)})
          </span>
        </div>
        <Progress
          value={percent}
          className={`h-2 ${style.progressTrack} ${style.progressIndicator}`}
          aria-label={`پیشرفت مسیر ${pathId}`}
        />
      </div>

      {lessons.map((lesson) => {
        const completed = Boolean(completedLessons[`${pathId}/${lesson.slug}`]);
        return (
          <Link
            key={lesson.slug}
            href={`/lessons/${pathId}/${lesson.slug}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 sm:gap-4 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          >
            {completed ? (
              <CheckCircle2 className="size-6 shrink-0 text-emerald-500" aria-label="تکمیل‌شده" />
            ) : (
              <Circle className="size-6 shrink-0 text-muted-foreground/40" aria-label="ناتمام" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {lesson.title}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                  درس {faNum(lesson.order)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {lesson.summary}
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <Clock3 className="size-3.5" />
              {faNum(lesson.duration)} دقیقه
            </span>
            <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        );
      })}
    </div>
  );
}
