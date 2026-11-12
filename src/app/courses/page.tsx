import type { Metadata } from "next";
import { PathCard } from "@/components/home/path-card";
import { getLearningPaths, getLessonsForPath } from "@/lib/content";

export const metadata: Metadata = {
  title: "مسیرهای یادگیری",
  description: "سه مسیر کوتاه برای یادگیری مبانی شبکه، دستورات CMD و گیت؛ به فارسی و رایگان.",
};

export default function CoursesPage() {
  const paths = getLearningPaths();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">مسیرهای یادگیری</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          هر مسیر سه درس کوتاه دارد که به‌ترتیب روی هم سوار می‌شوند: اول مفهوم، بعد دستور،
          بعد تمرین واقعی. با زدن دکمه «تکمیل» در صفحه هر درس، پیشرفت شما اینجا ثبت می‌شود.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            lessons={getLessonsForPath(path.id).map((lesson) => lesson.frontmatter)}
          />
        ))}
      </div>
    </div>
  );
}
