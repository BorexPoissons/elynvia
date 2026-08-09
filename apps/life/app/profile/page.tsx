import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supportedLanguages } from "@/lib/i18n";

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 120);
  const locale = String(formData.get("locale") ?? "en").trim().slice(0, 20);
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
  return <main className="detailShell"><header className="detailHeader"><Link href="/">← Home</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="profilePage"><p className="eyebrow">ELYNVIA ID</p><h1>Your profile</h1><p>These preferences help Life understand your context. Personal memory remains a separate, user-controlled capability.</p><form className="profileForm" action={updateProfile}><label>Display name<input name="display_name" defaultValue={profile?.display_name ?? user.user_metadata?.display_name ?? ""} maxLength={120} /></label><label>Email<input value={user.email ?? ""} disabled /></label><label>Primary language<select name="locale" defaultValue={(profile?.locale ?? "en").split("-")[0]}>{supportedLanguages.map((language)=><option key={language.code} value={language.code}>{language.native} — {language.label}</option>)}</select></label><label>Time zone<input name="timezone" defaultValue={profile?.timezone ?? "Europe/Zurich"} maxLength={80} /></label><button className="primaryButton" type="submit">Save preferences</button></form></section></main>;
}
