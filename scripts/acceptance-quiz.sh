#!/usr/bin/env bash
# تست پذیرش: اجرای کامل آزمون مسیر network-basics با پاسخ‌های درست
set -e
AB="agent-browser"

$AB open http://localhost:3000/quiz/network-basics
$AB wait --load networkidle

# کلیک JS سازگار با React روی دکمه‌ای که متنش شامل رشته داده‌شده است
click_btn () {
  $AB eval "(function(){const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('$1')); if(!b) return 'NOTFOUND:$1'; b.click(); return 'clicked:$1';})()"
  sleep 0.35
}

# پر کردن ورودی جای‌خالی با native setter سازگار با React
fill_blank () {
  $AB eval "(function(){const i=document.querySelector('input[aria-label=\"پاسخ جای خالی\"]'); if(!i) return 'NO-INPUT'; const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'$1'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled:$1';})()"
  sleep 0.25
}

# سؤال‌های چهارگزینه‌ای ۱ تا ۷ (اندیس پاسخ درست از content/quiz.json)
for correct in 0 1 1 2 2 1 2; do
  $AB eval "document.querySelectorAll('[role=radio]')[${correct}].click(); 'radio:${correct}'"
  sleep 0.25
  click_btn "ثبت پاسخ"
  click_btn "سؤال بعدی"
done

# سؤال‌های جای‌خالی ۸ تا ۱۰
fill_blank "ipconfig";  click_btn "ثبت پاسخ"; click_btn "سؤال بعدی" || true
fill_blank "tracert";   click_btn "ثبت پاسخ"; click_btn "سؤال بعدی" || true
fill_blank "lan";       click_btn "ثبت پاسخ"; click_btn "مشاهده نتیجه" || true

$AB wait 800
echo "---URL---"; $AB get url
echo "---PERCENT---"
$AB eval "document.body.innerText.match(/[۰-۹]+٪/)?.[0] || 'NO-PERCENT'"
echo "---SCORE LINE---"
$AB eval "document.body.innerText.split('\n').filter(l=>l.includes('پاسخ درست از')).join(' | ')"
echo "---STORAGE---"
$AB eval "JSON.stringify(JSON.parse(localStorage.getItem('shabamouz-progress-v1')||'{}').state?.quizResults ?? null)"
$AB screenshot /tmp/shots/03-quiz-result.png
