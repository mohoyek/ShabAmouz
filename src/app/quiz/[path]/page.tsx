import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { PathIcon } from "@/components/path-icon";
import { Badge } from "@/components/ui/badge";
import { getAllPathIds, getLearningPath, getQuizQuestions, isPathId } from "@/lib/content";
import { faNum } from "@/lib/format";
import { pathStyles } from "@/lib/path-styles";

interface QuizPageProps {
  params: Promise<{ path: string }>;
}

/** همه مسیرها برای prerender زمان build */
export function generateStaticParams() {
  return getAllPathIds().map((id) => ({ path: id }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { path } = await params;
  if (!isPathId(path)) return { title: "آزمون" };
  const learningPath = getLearningPath(path);
  return {
    title: learningPath ? `آزمون ${learningPath.title}` : "آزمون",
    description: learningPath
      ? `آزمون ۱۰ سؤالی مسیر «${learningPath.title}»: ۷ سؤال چهارگزینه‌ای و ۳ سؤال جای‌خالی با توضیح پاسخ‌ها.`
      : "آزمون شب‌آموز",
  };
}

export default async function QuizPathPage({ params }: QuizPageProps) {
  const { path } = await params;
  if (!isPathId(path)) notFound();

  const learningPath = getLearningPath(path);
  if (!learningPath) notFound();

  const questions = getQuizQuestions(path);
  const style = pathStyles[learningPath.color];

  const mcCount = questions.filter((q) => q.type === "mc").length;
  const blankCount = questions.filter((q) => q.type === "blank").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {/* مسیر نان‌ریزه */}
      <nav
        aria-label="مسیر صفحه"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/quiz" className="hover:text-foreground">
          آزمون‌ها
        </Link>
        <ChevronLeft className="size-3.5" />
        <span className="text-foreground">{learningPath.title}</span>
      </nav>

      {/* سربرگ آزمون */}
      <header className="mb-8 flex items-center gap-4 border-b pb-6">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}>
          <PathIcon name={learningPath.icon} className={`size-8 ${style.iconColor}`} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">آزمون {learningPath.title}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={`${style.chipBg} ${style.chipText} border-transparent`}>
              {faNum(questions.length)} سؤال
            </Badge>
            {faNum(mcCount)} چهارگزینه‌ای + {faNum(blankCount)} جای‌خالی — با هر پاسخ، توضیح
            همان سؤال نمایش داده می‌شود.
          </p>
        </div>
      </header>

      {/* موتور آزمون */}
      <QuizRunner
        path={{
          id: learningPath.id,
          title: learningPath.title,
          color: learningPath.color,
          icon: learningPath.icon,
        }}
        questions={questions}
      />
    </div>
  );
}
