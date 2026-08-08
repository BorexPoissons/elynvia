# ELYNVIA Intent Contract v0.1

Status: initial shared contract.

An Intent represents **what a user wants to accomplish**, not the model's internal reasoning.

## Required fields

- `type`: broad machine-readable category, initially free-form and refined from real usage.
- `status`: `draft | planning | active | completed | cancelled`.
- `summary`: concise human-readable statement of the goal.
- `constraints`: structured facts explicitly supplied or safely derived from permitted context.
- `missingInformation`: genuinely useful information still needed.
- `confidence`: optional 0–1 extraction confidence; not a truth guarantee.
- `sourceText`: optional original user wording for traceability.

## Example

```json
{
  "type": "travel",
  "status": "planning",
  "summary": "Organiser cinq jours en Italie en septembre pour deux personnes.",
  "constraints": {
    "participants": 2,
    "destination": { "country": "Italy" },
    "durationDays": 5,
    "timeWindow": { "month": "September" },
    "budget": { "amount": 1500, "currency": "CHF" }
  },
  "missingInformation": ["departureLocation"],
  "confidence": 0.94,
  "sourceText": "Je veux partir cinq jours en Italie en septembre avec ma femme. Budget maximum 1'500 CHF."
}
```

## Rules

1. Do not invent critical constraints to make an Intent complete.
2. Do not put private chain-of-thought or hidden reasoning into the Intent.
3. Ask follow-up questions only when the missing information materially improves the next step.
4. Keep the stable top-level contract small. Domain-specific details belong in `constraints` until real usage justifies stronger typed subcontracts.
5. Validate every AI-produced Intent server-side before persistence.
6. The TypeScript/Zod source of truth is `packages/intents/src/index.ts`.
7. Database JSON field names may use SQL conventions internally, but application boundaries should use the shared typed contract.

## Future compatibility

Network and Business must consume explicit Intent-derived contracts/API payloads rather than directly depending on Life's database tables.
