import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p
        dir="ltr"
        className="ltr-content font-mono text-6xl font-extrabold text-emerald-600 dark:text-emerald-400"
      >
        404
      </p>
      <h1 className="text-2xl font-extrabold">این صفحه پیدا نشد</h1>
      <p className="leading-8 text-muted-foreground">
        آدرسی که باز کرده‌اید وجود ندارد یا جابه‌جا شده است. از لینک‌های زیر می‌توانید به
        صفحه اصلی یا مسیرهای یادگیری برگردید.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">بازگشت به خانه</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/courses">مسیرهای یادگیری</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/reference">مرجع دستورات</Link>
        </Button>
      </div>
    </div>
  );
}
