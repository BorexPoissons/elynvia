# ELYNVIA — Agent Development Rules

This file is authoritative for AI coding agents working on ELYNVIA.

## Before making significant changes

1. Read `docs/MASTER_SPEC.md`.
2. Read `docs/VISION.md`.
3. Read `docs/ARCHITECTURE.md` before structural changes.
4. Read `docs/DATABASE.md` before database changes.
5. Read `docs/DECISIONS.md` before changing an established choice.
6. Read `docs/SECURITY.md` before auth, permissions, storage, API or data changes.

## Core rules

- ELYNVIA is the product; AI model providers are replaceable engines.
- `ELYNVIA Intent` is a core shared domain object.
- Life, Network, Business, Trust and Pay must remain logically decoupled.
- Cross-product communication should use explicit contracts/APIs rather than direct table coupling.
- Every database schema change must be versioned as a migration.
- Enable and test RLS for user-sensitive Supabase tables.
- Never expose service-role keys, private API keys, passwords or secrets in client code or the repository.
- Prefer least privilege and server-side validation.
- Do not build speculative modules merely because they appear in the long-term vision.
- V1 prioritizes a reliable human-intention-to-structured-intent experience.
- Preserve backwards compatibility of shared contracts when practical; document breaking changes.
- Add important architectural/product decisions to `docs/DECISIONS.md`.

## Working style

- Keep changes focused and reviewable.
- Avoid unrelated refactors.
- Prefer simple, typed, testable code.
- Document public interfaces and important invariants.
- Treat privacy, security, observability and internationalization as architectural concerns, not afterthoughts.

## Initial technology direction

- Monorepo
- Next.js / React / TypeScript for ELYNVIA Life
- Supabase / PostgreSQL for initial backend
- Provider-independent AI layer
- GitHub as the source of truth for code and versioned technical documentation

These choices may evolve only through an explicit documented decision.
