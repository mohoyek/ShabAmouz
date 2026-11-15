import type { ColorKey, CommandCategory } from "@/lib/types";

/**
 * نگاشت کلید رنگ مسیر به کلاس‌های Tailwind.
 * کلاس‌ها باید رشته‌های ثابت باشند (Tailwind نمی‌تواند نام کلاس داینامیک بسازد).
 */
export interface PathStyle {
  /** پس‌زمینه ملایم برای بج و آیکون */
  chipBg: string;
  /** رنگ متن تاکیدی */
  chipText: string;
  /** پس‌زمینه مربع آیکون */
  iconBg: string;
  /** رنگ آیکون */
  iconColor: string;
  /** گرادیان نوار بالای کارت مسیر */
  gradientBar: string;
  /** رنگ نوار پیشرفت */
  progressFill: string;
  /** پس‌زمینه ریل نوار پیشرفت */
  progressTrack: string;
  /** کلاس literal برای override رنگ نشانگر Progress (سبک shadcn) */
  progressIndicator: string;
}

export const pathStyles: Record<ColorKey, PathStyle> = {
  teal: {
    chipBg: "bg-teal-100 dark:bg-teal-950/60",
    chipText: "text-teal-700 dark:text-teal-300",
    iconBg: "bg-teal-100 dark:bg-teal-950/60",
    iconColor: "text-teal-600 dark:text-teal-400",
    gradientBar: "bg-gradient-to-l from-teal-400 to-teal-600",
    progressFill: "bg-teal-500",
    progressTrack: "bg-teal-500/15",
    progressIndicator: "[&>div]:bg-teal-500",
  },
  amber: {
    chipBg: "bg-amber-100 dark:bg-amber-950/60",
    chipText: "text-amber-700 dark:text-amber-300",
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconColor: "text-amber-600 dark:text-amber-400",
    gradientBar: "bg-gradient-to-l from-amber-400 to-amber-600",
    progressFill: "bg-amber-500",
    progressTrack: "bg-amber-500/15",
    progressIndicator: "[&>div]:bg-amber-500",
  },
  violet: {
    chipBg: "bg-violet-100 dark:bg-violet-950/60",
    chipText: "text-violet-700 dark:text-violet-300",
    iconBg: "bg-violet-100 dark:bg-violet-950/60",
    iconColor: "text-violet-600 dark:text-violet-400",
    gradientBar: "bg-gradient-to-l from-violet-400 to-violet-600",
    progressFill: "bg-violet-500",
    progressTrack: "bg-violet-500/15",
    progressIndicator: "[&>div]:bg-violet-500",
  },
  cyan: {
    chipBg: "bg-cyan-100 dark:bg-cyan-950/60",
    chipText: "text-cyan-700 dark:text-cyan-300",
    iconBg: "bg-cyan-100 dark:bg-cyan-950/60",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    gradientBar: "bg-gradient-to-l from-cyan-400 to-cyan-600",
    progressFill: "bg-cyan-500",
    progressTrack: "bg-cyan-500/15",
    progressIndicator: "[&>div]:bg-cyan-500",
  },
  rose: {
    chipBg: "bg-rose-100 dark:bg-rose-950/60",
    chipText: "text-rose-700 dark:text-rose-300",
    iconBg: "bg-rose-100 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
    gradientBar: "bg-gradient-to-l from-rose-400 to-rose-600",
    progressFill: "bg-rose-500",
    progressTrack: "bg-rose-500/15",
    progressIndicator: "[&>div]:bg-rose-500",
  },
  sky: {
    chipBg: "bg-sky-100 dark:bg-sky-950/60",
    chipText: "text-sky-700 dark:text-sky-300",
    iconBg: "bg-sky-100 dark:bg-sky-950/60",
    iconColor: "text-sky-600 dark:text-sky-400",
    gradientBar: "bg-gradient-to-l from-sky-400 to-sky-600",
    progressFill: "bg-sky-500",
    progressTrack: "bg-sky-500/15",
    progressIndicator: "[&>div]:bg-sky-500",
  },
  indigo: {
    chipBg: "bg-indigo-100 dark:bg-indigo-950/60",
    chipText: "text-indigo-700 dark:text-indigo-300",
    iconBg: "bg-indigo-100 dark:bg-indigo-950/60",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    gradientBar: "bg-gradient-to-l from-indigo-400 to-indigo-600",
    progressFill: "bg-indigo-500",
    progressTrack: "bg-indigo-500/15",
    progressIndicator: "[&>div]:bg-indigo-500",
  },
};

/** برچسب فارسی دسته دستورات مرجع */
export const categoryLabels: Record<CommandCategory, string> = {
  network: "شبکه",
  cmd: "خط فرمان",
  git: "گیت",
};
