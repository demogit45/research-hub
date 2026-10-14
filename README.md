# Research Hub — Next.js 14 (App Router) + Supabase

A modern, high-performance research hub dashboard converted from single-file architecture to **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**, backed by a live **Supabase** backend with Realtime synchronization.

---

## 🚀 Key Features

- **Supabase Realtime Sync:** Live task progress and member updates propagate immediately via WebSockets across all active browsers without manual refresh.
- **Supabase Auth & Profiles:** Official email/password authentication (`signInWithPassword` & `signUp`) synchronizing user metadata into a relational `public.members` profile table.
- **Role-Based Controls:** Dynamic admin permissions to assign work, register team members, and modify resource tiles.
- **Bento Grid & Palette:** Warm ink (`#100f0c` dark / `#faf8f3` light) and ember accent (`#e0a458`), Space Grotesk + Geist typography, and micro-interactions.
- **Interactive "My Work":** Range slider and instant percentage buttons (`0%`, `25%`, `50%`, `75%`, `100%`) for researchers to update work progress in real-time.
- **XSS Security:** Strict URI validation protocol checking (`safeUrl`) allowing only `http:`, `https:`, and `mailto:` schemes.

---

## 📁 Project Structure

```
hub-next/
├── app/
│   ├── globals.css           # Theme variables, typography, animations, bento styles
│   ├── layout.tsx            # Root layout with grain, vignette, and ToastProvider
│   └── page.tsx              # Main dashboard assembling modular components
├── components/
│   ├── Header.tsx            # Wordmark, theme switcher, actions, live stats readout
│   ├── ResourceBento.tsx     # Bento grid, category filter rail, resource cards
│   ├── MemberRoster.tsx      # Department chips, researcher cards, task progress bars
│   ├── TaskList.tsx          # "My work" section with real-time sliders & quick jumps
│   ├── AuthModal.tsx         # Supabase Auth sign-in & registration with profile sync
│   ├── TaskModal.tsx         # Modal for assigning tasks to researchers
│   ├── PersonModal.tsx       # Modal for adding new lab researchers
│   ├── LinkModal.tsx         # Modal for adding/editing resource cards & icons
│   ├── GuideModal.tsx        # How the hub works modal & keyboard shortcuts
│   ├── ConfigModal.tsx       # Safe JSON.parse import & config export modal
│   ├── Icon.tsx              # SVG icon system matching all hub symbols
│   └── Toast.tsx             # Interactive toast notifications
├── hooks/
│   ├── useAuth.ts            # Supabase session, profile, and auth methods
│   └── useRealtimeData.ts    # Supabase Realtime channel subscriptions & mutations
├── lib/
│   ├── config.ts             # Default configuration and initial seed data
│   ├── utils.ts              # URL sanitization, date formatting, and helpers
│   └── supabase/
│       ├── client.ts         # Browser client (@supabase/ssr)
│       ├── server.ts         # Server client (@supabase/ssr)
│       └── middleware.ts     # Cookie handling & session renewal
├── types/
│   └── index.ts              # TypeScript interfaces for Member, Task, Link, Config
├── supabase/
│   └── schema.sql            # Full SQL migration script with RLS & Realtime
├── middleware.ts             # Next.js edge session refresh middleware
├── tailwind.config.ts        # Custom theme colors and font definitions
└── package.json
```

---

## 🛠️ Getting Started Locally

### 1. Install Dependencies
```bash
cd hub-next
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` (already preconfigured with your Supabase credentials):
```env
NEXT_PUBLIC_SUPABASE_URL=https://bhwkufuzvprbsnyvxrgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ru06ErJHTRTzNH06jjow-A_S4ejB5oC
```

### 3. Initialize Supabase Database
Run `supabase/schema.sql` in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) to set up tables (`departments`, `members`, `tasks`), RLS policies, and Realtime publications.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploy to Vercel

### Option A: Using the Vercel CLI
```bash
# 1. Install Vercel CLI if needed
npm i -g vercel

# 2. Deploy from the project root
cd hub-next
vercel

# 3. Add Environment Variables during prompt or via command line:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Deploy to Production
vercel --prod
```

### Option B: Deploying via GitHub & Vercel Dashboard
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: modern Next.js research hub with Supabase Realtime"
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new), import your GitHub repository.
3. Set the **Root Directory** to `hub-next` (if part of a monorepo) or `./`.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://bhwkufuzvprbsnyvxrgz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_Ru06ErJHTRTzNH06jjow-A_S4ejB5oC`
5. Click **Deploy**. Vercel will automatically build and distribute the application globally with edge caching.
