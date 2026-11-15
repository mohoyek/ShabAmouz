import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getLearningPaths, getLessonsForPath } from "@/lib/content";

export const metadata: Metadata = {
  title: "پیشرفت من",
  description:
    "نمایش درس‌های تکمیل‌شده، نتایج آزمون‌ها و وضعیت ترمینال؛ همه داده‌ها در localStorage مرورگر خودتان ذخیره می‌شود.",
};

export default function DashboardPage() {
  const paths = getLearningPaths().map((path) => ({
    id: path.id,
    title: path.title,
    icon: path.icon,
    color: path.color,
    lessons: getLessonsForPath(path.id).map((lesson) => ({
      slug: lesson.frontmatter.slug,
      title: lesson.frontmatter.title,
      duration: lesson.frontmatter.duration,
    })),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">پیشرفت من</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          درس‌های تکمیل‌شده و نتایج آزمون‌ها؛ همه داده‌ها فقط روی مرورگر خودتان (localStorage)
          ذخیره می‌شود و به هیچ سروری فرستاده نمی‌شود.
        </p>
      </header>
      <DashboardClient paths={paths} />
    </div>
  );
}
