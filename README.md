# Chesterfield Property Management — Next.js (Vercel-ready)

- Next.js 14 (App Router) + Tailwind
- Calendly wired (header + hero) → https://calendly.com/chesterfieldgroup/30min
- Pricing: **6% monthly**, **no leasing fee**, month-to-month
- KPI helper text, CMHC rent chips, service areas → lead form (2-step)
- `/api/lead` emails Brandon (via Resend if `RESEND_API_KEY` set) or logs
- `/api/reviews` ready for Google Places integration

## Deploy on Vercel
1. Upload *all files at repo root* to GitHub (top-level should show `app/`, `public/`, `package.json`).
2. Import repo to Vercel. **Root Directory:** leave blank.
3. Build command: `next build` (auto), Output: `.next` (auto).
4. (Optional) Add `RESEND_API_KEY` and `LEADS_TO_EMAIL` in Project → Settings → Environment Variables.
