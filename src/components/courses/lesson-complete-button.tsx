"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/lib/store";
import type { PathId } from "@/lib/types";

interface LessonCompleteButtonProps {
  pathId: PathId;
  slug: string;
}

/**
 * دکمه ثبت تکمیل درس — وضعیت در localStorage ذخیره می‌شود.
 * اگر درس قبلاً تکمیل شده باشد، دکمه حالت «تکمیل‌شده» نشان می‌دهد.
 */
export function LessonCompleteButton({ pathId, slug }: LessonCompleteButtonProps) {
  const completed = useProgressStore(
    (s) => Boolean(s.completedLessons[`${pathId}/${slug}`]),
  );
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);

  if (completed) {
    return (
      <Button
        variant="outline"
        disabled
        className="gap-2 border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
      >
        <CheckCircle2 className="size-4" />
        این درس را تکمیل کرده‌اید
      </Button>
    );
  }

  return (
    <Button onClick={() => markLessonComplete(pathId, slug)} className="gap-2">
      <CheckCircle2 className="size-4" />
      علامت‌گذاری به‌عنوان تکمیل‌شده
    </Button>
  );
}
