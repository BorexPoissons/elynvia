# ELYNVIA — Architecture v0.1

## Architectural goal

Start simple enough to ship ELYNVIA Life while preserving clean boundaries for a future multi-product ecosystem.

## Product topology

```text
ELYNVIA
├── Life        personal user experience
├── Network     future agent coordination
├── Business    future professional agents
├── Trust       future verification/reputation
├── Pay         future transaction service
├── ID          shared identity concept
└── Protocol    future external agent contract
```

Only Life is an implementation priority today.

## Repository strategy

Use a monorepo so applications can share typed contracts and UI primitives without collapsing into one codebase.

```text
apps/life
packages/ui
packages/ai
packages/auth
packages/intents
supabase/migrations
supabase/functions
docs
```

Directories are created when implementation begins; empty directories do not need to be committed merely for appearance.

## Life layers

```text
UI
↓
Application services
↓
Domain contracts (Intent, Project, Memory)
↓
AI orchestration / tool layer
↓
Data access / Supabase
```

Domain contracts must not depend on UI components or a specific AI provider.

## Shared contracts

The first important shared contract is `Intent`. Future Network communication should consume explicit Intent/Offer-style contracts rather than directly reading Life-owned tables.

## AI provider boundary

`packages/ai` should expose ELYNVIA-level capabilities rather than provider-specific APIs to the rest of the application. Provider adapters can implement those capabilities.

Conceptually:

```text
Life → ELYNVIA AI interface → provider adapter → model
```

## Backend direction

Initial backend: Supabase/PostgreSQL.

Use migrations as the canonical database history. The production schema should be reproducible from versioned migrations rather than dashboard-only manual changes.

## Environment strategy

Initial development may begin with one Supabase development project. Before meaningful public production traffic, use separate development/staging/production environments.

Do not prematurely create separate Supabase projects for Life, Network and Pay. Revisit isolation when those services exist and operational/security requirements justify it.

## Integration boundary

Future ELYNVIA products should communicate through explicit APIs/events/contracts. Avoid allowing one product to depend on undocumented internals of another product.

## Observability

Plan for structured application errors, AI request metadata without leaking sensitive content, audit events for privileged actions, and cost/latency measurement for AI providers.

## Scalability principle

Do not optimize for hypothetical global scale before product validation. Do avoid choices that make security boundaries, migrations or provider replacement unnecessarily difficult later.
