# ELYNVIA — RLS isolation test plan

Run this plan against Supabase DEV before treating Life as remotely usable.

## Goal

Prove that an authenticated user can access only their own ELYNVIA Life rows, including through foreign-key relationships and RPC functions.

## Test identities

Create two ordinary Auth users:

- User A
- User B

Never use `service_role` for these tests because it bypasses normal RLS expectations.

## Required checks

### Profiles
- A can read/update A profile.
- A cannot read/update/delete B profile.

### Projects
- A can create/read/update/delete an A project.
- A cannot read/update/delete a B project.

### Conversations
- A can create/read/update/delete an A conversation.
- A cannot attach an A conversation to a B project.
- A cannot read/update/delete a B conversation.

### Messages
- A can create/read a message in an A conversation.
- A cannot create a message in a B conversation.
- A cannot read/update/delete B messages.

### Intents
- A can create/read/update/delete an A intent.
- A cannot attach an intent to a B conversation or B project.
- A cannot read/update/delete B intents.

### Atomic Life RPC
- Anonymous callers cannot execute `create_life_intent`.
- A can execute it and receives IDs belonging to A.
- The RPC creates exactly one conversation, one user message and one intent.
- If any insert fails, none of the three rows remain.
- B cannot retrieve the rows created by A.

## Acceptance criteria

ELYNVIA Life does not move past DEV security verification until all cross-user reads and writes are denied and the atomic RPC behaves transactionally.

Record evidence/date in `docs/DECISIONS.md` or a dedicated security verification note after the remote test is completed.
