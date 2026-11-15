"use client";

import { TerminalSquare } from "lucide-react";
import { TRY_COMMAND_EVENT } from "@/components/terminal/simulated-terminal";

/**
 * دکمه «امتحان کن» روی بلوک‌های کد درس — کاربر موقع خواندن می‌تواند همان دستور
 * را بدون تایپ، در ترمینال تمرینی پایین صفحه اجرا کند.
 * ارتباط با ترمینال از طریق رخداد سفارشی window انجام می‌شود تا کامپوننت‌ها
 * به هم وابستگی مستقیم نداشته باشند؛ ترمینال خودش اسکرول و اجرا را انجام می‌دهد.
 */
export function TryItButton({ command }: { command: string }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(TRY_COMMAND_EVENT, { detail: { command } }));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`اجرای دستور در ترمینال تمرینی: ${command}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/40 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 transition-colors hover:border-emerald-500 hover:bg-emerald-900 hover:text-emerald-200"
    >
      <TerminalSquare className="size-3.5" />
      امتحان کن در ترمینال
    </button>
  );
}
