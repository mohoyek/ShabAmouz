import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";

/**
 * رندر بدنه درس‌ها (Markdown/MDX) با react-markdown + remark-gfm.
 * بلوک‌های کد و کد درون‌خطی همیشه LTR رندر می‌شوند (کلاس کمکی ltr-content)
 * و متن فارسی RTL می‌ماند. این کامپوننت در سمت سرور اجرا می‌شود.
 */

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type TableProps = ComponentPropsWithoutRef<"table">;

/**
 * استخراج متن خام از فرزندان <pre> (المان <code> و متن‌های تو در تو).
 * با این روش رندر بلوک کد کاملاً در override خود pre انجام می‌شود و
 * استایل کد درون‌خطی هرگز داخل بلوک اعمال نمی‌شود.
 */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const code = extractText(children).replace(/\n$/, "");
  return (
    <div
      dir="ltr"
      className="ltr-content thin-scrollbar my-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950"
    >
      <pre className="p-4 text-left font-mono text-[13px] leading-6 text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function LessonContent({ body }: { body: string }) {
  return (
    <div className="leading-8 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }: HeadingProps) => (
            <h2 className="mb-3 mt-9 border-b pb-2 text-xl font-extrabold text-foreground sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
            <h3 className="mb-2 mt-6 text-lg font-bold text-foreground">{children}</h3>
          ),
          p: ({ children }) => <p className="my-4 leading-8">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 ps-6 marker:text-emerald-500">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 ps-6 marker:text-emerald-500">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-8">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-extrabold text-foreground">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-600 dark:text-emerald-400"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-s-4 border-emerald-400 bg-emerald-50/50 px-4 py-1 text-foreground/80 dark:bg-emerald-950/30">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ children }) => {
            // کد درون‌خطی — مثل نام دستورها؛ بلوک کد به‌طور کامل در pre رندر می‌شود
            return (
              <code
                dir="ltr"
                className="ltr-content inline-block rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-800 dark:text-emerald-300"
              >
                {children}
              </code>
            );
          },
          table: ({ children }: TableProps) => (
            <div className="thin-scrollbar my-5 overflow-x-auto rounded-xl border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
          th: ({ children }) => (
            <th className="border px-3 py-2.5 text-start font-extrabold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border px-3 py-2 leading-7">{children}</td>,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
