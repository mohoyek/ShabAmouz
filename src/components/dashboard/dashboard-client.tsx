"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Info,
  ListChecks,
  RotateCcw,
  TerminalSquare,
  Trophy,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PathIcon } from "@/components/path-icon";
import { pathStyles } from "@/lib/path-styles";
import { faNum, faPercent } from "@/lib/format";
import { useProgressHydrated, useProgressStore } from "@/lib/store";
import type { ColorKey, PathId } from "@/lib/types";

/** داده کمینه مسیرها که از سرور پاس داده می‌شود */
export interface DashboardPath {
  id: PathId;
  title: string;
  icon: string;
  color: ColorKey;
  lessons: { slug: string; title: string; duration: number }[];
}

/** قالب تاریخ فارسی برای نمایش زمان آخرین آزمون */
const dateFormatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

function formatFaDate(iso: string): string {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

export function DashboardClient({ paths }: { paths: DashboardPath[] }) {
  const hydrated = useProgressHydrated();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const quizResults = useProgressStore((s) => s.quizResults);
  const terminalUsedAt = useProgressStore((s) => s.terminalUsedAt);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  if (!hydrated) {
    // تا قبل از بازیابی از localStorage، اسکلت خنثی نشان می‌دهیم تا پرش محتوایی نداشته باشیم
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        {paths.map((path) => (
          <Skeleton key={path.id} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const totalLessons = paths.reduce((sum, p) => sum + p.lessons.length, 0);
  const doneLessons = Object.keys(completedLessons).length;
  const results = Object.values(quizResults).filter(Boolean);
  const bestPercent = results.reduce((max, r) => Math.max(max, r?.bestPercent ?? 0), 0);
  const attempts = results.reduce((sum, r) => sum + (r?.attempts ?? 0), 0);
  const isEmpty = doneLessons === 0 && attempts === 0;

  const stats = [
    {
      icon: BookOpen,
      label: "درس‌های تکمیل‌شده",
      value: `${faNum(doneLessons)} از ${faNum(totalLessons)}`,
    },
    {
      icon: Trophy,
      label: "بهترین درصد آزمون",
      value: attempts > 0 ? faPercent(bestPercent) : "—",
    },
    {
      icon: ListChecks,
      label: "تلاش‌های آزمون",
      value: faNum(attempts),
    },
    {
      icon: TerminalSquare,
      label: "ترمینال تمرینی",
      value: terminalUsedAt ? "استفاده شده" : "هنوز شروع نشده",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* آمار کلی */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <stat.icon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold">{stat.value}</p>
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* حالت خالی */}
      {isEmpty ? (
        <Card className="py-10">
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <Info className="size-8 text-muted-foreground/60" />
            <p className="text-lg font-bold">هنوز چیزی ثبت نشده</p>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              با تکمیل اولین درس یا شرکت در آزمون، پیشرفت شما اینجا نمایش داده می‌شود.
              داده‌ها فقط روی مرورگر خودتان ذخیره می‌شوند.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/courses">شروع اولین درس</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/terminal">تمرین در ترمینال</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* کارت هر مسیر */}
      {paths.map((path) => {
        const style = pathStyles[path.color];
        const done = path.lessons.filter(
          (lesson) => completedLessons[`${path.id}/${lesson.slug}`],
        ).length;
        const percent =
          path.lessons.length > 0 ? Math.round((done / path.lessons.length) * 100) : 0;
        const result = quizResults[path.id];

        return (
          <Card key={path.id} className="gap-4">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
                    <PathIcon name={path.icon} className={`size-5 ${style.iconColor}`} />
                  </span>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/courses/${path.id}`}
                      className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      {path.title}
                    </Link>
                  </CardTitle>
                </div>
                <span className={`text-sm font-extrabold ${style.chipText}`}>
                  {faNum(done)} از {faNum(path.lessons.length)} درس
                </span>
              </div>
              <Progress
                value={percent}
                className={`h-2 ${style.progressTrack} ${style.progressIndicator}`}
                aria-label={`پیشرفت مسیر ${path.title}`}
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              {path.lessons.map((lesson) => {
                const completed = Boolean(completedLessons[`${path.id}/${lesson.slug}`]);
                return (
                  <Link
                    key={lesson.slug}
                    href={`/lessons/${path.id}/${lesson.slug}`}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
                  >
                    {completed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={
                        completed
                          ? "font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                          : "text-muted-foreground group-hover:text-foreground"
                      }
                    >
                      {lesson.title}
                    </span>
                  </Link>
                );
              })}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
                {result ? (
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                    <span>
                      آخرین آزمون:{" "}
                      <b className="text-foreground">
                        {faNum(result.score)} از {faNum(result.total)} ({faPercent(result.percent)})
                      </b>
                    </span>
                    <span>
                      بهترین: <b className="text-foreground">{faPercent(result.bestPercent)}</b>
                    </span>
                    <span>
                      تلاش‌ها: <b className="text-foreground">{faNum(result.attempts)}</b>
                    </span>
                    <span>
                      تاریخ: <b className="text-foreground">{formatFaDate(result.lastAttemptAt)}</b>
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    آزمون این مسیر هنوز داده نشده — از صفحه{" "}
                    <Link href="/quiz" className="font-bold text-emerald-700 underline underline-offset-4 dark:text-emerald-400">
                      آزمون‌ها
                    </Link>{" "}
                    شروع کنید.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* بازنشانی پیشرفت */}
      <div className="flex justify-start">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <RotateCcw className="size-4" />
              بازنشانی پیشرفت
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>بازنشانی پیشرفت؟</AlertDialogTitle>
              <AlertDialogDescription>
                همه درس‌های تکمیل‌شده و نتایج آزمون‌ها از مرورگر شما پاک می‌شوند. این عمل
                قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => resetProgress()}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                بله، پاک کن
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
