# ELYNVIA

**From intention to action.**

ELYNVIA is an AI-native ecosystem designed to turn human intentions into useful actions with as little friction as possible.

The first product is **ELYNVIA Life** — *Your Life. Your Agent.*

## Current scope

Only the Life foundation is being implemented now. Network, Business, Trust, Pay and Protocol remain future products and must not add complexity to Life V1.

## Repository

```text
apps/life                 Next.js user experience
packages/intents          shared Intent contract + validation
supabase/migrations       canonical database history
supabase/functions        future server-side Supabase functions
docs                      product and technical source of truth
AGENTS.md                  rules for AI coding agents
```

## Backend

Supabase DEV project URL:

`https://lrhrguotvznqeawoncch.supabase.co`

The URL is public configuration. Never commit service-role keys, database passwords or private API keys.

The first migration creates only:

- profiles
- projects
- conversations
- messages
- intents

RLS is enabled on all five user-owned tables.

## Local development

Requirements: Node.js 22+, pnpm 10+, and optionally the Supabase CLI for local database work.

```bash
pnpm install
cp .env.example apps/life/.env.local
# Fill NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY with the project's public/publishable key.
pnpm dev
```

Open `http://localhost:3000`.

## Database workflow

Database changes are never made as undocumented dashboard-only edits. Add migrations under `supabase/migrations/`, review them, then apply them to the intended environment.

The initial remote migration has **not** been assumed applied until it is explicitly verified against Supabase DEV.

## First milestone

The first product capability is the **ELYNVIA Intent Engine**: convert natural-language requests into validated structured Intent objects, ask only useful follow-up questions, and persist the result safely.

See `docs/INTENT_CONTRACT.md` and `packages/intents/src/index.ts`.
