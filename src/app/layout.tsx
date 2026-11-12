import type { Metadata } from "next";
import { Vazirmatn, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** فونت اصلی فارسی — وزیرمتن */
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

/** فونت مونواسپیس برای بلوک‌های کد و ترمینال (LTR) */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "شب‌آموز | پلتفرم آموزش شبکه، CMD و گیت",
    template: "%s | شب‌آموز",
  },
  description:
    "پلتفرم فارسی یادگیری مبانی شبکه، دستورات خط فرمان ویندوز و گیت؛ با درس‌های کوتاه، مرجع دستورات، آزمون و ترمینال شبیه‌سازی‌شده.",
  keywords: ["آموزش شبکه", "دستورات CMD", "آموزش گیت", "خط فرمان", "شب‌آموز"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
