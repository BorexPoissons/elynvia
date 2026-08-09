import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function IntentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: intents } = await supabase.from("intents").select("id,conversation_id,type,status,summary,confidence,updated_at").order("updated_at", { ascending: false });
  return <main className="detailShell"><header className="detailHeader"><Link className="backLink" href="/">← Home</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="listPage"><div className="pageTitleRow"><div><p className="eyebrow">INTENT ENGINE</p><h1>Intents</h1><p className="pageLead">The structured layer between what you say and what ELYNVIA can help you accomplish.</p></div><Link className="primaryButton" href="/">Create an intent →</Link></div><div className="listGrid">{intents?.length ? intents.map((intent) => <Link className="listCard intentCard" href={`/intents/${intent.id}`} key={intent.id}><div className="intentStatus"><span>{intent.type}</span><span>{intent.status}</span></div><strong>{intent.summary}</strong><div className="confidenceBar"><span style={{ width: `${Math.max(3, Math.round(Number(intent.confidence ?? 0) * 100))}%` }}/></div><small>{intent.confidence != null ? `${Math.round(Number(intent.confidence) * 100)}% understood` : "Understanding in progress"}</small><span className="cardArrow">→</span></Link>) : <div className="emptyPanel"><span className="emptyGlyph">◎</span><h2>No structured intents yet</h2><p>Ask ELYNVIA naturally. The Intent Engine will organize the goal, context, constraints and missing information.</p><Link className="primaryButton" href="/">Ask ELYNVIA →</Link></div>}</div></section></main>;
}
