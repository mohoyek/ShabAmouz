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
}

export const pathStyles: Record<ColorKey, PathStyle> = {
  teal: {
    chipBg: "bg-teal-100 dark:bg-teal-950/60",
    chipText: "text-teal-700 dark:text-teal-300",
    iconBg: "bg-teal-100 dark:bg-teal-950/60",
    iconColor: "text-teal-600 dark:text-teal-400",
    gradientBar: "bg-gradient-to-l from-teal-400 to-teal-600",
    progressFill: "bg-teal-500",
  },
  amber: {
    chipBg: "bg-amber-100 dark:bg-amber-950/60",
    chipText: "text-amber-700 dark:text-amber-300",
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconColor: "text-amber-600 dark:text-amber-400",
    gradientBar: "bg-gradient-to-l from-amber-400 to-amber-600",
    progressFill: "bg-amber-500",
  },
  violet: {
    chipBg: "bg-violet-100 dark:bg-violet-950/60",
    chipText: "text-violet-700 dark:text-violet-300",
    iconBg: "bg-violet-100 dark:bg-violet-950/60",
    iconColor: "text-violet-600 dark:text-violet-400",
    gradientBar: "bg-gradient-to-l from-violet-400 to-violet-600",
    progressFill: "bg-violet-500",
  },
};

/** برچسب فارسی دسته دستورات مرجع */
export const categoryLabels: Record<CommandCategory, string> = {
  network: "شبکه",
  cmd: "خط فرمان",
  git: "گیت",
};
