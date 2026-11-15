import type { Metadata } from "next";
import { ReferenceClient } from "@/components/reference/reference-client";
import { getReferenceCommands } from "@/lib/content";

export const metadata: Metadata = {
  title: "مرجع دستورات",
  description:
    "مرجع ۲۵ دستور پرکاربرد شبکه، خط فرمان، گیت، لینوکس و پاورشل با توضیح فارسی، سینتکس، مثال عملی و جستجو.",
};

export default function ReferencePage() {
  const commands = getReferenceCommands();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">مرجع دستورات</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          بیست‌وپنج دستور پرکاربرد در پنج دسته: شبکه، خط فرمان ویندوز، گیت، لینوکس و
          پاورشل؛ با توضیح فارسی، سینتکس و مثال عملی. با جستجو پیدا کنید یا بر اساس
          دسته فیلتر کنید.
        </p>
      </header>
      <ReferenceClient commands={commands} />
    </div>
  );
}
