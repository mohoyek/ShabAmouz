import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Info,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLearningPaths, getRoadmap } from "@/lib/content";
import { faNum } from "@/lib/format";
import type { LearningPath, RoadmapLevel } from "@/lib/types";

export const metadata: Metadata = {
  title: "نقشه راه شغلی شبکه",
  description:
    "نقشه راه چهار مرحله‌ای حرفه‌ای شدن در شبکه — شبکه پایه، کارآموز، کارشناس و مدیر — هم‌راستا با مدارک جهانی CompTIA، Cisco CCNA/CCNP/CCIE، Juniper، MikroTik و ITIL.",
};

/**
 * استایل نود هر مرحله — طبق قاعده کلاس‌های ثابت (مانند path-styles) تا Tailwind
 * کلاس‌ها را purge نکند. رنگ نود با هر مرحله پررنگ‌تر می‌شود (مسیر رشد).
 */
const LEVEL_NODE_STYLES = [
  "bg-emerald-400 text-emerald-950",
  "bg-emerald-500 text-white",
  "bg-emerald-600 text-white",
  "bg-emerald-700 text-white dark:bg-emerald-500 dark:text-emerald-950",
];

function nodeStyleFor(order: number): string {
  return LEVEL_NODE_STYLES[order - 1] ?? LEVEL_NODE_STYLES[LEVEL_NODE_STYLES.length - 1];
}

export default function RoadmapPage() {
  const roadmap = getRoadmap();
  const allPaths = getLearningPaths();

  /** مسیرهای شب‌آموز مرتبط با هر مرحله (فقط شناسه‌های معتبر) */
  function relatedPathsFor(level: RoadmapLevel): LearningPath[] {
    return level.relatedPathIds
      .map((id) => allPaths.find((p) => p.id === id))
      .filter((p): p is LearningPath => Boolean(p));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* سربرگ */}
      <header className="mb-12 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Map className="size-4" />
          نقشه راه شغلی
        </span>
        <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
          از شبکه پایه تا مدیر شبکه
        </h1>
        <p className="mt-4 leading-8 text-muted-foreground">{roadmap.intro}</p>
      </header>

      {/* تایم‌لاین مرحله‌ها */}
      <ol className="flex flex-col gap-10">
        {roadmap.levels.map((level, index) => {
          const prev = index > 0 ? roadmap.levels[index - 1] : null;
          const related = relatedPathsFor(level);
          return (
            <li
              key={level.id}
              className="relative ps-16 before:absolute before:top-10 before:bottom-[-2.5rem] before:start-[19px] before:w-0.5 before:bg-emerald-200 dark:before:bg-emerald-800 last:before:hidden"
            >
              {/* نود شماره مرحله */}
              <span
                aria-hidden="true"
                className={`absolute start-0 top-0 flex size-10 items-center justify-center rounded-full text-base font-extrabold ring-4 ring-background ${nodeStyleFor(level.order)}`}
              >
                {faNum(level.order)}
              </span>

              <Card className="gap-4 overflow-hidden py-0">
                <div className="h-1.5 w-full bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-400" />
                <CardHeader className="gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <CardTitle className="text-xl font-extrabold">
                        {level.title}
                      </CardTitle>
                      <span
                        dir="ltr"
                        className="ltr-content font-mono text-xs text-muted-foreground"
                      >
                        {level.englishTitle}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="gap-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <Clock className="size-3.5" />
                      {level.duration}
                    </Badge>
                  </div>
                  {prev ? (
                    <p className="text-xs text-muted-foreground">
                      پیش‌نیاز: مرحله {faNum(prev.order)} — {prev.title}
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      بدون پیش‌نیاز — نقطه شروع مسیر
                    </p>
                  )}
                  <CardDescription className="text-sm leading-7">
                    {level.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                  {/* مهارت‌های مرحله */}
                  <section aria-label={`مهارت‌های مرحله ${level.title}`}>
                    <h3 className="mb-2.5 text-sm font-bold">مهارت‌های این مرحله</h3>
                    <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                      {level.skills.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-start gap-2 text-sm leading-7 text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* مدارک جهانی */}
                  <section aria-label={`مدارک جهانی مرحله ${level.title}`}>
                    <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-bold">
                      <Award className="size-4 text-amber-500" />
                      مدارک و استانداردهای جهانی این مرحله
                    </h3>
                    <div className="flex flex-col gap-2">
                      {level.certifications.map((cert) => (
                        <div
                          key={cert.name}
                          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border bg-muted/30 px-3 py-2.5"
                        >
                          <code
                            dir="ltr"
                            className="ltr-content rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            {cert.name}
                          </code>
                          <Badge variant="secondary" className="text-[11px]">
                            {cert.issuer}
                          </Badge>
                          <span className="min-w-48 flex-1 text-xs leading-6 text-muted-foreground">
                            {cert.note}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* اتصال به محتوای شب‌آموز */}
                  {related.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2.5 rounded-lg bg-emerald-50/70 px-3 py-2.5 dark:bg-emerald-950/30">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        در شب‌آموز چه بخوانید؟
                      </span>
                      {related.map((path) => (
                        <Button
                          asChild
                          key={path.id}
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1.5 rounded-full px-3 text-xs"
                        >
                          <Link href={`/courses/${path.id}`}>
                            {path.title}
                            <ArrowLeft className="size-3" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed px-3 py-2.5 text-xs leading-6 text-muted-foreground">
                      محتوای اختصاصی این مرحله در نسخه‌های بعدی شب‌آموز اضافه می‌شود؛ برای
                      رسیدن به این سطح، روی مدارک بالا و تمرین آزمایشگاهی تمرکز کنید.
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>

      {/* مبنا و دعوت به اقدام */}
      <section className="mt-12 flex flex-col gap-4 rounded-2xl border bg-muted/30 px-6 py-6 sm:flex-row sm:items-start">
        <Info className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-7 text-muted-foreground">
            {roadmap.standardsNote}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href="/courses">
                شروع مرحله ۱
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quiz">سنجش خودتان با آزمون‌ها</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
