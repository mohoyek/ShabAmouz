"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { extractCwdLine, executeCommand, lineHasPersian } from "@/lib/terminal-engine";
import { useProgressStore } from "@/lib/store";
import type { TerminalContent } from "@/lib/types";

/**
 * ترمینال شبیه‌سازی‌شده شب‌آموز — کامپوننت DOM با ظاهر و رفتار ترمینال واقعی:
 * پرامپت، مکان‌نمای چشمک‌زن، تاریخچه دستورها (فلش بالا/پایین)، cls و اسکرول خودکار.
 *
 * تصمیم معماری (ثبت‌شده در README): از xterm.js استفاده نمی‌شود؛ xterm.js ۶ از
 * متن RTL/bidi پشتیبانی نمی‌کند و خروجی فارسی ناخوانا می‌شد (تست تجربی انجام شد).
 * این کامپوننت رندر فارسی را به موتور bidi مرورگر می‌سپارد و خروجی‌ها دقیقاً
 * همان رشته‌های predefined فایل content/terminal.json هستند.
 *
 * همین کامپوننت در دو زمینه استفاده می‌شود:
 *  - صفحه کامل ترمینال (/terminal) با همه قاعده‌ها
 *  - بخش «تمرین عملی» داخل هر درس با قاعده‌های همان مسیر (enableTryEvents)
 * و با props پرامپت، ارتفاع و دستورهای سریع خود را از زمینه می‌گیرد.
 */

/** نام رخداد سفارشی «امتحان کن» — از دکمه بلوک‌های کد درس منتشر می‌شود */
export const TRY_COMMAND_EVENT = "shabamouz:try-command";

type Tone = "default" | "dim" | "error";

export interface SimulatedTerminalProps {
  content: TerminalContent;
  /** پرامپت پایه (بدون پسوند) — مثلاً پرامپت Bash برای درس‌های لینوکس */
  initialPrompt?: string;
  /** پسوند پرامپت مثل > یا $ */
  promptSuffix?: string;
  /** دستورهای سریع یک‌کلیکی؛ پیش‌فرض: نمونه همان قاعده‌های content */
  quickCommands?: string[];
  /** حداکثر تعداد دکمه دستور سریع (برای جلوگیری از شلوغی) */
  maxQuickCommands?: number;
  /** کلاس ارتفاع ناحیه خروجی */
  heightClass?: string;
  /** متن نوار عنوان پنجره ترمینال */
  title?: string;
  /** شنیدن رخداد «امتحان کن» بلوک‌های کد درس (فقط ترمینال داخل درس) */
  enableTryEvents?: boolean;
}

interface CommandLine {
  kind: "command";
  id: number;
  command: string;
  /** پرامپت لحظه اجرا — در echoهای تاریچه ثابت می‌ماند */
  prompt: string;
}

interface OutputLine {
  kind: "output";
  id: number;
  text: string;
  tone: Tone;
}

type TerminalLine = CommandLine | OutputLine;

function detectTone(text: string): Tone {
  const trimmed = text.trimStart();
  if (trimmed.startsWith("خطا") || trimmed.includes("شناخته‌شده نیست")) return "error";
  if (trimmed.startsWith("(")) return "dim";
  return "default";
}

export function SimulatedTerminal({
  content,
  initialPrompt = "C:\\Users\\Ali",
  promptSuffix = ">",
  quickCommands,
  maxQuickCommands = Number.POSITIVE_INFINITY,
  heightClass = "h-[420px]",
  title = "ShabAmouz — simulated terminal",
  enableTryEvents = false,
}: SimulatedTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [promptPath, setPromptPath] = useState(initialPrompt + promptSuffix);
  const [flash, setFlash] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const didInitRef = useRef(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markTerminalUsed = useProgressStore((s) => s.markTerminalUsed);

  const nextId = () => ++idRef.current;

  const pushWelcome = useCallback(() => {
    const welcome: TerminalLine[] = content.welcome.split("\n").map((text) => ({
      kind: "output" as const,
      id: nextId(),
      text,
      tone: "default" as Tone,
    }));
    welcome.push({ kind: "output", id: nextId(), text: "", tone: "default" });
    setLines(welcome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  /** اجرای شبیه‌سازی‌شده دستور: echo خط پرامپت + چاپ خروجی predefined */
  const runCommand = useCallback(
    (command: string) => {
      const result = executeCommand(command, content);
      markTerminalUsed();

      if (result.clear) {
        setLines([]);
        return;
      }

      const added: TerminalLine[] = [
        { kind: "command", id: nextId(), command, prompt: promptPath },
        ...result.lines.map((text) => ({
          kind: "output" as const,
          id: nextId(),
          text,
          tone: detectTone(text),
        })),
      ];

      const cwd = extractCwdLine(result.lines);
      if (cwd) setPromptPath(cwd + promptSuffix);

      setLines((prev) => [...prev, ...added]);
    },
    [content, markTerminalUsed, promptPath, promptSuffix],
  );

  /** ثبت دستور تایپ‌شده: echo + اجرا + به‌روزرسانی تاریخچه */
  const submit = useCallback(() => {
    const command = value;
    setValue("");
    setCaret(0);
    setHistoryIndex(null);

    const trimmed = command.trim();
    if (!trimmed) {
      setLines((prev) => [
        ...prev,
        { kind: "command", id: nextId(), command: "", prompt: promptPath },
      ]);
      return;
    }
    setHistory((h) => (h[h.length - 1] === command ? h : [...h, command]));
    runCommand(trimmed);
  }, [value, runCommand, promptPath]);

  /** مرور تاریخچه با فلش بالا/پایین */
  const browseHistory = useCallback(
    (direction: 1 | -1) => {
      if (history.length === 0) return;
      if (historyIndex === null) {
        if (direction === 1) return;
        const idx = history.length - 1;
        setHistoryIndex(idx);
        setValue(history[idx]);
        setCaret(history[idx].length);
        return;
      }
      const idx = historyIndex + direction;
      if (idx < 0) return;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setValue("");
        setCaret(0);
        return;
      }
      setHistoryIndex(idx);
      setValue(history[idx]);
      setCaret(history[idx].length);
    },
    [history, historyIndex],
  );

  // پیام خوش‌آمد — فقط یک‌بار در سمت کلاینت (محافظ در برابر دوبار اجرای effect)
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    pushWelcome();
  }, [pushWelcome]);

  // رخداد «امتحان کن» از بلوک‌های کد درس: اجرای دستور + اسکرول + فلش سبز
  useEffect(() => {
    if (!enableTryEvents) return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ command?: string }>).detail;
      const command = detail?.command?.trim();
      if (!command) return;
      runCommand(command);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setFlash(true);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(false), 1400);
    };
    window.addEventListener(TRY_COMMAND_EVENT, handler);
    return () => {
      window.removeEventListener(TRY_COMMAND_EVENT, handler);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, [enableTryEvents, runCommand]);

  // اسکرول خودکار به پایین با هر خروجی جدید
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, value]);

  const focusInput = () => inputRef.current?.focus();

  const syncCaret = () => {
    const el = inputRef.current;
    if (el) setCaret(el.selectionStart ?? el.value.length);
  };

  const resetTerminal = () => {
    setPromptPath(initialPrompt + promptSuffix);
    setValue("");
    setCaret(0);
    setHistoryIndex(null);
    pushWelcome();
    focusInput();
  };

  // دستورهای سریع از داده قاعده‌ها می‌آیند (نه لیست دستی) تا همیشه هم‌خوان با زمینه باشند
  const quick = (quickCommands ?? content.rules.map((r) => r.example)).slice(
    0,
    maxQuickCommands,
  );

  const before = value.slice(0, caret);
  const at = value.slice(caret, caret + 1);
  const after = value.slice(caret + 1);

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className={
        "ltr-content scroll-mt-28 overflow-hidden rounded-xl border bg-zinc-950 shadow-lg transition-colors duration-500 " +
        (flash ? "border-emerald-400 ring-2 ring-emerald-400/40" : "border-zinc-800")
      }
    >
      {/* نوار بالای پنجره ترمینال */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-amber-500/80" />
          <span className="size-3 rounded-full bg-emerald-500/80" />
          <span className="ms-2 font-mono text-xs text-zinc-400">{title}</span>
        </div>
        <button
          type="button"
          onClick={resetTerminal}
          title="پاک‌کردن ترمینال و شروع مجدد"
          aria-label="پاک‌کردن ترمینال و شروع مجدد"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <RotateCcw className="size-3.5" />
          reset
        </button>
      </div>

      {/* دستورهای سریع — از نمونه‌های همان قاعده‌های زمینه جاری */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-2">
        {quick.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              focusInput();
              runCommand(cmd);
            }}
            className="rounded-md bg-zinc-800/70 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-emerald-900/60 hover:text-emerald-300"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* ناحیه خروجی + پرامپت فعال */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className={`thin-scrollbar relative cursor-text overflow-y-auto p-4 text-[13px] leading-6 text-zinc-200 ${heightClass}`}
        style={{ fontFamily: "var(--font-geist-mono), var(--font-vazirmatn), monospace" }}
        aria-label="ترمینال شبیه‌سازی‌شده"
      >
        {lines.map((line) =>
          line.kind === "command" ? (
            <div key={line.id} className="flex flex-wrap items-baseline whitespace-pre-wrap">
              <span className="font-bold text-emerald-400">{line.prompt}</span>
              <span className="text-zinc-100">{line.command}</span>
            </div>
          ) : (
            <div
              key={line.id}
              dir={lineHasPersian(line.text) ? "rtl" : "ltr"}
              className={
                "whitespace-pre-wrap break-words " +
                (line.tone === "error"
                  ? "text-rose-400"
                  : line.tone === "dim"
                    ? "text-zinc-500"
                    : "text-zinc-200")
              }
            >
              {line.text || "\u00a0"}
            </div>
          ),
        )}

        {/* سطر پرامپت فعال با مکان‌نمای چشمک‌زن */}
        <div className="flex flex-wrap items-baseline whitespace-pre-wrap">
          <span className="font-bold text-emerald-400">{promptPath}</span>
          <span className="text-zinc-100">{before}</span>
          <span
            aria-hidden
            className={
              "mx-px inline-block min-w-[0.6em] " +
              (focused
                ? "terminal-cursor bg-emerald-400 text-zinc-950"
                : "bg-zinc-700 text-zinc-950")
            }
          >
            {at || "\u00a0"}
          </span>
          <span className="text-zinc-100">{after}</span>
        </div>

        {/* ورودی پنهان — ثبت کلیدها و نمایش کیبورد موبایل */}
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 h-full w-full cursor-text bg-transparent opacity-0"
          style={{ fontSize: "16px" }}
          value={value}
          aria-label="ورودی دستور ترمینال"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value);
            setCaret(e.target.selectionStart ?? e.target.value.length);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              browseHistory(-1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              browseHistory(1);
            }
          }}
          onKeyUp={syncCaret}
          onClick={syncCaret}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}
