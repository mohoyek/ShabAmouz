"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PathIcon } from "@/components/path-icon";
import { pathStyles } from "@/lib/path-styles";
import { faNum, faPercent } from "@/lib/format";
import { useProgressStore } from "@/lib/store";
import type { LearningPath } from "@/lib/types";

export interface QuizPathStats {
  total: number;
  mc: number;
  blank: number;
}

interface QuizPathCardProps {
  path: LearningPath;
  stats: QuizPathStats;
}

/**
 * کارت آزمون هر مسیر — بهترین نتیجه ذخیره‌شده را از store نشان می‌دهد
 * و دکمه شروع به صفحه آزمون همان مسیر (/quiz/[path]) می‌رود.
 */
export function QuizPathCard({ path, stats }: QuizPathCardProps) {
  const style = pathStyles[path.color];
  const bestPercent = useProgressStore((s) => s.quizResults[path.id]?.bestPercent);
  const attempts = useProgressStore((s) => s.quizResults[path.id]?.attempts);

  return (
    <Card className="h-full gap-4">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
            <PathIcon name={path.icon} className={`size-6 ${style.iconColor}`} />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-lg">{path.title}</CardTitle>
            <CardDescription className="mt-1">
              {faNum(stats.total)} سؤال — {faNum(stats.mc)} چهارگزینه‌ای + {faNum(stats.blank)} جای‌خالی
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-wrap items-center justify-between gap-2">
        {typeof bestPercent === "number" ? (
          <Badge className="gap-1.5 border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Trophy className="size-3.5" />
            بهترین نتیجه: {faPercent(bestPercent)}
            {typeof attempts === "number" && attempts > 1
              ? ` — ${faNum(attempts)} تلاش`
              : ""}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">هنوز نتیجه‌ای ثبت نشده</span>
        )}
        <Button asChild className="gap-2">
          <Link href={`/quiz/${path.id}`}>شروع آزمون</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
