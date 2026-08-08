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
  const currency = /€|euro/i.test(match[2]) ? "EUR" : "CHF";
  return { amount, currency };
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

export function extractIntentLocally(sourceText: string): Intent {
  const text = sourceText.trim();
  const type = inferType(text);
  const budget = inferBudget(text);
  const people = inferPeople(text);
  const duration = inferDuration(text);
  const constraints: Record<string, unknown> = {};
  if (budget) constraints.budget = budget;
  if (people) constraints.people = people;
  if (duration) constraints.duration = duration;

  const missingInformation: string[] = [];
  if (type === "travel" && !/(genève|geneve|lausanne|zurich|bâle|bale|départ|depart)/i.test(text)) {
    missingInformation.push("departure_location");
  }

  return parseIntent({
    type,
    status: type === "general" ? "draft" : "planning",
    summary: text.length > 180 ? `${text.slice(0, 177)}…` : text,
    constraints,
    missingInformation,
    confidence: type === "general" ? 0.45 : 0.72,
    sourceText: text,
  });
}
