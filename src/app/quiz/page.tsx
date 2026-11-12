import type { Metadata } from "next";
import { Info } from "lucide-react";
import { QuizPathCard } from "@/components/quiz/quiz-path-card";
import { getLearningPaths, getQuizQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "آزمون‌ها",
  description:
    "آزمون ۱۰ سؤالی هر مسیر (چهارگزینه‌ای + جای‌خالی) با توضیح پاسخ؛ نتیجه در پیشرفت من ذخیره می‌شود.",
};

export default function QuizPage() {
  const paths = getLearningPaths();

  const cards = paths.map((path) => {
    const questions = getQuizQuestions(path.id);
    return {
      path,
      stats: {
        total: questions.length,
        mc: questions.filter((q) => q.type === "mc").length,
        blank: questions.filter((q) => q.type === "blank").length,
      },
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">آزمون‌ها</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          بعد از پایان هر مسیر، دانش خود را با آزمون ۱۰ سؤالی همان مسیر بسنجید: ۷ سؤال
          چهارگزینه‌ای و ۳ سؤال جای‌خالی. نتیجه هر آزمون به‌صورت خودکار در «پیشرفت من»
          ذخیره می‌شود.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ path, stats }) => (
          <QuizPathCard key={path.id} path={path} stats={stats} />
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-1 size-4 shrink-0" />
        <p>
          موتور اجرای آزمون در فاز ۴ فعال می‌شود؛ تا آن زمان می‌توانید درس‌ها را مرور کنید
          و بهترین نتیجه‌های ثبت‌شده قبلی در همین صفحه نمایش داده می‌شود.
        </p>
      </div>
    </div>
  );
}
