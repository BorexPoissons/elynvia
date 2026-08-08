# ELYNVIA — Master Spec v0.1

Status: Foundation

## Mission

Transform a human intention into useful action with the minimum possible friction.

## Vision

People currently move through search engines, websites, apps, forms, comparisons and manual coordination to accomplish everyday goals. ELYNVIA aims to provide a simpler interface: express what you want naturally, let the system understand the goal and context, then help move from intention to result.

ELYNVIA is not intended to be only a chatbot or a wrapper around one model provider. It is an AI-native product and, over time, an ecosystem of interoperable services and agents.

## Brand architecture

### ELYNVIA Life
Personal product for individuals. Signature: **Your Life. Your Agent.**

### ELYNVIA Network
Future infrastructure for discovering, matching and coordinating agents, businesses and services.

### ELYNVIA Business
Future professional-agent product connected to business data, availability, catalogues, services and systems.

### ELYNVIA Trust
Future identity, verification and reputation layer.

### ELYNVIA Pay
Future transaction layer.

### ELYNVIA ID
Shared identity concept across the ecosystem.

### ELYNVIA Protocol
Future open contract/protocol for agent-to-agent communication.

## First product

Development starts with **ELYNVIA Life**.

The first product must prove one fundamental capability: ELYNVIA can reliably understand what a user wants to accomplish.

## Core domain object: Intent

An Intent is a structured representation of a human goal.

Example input:

> I want to spend five days in Italy in September with my partner. Maximum budget CHF 1,500.

Conceptual output:

```json
{
  "type": "travel",
  "status": "planning",
  "participants": 2,
  "destination": { "country": "Italy" },
  "duration_days": 5,
  "time_window": { "month": "September" },
  "budget": { "amount": 1500, "currency": "CHF" },
  "missing_information": ["departure_location"],
  "confidence": 0.94
}
```

The contract must be general enough to evolve across Life, Network, Business and Protocol without becoming an unstructured dumping ground.

## Life V1 experience

The user should be able to:

1. create/sign in to an account;
2. open a conversation;
3. state a request naturally;
4. have ELYNVIA analyze it;
5. receive a structured Intent;
6. see what was understood;
7. answer only genuinely useful follow-up questions;
8. optionally turn a complex Intent into a Project;
9. retain conversation and project history;
10. control personal data and future memory behavior.

## Projects

Simple questions need not become projects. Complex goals may become Projects containing one or more Intents, tasks, decisions and eventually actions.

## Memory

Memory must be explicit, useful and user-controlled. Users must be able to inspect, correct, remove or disable remembered information. Sensitive data should not be retained merely because it appeared in conversation.

## AI architecture principle

ELYNVIA must use a provider-independent AI layer. Model providers are replaceable execution engines selected according to task quality, cost, latency and availability. Product logic and domain data must not be unnecessarily coupled to a specific provider.

## Initial technical direction

- Monorepo
- Next.js / React / TypeScript
- Supabase / PostgreSQL
- Supabase Auth
- Supabase Storage where appropriate
- Supabase migrations committed to Git
- Server-side orchestration for privileged operations
- Provider-independent AI package

## Initial repository shape

```text
elynvia/
├── apps/
│   └── life/
├── packages/
│   ├── ui/
│   ├── ai/
│   ├── auth/
│   └── intents/
├── supabase/
│   ├── migrations/
│   └── functions/
├── docs/
└── AGENTS.md
```

## Initial data domains

Expected concepts, subject to detailed database design:

- profiles
- conversations
- messages
- intents
- projects
- project_intents
- memories
- preferences
- files
- activity/audit events

## Security principles

- private by design;
- least privilege;
- RLS on sensitive user data;
- server-side authorization and validation;
- secrets never shipped to clients or committed;
- auditable privileged operations;
- controlled uploads;
- rate limiting and abuse protections;
- GDPR-aware architecture from the start.

## Explicit non-goals for Life V1

Do not build yet:

- ELYNVIA Network production system;
- Pay;
- automatic commercial negotiation;
- a full marketplace;
- native mobile apps;
- hundreds of integrations;
- a complex autonomous multi-agent swarm;
- a complete business reputation system.

Architectural seams may be prepared, but speculative products must not slow down the first useful experience.

## Roadmap summary

### Phase 0 — Foundation
Documentation, repository architecture, security baseline, development conventions.

### Phase 1 — Life Core
Identity, profiles, conversations, Intent Engine, Projects.

### Phase 2 — Intelligence
Memory, tools, web/data integrations, notifications, controlled action execution.

### Phase 3 — Life Beta
Real users, measurement, intent taxonomy refinement, safety and UX improvement.

### Phase 4 — Network Prototype
Professional agents, matching, offers and agent contracts.

### Later
Business, Trust, Pay and Protocol based on validated demand.

## Product test

Every important feature should answer:

> Does this help ELYNVIA understand an intention or move it toward a useful result with less friction and appropriate user control?

If not, it probably does not belong in the current phase.
