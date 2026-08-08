"use server";

import { redirect } from "next/navigation";
import { extractIntentLocally } from "@/lib/intents/engine";
import { createClient } from "@/lib/supabase/server";

export type IntentActionState = { error?: string; success?: string };

export async function submitIntent(
  _previousState: IntentActionState,
  formData: FormData,
): Promise<IntentActionState> {
  const sourceText = String(formData.get("intent") ?? "").trim();
  if (sourceText.length < 3) return { error: "Décrivez votre intention en quelques mots." };
  if (sourceText.length > 20_000) return { error: "Votre demande est trop longue pour cette première version." };

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login?next=/");

  const parsed = extractIntentLocally(sourceText);
  const { data, error } = await supabase.rpc("create_life_intent", {
    p_title: parsed.summary.slice(0, 80),
    p_source_text: sourceText,
    p_type: parsed.type,
    p_status: parsed.status,
    p_summary: parsed.summary,
    p_constraints: parsed.constraints,
    p_missing_information: parsed.missingInformation,
    p_confidence: parsed.confidence,
  });

  if (error || !data?.[0]?.conversation_id) {
    return { error: "Impossible d’enregistrer cette intention. Vérifiez que les migrations Supabase sont appliquées." };
  }

  redirect(`/conversations/${data[0].conversation_id}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
