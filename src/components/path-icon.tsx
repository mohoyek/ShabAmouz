import { GitBranch, Network, TerminalSquare, type LucideIcon } from "lucide-react";

/**
 * نگاشت نام آیکون ذخیره‌شده در paths.json به کامپوننت lucide-react.
 * اگر نام ناشناخته باشد، آیکون پیش‌فرض Network نمایش داده می‌شود.
 */
const ICONS: Record<string, LucideIcon> = {
  Network,
  TerminalSquare,
  GitBranch,
};

export function PathIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Network;
  return <Icon className={className} />;
}
