import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 120);
  const locale = String(formData.get("locale") ?? "fr-CH").trim().slice(0, 20);
  const timezone = String(formData.get("timezone") ?? "Europe/Zurich").trim().slice(0, 80);
  await supabase.from("profiles").upsert({ id: user.id, display_name: displayName || null, locale, timezone }, { onConflict: "id" });
  await supabase.auth.updateUser({ data: { display_name: displayName || undefined } });
  redirect("/profile?saved=1");
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("display_name,locale,timezone").eq("id", user.id).maybeSingle();

  return <main className="detailShell"><header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="profilePage"><p className="eyebrow">ELYNVIA ID</p><h1>Votre profil</h1><p>Ces réglages servent à contextualiser Life. Ils ne constituent pas encore la mémoire personnelle ELYNVIA.</p><form className="profileForm" action={updateProfile}><label>Nom affiché<input name="display_name" defaultValue={profile?.display_name ?? user.user_metadata?.display_name ?? ""} maxLength={120} /></label><label>E-mail<input value={user.email ?? ""} disabled /></label><label>Langue / région<input name="locale" defaultValue={profile?.locale ?? "fr-CH"} maxLength={20} /></label><label>Fuseau horaire<input name="timezone" defaultValue={profile?.timezone ?? "Europe/Zurich"} maxLength={80} /></label><button className="primaryButton" type="submit">Enregistrer</button></form></section></main>;
}
