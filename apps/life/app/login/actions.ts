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
  if (!email || password.length < 8) return { error: "Enter a valid email and a password of at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "We couldn't sign you in. Check your email and password." };
  redirect("/");
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = credentials(formData);
  if (!email || password.length < 8) return { error: "Enter a valid email and a password of at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: "We couldn't create your account right now. Please try again." };
  if (!data.session) return { message: "Account created. Check your email to confirm your address, then sign in." };
  redirect("/");
}
