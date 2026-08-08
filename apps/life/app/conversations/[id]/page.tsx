import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: conversation }, { data: messages }, { data: intents }] = await Promise.all([
    supabase.from("conversations").select("id,title,created_at").eq("id", id).single(),
    supabase.from("messages").select("id,role,content,created_at").eq("conversation_id", id).order("created_at"),
    supabase.from("intents").select("id,type,status,summary,constraints,missing_information,confidence").eq("conversation_id", id).order("created_at", { ascending: false }),
  ]);
  if (!conversation) notFound();
  const intent = intents?.[0];

  return (
    <main className="detailShell">
      <header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
      <section className="detailGrid">
        <div className="conversationPanel">
          <p className="eyebrow">CONVERSATION</p><h1>{conversation.title || "Nouvelle intention"}</h1>
          {messages?.map((message) => <article className={`message ${message.role}`} key={message.id}><small>{message.role === "user" ? "Vous" : "ELYNVIA"}</small><p>{message.content}</p></article>)}
        </div>
        <aside className="intentPanel">
          <p className="eyebrow">INTENT v0.1</p>
          {intent ? <><div className="intentStatus"><span>{intent.type}</span><span>{intent.status}</span></div><h2>Ce que j’ai compris</h2><p>{intent.summary}</p><dl><dt>Contraintes détectées</dt><dd><pre>{JSON.stringify(intent.constraints, null, 2)}</pre></dd><dt>Informations manquantes</dt><dd>{Array.isArray(intent.missing_information) && intent.missing_information.length ? intent.missing_information.join(", ") : "Aucune indispensable détectée"}</dd><dt>Confiance</dt><dd>{intent.confidence ? `${Math.round(Number(intent.confidence) * 100)} %` : "—"}</dd></dl><p className="betaNote">Cette première extraction est locale et déterministe. Le fournisseur IA sera branché derrière le même contrat après validation du parcours.</p></> : <p>Aucune intention structurée n’a été trouvée.</p>}
        </aside>
      </section>
    </main>
  );
}
