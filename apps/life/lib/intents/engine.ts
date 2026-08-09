import { parseIntent, type Intent } from "@elynvia/intents";

const categories = [
  { type: "travel", words: ["voyage", "week-end", "weekend", "hôtel", "hotel", "vol", "italie", "vacances"] },
  { type: "vehicle", words: ["voiture", "véhicule", "vehicule", "auto", "électrique", "electrique"] },
  { type: "event", words: ["anniversaire", "mariage", "événement", "evenement", "fête", "fete"] },
  { type: "local_service", words: ["rénover", "renover", "réparation", "reparation", "artisan", "salle de bain", "plombier"] },
  { type: "work", words: ["emploi", "travail", "job", "recrut", "cv"] },
] as const;

function inferType(text: string) {
  const normalized = text.toLocaleLowerCase("fr");
  return categories.find((category) => category.words.some((word) => normalized.includes(word)))?.type ?? "general";
}

function inferBudget(text: string) {
  const match = text.match(/(?:budget(?:\s+(?:de|max(?:imum)?))?\s*[:àde-]*\s*)?(\d[\d\s’'.]*)\s*(CHF|francs?|€|euros?)/i);
  if (!match) return undefined;
  const amount = Number(match[1].replace(/[\s’'.]/g, ""));
  if (!Number.isFinite(amount)) return undefined;
  return { amount, currency: /€|euro/i.test(match[2]) ? "EUR" : "CHF" };
}

function inferPeople(text: string) {
  const match = text.match(/(?:pour|à)\s+(\d+)\s+(?:personnes?|pers\.?)/i);
  if (match) return Number(match[1]);
  if (/avec ma femme|avec mon mari|avec mon conjoint|avec ma conjointe/i.test(text)) return 2;
  return undefined;
}

function inferDuration(text: string) {
  const match = text.match(/(\d+)\s*(jours?|nuits?)/i);
  return match ? { value: Number(match[1]), unit: match[2].toLowerCase() } : undefined;
}

function inferDeparture(text: string) {
  const match = text.match(/(?:depuis|de|départ\s+(?:de|depuis)?)\s*(Genève|Geneve|Lausanne|Zurich|Bâle|Bale)/i);
  return match?.[1];
}

function buildIntent(text: string, forcedType?: string, baseConstraints: Record<string, unknown> = {}): Intent {
  const type = forcedType && forcedType !== "general" ? forcedType : inferType(text);
  const constraints: Record<string, unknown> = { ...baseConstraints };
  const budget = inferBudget(text);
  const people = inferPeople(text);
  const duration = inferDuration(text);
  const departure = inferDeparture(text);
  if (budget) constraints.budget = budget;
  if (people) constraints.people = people;
  if (duration) constraints.duration = duration;
  if (departure) constraints.departure_location = departure;

  const missingInformation: string[] = [];
  if (type === "travel" && !constraints.departure_location) missingInformation.push("departure_location");

  return parseIntent({
    type,
    status: type === "general" ? "draft" : "planning",
    summary: text.length > 180 ? `${text.slice(0, 177)}…` : text,
    constraints,
    missingInformation,
    confidence: type === "general" ? 0.45 : missingInformation.length ? 0.72 : 0.82,
    sourceText: text,
  });
}

export function extractIntentLocally(sourceText: string): Intent {
  return buildIntent(sourceText.trim());
}

export function refineIntentLocally(existing: Intent, reply: string): Intent {
  const combinedSource = `${existing.sourceText ?? existing.summary}\n${reply.trim()}`.trim();
  return buildIntent(combinedSource, existing.type, existing.constraints);
}
