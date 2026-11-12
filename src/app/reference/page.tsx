import type { Metadata } from "next";
import { ReferenceClient } from "@/components/reference/reference-client";
import { getReferenceCommands } from "@/lib/content";

export const metadata: Metadata = {
  title: "مرجع دستورات",
  description:
    "مرجع ۱۵ دستور پرکاربرد شبکه، خط فرمان و گیت با توضیح فارسی، سینتکس، مثال عملی و جستجو.",
};

export default function ReferencePage() {
  const commands = getReferenceCommands();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold">مرجع دستورات</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          پانزده دستور پرکاربرد شبکه، خط فرمان ویندوز و گیت، با توضیح فارسی، سینتکس و مثال
          عملی. با جستجو پیدا کنید یا بر اساس دسته فیلتر کنید.
        </p>
      </header>
      <ReferenceClient commands={commands} />
    </div>
  );
}
