import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PathIcon } from "@/components/path-icon";
import { LessonList } from "@/components/courses/lesson-list";
import { getLearningPath, getLearningPaths, getLessonsForPath, isPathId } from "@/lib/content";
import { pathStyles } from "@/lib/path-styles";
import { faNum } from "@/lib/format";

interface PathPageProps {
  params: Promise<{ path: string }>;
}

export function generateStaticParams() {
  return getLearningPaths().map((p) => ({ path: p.id }));
}

export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const { path } = await params;
  if (!isPathId(path)) return { title: "مسیر یافت نشد" };
  const learningPath = getLearningPath(path);
  return {
    title: learningPath?.title,
    description: learningPath?.description,
  };
}

export default async function PathPage({ params }: PathPageProps) {
  const { path } = await params;
  if (!isPathId(path)) notFound();
  const learningPath = getLearningPath(path);
  if (!learningPath) notFound();

  const lessons = getLessonsForPath(learningPath.id);
  const style = pathStyles[learningPath.color];
  const totalMinutes = lessons.reduce((sum, l) => sum + l.frontmatter.duration, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <Card className="gap-4 overflow-hidden pt-0">
        <div className={`h-1.5 w-full ${style.gradientBar}`} />
        <CardHeader className="gap-3">
          <div className="flex items-center gap-3">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
              <PathIcon name={learningPath.icon} className={`size-7 ${style.iconColor}`} />
            </span>
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-2xl">{learningPath.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <BookOpen className="size-3" />
                  {faNum(lessons.length)} درس
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Clock3 className="size-3" />
                  حدود {faNum(totalMinutes)} دقیقه
                </Badge>
              </div>
            </div>
          </div>
          <CardDescription className="leading-7">{learningPath.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonList
            pathId={learningPath.id}
            color={learningPath.color}
            lessons={lessons.map((lesson) => lesson.frontmatter)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
