import type { BlankQuestion, McQuestion } from "@/lib/types";

/**
 * کمکی‌های موتور آزمون — نرمال‌سازی پاسخ جای‌خالی و مقایسه با پاسخ‌های پذیرفته‌شده.
 * مقایسه بدون حساسیت به بزرگی/کوچکی حروف، یکسان‌سازی نویسه‌های عربی/فارسی
 * (ي→ی، ك→ک، ة→ه) و حذف فاصله‌های اضافی انجام می‌شود.
 */
export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[يى]/g, "ی")
    .replace(/[كک]/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/"/g, "")
    .toLowerCase();
}

/** آیا پاسخ وارد‌شده کاربر برای سؤال جای‌خالی صحیح است؟ */
export function isBlankAnswerCorrect(question: BlankQuestion, answer: string): boolean {
  const normalized = normalizeAnswer(answer);
  if (normalized === "") return false;
  return question.acceptedAnswers.some((a) => normalizeAnswer(a) === normalized);
}

/** برچسب فارسی گزینه چهارگزینه‌ای (گزینه ۱ تا ۴) */
export function mcOptionLabel(index: number): string {
  return index.toLocaleString("fa-IR");
}

/** امتیاز پیام نتیجه بر اساس درصد */
export function quizTier(percent: number): {
  icon: "trophy" | "award" | "book";
  title: string;
  description: string;
} {
  if (percent >= 90) {
    return {
      icon: "trophy",
      title: "آفرین، تسلط عالی!",
      description: "دانش شما در این مسیر بسیار خوب است؛ می‌توانید سراغ آزمون مسیر بعدی بروید.",
    };
  }
  if (percent >= 70) {
    return {
      icon: "award",
      title: "خوب بود، ولی جای مرور دارد",
      description:
        "پایه‌ها را یاد گرفته‌اید؛ درس‌هایی که در آن‌ها اشتباه کردید را یک‌بار دیگر مرور کنید.",
    };
  }
  return {
    icon: "book",
    title: "نیاز به مرور بیشتر دارید",
    description:
      "اشکالی ندارد؛ اشتباه کردن بخشی از یادگیری است. درس‌های این مسیر را دوباره بخوانید و بار دیگر تلاش کنید.",
  };
}

/** متن پاسخ داده‌شده کاربر برای نمایش در مرور نتیجه */
export function givenAnswerText(
  question: McQuestion | BlankQuestion,
  given: number | string | null,
): string {
  if (question.type === "mc" && typeof given === "number") {
    return question.options[given];
  }
  if (question.type === "blank" && typeof given === "string") {
    return given;
  }
  return "بدون پاسخ";
}
