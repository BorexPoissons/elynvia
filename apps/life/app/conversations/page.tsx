import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: conversations } = await supabase.from("conversations").select("id,title,status,created_at,updated_at").order("updated_at", { ascending: false });

  return <main className="detailShell">
    <header className="detailHeader"><Link className="backLink" href="/">← Home</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
    <section className="listPage">
      <div className="pageTitleRow"><div><p className="eyebrow">ELYNVIA LIFE</p><h1>Conversations</h1><p className="pageLead">Every intention starts with a conversation. Pick up where you left off.</p></div><Link className="primaryButton" href="/">+ New intention</Link></div>
      <div className="listGrid">{conversations?.length ? conversations.map((item) => <Link className="listCard" href={`/conversations/${item.id}`} key={item.id}><div className="cardMeta"><span className="statusDot"/><span>{item.status}</span></div><strong>{item.title || "New conversation"}</strong><small>Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.updated_at))}</small><span className="cardArrow">→</span></Link>) : <div className="emptyPanel"><span className="emptyGlyph">◯</span><h2>No conversations yet</h2><p>Tell ELYNVIA what you want to accomplish. Your first conversation will appear here.</p><Link className="primaryButton" href="/">Ask ELYNVIA →</Link></div>}</div>
    </section>
  </main>;
}
