# פריסה ל־Vercel

הפרויקט כולל מסלול Next.js רגיל, ללא צורך ב־Cloudflare, במסד נתונים או בהתחברות ל־ChatGPT בגרסת Vercel.

## הגדרות הפרויקט

1. העלו את תוכן הפרויקט למאגר Git ובחרו Import Project ב־Vercel.
2. Root Directory: התיקייה שמכילה את `package.json` ואת `vercel.json` (במאגר הנוכחי: `yigal-site`, אם מייבאים את תיקיית האב).
3. Framework Preset: **Next.js**. Node.js: **22.x**.
4. Install Command: `npm ci`.
5. Build Command: `npm run build:vercel`.
6. השאירו Output Directory בברירת המחדל של Next.js; אל תבחרו `dist` או `public`.

הפקודות מוגדרות גם ב־`vercel.json`. אין משתני סביבה חובה. אפשר להגדיר `SITE_URL=https://your-domain.example` לאחר חיבור דומיין, כדי להתאים את כתובות תמונות השיתוף. בהיעדרו נעשה שימוש בכתובת הפרויקט של Vercel.

## בדיקה מקומית

```sh
npm ci
npm test
npm run build:vercel
npm run start:vercel
```

פיתוח: `npm run dev:vercel`. הכתובת המקומית הרגילה היא `http://localhost:3000`.

כאשר שרת הייצור המקומי פועל, אפשר להריץ בחלון נוסף `node --import tsx scripts/verify-vercel.mjs` לבדיקת נתיבי האתר, הנכסים וה־API המושבת.

## יצירת קשר — ללא מסד נתונים

בהתאם לבקשה, האתר מציג קישורי טלפון, WhatsApp ודוא״ל בלבד. אין איסוף פרטים ואין מצג של שליחה מוצלחת. `POST /api/inquiries` מחזיר `503` ללא שמירה. כדי להפעיל טופס בעתיד יש לחבר אחסון/מסירה ולבדוק הצלחה אמיתית לפני החזרת ממשק הטופס.

## אנימציות ונכסים

קבצי התמונות, הפונטים וקומפוזיציות HyperFrames כבר נמצאים ב־`public/`. אין צורך להריץ HyperFrames או לייצר וידאו בשרת הבנייה. הפתיחה החדשה בעברית פועלת ב־HTML/GSAP ואינה תלויה באישור ניגון וידאו.

## מסלול האחסון הקודם

`npm run dev`, `npm run build` ו־`npm start` נשמרו למסלול Sites/Vinext הקודם. **ל־Vercel משתמשים בפקודות עם הסיומת `:vercel`**. קבצי D1 וההגדרות הישנות נשמרו כמקור לעבודה עתידית, אך אינם מיובאים מנתיבי היישום הפעילים.

הכנת הקוד והבדיקה המקומית אינן פריסה לחשבון Vercel. יש לייבא את המאגר ולבצע Deploy בחשבון היעד.

תיעוד: [Next.js ב־Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [הגדרות vercel.json](https://vercel.com/docs/project-configuration/vercel-json).
