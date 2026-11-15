/**
 * شب‌آموز — مدل داده مرکزی
 * این فایل قرارداد (Contract) همه محتواها و وضعیت‌های برنامه است.
 * فایل‌های JSON داخل پوشه content/ باید دقیقاً همین ساختارها را داشته باشند.
 */

/* ---------------------------------- مسیر یادگیری ---------------------------------- */

/** شناسه‌های مسیرهای یادگیری (فقط این مقادیر مجاز است) */
export type PathId =
  | "network-basics"
  | "cmd-basics"
  | "git-basics"
  | "network-specialist"
  | "network-manager"
  | "devops-engineer"
  | "devops-architect"
  | "linux-lpic1"
  | "linux-lpic2"
  | "linux-lpic3"
  | "mcsa"
  | "mikrotik"
  | "ccna"
  | "powershell";

/** کلید رنگ مسیر — نگاشت به کلاس‌های Tailwind در lib/path-styles.ts انجام می‌شود */
export type ColorKey =
  | "teal"
  | "amber"
  | "violet"
  | "cyan"
  | "rose"
  | "sky"
  | "indigo"
  | "green"
  | "emerald"
  | "lime"
  | "blue"
  | "orange"
  | "purple";

/** متادیتای یک مسیر یادگیری — منبع: content/paths.json */
export interface LearningPath {
  id: PathId;
  /** عنوان فارسی مسیر، مثل «مبانی شبکه» */
  title: string;
  /** توضیح یک‌خطی فارسی */
  description: string;
  /** نام آیکون lucide-react، مثل "Network" */
  icon: string;
  /** کلید رنگ برای کارت‌ها و برچسب‌ها */
  color: ColorKey;
  /** ترتیب نمایش در صفحه اصلی */
  order: number;
  /** شناسه فایل درس‌های این مسیر به ترتیب (slug فایل mdx) */
  lessonSlugs: string[];
}

/* -------------------------------------- درس -------------------------------------- */

/** فرانت‌متر YAML هر فایل درس (content/lessons/<path>/<slug>.mdx) */
export interface LessonFrontmatter {
  /** شناسه درس؛ باید با نام فایل بدون پسوند برابر باشد */
  slug: string;
  /** مسیر والد */
  path: PathId;
  title: string;
  /** خلاصه یک‌خطی برای کارت‌ها */
  summary: string;
  /** مدت تقریبی مطالعه (دقیقه) */
  duration: number;
  /** ترتیب درس در مسیر (از ۱) */
  order: number;
}

/** یک درس کامل: فرانت‌متر + بدنه Markdown/MDX */
export interface Lesson {
  frontmatter: LessonFrontmatter;
  /** بدنه درس به‌صورت رشته (رندر با react-markdown انجام می‌شود) */
  body: string;
}

/* --------------------------------- مرجع دستورات --------------------------------- */

export type CommandCategory = "network" | "cmd" | "git";

/** یک دستور در صفحه مرجع — منبع: content/reference.json */
export interface CommandRef {
  id: string;
  /** نام دستور مثل ping یا git commit */
  name: string;
  category: CommandCategory;
  /** توضیح فارسی کاری که دستور انجام می‌دهد */
  description: string;
  /** سینتکس کامل دستور (LTR) */
  syntax: string;
  /** مثال عملی (LTR) */
  example: string;
  /** نمونه خروجی دستور (اختیاری، LTR) */
  exampleOutput?: string;
  /** نکته‌های فارسی اضافه (اختیاری) */
  notes?: string;
}

/* ------------------------------------- آزمون ------------------------------------- */

export type QuestionType = "mc" | "blank";

/** سؤال چهارگزینه‌ای */
export interface McQuestion {
  id: string;
  path: PathId;
  type: "mc";
  /** متن سؤال (فارسی) */
  text: string;
  /** دقیقاً ۴ گزینه */
  options: [string, string, string, string];
  /** اندیس پاسخ درست (۰ تا ۳) */
  correctIndex: 0 | 1 | 2 | 3;
  /** توضیح فارسی پاسخ درست که بعد از ثبت نشان داده می‌شود */
  explanation: string;
}

/** سؤال جای‌خالی */
export interface BlankQuestion {
  id: string;
  path: PathId;
  type: "blank";
  /** متن سؤال؛ جای خالی با کاراکتر ____ مشخص می‌شود */
  text: string;
  /** پاسخ‌های پذیرفته‌شده (مقایسه بدون حساسیت به حروف بزرگ/کوچک) */
  acceptedAnswers: string[];
  explanation: string;
}

export type QuizQuestion = McQuestion | BlankQuestion;

/* ------------------------------------ ترمینال ------------------------------------ */

/**
 * یک قاعده شبیه‌سازی ترمینال — منبع: content/terminal.json
 * خروجی‌ها از پیش تعریف‌شده‌اند و هیچ دستوری واقعاً اجرا نمی‌شود.
 */
export interface TerminalRule {
  /** نام دستور مثل ping یا git */
  name: string;
  /** شیوه نگارش کامل برای پیام راهنما (LTR) */
  usage: string;
  /** توضیح فارسی کوتاه */
  description: string;
  /**
   * فهرست تطبیق‌های آرگومان به خروجی.
   * args رشته‌ای است که پس از حذف نام دستور می‌آید؛
   * مقدار "*" یعنی برای هر آرگومانی این خروجی داده شود.
   * مثال: { args: "google.com", output: "..." }
   * در متن خروجی می‌توان از جانگه‌دار {{arg}} استفاده کرد که با آرگومان وارد‌شده جایگزین می‌شود.
   */
  matches: { args: string; output: string }[];
  /** خروجی پیش‌فرض وقتی هیچ تطبیقی پیدا نشد */
  defaultOutput: string;
}

/** کل فایل terminal.json */
export interface TerminalContent {
  /** پیام خوش‌آمد اول ترمینال */
  welcome: string;
  /** پیام خطای دستور ناشناخته؛ {{cmd}} با نام دستور جایگزین می‌شود */
  unknownCommand: string;
  /** فهرست ۱۰ قاعده دستور */
  rules: TerminalRule[];
}

/* ---------------------------------- نقشه راه ---------------------------------- */

/** یک مدرک یا استاندارد جهانی در هر مرحله از نقشه راه */
export interface RoadmapCertification {
  /** نام مدرک مثل CCNA یا CompTIA Network+ (LTR) */
  name: string;
  /** نهاد صدور مدرک مثل Cisco یا CompTIA */
  issuer: string;
  /** توضیح فارسی کوتاه درباره جایگاه مدرک */
  note: string;
}

/** یک مرحله از نقشه راه شغلی — منبع: content/roadmap.json */
export interface RoadmapLevel {
  /** شناسه یکتای مرحله مثل fundamentals */
  id: string;
  /** ترتیب مرحله (از ۱) */
  order: number;
  /** عنوان فارسی مرحله مثل «شبکه پایه» */
  title: string;
  /** معادل انگلیسی عنوان (LTR) */
  englishTitle: string;
  /** مدت تقریبی گذراندن مرحله (متن فارسی) */
  duration: string;
  /** توضیح فارسی مرحله */
  summary: string;
  /** مهارت‌هایی که در این مرحله کسب می‌شود */
  skills: string[];
  /** مدارک و استانداردهای جهانی مرتبط با این مرحله */
  certifications: RoadmapCertification[];
  /** مسیرهای یادگیری شب‌آموز که این مرحله را پوشش می‌دهند */
  relatedPathIds: PathId[];
}

/** یک مسیر شغلی کامل در نقشه راه (مثل «شبکه» یا «DevOps») */
export interface RoadmapTrack {
  /** شناسه یکتای مسیر مثل network یا devops */
  id: string;
  /** عنوان فارسی مسیر مثل «مسیر شبکه» */
  title: string;
  /** معادل انگلیسی عنوان (LTR) */
  englishTitle: string;
  /** توضیح کوتاه یک‌خطی مسیر (زیر عنوان در تب) */
  tagline: string;
  /** مقدمه فارسی این مسیر */
  intro: string;
  /** مبنا و ملاک مدارک جهانی این مسیر (پایین تایم‌لاین) */
  standardsNote: string;
  /** مرحله‌های این مسیر به ترتیب */
  levels: RoadmapLevel[];
}

/** کل فایل roadmap.json */
export interface RoadmapContent {
  /** مقدمه فارسی بالای صفحه نقشه راه */
  intro: string;
  /** مسیرهای شغلی موجود در نقشه راه (شبکه، DevOps و…) */
  tracks: RoadmapTrack[];
}

/* ---------------------------------- پیشرفت کاربر ---------------------------------- */

/** رکورد تکمیل یک درس در localStorage */
export interface LessonProgress {
  /** کلید یکتا: "pathId/slug" */
  key: string;
  path: PathId;
  slug: string;
  /** زمان تکمیل به‌صورت ISO string */
  completedAt: string;
}

/** نتیجه ثبت‌شده یک آزمون برای یک مسیر */
export interface QuizResult {
  path: PathId;
  /** تعداد پاسخ درست در آخرین تلاش */
  score: number;
  /** تعداد کل سؤالات */
  total: number;
  /** درصد آخرین تلاش (۰ تا ۱۰۰) */
  percent: number;
  /** بهترین درصد ثبت‌شده تاکنون */
  bestPercent: number;
  /** تعداد کل تلاش‌ها */
  attempts: number;
  /** زمان آخرین تلاش (ISO string) */
  lastAttemptAt: string;
}
