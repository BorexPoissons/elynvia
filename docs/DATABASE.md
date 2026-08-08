# ELYNVIA — Database Design Notes v0.1

Status: design baseline, not yet a migration specification.

## Backend

Initial persistence uses Supabase/PostgreSQL.

## Candidate Life domains

- `profiles`
- `conversations`
- `messages`
- `intents`
- `projects`
- `project_intents`
- `memories`
- `preferences`
- `files`
- `activity_events`

Exact schemas, indexes and retention policies will be designed before the first migration.

## Identity

Supabase Auth should own authentication identity. Application profiles should reference the authenticated user ID rather than duplicating credentials.

## Intent persistence

Intent requires both stable searchable fields and extensibility. Avoid putting the entire domain exclusively into opaque JSON. Conversely, avoid creating hundreds of category-specific columns.

The first schema design should define:

- stable identity and ownership;
- type/category;
- lifecycle status;
- human-readable summary;
- structured constraints;
- missing information;
- confidence/provenance metadata where useful;
- timestamps/versioning.

The detailed contract will be designed in the Intent Engine milestone.

## Security

Every user-owned table must have explicit RLS policies before being considered complete. Client-side filtering is never an authorization mechanism.

## Migrations

All schema changes must be represented in `supabase/migrations/` and reviewed in Git. Avoid production-only dashboard edits that cannot be reproduced.

## Privacy and retention

Messages, memories, files and model-derived data may have different retention needs. Do not assume all conversation content should become long-term memory.

## Future boundaries

Network, Trust and Pay may eventually require stronger database/service isolation. Do not mix their future sensitive domains into Life tables merely to save early setup work.
