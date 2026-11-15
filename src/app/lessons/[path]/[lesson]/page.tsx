import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, Clock3, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonContent } from "@/components/mdx/lesson-content";
import { LessonCompleteButton } from "@/components/courses/lesson-complete-button";
import { SimulatedTerminal } from "@/components/terminal/simulated-terminal";
import {
  getAllLessonParams,
  getLesson,
  getLessonNeighbors,
  getLearningPath,
  getTerminalContentForLesson,
  isPathId,
} from "@/lib/content";
import { getPromptForPath } from "@/lib/terminal-prompts";
import { pathStyles } from "@/lib/path-styles";
import { faNum } from "@/lib/format";

interface LessonPageProps {
  params: Promise<{ path: string; lesson: string }>;
}

export function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { path, lesson } = await params;
  if (!isPathId(path)) return { title: "درس یافت نشد" };
  const found = getLesson(path, lesson);
  if (!found) return { title: "درس یافت نشد" };
  return {
    title: found.frontmatter.title,
    description: found.frontmatter.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { path, lesson: slug } = await params;
  if (!isPathId(path)) notFound();

  const lesson = getLesson(path, slug);
  if (!lesson) notFound();

  const learningPath = getLearningPath(path);
  if (!learningPath) notFound();

  const { prev, next } = getLessonNeighbors(path, slug);
  const fm = lesson.frontmatter;
  const style = pathStyles[learningPath.color];

  // ترمینال تمرینی همان مسیر + پرامپت متناسب با خانواده فناوری (Bash/IOS/RouterOS/…)
  const practiceTerminal = getTerminalContentForLesson(path, fm.title);
  const promptStyle = getPromptForPath(path);
  const tryCommands = practiceTerminal.rules.map((r) => r.name.toLowerCase());

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {/* مسیر نان‌ریزه */}
      <nav
        aria-label="مسیر صفحه"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/courses" className="hover:text-foreground">
          مسیرهای یادگیری
        </Link>
        <ChevronLeft className="size-3.5" />
        <Link href={`/courses/${path}`} className="hover:text-foreground">
          {learningPath.title}
        </Link>
        <ChevronLeft className="size-3.5" />
        <span className="text-foreground">{fm.title}</span>
      </nav>

      {/* سربرگ درس */}
      <header className="mb-8 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`${style.chipBg} ${style.chipText} border-transparent`}>
            {learningPath.title}
          </Badge>
          <span className="text-xs text-muted-foreground">
            درس {faNum(fm.order)} از {faNum(learningPath.lessonSlugs.length)}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-snug">{fm.title}</h1>
        <p className="mt-2 leading-7 text-muted-foreground">{fm.summary}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />
          حدود {faNum(fm.duration)} دقیقه مطالعه
        </p>
      </header>

      {/* بدنه درس — بلوک‌های کد به‌صورت LTR رندر می‌شوند؛ بلوک‌های قابل تمرین دکمه «امتحان کن» دارند */}
      <article>
        <LessonContent body={lesson.body} tryCommands={tryCommands} />
      </article>

      {/* تمرین عملی در همان صفحه — کاربر موقع خواندن دستورها را امتحان می‌کند */}
      {practiceTerminal.rules.length > 0 ? (
        <section
          id="practice-terminal"
          aria-label="تمرین عملی درس"
          className="mt-12 scroll-mt-24"
        >
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                <TerminalSquare className="size-5 text-emerald-600 dark:text-emerald-400" />
                تمرین عملی همین درس
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                ترمینال شبیه‌سازی‌شده امن است: هیچ دستوری واقعاً اجرا نمی‌شود و اشتباه
                کردن هزینه‌ای ندارد. روی بلوک‌های کد بالا دکمه «امتحان کن» هست، یا همان
                جا دستور بنویسید.
              </p>
            </div>
            <div className="text-end text-xs text-muted-foreground">
              <span className="inline-block rounded-full border bg-muted/50 px-2.5 py-1">
                {faNum(practiceTerminal.rules.length)} دستور پشتیبانی‌شده
              </span>
              <Link
                href="/terminal"
                className="mt-1.5 block text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-600 dark:text-emerald-400"
              >
                ترمینال کامل با همه دستورها
              </Link>
            </div>
          </header>
          <SimulatedTerminal
            content={practiceTerminal}
            initialPrompt={promptStyle.initialPrompt}
            promptSuffix={promptStyle.promptSuffix}
            heightClass="h-[360px]"
            title="ShabAmouz — lesson practice"
            enableTryEvents
          />
        </section>
      ) : null}

      {/* ثبت تکمیل */}
      <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-6 text-center sm:flex-row sm:justify-between sm:text-start">
        <p className="text-sm leading-7 text-muted-foreground">
          این درس را کامل خواندید؟ با ثبت تکمیل، پیشرفت شما در صفحه «پیشرفت من» و نوار
          پیشرفت مسیر دیده می‌شود.
        </p>
        <LessonCompleteButton pathId={path} slug={slug} />
      </div>

      {/* ناوبری درس قبلی / بعدی */}
      <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="ناوبری درس‌ها">
        <div className="contents">
          {prev ? (
            <Link
              href={`/lessons/${path}/${prev.frontmatter.slug}`}
              className="group flex flex-col gap-1.5 rounded-xl border bg-card p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                درس قبلی
              </span>
              <span className="font-bold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {prev.frontmatter.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" aria-hidden="true" />
          )}
        </div>
        {next ? (
          <Link
            href={`/lessons/${path}/${next.frontmatter.slug}`}
            className="group flex flex-col items-start gap-1.5 rounded-xl border bg-card p-4 text-start transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 sm:items-end dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          >
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              درس بعدی
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            </span>
            <span className="font-bold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
              {next.frontmatter.title}
            </span>
          </Link>
        ) : (
          <Button
            asChild
            className="mt-1 w-full bg-emerald-600 hover:bg-emerald-700 sm:mt-0"
          >
            <Link href={`/courses/${path}`}>پایان مسیر — برگرد به صفحه مسیر</Link>
          </Button>
        )}
      </nav>
    </div>
  );
}
