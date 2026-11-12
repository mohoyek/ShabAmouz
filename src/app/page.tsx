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

const FEATURES = [
  {
    icon: BookOpen,
    title: "درس‌های کوتاه و واقعی",
    description: "۹ درس فارسی در سه مسیر؛ هر درس کمتر از ۱۵ دقیقه با مثال‌های عملی.",
  },
  {
    icon: ListChecks,
    title: "آزمون و سنجش",
    description: "۳۰ سؤال چهارگزینه‌ای و جای‌خالی با توضیح پاسخ و ثبت امتیاز.",
  },
  {
    icon: TerminalSquare,
    title: "ترمینال شبیه‌سازی‌شده",
    description: "۱۰ دستور شبکه، CMD و گیت را در محیط امن تمرین کنید؛ خروجی واقعی، بدون ریسک.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* بخش قهرمان */}
      <section className="flex flex-col items-center gap-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Network className="size-4" />
          نسخه اولیه — در حال تکمیل محتوا
        </span>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.3] sm:text-4xl md:text-5xl">
          یادگیری شبکه، خط فرمان و گیت
          <span className="block text-emerald-600 dark:text-emerald-400">به زبان ساده و فارسی</span>
        </h1>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          شب‌آموز یک پلتفرم یادگیری کوچک و متمرکز است: سه مسیر کوتاه، مرجع دستورات
          قابل جستجو، آزمون و یک ترمینال شبیه‌سازی‌شده برای تمرین بدون ترس.
          همه‌چیز در مرورگر شما می‌ماند و به ثبت‌نام نیازی نیست.
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
          بعد از هر مسیر، در آزمون ۱۰ سؤالی همان مسیر شرکت کنید؛ امتیاز شما
          به‌صورت خودکار در صفحه «پیشرفت من» ذخیره می‌شود.
        </p>
        <Button asChild variant="outline" className="mt-1">
          <Link href="/quiz">رفتن به آزمون‌ها</Link>
        </Button>
      </section>
    </div>
  );
}
