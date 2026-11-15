/**
 * تبدیل عدد به رقم فارسی برای متن‌های UI (مثل «۳ درس» و «۳۳٪»).
 * خروجی این تابع در سرور و کلاینت یکسان است و mismatch ایجاد نمی‌کند.
 */
export function faNum(value: number): string {
  return value.toLocaleString("fa-IR");
}

/** درصدهای فارسی مثل «۳۳٪» */
export function faPercent(value: number): string {
  return `${faNum(value)}٪`;
}
