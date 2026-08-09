import { parseIntent, type Intent } from "@elynvia/intents";

export type IntentContext = {
  locale?: string;
  timezone?: string;
  previousIntent?: Intent | null;
};

export interface IntentProvider {
  readonly name: string;
  extractIntent(input: string, context?: IntentContext): Promise<Intent>;
}

export async function extractValidatedIntent(
  provider: IntentProvider,
  input: string,
  context?: IntentContext,
): Promise<Intent> {
  if (input.trim().length < 3) throw new Error("Intent input is too short.");
  const raw = await provider.extractIntent(input.trim(), context);
  return parseIntent(raw);
}

export class ProviderUnavailableError extends Error {
  constructor(provider: string) {
    super(`AI provider ${provider} is not configured.`);
    this.name = "ProviderUnavailableError";
  }
}
