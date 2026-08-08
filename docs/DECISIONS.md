# ELYNVIA — Decision Log

Important product/architecture decisions are recorded here so future contributors and AI agents understand not only what exists, but why.

## 2026-08-08 — D001 — ELYNVIA is an ecosystem, not one monolithic product

**Decision:** ELYNVIA is the parent brand. Life is the first product; Network, Business, Trust, Pay, ID and Protocol are potential distinct products/services.

**Reason:** This allows independent evolution, security boundaries and business models while preserving a coherent ecosystem.

## 2026-08-08 — D002 — Build Life before Network

**Decision:** ELYNVIA Life is the first implementation priority.

**Reason:** Real Life usage can reveal which human intentions actually occur and therefore what Network should eventually support.

## 2026-08-08 — D003 — Intent is the first shared domain primitive

**Decision:** Define a structured `Intent` contract before building broad agent/network functionality.

**Reason:** The ecosystem depends on reliably translating human goals into machine-usable representations.

## 2026-08-08 — D004 — Use a monorepo initially

**Decision:** Keep Life and shared packages in one repository, with explicit product boundaries.

**Reason:** Early development benefits from shared types/tooling without requiring premature distributed-service complexity.

## 2026-08-08 — D005 — Supabase/PostgreSQL is the initial backend

**Decision:** Use Supabase for the first backend and version database changes through migrations.

**Reason:** It provides PostgreSQL, authentication, storage and RLS while keeping the core data model portable and inspectable.

## 2026-08-08 — D006 — AI providers must remain replaceable

**Decision:** Product/domain logic will depend on an ELYNVIA AI abstraction rather than directly on one model vendor throughout the application.

**Reason:** Model quality, price and capabilities evolve quickly. ELYNVIA must remain the durable product layer.

## 2026-08-08 — D007 — Privacy and security are foundational

**Decision:** RLS, least privilege, user-controlled memory and explicit action permissions are architectural requirements.

**Reason:** ELYNVIA's usefulness depends on access to personal context, making trust a core product requirement.

## 2026-08-08 — D008 — Keep the first database intentionally small

**Decision:** Life starts with only `profiles`, `projects`, `conversations`, `messages` and `intents` plus Supabase Auth.

**Reason:** These tables support the first validated user journey without prematurely creating memory, payments, network or business infrastructure.

## 2026-08-08 — D009 — Use pnpm/Turborepo for the initial monorepo

**Decision:** Use pnpm workspaces with Turborepo, with `apps/life` and shared packages such as `packages/intents`.

**Reason:** This keeps shared contracts reusable while retaining clear product boundaries and simple local development.

## 2026-08-08 — D010 — Supabase browser access is publishable-key + RLS only

**Decision:** Browser code may use only the project's public/publishable Supabase credential. Privileged service credentials must never be shipped to the browser or committed.

**Reason:** Authorization belongs in RLS/server boundaries, not in obscurity or client-side filtering.
