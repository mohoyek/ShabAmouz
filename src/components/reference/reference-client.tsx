"use client";

import { useMemo, useState } from "react";
import { Lightbulb, Search, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categoryLabels } from "@/lib/path-styles";
import type { CommandCategory, CommandRef } from "@/lib/types";

type CategoryFilter = "all" | CommandCategory;

const FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "network", label: categoryLabels.network },
  { key: "cmd", label: categoryLabels.cmd },
  { key: "git", label: categoryLabels.git },
];

/**
 * مرجع دستورات با جستجوی زنده و فیلتر دسته.
 * جستجو روی نام، توضیح، سینتکس، مثال و نکته‌ها اعمال می‌شود.
 */
export function ReferenceClient({ commands }: { commands: CommandRef[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const counts = useMemo(() => {
    const map: Record<CategoryFilter, number> = {
      all: commands.length,
      network: 0,
      cmd: 0,
      git: 0,
    };
    for (const command of commands) map[command.category] += 1;
    return map;
  }, [commands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((command) => {
      if (category !== "all" && command.category !== category) return false;
      if (!q) return true;
      return [command.name, command.description, command.syntax, command.example, command.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [commands, query, category]);

  return (
    <div className="flex flex-col gap-6">
      {/* نوار جستجو و فیلتر */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو در دستورات... (مثلاً ping یا کپی فایل)"
            className="ps-9"
            aria-label="جستجوی دستورات"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر دسته">
          {FILTERS.map((filter) => (
            <Button
              key={filter.key}
              variant={category === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(filter.key)}
              className="gap-2"
              aria-pressed={category === filter.key}
            >
              {filter.label}
              <span className="rounded-full bg-foreground/10 px-1.5 text-[11px] font-bold">
                {counts[filter.key]}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} دستور یافت شد
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
          <SearchX className="size-8 text-muted-foreground/60" />
          <p className="font-bold">دستوری یافت نشد</p>
          <p className="text-sm text-muted-foreground">
            عبارت دیگری را امتحان کنید یا فیلتر دسته را تغییر دهید.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            حذف جستجو و فیلترها
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((command) => (
            <CommandCard key={command.id} command={command} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommandCard({ command }: { command: CommandRef }) {
  return (
    <Card className="gap-4">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <code
            dir="ltr"
            className="ltr-content rounded-lg bg-emerald-50 px-3 py-1.5 font-mono text-base font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            {command.name}
          </code>
          <Badge variant="secondary">{categoryLabels[command.category]}</Badge>
        </div>
        <CardDescription className="leading-7">{command.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <span className="mb-1 block text-xs font-bold text-muted-foreground">سینتکس</span>
          <code
            dir="ltr"
            className="ltr-content block rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[13px] leading-6"
          >
            {command.syntax}
          </code>
        </div>
        <div>
          <span className="mb-1 block text-xs font-bold text-muted-foreground">مثال</span>
          <div
            dir="ltr"
            className="ltr-content thin-scrollbar overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-[13px] leading-6 text-zinc-100"
          >
            {command.example}
            {command.exampleOutput ? (
              <pre className="mt-2 whitespace-pre-wrap border-t border-zinc-800 pt-2 text-zinc-400">
                {command.exampleOutput}
              </pre>
            ) : null}
          </div>
        </div>
        {command.notes ? (
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
            {command.notes}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
