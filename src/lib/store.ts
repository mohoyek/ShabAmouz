"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { LessonProgress, PathId, QuizResult } from "@/lib/types";

/** کلید ذخیره‌سازی در localStorage */
const STORAGE_KEY = "shabamouz-progress-v1";

interface ProgressState {
  /** درس‌های تکمیل‌شده — کلید: "pathId/slug" */
  completedLessons: Record<string, LessonProgress>;
  /** آخرین نتیجه آزمون هر مسیر */
  quizResults: Partial<Record<PathId, QuizResult>>;
  /** اینکه کاربر ترمینال را حداقل یک‌بار اجرا کرده یا نه */
  terminalUsedAt: string | null;
  /** آیا وضعیت از localStorage بازیابی شده است؟ (برای جلوگیری از mismatch در SSR) */
  hasHydrated: boolean;

  markLessonComplete: (path: PathId, slug: string) => void;
  isLessonCompleted: (path: PathId, slug: string) => boolean;
  saveQuizResult: (path: PathId, score: number, total: number) => void;
  markTerminalUsed: () => void;
  resetProgress: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      quizResults: {},
      terminalUsedAt: null,
      hasHydrated: false,

      markLessonComplete: (path, slug) => {
        const key = `${path}/${slug}`;
        set((state) => {
          // اگر قبلاً تکمیل شده، تاریخ را تغییر نمی‌دهیم
          if (state.completedLessons[key]) return state;
          return {
            completedLessons: {
              ...state.completedLessons,
              [key]: {
                key,
                path,
                slug,
                completedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      isLessonCompleted: (path, slug) => {
        return Boolean(get().completedLessons[`${path}/${slug}`]);
      },

      saveQuizResult: (path, score, total) => {
        const percent = total > 0 ? Math.round((score / total) * 100) : 0;
        set((state) => {
          const previous = state.quizResults[path];
          return {
            quizResults: {
              ...state.quizResults,
              [path]: {
                path,
                score,
                total,
                percent,
                bestPercent: Math.max(previous?.bestPercent ?? 0, percent),
                attempts: (previous?.attempts ?? 0) + 1,
                lastAttemptAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      markTerminalUsed: () => {
        set((state) =>
          state.terminalUsedAt ? state : { terminalUsedAt: new Date().toISOString() },
        );
      },

      resetProgress: () => {
        set({ completedLessons: {}, quizResults: {}, terminalUsedAt: null });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        completedLessons: state.completedLessons,
        quizResults: state.quizResults,
        terminalUsedAt: state.terminalUsedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/**
 * هوک کمکی: فقط وقتی وضعیت از localStorage بازیابی شده، داده پیشرفت را مصرف کن.
 * در سرور/اولین رندر true برمی‌گرداند تا صفحه بدون پرش رندر شود؛
 * کامپوننت‌های پیشرفت مقدار پیش‌فرض (خالی) نشان می‌دهند.
 */
export function useProgressHydrated(): boolean {
  return useProgressStore((s) => s.hasHydrated);
}
