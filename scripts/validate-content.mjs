/**
 * اعتبارسنجی فایل‌های محتوا — شب‌آموز
 * اجرا: node scripts/validate-content.mjs
 * بررسی می‌کند: تعداد مسیرها (۳)، درس‌ها (۹)، دستورات مرجع (۱۵) در سه دسته
 * ۵تایی، سؤالات آزمون (۳۰) با ترکیب ۷ چهارگزینه‌ای + ۳ جای‌خالی در هر مسیر،
 * و ۱۰ دستور ترمینال با قاعده ping google.com.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

/* ------------------------------- مسیرها ------------------------------- */
const paths = JSON.parse(fs.readFileSync(path.join(contentDir, "paths.json"), "utf-8"));
check(paths.length === 3, `تعداد مسیرها باید ۳ باشد (فعلاً: ${paths.length})`);
const validColors = new Set(["teal", "amber", "violet"]);
const validPathIds = new Set(["network-basics", "cmd-basics", "git-basics"]);
for (const p of paths) {
  check(validPathIds.has(p.id), `شناسه مسیر نامعتبر: ${p.id}`);
  check(typeof p.title === "string" && p.title.length > 2, `عنوان مسیر ${p.id} نامعتبر است`);
  check(validColors.has(p.color), `رنگ مسیر ${p.id} نامعتبر است: ${p.color}`);
  check(Array.isArray(p.lessonSlugs) && p.lessonSlugs.length === 3, `مسیر ${p.id} باید دقیقاً ۳ درس داشته باشد`);
}

/* ------------------------------- درس‌ها ------------------------------- */
let lessonCount = 0;
for (const p of paths) {
  for (const slug of p.lessonSlugs) {
    const file = path.join(contentDir, "lessons", p.id, `${slug}.mdx`);
    check(fs.existsSync(file), `فایل درس یافت نشد: ${p.id}/${slug}.mdx`);
    if (!fs.existsSync(file)) continue;
    const { data, content } = matter(fs.readFileSync(file, "utf-8"));
    check(data.slug === slug, `در ${p.id}/${slug}: فرانت‌متر slug (${data.slug}) با نام فایل (${slug}) فرق دارد`);
    check(data.path === p.id, `در ${p.id}/${slug}: فرانت‌متر path (${data.path}) نادرست است`);
    check(typeof data.title === "string" && data.title.length > 2, `در ${p.id}/${slug}: عنوان نادرست`);
    check(typeof data.summary === "string" && data.summary.length > 10, `در ${p.id}/${slug}: خلاصه نادرست`);
    check(Number.isInteger(data.duration) && data.duration > 0, `در ${p.id}/${slug}: duration نامعتبر`);
    check(Number.isInteger(data.order) && data.order >= 1 && data.order <= 3, `در ${p.id}/${slug}: order باید ۱ تا ۳ باشد`);
    check(content.length > 1500, `در ${p.id}/${slug}: بدنه درس خیلی کوتاه است (${content.length} کاراکتر)`);
    lessonCount++;
  }
}
check(lessonCount === 9, `تعداد کل درس‌ها باید ۹ باشد (فعلاً: ${lessonCount})`);

/* ----------------------------- مرجع دستورات ----------------------------- */
const commands = JSON.parse(fs.readFileSync(path.join(contentDir, "reference.json"), "utf-8"));
check(commands.length === 15, `تعداد دستورات مرجع باید ۱۵ باشد (فعلاً: ${commands.length})`);
const byCategory = { network: 0, cmd: 0, git: 0 };
const cmdIds = new Set();
for (const c of commands) {
  check(cmdIds.has(c.id) === false, `شناسه دستور تکراری: ${c.id}`);
  cmdIds.add(c.id);
  check(c.category in byCategory, `دسته نامعتبر در ${c.id}: ${c.category}`);
  check(typeof c.name === "string" && c.name.length > 1, `نام دستور ${c.id} نامعتبر`);
  check(typeof c.description === "string" && c.description.length > 10, `توضیح ${c.id} کوتاه است`);
  check(typeof c.syntax === "string" && c.syntax.length > 2, `سینتکس ${c.id} کوتاه است`);
  check(typeof c.example === "string" && c.example.length > 2, `مثال ${c.id} کوتاه است`);
  if (c.category in byCategory) byCategory[c.category]++;
}
check(byCategory.network === 5, `دسته شبکه باید ۵ دستور داشته باشد (فعلاً: ${byCategory.network})`);
check(byCategory.cmd === 5, `دسته CMD باید ۵ دستور داشته باشد (فعلاً: ${byCategory.cmd})`);
check(byCategory.git === 5, `دسته گیت باید ۵ دستور داشته باشد (فعلاً: ${byCategory.git})`);

/* -------------------------------- آزمون -------------------------------- */
const questions = JSON.parse(fs.readFileSync(path.join(contentDir, "quiz.json"), "utf-8"));
check(questions.length === 30, `تعداد سؤالات باید ۳۰ باشد (فعلاً: ${questions.length})`);
const qIds = new Set();
const perPath = {};
for (const q of questions) {
  check(qIds.has(q.id) === false, `شناسه سؤال تکراری: ${q.id}`);
  qIds.add(q.id);
  check(validPathIds.has(q.path), `مسیر نامعتبر در سؤال ${q.id}: ${q.path}`);
  check(q.type === "mc" || q.type === "blank", `نوع نامعتبر در سؤال ${q.id}: ${q.type}`);
  check(typeof q.explanation === "string" && q.explanation.length > 10, `توضیح پاسخ سؤال ${q.id} کوتاه است`);
  if (q.type === "mc") {
    check(Array.isArray(q.options) && q.options.length === 4, `سؤال ${q.id} باید دقیقاً ۴ گزینه داشته باشد`);
    check(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3, `اندیس پاسخ سؤال ${q.id} نامعتبر`);
    check(q.options.every((o) => typeof o === "string" && o.length > 0), `گزینه‌های سؤال ${q.id} خالی هستند`);
  } else {
    check(Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0, `سؤال ${q.id} پاسخ پذیرفته‌شده ندارد`);
  }
  perPath[q.path] ??= { mc: 0, blank: 0, total: 0 };
  perPath[q.path][q.type]++;
  perPath[q.path].total++;
}
for (const id of validPathIds) {
  const s = perPath[id] ?? {};
  check(s.total === 10, `مسیر ${id} باید ۱۰ سؤال داشته باشد (فعلاً: ${s.total ?? 0})`);
  check(s.mc === 7, `مسیر ${id} باید ۷ سؤال چهارگزینه‌ای داشته باشد (فعلاً: ${s.mc ?? 0})`);
  check(s.blank === 3, `مسیر ${id} باید ۳ سؤال جای‌خالی داشته باشد (فعلاً: ${s.blank ?? 0})`);
}

/* -------------------------------- ترمینال -------------------------------- */
const terminal = JSON.parse(fs.readFileSync(path.join(contentDir, "terminal.json"), "utf-8"));
const expectedCommands = ["help", "ping", "ipconfig", "tracert", "cd", "dir", "mkdir", "echo", "cls", "git"];
check(terminal.rules.length === 10, `تعداد دستورات ترمینال باید ۱۰ باشد (فعلاً: ${terminal.rules.length})`);
check(typeof terminal.welcome === "string" && terminal.welcome.length > 5, "پیام خوش‌آمد ترمینال نامعتبر است");
check(typeof terminal.unknownCommand === "string" && terminal.unknownCommand.includes("{{cmd}}"), "پیام unknownCommand باید جانگه‌دار {{cmd}} داشته باشد");
for (const name of expectedCommands) {
  const rule = terminal.rules.find((r) => r.name === name);
  check(rule !== undefined, `دستور ترمینال '${name}' تعریف نشده است`);
  if (!rule) continue;
  check(Array.isArray(rule.matches) && rule.matches.length > 0, `دستور ${name} قاعده تطبیق ندارد`);
  check(typeof rule.defaultOutput === "string", `دستور ${name} خروجی پیش‌فرض ندارد`);
  check(typeof rule.usage === "string" && rule.usage.length > 2, `دستور ${name} usage ندارد`);
}
const pingRule = terminal.rules.find((r) => r.name === "ping");
check(pingRule && pingRule.matches.some((m) => m.args === "google.com"), "قاعده ping google.com وجود ندارد (معیار پذیرش)");
const gitRule = terminal.rules.find((r) => r.name === "git");
check(gitRule && gitRule.matches.some((m) => m.args === "status"), "قاعده git status وجود ندارد");

/* ------------------------------- نتیجه ------------------------------- */
if (errors.length > 0) {
  console.error(`✗ اعتبارسنجی محتوا با ${errors.length} خطا شکست خورد:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
} else {
  console.log("✓ اعتبارسنجی محتوا موفق بود:");
  console.log(`  مسیرها: ${paths.length} (شبکه، CMD، گیت)`);
  console.log(`  درس‌ها: ${lessonCount} × MDX با فرانت‌متر معتبر`);
  console.log(`  مرجع دستورات: ${commands.length} (شبکه=${byCategory.network}, CMD=${byCategory.cmd}, گیت=${byCategory.git})`);
  console.log(`  سؤالات آزمون: ${questions.length} (هر مسیر ۷ چهارگزینه‌ای + ۳ جای‌خالی)`);
  console.log(`  دستورات ترمینال: ${terminal.rules.length} (شامل ping google.com و git با زیردستورها)`);
}
