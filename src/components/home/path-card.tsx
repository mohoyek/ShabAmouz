"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PathIcon } from "@/components/path-icon";
import { pathStyles } from "@/lib/path-styles";
import { faNum, faPercent } from "@/lib/format";
import { useProgressStore } from "@/lib/store";
import type { LearningPath } from "@/lib/types";

/** داده کمینه درس‌ها که از سرور به این کامپوننت کلاینت پاس داده می‌شود */
export interface PathCardLesson {
  slug: string;
  title: string;
  summary: string;
  duration: number;
  order: number;
}

interface PathCardProps {
  path: LearningPath;
  lessons: PathCardLesson[];
}

/**
 * کارت مسیر یادگیری — نوار پیشرفت زنده از store پیشرفت می‌خواند.
 * کل کارت یک لینک به صفحه مسیر است.
 */
export function PathCard({ path, lessons }: PathCardProps) {
  const style = pathStyles[path.color];
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const total = path.lessonSlugs.length;
  const done = path.lessonSlugs.filter(
    (slug) => completedLessons[`${path.id}/${slug}`],
  ).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const ctaLabel = done === 0 ? "شروع مسیر" : done === total ? "مرور دوباره" : "ادامه یادگیری";

  return (
    <Link href={`/courses/${path.id}`} className="group block" aria-label={`مسیر ${path.title}`}>
      <Card className="h-full gap-0 overflow-hidden pt-0 transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className={`h-1.5 w-full ${style.gradientBar}`} />
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <span className={`flex size-11 items-center justify-center rounded-xl ${style.iconBg}`}>
              <PathIcon name={path.icon} className={`size-6 ${style.iconColor}`} />
            </span>
            {done === total && done > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="size-3.5" />
                تکمیل شد
              </span>
            ) : null}
          </div>
          <CardTitle className="text-xl">{path.title}</CardTitle>
          <CardDescription className="leading-7">{path.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {faNum(total)} درس
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              حدود {faNum(totalMinutes)} دقیقه
            </span>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {faNum(done)} از {faNum(total)} درس تکمیل شد
              </span>
              <span className={`font-extrabold ${style.chipText}`}>{faPercent(percent)}</span>
            </div>
            <Progress
              value={percent}
              className={`h-1.5 ${style.progressTrack} ${style.progressIndicator}`}
              aria-label={`پیشرفت مسیر ${path.title}`}
            />
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition-colors group-hover:text-emerald-600 dark:text-emerald-400">
            {ctaLabel}
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
