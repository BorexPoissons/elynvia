import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { promoteIntentToProject, replyToIntent } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

const clarificationLabels: Record<string, string> = {
  departure_location: "D’où souhaitez-vous partir ?",
  destination: "Quelle destination avez-vous en tête ?",
  budget: "Quel budget souhaitez-vous respecter ?",
  date: "À quelle date souhaitez-vous réaliser ce projet ?",
};

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: conversation }, { data: messages }, { data: intents }] = await Promise.all([
    supabase.from("conversations").select("id,title,project_id,created_at").eq("id", id).single(),
    supabase.from("messages").select("id,role,content,created_at").eq("conversation_id", id).order("created_at"),
    supabase.from("intents").select("id,type,status,summary,constraints,missing_information,confidence,project_id").eq("conversation_id", id).order("created_at", { ascending: false }),
  ]);
  if (!conversation) notFound();
  const intent = intents?.[0];
  const missing = Array.isArray(intent?.missing_information) ? intent.missing_information : [];
  const clarification = missing.length ? clarificationLabels[String(missing[0])] ?? `Pouvez-vous préciser : ${String(missing[0])} ?` : null;

  return (
    <main className="detailShell">
      <header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
      <section className="detailGrid">
        <div className="conversationPanel">
          <p className="eyebrow">CONVERSATION</p><h1>{conversation.title || "Nouvelle intention"}</h1>
          {messages?.map((message) => <article className={`message ${message.role}`} key={message.id}><small>{message.role === "user" ? "Vous" : "ELYNVIA"}</small><p>{message.content}</p></article>)}
          {clarification && intent ? <article className="message assistant"><small>ELYNVIA</small><p>{clarification}</p><form className="replyComposer" action={replyToIntent}><input type="hidden" name="conversation_id" value={conversation.id} /><input type="hidden" name="intent_id" value={intent.id} /><input name="reply" required maxLength={10000} autoComplete="off" placeholder="Votre réponse…" /><button className="primaryButton" type="submit">Répondre</button></form></article> : <article className="message assistant"><small>ELYNVIA</small><p>J’ai suffisamment d’informations pour poursuivre cette intention.</p></article>}
        </div>
        <aside className="intentPanel">
          <p className="eyebrow">INTENT v0.1</p>
          {intent ? <><div className="intentStatus"><span>{intent.type}</span><span>{intent.status}</span></div><h2>Ce que j’ai compris</h2><p>{intent.summary}</p><dl><dt>Contraintes détectées</dt><dd><pre>{JSON.stringify(intent.constraints, null, 2)}</pre></dd><dt>Informations manquantes</dt><dd>{missing.length ? missing.join(", ") : "Aucune indispensable détectée"}</dd><dt>Confiance</dt><dd>{intent.confidence ? `${Math.round(Number(intent.confidence) * 100)} %` : "—"}</dd></dl>{intent.project_id || conversation.project_id ? <p className="betaNote">✓ Cette intention est déjà liée à un projet.</p> : <form action={promoteIntentToProject}><input type="hidden" name="intent_id" value={intent.id} /><input type="hidden" name="conversation_id" value={conversation.id} /><button className="primaryButton" type="submit">Transformer en projet</button></form>}<p className="betaNote">Le moteur v0.1 valide le parcours conversationnel. Un fournisseur IA pourra ensuite remplacer l’extraction sans modifier le contrat Intent.</p></> : <p>Aucune intention structurée n’a été trouvée.</p>}
        </aside>
      </section>
    </main>
  );
}
