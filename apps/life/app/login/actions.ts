"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = credentials(formData);
  if (!email || password.length < 8) return { error: "Saisissez un e-mail valide et un mot de passe d’au moins 8 caractères." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Connexion impossible. Vérifiez vos identifiants." };
  redirect("/");
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = credentials(formData);
  if (!email || password.length < 8) return { error: "Saisissez un e-mail valide et un mot de passe d’au moins 8 caractères." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: "Création du compte impossible pour le moment." };
  if (!data.session) return { message: "Compte créé. Consultez votre e-mail pour confirmer votre adresse, puis connectez-vous." };
  redirect("/");
}
