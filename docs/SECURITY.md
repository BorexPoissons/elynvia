# ELYNVIA — Security Baseline v0.1

Security and privacy are product requirements.

## Secrets

- Never commit passwords, service-role keys, private API keys or tokens.
- Never expose privileged Supabase credentials to browser code.
- Use environment/secret management appropriate to each deployment environment.

## Authorization

- Enable RLS on user-sensitive Supabase tables.
- Write explicit policies based on authenticated ownership/roles.
- Validate authorization server-side for privileged operations.
- Do not rely on hidden UI elements or client-side filters for access control.

## Data minimization

Store what the product needs, not everything a user ever says. Durable memory requires a separate policy from transient conversation context.

## AI safety/security

Treat model output as untrusted input. Validate structured outputs and tool arguments. Tool calls must respect authorization and user approval boundaries independently of what the model requests.

## Uploads

Validate allowed file types, sizes and ownership. Use private storage by default for personal files. Signed access should be short-lived and scoped.

## Abuse controls

Plan rate limits and usage quotas around authentication, AI endpoints, uploads and externally exposed actions.

## Auditability

Privileged or consequential operations should produce structured audit/activity events without leaking unnecessary secrets or sensitive payloads.

## Privacy/regulatory direction

ELYNVIA should be designed with Swiss and European privacy expectations in mind, including user access, correction, deletion and data minimization. Formal legal/compliance requirements must be reviewed before public production launch.

## Environment isolation

Development must not use real production user data by default. Establish separate staging/production environments before public launch.

## Security completion rule

A feature handling private user data is not complete until its authorization, RLS, validation, error handling and data-retention implications have been considered and tested.
