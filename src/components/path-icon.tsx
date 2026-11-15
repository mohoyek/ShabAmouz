import {
  AppWindow,
  Building2,
  Cable,
  Container,
  GitBranch,
  HardDrive,
  Network,
  Router,
  Server,
  SquareTerminal,
  Terminal,
  TerminalSquare,
  Wifi,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * نگاشت نام آیکون ذخیره‌شده در paths.json به کامپوننت lucide-react.
 * اگر نام ناشناخته باشد، آیکون پیش‌فرض Network نمایش داده می‌شود.
 */
const ICONS: Record<string, LucideIcon> = {
  Network,
  TerminalSquare,
  GitBranch,
  Router,
  Building2,
  Container,
  Workflow,
  Terminal,
  HardDrive,
  Server,
  AppWindow,
  Wifi,
  Cable,
  SquareTerminal,
};

export function PathIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Network;
  return <Icon className={className} />;
}
