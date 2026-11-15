import type { Metadata } from "next";
import { TerminalSquare } from "lucide-react";
import { SimulatedTerminal } from "@/components/terminal/simulated-terminal";
import { getTerminalContent } from "@/lib/content";
import { faNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "ترمینال تمرینی",
  description:
    "ترمینال شبیه‌سازی‌شده برای تمرین امن دستورات شبکه، CMD، گیت، لینوکس، سیسکو، میکروتیک و پاورشل؛ بدون اجرای واقعی و بدون ریسک.",
};

export default function TerminalPage() {
  const content = getTerminalContent();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">ترمینال تمرینی</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          محیطی امن برای تمرین دستورات: هیچ دستوری واقعاً اجرا نمی‌شود و همه خروجی‌ها از
          پیش تعریف شده‌اند؛ اشتباه کردن اینجا هیچ هزینه‌ای ندارد. برای شروع، روی پنجره
          ترمینال کلیک کنید و دستور <code dir="ltr" className="ltr-content rounded bg-muted px-1.5 py-0.5 font-mono">help</code> را
          تایپ کنید یا از دستورهای سریع زیر استفاده کنید.
        </p>
      </header>

      {/* ترمینال تعاملی — خروجی‌ها از content/terminal.json؛ help و cls پویا ساخته می‌شوند */}
      <SimulatedTerminal content={content} maxQuickCommands={10} />

      <p className="mt-2 text-xs text-muted-foreground">
        نکته‌ها: با فلش‌های بالا و پایین به دستورهای قبلی برگردید؛ با{" "}
        <code dir="ltr" className="ltr-content rounded bg-muted px-1.5 py-0.5 font-mono">cls</code>{" "}
        (یا{" "}
        <code dir="ltr" className="ltr-content rounded bg-muted px-1.5 py-0.5 font-mono">clear</code>
        ) صفحه پاک می‌شود؛ دستور{" "}
        <code dir="ltr" className="ltr-content rounded bg-muted px-1.5 py-0.5 font-mono">cd</code>{" "}
        پرامپت را به‌روز می‌کند. دکمه reset هم ترمینال را از نو شروع می‌کند. در هر درس
        هم بخش «تمرین عملی» با دستورهای همان مسیر در پایین صفحه درس وجود دارد.
      </p>

      {/* برگه تقلب: دستورهای پشتیبانی‌شده — داده از terminal.json */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold">
          دستورهای پشتیبانی‌شده ({faNum(content.rules.length)} دستور + help و cls)
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
