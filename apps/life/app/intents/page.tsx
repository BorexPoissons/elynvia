import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function IntentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: intents } = await supabase.from("intents").select("id,conversation_id,type,status,summary,confidence,updated_at").order("updated_at", { ascending: false });
  return <main className="detailShell"><header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="listPage"><p className="eyebrow">INTENT ENGINE</p><h1>Intentions</h1><div className="listGrid">{intents?.length ? intents.map((intent) => <Link className="listCard" href={intent.conversation_id ? `/conversations/${intent.conversation_id}` : "/"} key={intent.id}><div className="intentStatus"><span>{intent.type}</span><span>{intent.status}</span></div><strong>{intent.summary}</strong><small>Confiance {intent.confidence ? `${Math.round(Number(intent.confidence) * 100)} %` : "—"}</small></Link>) : <p className="emptyState">Aucune intention structurée pour le moment.</p>}</div></section></main>;
}
