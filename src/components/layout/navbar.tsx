"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/courses", label: "مسیرهای یادگیری" },
  { href: "/roadmap", label: "نقشه راه" },
  { href: "/reference", label: "مرجع دستورات" },
  { href: "/quiz", label: "آزمون" },
  { href: "/terminal", label: "ترمینال" },
  { href: "/dashboard", label: "پیشرفت من" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="تغییر تم روشن و تاریک"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* لوگو */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="شب‌آموز — صفحه اصلی">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <GraduationCap className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold">شب‌آموز</span>
            <span className="text-[11px] text-muted-foreground">آموزش شبکه، CMD و گیت</span>
          </span>
        </Link>

        {/* لینک‌های دسکتاپ */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* منوی موبایل */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="flex items-center gap-2 text-base font-extrabold">
                <GraduationCap className="size-5 text-emerald-600" />
                شب‌آموز
              </SheetTitle>
              <SheetDescription className="sr-only">منوی ناوبری سایت شب‌آموز</SheetDescription>
              <nav className="mt-4 flex flex-col gap-1" aria-label="ناوبری موبایل">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
