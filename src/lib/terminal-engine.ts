import type { TerminalContent, TerminalRule } from "@/lib/types";

/**
 * موتور اجرای دستورهای ترمینال شبیه‌سازی‌شده — تابع خالص و بدون وابستگی به DOM.
 * هیچ دستوری واقعاً اجرا نمی‌شود؛ خروجی‌ها از قواعد content/terminal.json می‌آیند.
 *
 * منطق تطبیق آرگومان‌ها (به ترتیب اولویت):
 *  ۱) تطبیق دقیق (بدون حساسیت به بزرگی/کوچکی حروف) مثل "google.com" یا "add ."
 *  ۲) الگوی "{{rest}}" — پیشوند ثابت + بقیه به‌عنوان {{rest}} (مثل "commit -m {{rest}}")
 *  ۳) الگوی پایان‌یافته با " *" — پیشوند + هر چیز بعدش (مثل "add *" و "commit *")
 *  ۴) "*" تنها — هر آرگومان غیرخالی (مثل "*" در ping)
 * در نبود تطبیق، defaultOutput قاعده برگردانده می‌شود.
 */

export interface TerminalCommandResult {
  /** اگر true باشد، صفحه ترمینال باید پاک شود (cls) */
  clear: boolean;
  /** خطوط خروجی؛ هر عضو یک سطر است (سطر خالی مجاز است) */
  lines: string[];
}

/** الگوی تشخیص نویسه‌های فارسی/عربی برای انتخاب جهت رندر هر سطر */
const PERSIAN_RE =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** آیا این سطر متن فارسی دارد؟ (برای dir=rtl در رندر ترمینال) */
export function lineHasPersian(line: string): boolean {
  return PERSIAN_RE.test(line);
}

interface MatchSelection {
  output: string;
  /** مقادیر جانگه‌دارها: arg = کل آرگومان‌ها، rest = باقی‌مانده پس از پیشوند الگو */
  bindings: { arg: string; rest: string };
}

/** جانگه‌دارهای {{arg}} و {{rest}} و {{cmd}} را در متن جایگزین می‌کند */
function substitute(
  template: string,
  values: { arg?: string; rest?: string; cmd?: string },
): string {
  return template
    .replaceAll("{{arg}}", values.arg ?? "")
    .replaceAll("{{rest}}", values.rest ?? "")
    .replaceAll("{{cmd}}", values.cmd ?? "");
}

/** انتخاب بهترین تطبیق از فهرست matches طبق اولویت بالا */
function pickMatch(matches: TerminalRule["matches"], args: string): MatchSelection | null {
  const argLower = args.toLowerCase();

  // ۱) تطبیق دقیق
  for (const m of matches) {
    if (m.args !== "*" && !m.args.includes("{{rest}}") && !m.args.endsWith(" *")) {
      if (m.args.toLowerCase() === argLower) {
        return { output: m.output, bindings: { arg: args, rest: args } };
      }
    }
  }

  // ۲) الگوی {{rest}}
  for (const m of matches) {
    if (m.args.includes("{{rest}}")) {
      const prefix = m.args.slice(0, m.args.indexOf("{{rest}}"));
      if (prefix === "" || argLower.startsWith(prefix.toLowerCase())) {
        const rest = args.slice(prefix.length);
        return { output: m.output, bindings: { arg: args, rest } };
      }
    }
  }

  // ۳) الگوی پیشوندی با پایان " *"
  for (const m of matches) {
    if (m.args.endsWith(" *") && m.args.length > 2) {
      const prefix = m.args.slice(0, -2);
      if (argLower.startsWith(prefix.toLowerCase())) {
        return { output: m.output, bindings: { arg: args, rest: args } };
      }
    }
  }

  // ۴) wildcard "*" فقط برای آرگومان غیرخالی
  if (args !== "") {
    const wildcard = matches.find((m) => m.args === "*");
    if (wildcard) {
      return { output: wildcard.output, bindings: { arg: args, rest: args } };
    }
  }

  return null;
}

/**
 * اجرای شبیه‌سازی‌شده یک خط دستور.
 * raw همان متنی است که کاربر بعد از پرامپت تایپ کرده است.
 */
export function executeCommand(raw: string, content: TerminalContent): TerminalCommandResult {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { clear: false, lines: [] };

  const spaceIndex = trimmed.indexOf(" ");
  const typedName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
  const name = typedName.toLowerCase();
  const args = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1);

  const rule = content.rules.find((r) => r.name.toLowerCase() === name);
  if (!rule) {
    return {
      clear: false,
      lines: substitute(content.unknownCommand, { cmd: typedName }).split("\n"),
    };
  }

  // cls فقط صفحه را پاک می‌کند
  if (rule.name.toLowerCase() === "cls") {
    return { clear: true, lines: [] };
  }

  const match = pickMatch(rule.matches, args);
  const output = match ? substitute(match.output, match.bindings) : rule.defaultOutput;

  return { clear: false, lines: output.split("\n") };
}

/**
 * استخراج مسیر جاری از خروجی دستور cd (سطرهایی مثل «مسیر جاری: C:\Users\Ali\Projects»)
 * برای به‌روزرسانی پرامپت ترمینال؛ اگر پیدا نشد null.
 */
export function extractCwdLine(lines: string[]): string | null {
  for (const line of lines) {
    const match = line.match(/مسیر جاری:\s*(.+)$/);
    if (match) return match[1].trim();
  }
  return null;
}
