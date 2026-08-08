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

  const userId = authData.user.id;
  const parsed = extractIntentLocally(sourceText);

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title: parsed.summary.slice(0, 80) })
    .select("id")
    .single();

  if (conversationError) return { error: "Impossible de créer la conversation. La migration Supabase est-elle appliquée ?" };

  const { error: messageError } = await supabase.from("messages").insert({
    user_id: userId,
    conversation_id: conversation.id,
    role: "user",
    content: sourceText,
  });
  if (messageError) return { error: "La conversation a été créée, mais le message n’a pas pu être enregistré." };

  const { error: intentError } = await supabase.from("intents").insert({
    user_id: userId,
    conversation_id: conversation.id,
    type: parsed.type,
    status: parsed.status,
    summary: parsed.summary,
    constraints: parsed.constraints,
    missing_information: parsed.missingInformation,
    confidence: parsed.confidence,
    source_text: parsed.sourceText,
  });
  if (intentError) return { error: "Le message est enregistré, mais l’intention n’a pas pu être créée." };

  redirect(`/conversations/${conversation.id}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
