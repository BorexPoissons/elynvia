# ELYNVIA Life — Deployment

## Target

Initial target: Vercel for the Next.js Life application, Supabase for auth/database.

## Required environment variables

Set these in the deployment platform; never commit real values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No `service_role` key is allowed in the browser application.

## Vercel monorepo setup

Recommended project settings:

- Repository: `BorexPoissons/elynvia`
- Root directory: repository root
- Framework: Next.js
- Build command: `pnpm --filter @elynvia/life build`
- Development command: `pnpm --filter @elynvia/life dev`

The repository includes `vercel.json` with the same commands.

## Before first production deploy

1. Apply every SQL migration in `supabase/migrations/` to the target Supabase project in order.
2. Run the two-user RLS test plan.
3. Configure Supabase Auth site URL and redirect URLs for the deployed domain.
4. Add the public Supabase environment variables to Vercel.
5. Build and deploy.
6. Test sign-up, login, logout, intent creation, clarification, project promotion, and cross-user isolation.

## Domain progression

Start with the generated preview domain. Only after validation, attach `life.elynvia.com`.

## Production rule

A successful frontend deploy does not prove database security. Production is approved only after RLS isolation tests pass against the production database.
