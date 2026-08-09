import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id,title,status,created_at,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <main className="detailShell">
      <header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
      <section className="listPage">
        <p className="eyebrow">LIFE</p><h1>Conversations</h1>
        <div className="listGrid">
          {conversations?.length ? conversations.map((item) => (
            <Link className="listCard" href={`/conversations/${item.id}`} key={item.id}>
              <strong>{item.title || "Nouvelle conversation"}</strong>
              <span>{item.status}</span>
              <small>{new Date(item.updated_at).toLocaleString("fr-CH")}</small>
            </Link>
          )) : <p className="emptyState">Aucune conversation pour le moment.</p>}
        </div>
      </section>
    </main>
  );
}
