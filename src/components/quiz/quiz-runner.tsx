"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { faNum, faPercent } from "@/lib/format";
import { givenAnswerText, isBlankAnswerCorrect, quizTier } from "@/lib/quiz-utils";
import { useProgressStore } from "@/lib/store";
import type { ColorKey, PathId, QuizQuestion } from "@/lib/types";

export interface QuizPathInfo {
  id: PathId;
  title: string;
  color: ColorKey;
  icon: string;
}

/** رکورد پاسخ هر سؤال برای مرور نتیجه در پایان */
interface AnswerRecord {
  question: QuizQuestion;
  correct: boolean;
  /** برای MC اندیس گزینه، برای جای‌خالی متن تایپ‌شده */
  given: number | string | null;
}

/** متن پاسخ درست برای نمایش در مرور نتایج */
function correctAnswerText(question: QuizQuestion): string {
  if (question.type === "mc") return `گزینه ${faNum(question.correctIndex + 1)}`;
  return question.acceptedAnswers.join(" یا ");
}

export function QuizRunner({ path, questions }: { path: QuizPathInfo; questions: QuizQuestion[] }) {
  const total = questions.length;

  const [step, setStep] = useState<"question" | "result">("question");
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [blankValue, setBlankValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  const saveQuizResult = useProgressStore((s) => s.saveQuizResult);
  const bestPercent = useProgressStore((s) => s.quizResults[path.id]?.bestPercent);
  const attempts = useProgressStore((s) => s.quizResults[path.id]?.attempts);

  const question = questions[index];

  /** ثبت پاسخ و نمایش توضیح */
  const submitAnswer = useCallback(() => {
    if (revealed || !question) return;
    let correct = false;
    let given: number | string | null = null;

    if (question.type === "mc") {
      if (choice === null) return;
      given = choice;
      correct = choice === question.correctIndex;
    } else {
      if (blankValue.trim() === "") return;
      given = blankValue;
      correct = isBlankAnswerCorrect(question, blankValue);
    }

    setRecords((prev) => [...prev, { question, correct, given }]);
    setRevealed(true);
  }, [question, choice, blankValue, revealed]);

  /** رفتن به سؤال بعدی یا پایان آزمون و ذخیره نتیجه در store */
  const goNext = useCallback(() => {
    if (!revealed) return;
    if (index + 1 < total) {
      setIndex(index + 1);
      setChoice(null);
      setBlankValue("");
      setRevealed(false);
      return;
    }
    const score = records.filter((r) => r.correct).length;
    saveQuizResult(path.id, score, total);
    setStep("result");
  }, [revealed, index, total, records, saveQuizResult, path.id]);

  /** شروع مجدد آزمون */
  const restart = useCallback(() => {
    setStep("question");
    setIndex(0);
    setRecords([]);
    setChoice(null);
    setBlankValue("");
    setRevealed(false);
  }, []);

  /* ------------------------------ صفحه نتیجه ------------------------------ */

  if (step === "result") {
    const score = records.filter((r) => r.correct).length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const tier = quizTier(percent);
    const TierIcon = tier.icon === "trophy" ? Trophy : tier.icon === "award" ? Award : BookOpen;

    return (
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden py-0">
          <div className="h-2 w-full bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-500" />
          <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60">
              <TierIcon className="size-8 text-emerald-700 dark:text-emerald-300" />
            </span>
            <p className="text-4xl font-extrabold">{faPercent(percent)}</p>
            <p className="text-lg font-bold">
              {faNum(score)} پاسخ درست از {faNum(total)} سؤال
            </p>
            <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">{tier.title}</p>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">{tier.description}</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
              {typeof bestPercent === "number" ? (
                <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Trophy className="size-3.5" />
                  بهترین نتیجه تاکنون: {faPercent(bestPercent)}
                </Badge>
              ) : null}
              {typeof attempts === "number" ? (
                <Badge variant="outline" className="text-muted-foreground">
                  تلاش شماره {faNum(attempts)}
                </Badge>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button onClick={restart} variant="outline" className="gap-2">
                <RotateCcw className="size-4" />
                تلاش دوباره
              </Button>
              <Button asChild className="gap-2">
                <Link href="/dashboard">مشاهده پیشرفت من</Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <Link href={`/courses/${path.id}`}>درس‌های این مسیر</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* مرور تک‌تک سؤال‌ها */}
        <section>
          <h2 className="mb-3 text-lg font-extrabold">مرور پاسخ‌ها</h2>
          <div className="flex flex-col gap-2">
            {records.map((record, i) => (
              <div
                key={record.question.id}
                className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${
                  record.correct
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20"
                }`}
              >
                {record.correct ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-6">
                    {faNum(i + 1)}. {record.question.text.replace("____", " … ")}
                  </p>
                  {!record.correct ? (
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      پاسخ شما: {givenAnswerText(record.question, record.given)}
                      <span className="mx-2">•</span>
                      پاسخ درست: {correctAnswerText(record.question)}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------ صفحه سؤال ------------------------------ */

  const isMc = question.type === "mc";
  const parts = isMc ? [] : question.text.split("____");

  return (
    <div className="flex flex-col gap-5">
      {/* نوار پیشرفت */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            سؤال {faNum(index + 1)} از {faNum(total)}
          </span>
          <span>
            {faNum(records.filter((r) => r.correct).length)} پاسخ درست تا اینجا
          </span>
        </div>
        <Progress
          value={((index + (revealed ? 1 : 0)) / total) * 100}
          aria-label={`پیشرفت آزمون؛ سؤال ${faNum(index + 1)} از ${faNum(total)}`}
        />
      </div>

      <Card className="gap-5">
        {/* سؤال */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {isMc ? "چهارگزینه‌ای" : "جای‌خالی"}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {path.title}
            </Badge>
          </div>

          {isMc ? (
            <p className="text-lg font-bold leading-9">{question.text}</p>
          ) : (
            <p className="text-lg font-bold leading-9">
              {parts[0]}
              <input
                dir="ltr"
                type="text"
                disabled={revealed}
                value={blankValue}
                onChange={(e) => setBlankValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                aria-label="پاسخ جای خالی"
                placeholder="پاسخ…"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className={`ltr-content mx-2 inline-block w-56 rounded-md border px-3 py-1.5 text-center font-mono text-base transition-colors disabled:opacity-80 ${
                  revealed
                    ? records[index]?.correct
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                    : "bg-background"
                }`}
              />
              {parts[1]}
            </p>
          )}

          {/* گزینه‌های چهارگزینه‌ای */}
          {isMc ? (
            <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="گزینه‌های سؤال">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correctIndex;
                const isChosen = choice === i;
                let classes =
                  "flex items-start gap-3 rounded-xl border bg-card p-3.5 text-start text-sm leading-7 transition-all";
                if (!revealed) {
                  classes += isChosen
                    ? " border-emerald-500 ring-2 ring-emerald-500/30"
                    : " hover:border-emerald-400 hover:bg-muted/50";
                } else {
                  classes += isCorrect
                    ? " border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30"
                    : isChosen
                      ? " border-rose-400 bg-rose-50/70 dark:bg-rose-950/30"
                      : " opacity-55";
                }
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    disabled={revealed}
                    onClick={() => setChoice(i)}
                    className={classes}
                  >
                    <span
                      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        revealed && isCorrect
                          ? "bg-emerald-600 text-white"
                          : revealed && isChosen
                            ? "bg-rose-500 text-white"
                            : isChosen
                              ? "bg-emerald-600 text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {faNum(i + 1)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* دکمه ثبت پاسخ (قبل از نمایش توضیح) */}
          {!revealed ? (
            <Button
              onClick={submitAnswer}
              disabled={isMc ? choice === null : blankValue.trim() === ""}
              className="self-start gap-2"
            >
              ثبت پاسخ
              <ChevronLeft className="size-4" />
            </Button>
          ) : null}

          {/* نتیجه + توضیح (بعد از ثبت) */}
          {revealed ? (
            <div className="flex flex-col gap-3">
              <div
                className={`rounded-xl px-4 py-3 text-sm font-bold leading-7 ${
                  records[index]?.correct
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                }`}
              >
                {records[index]?.correct ? "درست بود، آفرین!" : "پاسخ اشتباه بود."}
                {!records[index]?.correct ? (
                  <span className="ms-2 font-normal">پاسخ درست: {correctAnswerText(question)}</span>
                ) : null}
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border bg-muted/30 px-4 py-3">
                <Lightbulb className="mt-1 size-4 shrink-0 text-amber-500" />
                <p className="text-sm leading-7 text-muted-foreground">{question.explanation}</p>
              </div>
              <Button onClick={goNext} className="self-start gap-2">
                {index + 1 < total ? "سؤال بعدی" : "مشاهده نتیجه"}
                <ChevronLeft className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {/* بازگشت */}
      <Button asChild variant="ghost" className="self-start gap-2 text-muted-foreground">
        <Link href="/quiz">
          <ArrowRight className="size-4" />
          بازگشت به فهرست آزمون‌ها
        </Link>
      </Button>
    </div>
  );
}
