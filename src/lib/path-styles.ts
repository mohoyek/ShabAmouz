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
  green: {
    chipBg: "bg-green-100 dark:bg-green-950/60",
    chipText: "text-green-700 dark:text-green-300",
    iconBg: "bg-green-100 dark:bg-green-950/60",
    iconColor: "text-green-600 dark:text-green-400",
    gradientBar: "bg-gradient-to-l from-green-400 to-green-600",
    progressFill: "bg-green-500",
    progressTrack: "bg-green-500/15",
    progressIndicator: "[&>div]:bg-green-500",
  },
  emerald: {
    chipBg: "bg-emerald-100 dark:bg-emerald-950/60",
    chipText: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    gradientBar: "bg-gradient-to-l from-emerald-400 to-emerald-600",
    progressFill: "bg-emerald-500",
    progressTrack: "bg-emerald-500/15",
    progressIndicator: "[&>div]:bg-emerald-500",
  },
  lime: {
    chipBg: "bg-lime-100 dark:bg-lime-950/60",
    chipText: "text-lime-700 dark:text-lime-300",
    iconBg: "bg-lime-100 dark:bg-lime-950/60",
    iconColor: "text-lime-600 dark:text-lime-400",
    gradientBar: "bg-gradient-to-l from-lime-400 to-lime-600",
    progressFill: "bg-lime-500",
    progressTrack: "bg-lime-500/15",
    progressIndicator: "[&>div]:bg-lime-500",
  },
  blue: {
    chipBg: "bg-blue-100 dark:bg-blue-950/60",
    chipText: "text-blue-700 dark:text-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    gradientBar: "bg-gradient-to-l from-blue-400 to-blue-600",
    progressFill: "bg-blue-500",
    progressTrack: "bg-blue-500/15",
    progressIndicator: "[&>div]:bg-blue-500",
  },
  orange: {
    chipBg: "bg-orange-100 dark:bg-orange-950/60",
    chipText: "text-orange-700 dark:text-orange-300",
    iconBg: "bg-orange-100 dark:bg-orange-950/60",
    iconColor: "text-orange-600 dark:text-orange-400",
    gradientBar: "bg-gradient-to-l from-orange-400 to-orange-600",
    progressFill: "bg-orange-500",
    progressTrack: "bg-orange-500/15",
    progressIndicator: "[&>div]:bg-orange-500",
  },
  purple: {
    chipBg: "bg-purple-100 dark:bg-purple-950/60",
    chipText: "text-purple-700 dark:text-purple-300",
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    gradientBar: "bg-gradient-to-l from-purple-400 to-purple-600",
    progressFill: "bg-purple-500",
    progressTrack: "bg-purple-500/15",
    progressIndicator: "[&>div]:bg-purple-500",
  },
};

/** برچسب فارسی دسته دستورات مرجع */
export const categoryLabels: Record<CommandCategory, string> = {
  network: "شبکه",
  cmd: "خط فرمان",
  git: "گیت",
};
