# -*- coding: utf-8 -*-
"""
گسترش مرجع دستورات و ترمینال شبیه‌سازی‌شده — شب‌آموز
- reference.json: +۱۰ دستور (۵ لینوکس LPIC + ۵ پاورشل) → ۲۵ دستور در ۵ دسته
- terminal.json: +۶ قاعده (ls، chmod، systemctl، show سیسکو، /ip میکروتیک، Get-Process) → ۱۶ دستور
  و به‌روزرسانی خروجی help با فهرست ۱۶ دستوری
اجرا: python3 scripts/expand-reference-terminal.py
"""
import json
from pathlib import Path

CONTENT = Path(__file__).resolve().parent.parent / "content"

# ------------------------------ reference.json ------------------------------
NEW_COMMANDS = [
    {
        "id": "linux-ls",
        "name": "ls",
        "category": "linux",
        "description": "نمایش فهرست فایل‌ها و پوشه‌ها در لینوکس؛ پرکاربردترین دستور ناوبری که با فلگ‌ها خروجی کامل می‌دهد.",
        "syntax": "ls [-l] [-a] [-h] [path]",
        "example": "ls -lah /var/log",
        "exampleOutput": "total 2.4M\ndrwxr-xr-x 2 root root 4.0K Nov 15 09:30 .\n-rw-r--r-- 1 root adm  2.1M Nov 15 09:12 syslog\n-rw-r----- 1 root adm   48K Nov 15 08:44 auth.log",
        "notes": "-l نمایش بلند با مجوز و مالک، -a فایل‌های مخفی (نقطه‌دار) و -h حجم خوانا. ترکیب رایج «ls -lah» است؛ ستون اول خروجی همان مجوزهاست که در درس مجوزهای LPIC-1 توضیح داده شده.",
    },
    {
        "id": "linux-chmod",
        "name": "chmod",
        "category": "linux",
        "description": "تغییر مجوز خواندن/نوشتن/اجرای فایل با حالت عددی یا نمادی؛ ابزار کلیدی مدیریت دسترسی در لینوکس.",
        "syntax": "chmod <mode> <file>   (مثل 755 یا u+x)",
        "example": "chmod 755 deploy.sh",
        "exampleOutput": "",
        "notes": "حالت عددی از سه رقم rwx ساخته می‌شود: 7=rwx، 5=r-x، 4=r--. پس 755 یعنی مالک دسترسی کامل و گروه و بقیه فقط خواندن/اجرا؛ برای اجرایی‌کردن اسکریپت همین کافی است. با ls -l نتیجه را ببینید.",
    },
    {
        "id": "linux-systemctl",
        "name": "systemctl",
        "category": "linux",
        "description": "مدیریت سرویس‌های systemd: دیدن وضعیت، استارت و استاپ، ری‌استارت و فعال‌سازی سرویس برای زمان بوت.",
        "syntax": "systemctl <status|start|stop|restart|enable> <service>",
        "example": "systemctl status nginx",
        "exampleOutput": "● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n   Active: active (running) since Sat 2026-11-14 21:03:41 UTC; 2h 12min ago\n   Tasks: 3 (limit: 4612)\n   Memory: 8.4M",
        "notes": "«Active: active (running)» یعنی سرویس سالم است؛ اگر failed دیدید لاگش را با journalctl -u nginx بخوانید. enable باعث می‌شود سرویس بعد از ریبوت خودکار بالا بیاید.",
    },
    {
        "id": "linux-ssh",
        "name": "ssh",
        "category": "linux",
        "description": "اتصال امن رمزنگاری‌شده به شل یک سرور ریموت؛ ابزار روزمره هر ادمین لینوکس برای مدیریت از راه دور.",
        "syntax": "ssh [user@]host [-p port]",
        "example": "ssh ali@192.168.1.10",
        "exampleOutput": "The authenticity of host '192.168.1.10' can't be established.\nAre you sure you want to continue connecting (yes/no)? yes\n\nali@server:~$",
        "notes": "پورت پیش‌فرض 22 است و با -p عوض می‌شود. ورود با کلید امن‌تر و بی‌رمز است: با ssh-keygen کلید بسازید و با ssh-copy-id روی سرور بگذارید.",
    },
    {
        "id": "linux-apt",
        "name": "apt",
        "category": "linux",
        "description": "مدیر بسته‌های دبیان/اوبونتو: نصب، به‌روزرسانی و حذف نرم‌افزار از مخازن رسمی با وابستگی‌ها.",
        "syntax": "apt <update|upgrade|install|remove> [package]",
        "example": "sudo apt install nginx",
        "exampleOutput": "Reading package lists... Done\nThe following NEW packages will be installed:\n  nginx\nSetting up nginx (1.24.0) ...\nProcessing triggers for systemd ...",
        "notes": "apt update فقط فهرست بسته‌ها را تازه می‌کند (چیزی نصب نمی‌کند) و apt upgrade بسته‌های نصب‌شده را ارتقا می‌دهد. در خانواده RHEL/CentOS معادلش dnf است.",
    },
    {
        "id": "ps-getcommand",
        "name": "Get-Command",
        "category": "powershell",
        "description": "یافتن دستورهای پاورشل با جستجو در نام یا الگوی wildcard؛ ابزار کشف توانایی‌های پاورشل.",
        "syntax": "Get-Command [-Name pattern]",
        "example": "Get-Command -Name *firewall*",
        "exampleOutput": "CommandType     Name                        Source\n-----------     ----                        ------\nFunction        Get-NetFirewallRule         NetSecurity\nCmdlet          New-NetFirewallRule         NetSecurity",
        "notes": "پاورشل صدها cmdlet دارد؛ به‌جای حفظ‌کردن، با Get-Command جستجو کنید. ستون Source نشان می‌دهد دستور از کدام ماژول می‌آید؛ ماژول NetSecurity برای فایروال ویندوز است.",
    },
    {
        "id": "ps-gethelp",
        "name": "Get-Help",
        "category": "powershell",
        "description": "نمایش راهنمای کامل هر cmdlet: سینتکس، پارامترها و مثال‌های رسمی مایکروسافت.",
        "syntax": "Get-Help <cmdlet> [-Examples | -Full]",
        "example": "Get-Help Get-Process -Examples",
        "exampleOutput": "NAME\n    Get-Process\n\nSYNOPSIS\n    Gets the processes that are running on the local computer.\n\n    -------------------------- EXAMPLE 1 --------------------------\n    PS C:\\> Get-Process",
        "notes": "معادل man در لینوکس است. اگر راهنما نصب نبود اول Update-Help اجرا کنید؛ -Examples فقط مثال‌ها را می‌آورد که برای یادگیری سریع بهترین حالت است.",
    },
    {
        "id": "ps-getchilditem",
        "name": "Get-ChildItem",
        "category": "powershell",
        "description": "نمایش فهرست فایل‌ها و پوشه‌ها؛ معادل مدرن dir در پاورشل با خروجی شیءگرا و قابل فیلتر.",
        "syntax": "Get-ChildItem [[-Path] path] [-Recurse] [-Filter pattern]",
        "example": "Get-ChildItem C:\\Logs -Filter *.log -Recurse",
        "exampleOutput": "    Directory: C:\\Logs\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n-a----        11/14/2026   9:12 PM         245760 app.log\n-a----        11/14/2026   9:30 PM           1024 error.log",
        "notes": "نام‌های مستعار dir و ls در پاورشل واقعاً همین cmdlet را اجرا می‌کنند. -Recurse وارد زیرپوشه‌ها می‌شود و چون خروجی شیء است با پایپ‌لاین فیلتر می‌شود: ... | Where-Object Length -gt 1MB.",
    },
    {
        "id": "ps-getprocess",
        "name": "Get-Process",
        "category": "powershell",
        "description": "نمایش فرآیندهای در حال اجرا با مصرف CPU و RAM؛ نقطه شروع بررسی سلامت و فشار منابع سیستم.",
        "syntax": "Get-Process [[-Name] name]",
        "example": "Get-Process chrome",
        "exampleOutput": " NPM(K)    PM(M)      WS(M)     CPU(s)      Id  ProcessName\n ------    -----      -----     ------      --  -----------\n    215    512.44     768.12     142.77   12440  chrome\n     98    233.10     402.55      88.19   10920  chrome",
        "notes": "خروجی شیء است؛ با پایپ‌لاین تحلیلش کنید: Get-Process | Sort-Object WS -Descending | Select-Object -First 5 یعنی پنج فرآیند پرمصرف RAM. متوقف‌کردن هم با Stop-Process است.",
    },
    {
        "id": "ps-getservice",
        "name": "Get-Service",
        "category": "powershell",
        "description": "نمایش سرویس‌های ویندوز و وضعیت آن‌ها؛ معادل خط‌فرمانی کنسول services.msc.",
        "syntax": "Get-Service [[-Name] name] [-DisplayName pattern]",
        "example": "Get-Service wuauserv",
        "exampleOutput": "Status   Name               DisplayName\n------   ----               -----------\nRunning  wuauserv           Windows Update",
        "notes": "Status می‌تواند Running، Stopped یا Paused باشد. کنترل سرویس با Start-Service و Stop-Service و Restart-Service است؛ با Remoting همین الگو روی سرورهای دیگر هم اجرا می‌شود.",
    },
]

ref_path = CONTENT / "reference.json"
ref = json.loads(ref_path.read_text(encoding="utf-8"))
existing_ids = {c["id"] for c in ref}
added_ref = 0
for cmd in NEW_COMMANDS:
    if cmd["id"] not in existing_ids:
        ref.append(cmd)
        added_ref += 1
ref_path.write_text(
    json.dumps(ref, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"reference.json: {len(ref)} commands (+{added_ref})")

# ------------------------------ terminal.json ------------------------------
term_path = CONTENT / "terminal.json"
term = json.loads(term_path.read_text(encoding="utf-8"))

HELP_LIST = (
    "دستورهای پشتیبانی‌شده (۱۶ دستور):\n"
    "\n"
    "  help         نمایش همین راهنما\n"
    "  ping         تست دسترسی به یک میزبان\n"
    "  ipconfig     نمایش پیکربندی شبکه (ویندوز)\n"
    "  tracert      نمایش مسیر بسته‌ها تا مقصد\n"
    "  cd / dir     ناوبری و فهرست پوشه‌ها (CMD)\n"
    "  mkdir        ساخت پوشه\n"
    "  echo / cls   چاپ متن و پاک‌کردن صفحه\n"
    "  git          status / add / commit / push\n"
    "  ls / chmod   فهرست فایل‌ها و مجوزها (لینوکس)\n"
    "  systemctl    مدیریت سرویس‌های systemd (لینوکس)\n"
    "  show         سیسکو: ip interface brief / version\n"
    "  /ip          میکروتیک: address print / route print\n"
    "  Get-Process  فرآیندهای در حال اجرا (پاورشل)"
)

NEW_RULES = [
    {
        "name": "ls",
        "usage": "ls [-la]",
        "description": "نمایش فهرست شبیه‌سازی‌شده فایل‌ها و پوشه‌ها در لینوکس",
        "matches": [
            {
                "args": "",
                "output": "Desktop    Documents    Downloads    Projects\nnotes.txt  readme.md    deploy.sh",
            },
            {
                "args": "-la",
                "output": "total 44\ndrwxr-xr-x 6 ali ali  4096 Nov 15 09:15 .\ndrwxr-xr-x 3 root root 4096 Nov 01 08:00 ..\ndrwxr-xr-x 2 ali ali  4096 Nov 12 18:30 Desktop\ndrwxr-xr-x 2 ali ali  4096 Nov 12 18:30 Documents\ndrwxr-xr-x 2 ali ali  4096 Nov 13 21:02 Projects\n-rw-r--r-- 1 ali ali  1024 Nov 14 14:22 notes.txt\n-rw-r--r-- 1 ali ali  2310 Nov 14 09:47 readme.md\n-rwxr-xr-x 1 ali ali   512 Nov 15 08:12 deploy.sh\n\nستون اول مجوزهاست: drwxr-xr-x یعنی پوشه با دسترسی کامل مالک و خواندن/اجرا برای بقیه؛ x در انتهای deploy.sh یعنی اسکریپت اجرایی است.",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی فقط ls بدون پارامتر و با -la پشتیبانی می‌شود؛ خروجی بلند را با ls -la ببینید.",
            },
        ],
        "defaultOutput": "در این شبیه‌سازی فقط ls بدون پارامتر و با -la پشتیبانی می‌شود.",
    },
    {
        "name": "chmod",
        "usage": "chmod <mode> <file>",
        "description": "اعمال شبیه‌سازی‌شده مجوزهای لینوکس با حالت عددی (755 و 644)",
        "matches": [
            {
                "args": "755 *",
                "output": "مجوز «{{arg}}» اعمال شد.\nحالت 755 = rwxr-xr-x: مالک خواندن/نوشتن/اجرا، گروه و سایر کاربران فقط خواندن و اجرا.\nبا ls -la می‌توانید نتیجه را ببینید.\n(خروجی شبیه‌سازی‌شده)",
            },
            {
                "args": "644 *",
                "output": "مجوز «{{arg}}» اعمال شد.\nحالت 644 = rw-r--r--: مالک می‌خواند و می‌نویسد و بقیه فقط می‌خوانند؛ حالت استاندارد فایل‌های متنی و پیکربندی.\n(خروجی شبیه‌سازی‌شده)",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی حالت‌های عددی 755 و 644 پشتیبانی می‌شوند؛ مثل: chmod 755 deploy.sh",
            },
        ],
        "defaultOutput": "خطا: حالت مجوز و نام فایل را وارد کنید.\nشیوه صحیح: chmod 755 deploy.sh",
    },
    {
        "name": "systemctl",
        "usage": "systemctl <status|start|restart|enable> <service>",
        "description": "مدیریت شبیه‌سازی‌شده سرویس‌های systemd لینوکس",
        "matches": [
            {
                "args": "status nginx",
                "output": "● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n   Active: active (running) since Sat 2026-11-14 21:03:41 UTC; 2h 12min ago\n   Tasks: 3 (limit: 4612)\n   Memory: 8.4M\n\nسرویس nginx فعال و در حال اجراست؛ enabled یعنی بعد از ریبوت هم خودکار بالا می‌آید.",
            },
            {
                "args": "status *",
                "output": "● {{arg}}.service\n   Active: active (running) since Sat 2026-11-14 21:03:41 UTC; 1h 8min ago\n\nسرویس {{arg}} فعال است.\n(خروجی شبیه‌سازی‌شده)",
            },
            {
                "args": "start *",
                "output": "سرویس {{arg}} استارت شد. برای اطمینان از سلامت آن، systemctl status {{arg}} را اجرا کنید.",
            },
            {
                "args": "restart *",
                "output": "سرویس {{arg}} ری‌استارت شد؛ چند ثانیه صبر کنید و وضعیت را با systemctl status {{arg}} چک کنید.",
            },
            {
                "args": "enable *",
                "output": "سرویس {{arg}} برای اجرای خودکار بعد از ریبوت فعال شد (created symlink).",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی زیردستورهای systemctl پشتیبانی‌شده: status / start / restart / enable — مثل: systemctl status nginx",
            },
        ],
        "defaultOutput": "خطا: عملیات و نام سرویس را وارد کنید.\nشیوه صحیح: systemctl status nginx",
    },
    {
        "name": "show",
        "usage": "show <ip interface brief | version>",
        "description": "دستورات نمایشی سیسکو IOS: وضعیت اینترفیس‌ها و اطلاعات سیستم",
        "matches": [
            {
                "args": "ip interface brief",
                "output": "Interface              IP-Address      Status                Protocol\nGigabitEthernet0/0     192.168.1.1     up                    up\nGigabitEthernet0/1     unassigned      administratively down down\nSerial0/0/0            203.0.113.2     up                    up\nVlan1                  192.168.10.1    up                    up\n\n«up/up» یعنی لایه فیزیکی و پروتکل هر دو سالم‌اند؛ «administratively down» یعنی اینترفیس با shutdown بسته شده است.",
            },
            {
                "args": "version",
                "output": "Cisco IOS Software, Version 15.9(3)M3, RELEASE SOFTWARE (fc1)\nRouter uptime is 6 weeks, 2 days, 4 hours, 11 minutes\nSystem returned to ROM by power-on\nSystem image file is \"flash:c2900-universalk9-mz.SPA.159-3.M3.bin\"\n\nProcessor board ID FTX1234ABCD\n2 Gigabit Ethernet interfaces\n1 Serial interface\n(خروجی شبیه‌سازی‌شده)",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی زیردستورهای show پشتیبانی‌شده: ip interface brief و version — مثل: show ip interface brief",
            },
        ],
        "defaultOutput": "خطا: زیردستور show را وارد کنید.\nشیوه صحیح: show ip interface brief",
    },
    {
        "name": "/ip",
        "usage": "/ip <address print | route print>",
        "description": "دستورات RouterOS میکروتیک: نمایش آدرس‌ها و جدول مسیریابی",
        "matches": [
            {
                "args": "address print",
                "output": "Flags: D - dynamic\n #   ADDRESS             NETWORK         INTERFACE\n 0   192.168.88.1/24     192.168.88.0    bridge\n 1   85.15.20.4/28       85.15.20.0      ether1\n 1 D 192.168.1.100/24    192.168.1.0     ether2\n\nآدرس 192.168.88.1/24 آدرس پیش‌فرض روتر برای LAN روی bridge است؛ ردیف D یعنی آدرس dynamic از DHCP.",
            },
            {
                "args": "route print",
                "output": "Flags: A - active, D - dynamic, C - connect, S - static\n #      DST-ADDRESS        GATEWAY          DISTANCE\n 0 ADS  0.0.0.0/0          85.15.20.1              1\n 1 ADC  192.168.88.0/24    bridge                  0\n 2 ADC  192.168.1.0/24     ether2                  0\n\nمسیر 0.0.0.0/0 همان default route است و ترافیک اینترنت از گیت‌وی 85.15.20.1 خارج می‌شود.",
            },
            {
                "args": "address add {{rest}}",
                "output": "آدرس {{rest}} روی اینترفیس اضافه شد؛ فهرست جدید را با /ip address print ببینید.\n(خروجی شبیه‌سازی‌شده)",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی زیردستورهای /ip پشتیبانی‌شده: address print / route print / address add — مثل: /ip address print",
            },
        ],
        "defaultOutput": "خطا: زیردستور /ip را وارد کنید.\nشیوه صحیح: /ip address print",
    },
    {
        "name": "Get-Process",
        "usage": "Get-Process",
        "description": "نمایش شبیه‌سازی‌شده فرآیندهای در حال اجرا با پاورشل",
        "matches": [
            {
                "args": "",
                "output": " NPM(K)    PM(M)      WS(M)     CPU(s)      Id  ProcessName\n ------    -----      -----     ------      --  -----------\n    215    512.44     768.12     142.77   12440  chrome\n     98    233.10     402.55      88.19   10920  chrome\n     44     61.12      95.30      12.40    4188  explorer\n     30     42.88      71.16       3.05    9260  Code\n     12      8.20      18.44       0.88    2456  notepad\n\nخروجی پاورشل شیءگراست؛ با پایپ‌لاین تحلیلش کنید: Get-Process | Sort-Object WS -Descending | Select-Object -First 3",
            },
            {
                "args": "*",
                "output": "در این شبیه‌سازی فقط Get-Process بدون پارامتر پشتیبانی می‌شود؛ در پاورشل واقعی «Get-Process {{arg}}» فرآیندهای هم‌نام را فیلتر می‌کند.",
            },
        ],
        "defaultOutput": " NPM(K)    PM(M)      WS(M)     CPU(s)      Id  ProcessName\n ------    -----      -----     ------      --  -----------\n    215    512.44     768.12     142.77   12440  chrome\n     98    233.10     402.55      88.19   10920  chrome\n     44     61.12      95.30      12.40    4188  explorer",
    },
]

existing_rules = {r["name"] for r in term["rules"]}
added_rules = 0
for rule in NEW_RULES:
    if rule["name"] not in existing_rules:
        term["rules"].append(rule)
        added_rules += 1

# به‌روزرسانی خروجی help با فهرست ۱۶ دستوری (هم در match و هم defaultOutput)
help_rule = next(r for r in term["rules"] if r["name"] == "help")
help_rule["matches"][0]["output"] = HELP_LIST + "\n\nنکته: این ترمینال شبیه‌سازی‌شده است و خروجی‌ها از پیش تعریف‌شده‌اند."
help_rule["defaultOutput"] = HELP_LIST

term_path.write_text(
    json.dumps(term, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"terminal.json: {len(term['rules'])} rules (+{added_rules})")
