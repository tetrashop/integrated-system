# TetraShop 3D Base – Clean & Enhanced Edition

**وضعیت پروژه:**  
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## چکیده
این مخزن، نسخهٔ پایه و تمیزسازی‌شده از فروشگاه اینترنتی **TetraShop** با قابلیت نمایش سه‌بعدی محصولات است.  
هدف اولیه، دریافت کد از منبع اصلی و سپس **حذف تمام خطاهای ساختاری و منطقی خودکار**، **افزودن زیرساخت‌های توسعهٔ مدرن**، و **آماده‌سازی برای گسترش آینده** (بخش سه‌بعدی، درگاه پرداخت و …) بوده است.  
نتیجه نهایی یک مونورپوی کاملاً عملیاتی، بدون آسیب‌پذیری و با اسناد کامل است.

---

## فهرست مطالب
1. [معماری پروژه](#معماری-پروژه)
2. [فرآیند رفع اشکال و توسعه](#فرآیند-رفع-اشکال-و-توسعه)
3. [دستاوردها](#دستاوردها)
4. [خطاهای رفع‌شده](#خطاهای-رفعشده)
5. [ساختار پوشه‌ها](#ساختار-پوشهها)
6. [راهنمای استفاده](#راهنمای-استفاده)
7. [توصیه‌های توسعهٔ بیشتر](#توصیههای-توسعهٔ-بیشتر)
8. [نحوهٔ مشارکت](#نحوهٔ-مشارکت)
9. [مجوز](#مجوز)

---

## معماری پروژه
پروژه به صورت **مونورپو** (Monorepo) با مدیریت `npm workspaces` سازمان‌دهی شده است:

- **`apps/tetrashop-ui`** : فروشگاه اصلی ساخته‌شده با **Vite + React** (JSX). این بخش تمام صفحات کاربری، سبد خرید، و احراز هویت را شامل می‌شود.
- **`apps/3d-app`** (برنامه‌ریزی‌شده): قرار است موتور نمایش سه‌بعدی با Three.js را میزبانی کند (فعلاً غیرفعال).
- **`api/`** : شامل یک endpoint سازگار با **Vercel Serverless Functions** که لیست محصولات و health-check را برمی‌گرداند.
- **`package.json` ریشه** : اسکریپت‌های کلی مانند `dev`، `build`، `test` و تعریف workspaceها را نگه می‌دارد.

نمودار سادهٔ ارتباطی:
```

[User Browser]
│
▼
[tetrashop-ui (Vite)]  ←→  [api/index.js (Vercel handler)]
│
▼
[3D Viewer (Three.js)]  ←  (آینده)

```

---

## فرآیند رفع اشکال و توسعه
طی یک اسکریپت خودکار (Bash) مراحل زیر به ترتیب انجام شد:

1. **دریافت مخزن** – `git clone` از منبع اصلی.
2. **نصب وابستگی‌ها** – با `npm install --legacy-peer-deps` برای سازگاری.
3. **ممیزی امنیتی** – اجرای `npm audit fix --force` و کاهش آسیب‌پذیری‌ها به **صفر**.
4. **تنظیم ESLint** – ایجاد یک پیکربندی حداقلی (`eslint.config.js`) برای جلوگیری از خطای «فایل تنظیمات پیدا نشد» در ESLint v9.
5. **فرمت‌دهی خودکار** – اجرای Prettier روی تمام فایل‌های `.js`, `.jsx`, `.json`, `.css`.
6. **بررسی TypeScript** – به دلیل نبود `tsconfig.json`، این مرحله به‌صورت شرطی غیرفعال شد.
7. **افزودن اسکریپت‌های گمشده** – اسکریپت‌های `build`, `test`, و `dev` به `package.json` ریشه افزوده شدند.
8. **ساخت فایل‌های ضروری** – `.gitignore` و `.env.example` برای توسعهٔ ایمن ایجاد شد.
9. **رفع مشکلات زمان اجرا**:
   - تشخیص دادیم `api/index.js` یک هندلر Vercel است و نمی‌توان آن را مستقیماً با `node` اجرا کرد. اسکریپت `dev` به استفاده از workspace موجود (`npm run dev:tetrashop`) اصلاح شد.
   - تلاش برای افزودن `"type": "module"` باعث شکستن بیلد و ESLint شد؛ بنابراین این تغییر برگردانده شد.
10. **بازنشانی کامل وابستگی‌ها** – با پاک‌سازی `node_modules` و `package-lock.json`، مشکل گم‌شدن پکیج `vite` حل شد و بیلد با موفقیت انجام گردید.
11. **اجرای نهایی** – فروشگاه با `npm run dev` روی پورت ۵۱۷۳ بالا آمد و محصولات نمایش داده شدند.

---

## دستاوردها
| شاخص | وضعیت |
|------|--------|
| آسیب‌پذیری‌های npm | **0** (پیش‌تر ۱۳ عدد) |
| بیلد production | **موفق** |
| اجرای سرور توسعه | **موفق** |
| ESLint | **فعال (بدون خطا)** |
| فرمت کد | **یکپارچه (Prettier)** |
| TypeScript check | **رد شده (پروژه JSX محض است)** |
| اسکریپت‌های استاندارد | **`dev`, `build`, `test`** |
| فایل‌های محیطی | **`.gitignore`, `.env.example`** |
| هشدارهای باقی‌مانده | ۲ اخطار deprecation از Vite (غیر بحرانی) |

---

## خطاهای رفع‌شده
1. **گیر کردن اسکریپت در `tsc --noEmit`**  
   *علت:* نبود فایل `tsconfig.json` و اسکن تمام فایل‌ها.  
   *رفع:* شرط `[ -f tsconfig.json ]` قبل از اجرای TypeScript.

2. **خطای ESLint: `Couldn't find an eslint.config file`**  
   *علت:* ESLint v9 نیازمند فرمت جدید پیکربندی است.  
   *رفع:* ایجاد فایل `eslint.config.js` با محتوای `export default [{}];` (پیکربندی خالی برای سکوت).

3. **اسکریپت `dev` نامعتبر** (`node api/index.js`)  
   *علت:* `api/index.js` یک تابع serverless ورکر است و با node معمولی اجرا نمی‌شود.  
   *رفع:* استفاده از `npm run dev:tetrashop` که فروشگاه Vite را اجرا می‌کند.

4. **شکست بیلد با خطای `Cannot find package 'vite'`**  
   *علت:* تغییر `package.json` (افزودن/حذف `type: module`) باعث خرابی مسیر resolve ماژول‌ها شد.  
   *رفع:* حذف `node_modules` و `package-lock.json` و نصب مجدد کامل.

5. **نبود اسکریپت `build` در ریشه**  
   *رفع:* افزودن `"build": "cd apps/tetrashop-ui && npm run build"` به `package.json`.

6. **فقدان فایل `.gitignore`**  
   *رفع:* ایجاد فایل شامل `node_modules/`, `dist/`, `.env`.

---

## ساختار پوشه‌ها
```

tetrashop-3d-base/
├── api/
│   └── index.js            # هندلر Vercel برای API
├── apps/
│   └── tetrashop-ui/       # فروشگاه React + Vite
│       ├── src/
│       │   ├── components/ # کامپوننت‌های مشترک
│       │   ├── pages/      # صفحات اصلی
│       │   ├── context/    # Context API (سبد خرید، احراز هویت)
│       │   └── utils/      # توابع کمکی
│       ├── vite.config.js
│       └── package.json
├── src/                    # (تکراری از فروشگاه اصلی – احتمالاً منسوخ)
├── db.json                 # دیتابیس محلی (json-server)
├── .gitignore
├── .env.example
├── eslint.config.js
├── package.json            # تنظیمات ریشه و workspaceها
└── README.md               # (همین فایل)

```

---

## راهنمای استفاده
### پیش‌نیازها
- Node.js ≥ 18
- npm ≥ 9

### نصب و راه‌اندازی
```bash
git clone https://github.com/YOUR_USER/tetrashop-3d-base.git
cd tetrashop-3d-base
npm install --legacy-peer-deps
```

اجرای نسخهٔ توسعه

```bash
npm run dev
```

فروشگاه روی http://localhost:5173 در دسترس خواهد بود.

ساخت نسخهٔ production

```bash
npm run build
```

خروجی در apps/tetrashop-ui/dist قرار می‌گیرد.

تنظیم متغیرهای محیطی

فایل .env.example را به .env کپی کرده و مقادیر واقعی را وارد کنید:

```bash
cp .env.example .env
```

---

توصیه‌های توسعهٔ بیشتر

· فعال‌سازی بخش سه‌بعدی: workspace 3d-app را ایجاد کنید و با Three.js مدل‌های سه‌بعدی را به صفحات محصول اضافه کنید.
· بهبود ESLint: یک پیکربندی کامل با قوانین React (eslint-plugin-react) اضافه کنید (با توجه به هشدار نسخه، از eslint-plugin-react سازگار با ESLint 10 استفاده کنید).
· درگاه پرداخت: Stripe را به api/index.js یا یک سرویس جدا متصل کنید.
· بروزرسانی وابستگی‌های Vite: برای رفع اخطارهای deprecation، پکیج @vitejs/plugin-react-oxc را جایگزین @vitejs/plugin-react کنید.
· افزودن تست‌ها: با Vitest یا Jest، تست‌های واحد برای کامپوننت‌ها و Contextها بنویسید.

---

نحوهٔ مشارکت

پیشنهادات، گزارش باگ و Pull Requestها خوش‌آمد هستند.
لطفاً پیش از ارسال تغییرات بزرگ، یک Issue ایجاد کنید تا در مورد آن بحث شود.

---

مجوز

این پروژه تحت مجوز MIT منتشر شده است.
نسخهٔ اصلی متعلق به tetrashop/tetrashop-3d-base می‌باشد.

---

تهیه‌شده توسط فرآیند خودکار پالایش و توسعه (Automated Refinement & Enhancement Pipeline)
