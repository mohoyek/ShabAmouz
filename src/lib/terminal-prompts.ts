import type { PathId } from "@/lib/types";

/**
 * پرامپت ترمینال تمرینی بر اساس خانواده فناوری مسیر —
 * درس لینوکس با پرامپت Bash، درس سیسکو با پرامپت IOS و درس میکروتیک با
 * پرامپت RouterOS شروع می‌شود تا حس محیط واقعی حفظ شود.
 * (پرامپت پایه + پسوند؛ در دستور cd فقط پایه به‌روز می‌شود و پسوند ثابت می‌ماند)
 */

export interface TerminalPromptStyle {
  /** پرامپت پایه (بدون پسوند) */
  initialPrompt: string;
  /** پسوند پرامپت مثل > یا $ یا " > " */
  promptSuffix: string;
}

const BASH: TerminalPromptStyle = { initialPrompt: "ali@shabamouz:~", promptSuffix: "$ " };
const IOS: TerminalPromptStyle = { initialPrompt: "Router", promptSuffix: ">" };
const ROUTEROS: TerminalPromptStyle = { initialPrompt: "[admin@MikroTik]", promptSuffix: " > " };
const POWERSHELL: TerminalPromptStyle = { initialPrompt: "PS C:\\Users\\Ali", promptSuffix: ">" };
const WINDOWS: TerminalPromptStyle = { initialPrompt: "C:\\Users\\Ali", promptSuffix: ">" };

const PROMPT_BY_PATH: Partial<Record<PathId, TerminalPromptStyle>> = {
  "linux-lpic1": BASH,
  "linux-lpic2": BASH,
  "linux-lpic3": BASH,
  "devops-engineer": BASH,
  "devops-architect": BASH,
  ccna: IOS,
  "network-specialist": IOS,
  "network-manager": IOS,
  mikrotik: ROUTEROS,
  powershell: POWERSHELL,
  mcsa: POWERSHELL,
};

/** سبک پرامپت متناسب با مسیر؛ مسیرهای پایه (CMD/گیت/شبکه) پرامپت ویندوزی می‌گیرند */
export function getPromptForPath(pathId: PathId): TerminalPromptStyle {
  return PROMPT_BY_PATH[pathId] ?? WINDOWS;
}
