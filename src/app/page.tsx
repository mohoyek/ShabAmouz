import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ListChecks,
  Network,
  TerminalSquare,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PathCard } from "@/components/home/path-card";
import {
  getLearningPaths,
  getLessonsForPath,
  getQuizQuestions,
  getReferenceCommands,
  getTerminalContent,
} from "@/lib/content";
import { faNum } from "@/lib/format";

const FEATURES = [
  {
    icon: BookOpen,
    title: "درس‌های کوتاه و واقعی",
    description: "درس‌های فارسی با مثال‌های عملی و بلوک‌های کد؛ هر درس کمتر از ۱۵ دقیقه.",
  },
  {
    icon: ListChecks,
    title: "آزمون و سنجش",
    description: "سؤالات چهارگزینه‌ای و جای‌خالی با توضیح پاسخ؛ نتیجه در «پیشرفت من» ذخیره می‌شود.",
  },
  {
    icon: TerminalSquare,
    title: "ترمینال شبیه‌سازی‌شده",
    description: "دستورات شبکه، CMD و گیت را در محیط امن تمرین کنید؛ خروجی واقعی، بدون ریسک.",
  },
] as const;

export default function HomePage() {
  const paths = getLearningPaths();
  const totalLessons = paths.reduce((sum, p) => sum + p.lessonSlugs.length, 0);
  const totalQuiz = getQuizQuestions().length;
  const totalCommands = getReferenceCommands().length;
  const terminalCommands = getTerminalContent().rules.length;

  const stats = [
    { label: "مسیر یادگیری", value: faNum(paths.length) },
    { label: "درس کوتاه", value: faNum(totalLessons) },
    { label: "سؤال آزمون", value: faNum(totalQuiz) },
    { label: "دستور در مرجع", value: faNum(totalCommands) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* بخش قهرمان */}
      <section className="flex flex-col items-center gap-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Network className="size-4" />
          متن‌باز، بدون ثبت‌نام؛ همه‌چیز در مرورگر شما می‌ماند
        </span>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.3] sm:text-4xl md:text-5xl">
          یادگیری شبکه، خط فرمان و گیت
          <span className="block text-emerald-600 dark:text-emerald-400">به زبان ساده و فارسی</span>
        </h1>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          شب‌آموز یک پلتفرم یادگیری کوچک و متمرکز است: مسیرهای کوتاه ساختاریافته، مرجع
          دستورات قابل جستجو، آزمون و یک ترمینال شبیه‌سازی‌شده برای تمرین بدون ترس.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link href="/courses">
              شروع یادگیری
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 text-base">
            <Link href="/terminal">
              <TerminalSquare className="size-4" />
              تمرین در ترمینال
            </Link>
          </Button>
        </div>
      </section>

      {/* نوار آمار — همه اعداد از فایل‌های content/ خوانده می‌شوند */}
      <section className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-4 text-center">
            <CardContent className="flex flex-col gap-1 px-3">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* مسیرهای یادگیری */}
      <section className="mt-14">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">مسیرهای یادگیری</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            سه مسیر کوتاه و عملی؛ به ترتیب جلو بروید یا مستقیم سراغ چیزی بروید که لازم دارید.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              lessons={getLessonsForPath(path.id).map((lesson) => lesson.frontmatter)}
            />
          ))}
        </div>
      </section>

      {/* امکانات */}
      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="gap-3 py-6">
            <CardHeader className="items-start">
              <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <feature.icon className="size-5" />
              </span>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="leading-7">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* دعوت به آزمون */}
      <section className="mt-10 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 px-6 py-8 text-center">
        <Trophy className="size-6 text-amber-500" />
        <h2 className="text-xl font-bold">آماده سنجش دانش خود هستید؟</h2>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          بعد از هر مسیر، در آزمون ۱۰ سؤالی همان مسیر ({faNum(totalQuiz)} سؤال در کل) شرکت کنید؛
          امتیاز شما به‌صورت خودکار در صفحه «پیشرفت من» ذخیره می‌شود.
        </p>
        <Button asChild variant="outline" className="mt-1">
          <Link href="/quiz">رفتن به آزمون‌ها</Link>
        </Button>
      </section>
    </div>
  );
}
