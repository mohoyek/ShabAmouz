import type { Metadata } from "next";
import { Info, TerminalSquare } from "lucide-react";
import { getTerminalContent } from "@/lib/content";
import { faNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "ترمینال تمرینی",
  description:
    "ترمینال شبیه‌سازی‌شده برای تمرین امن دستورات شبکه، CMD و گیت؛ بدون اجرای واقعی و بدون ریسک.",
};

export default function TerminalPage() {
  const content = getTerminalContent();
  const pingRule = content.rules.find((rule) => rule.name === "ping");
  const pingGoogleOutput = pingRule?.matches.find((m) => m.args === "google.com")?.output;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">ترمینال تمرینی</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          محیطی امن برای تمرین دستورات: هیچ دستوری واقعاً اجرا نمی‌شود و همه خروجی‌ها از
          پیش تعریف شده‌اند؛ اشتباه کردن اینجا هیچ هزینه‌ای ندارد.
        </p>
      </header>

      {/* اطلاع‌رسانی فاز ۴ */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-1 size-4 shrink-0" />
        <p>
          نسخه تعاملی ترمینال (با xterm.js و تایپ دستور) در فاز ۴ فعال می‌شود. تا آن زمان
          می‌توانید فهرست دستورهای پشتیبانی‌شده را در پایین همین صفحه مرور کنید.
        </p>
      </div>

      {/* پیش‌نمایش غیرتعاملی */}
      <div className="mt-8">
        <div
          dir="ltr"
          className="ltr-content overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-amber-500/80" />
            <span className="size-3 rounded-full bg-emerald-500/80" />
            <span className="ms-2 font-mono text-xs text-zinc-400">
              ShabAmouz — simulated terminal
            </span>
          </div>
          <pre className="thin-scrollbar max-h-96 overflow-auto p-4 font-mono text-[13px] leading-6 text-zinc-100">
            {"$ ping google.com\n\n"}
            {pingGoogleOutput}
          </pre>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          پیش‌نمایش غیرتعاملی — خروجی نمونه دستور <code dir="ltr" className="ltr-content rounded bg-muted px-1.5 py-0.5 font-mono">ping google.com</code>؛ دقیقاً همین خروجی در نسخه تعاملی فاز ۴ هم نمایش داده می‌شود.
        </p>
      </div>

      {/* برگه تقلب: دستورهای پشتیبانی‌شده — داده از terminal.json */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold">
          دستورهای پشتیبانی‌شده ({faNum(content.rules.length)} دستور)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.rules.map((rule) => (
            <div
              key={rule.name}
              className="flex items-start gap-3 rounded-xl border bg-card p-4"
            >
              <TerminalSquare className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <code dir="ltr" className="ltr-content font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {rule.name}
                  </code>
                  <code dir="ltr" className="ltr-content font-mono text-xs text-muted-foreground">
                    {rule.usage}
                  </code>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
