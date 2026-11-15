import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-emerald-600" />
          <span className="font-bold text-foreground">شب‌آموز</span>
          <span aria-hidden="true">·</span>
          <span>پلتفرم فارسی آموزش شبکه، خط فرمان، گیت و DevOps</span>
        </div>
        <nav className="flex items-center gap-4" aria-label="لینک‌های فوتر">
          <Link href="/courses" className="transition-colors hover:text-foreground">
            مسیرهای یادگیری
          </Link>
          <Link href="/roadmap" className="transition-colors hover:text-foreground">
            نقشه راه
          </Link>
          <Link href="/reference" className="transition-colors hover:text-foreground">
            مرجع دستورات
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            پیشرفت من
          </Link>
        </nav>
        <span className="text-xs">ساخته‌شده برای یادگیری آزاد · بدون نیاز به ثبت‌نام</span>
      </div>
    </footer>
  );
}
