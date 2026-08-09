"use server";

import { redirect } from "next/navigation";
import { extractIntentLocally, refineIntentLocally } from "@/lib/intents/engine";
import { createClient } from "@/lib/supabase/server";
import { parseIntent } from "@elynvia/intents";

export type IntentActionState = { error?: string; success?: string };

export async function submitIntent(_previousState: IntentActionState, formData: FormData): Promise<IntentActionState> {
  const sourceText = String(formData.get("intent") ?? "").trim();
  if (sourceText.length < 3) return { error: "Describe what you want to accomplish in a few words." };
  if (sourceText.length > 20_000) return { error: "This request is too long for the current version." };

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login?next=/");

  const parsed = extractIntentLocally(sourceText);
  const { data, error } = await supabase.rpc("create_life_intent", {
    p_title: parsed.summary.slice(0, 80), p_source_text: sourceText, p_type: parsed.type,
    p_status: parsed.status, p_summary: parsed.summary, p_constraints: parsed.constraints,
    p_missing_information: parsed.missingInformation, p_confidence: parsed.confidence,
  });
  if (error || !data?.[0]?.conversation_id) return { error: "ELYNVIA could not save this intention. Please try again." };
  redirect(`/conversations/${data[0].conversation_id}`);
}

export async function replyToIntent(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "");
  const intentId = String(formData.get("intent_id") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();
  if (!conversationId || !intentId || !reply || reply.length > 10_000) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: row } = await supabase.from("intents").select("type,status,summary,constraints,missing_information,confidence,source_text").eq("id", intentId).eq("conversation_id", conversationId).single();
  if (!row) redirect(`/conversations/${conversationId}`);
  const current = parseIntent({ type: row.type, status: row.status, summary: row.summary, constraints: row.constraints ?? {}, missingInformation: row.missing_information ?? [], confidence: row.confidence == null ? undefined : Number(row.confidence), sourceText: row.source_text ?? undefined });
  const refined = refineIntentLocally(current, reply);
  await supabase.rpc("reply_and_refresh_intent", { p_conversation_id: conversationId, p_intent_id: intentId, p_reply: reply, p_type: refined.type, p_status: refined.status, p_summary: refined.summary, p_constraints: refined.constraints, p_missing_information: refined.missingInformation, p_confidence: refined.confidence, p_source_text: refined.sourceText });
  redirect(`/conversations/${conversationId}`);
}

export async function promoteIntentToProject(formData: FormData) {
  const intentId = String(formData.get("intent_id") ?? "");
  const conversationId = String(formData.get("conversation_id") ?? "");
  if (!intentId) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.rpc("promote_intent_to_project", { p_intent_id: intentId });
  redirect(conversationId ? `/conversations/${conversationId}` : "/");
}

export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/login"); }
