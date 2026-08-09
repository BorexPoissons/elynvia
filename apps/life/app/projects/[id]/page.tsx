import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: project }, { data: intents }, { data: conversations }] = await Promise.all([
    supabase.from("projects").select("id,title,status,description,created_at,updated_at").eq("id", id).single(),
    supabase.from("intents").select("id,type,status,summary,confidence,conversation_id,created_at").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("conversations").select("id,title,status,updated_at").eq("project_id", id).order("updated_at", { ascending: false }),
  ]);

  if (!project) notFound();

  return (
    <main className="detailShell">
      <header className="detailHeader"><Link href="/projects">← Projets</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
      <section className="projectDetail">
        <div className="projectHero"><p className="eyebrow">PROJET ELYNVIA</p><h1>{project.title}</h1><div className="intentStatus"><span>{project.status}</span></div><p>{project.description || "Projet créé depuis une intention ELYNVIA."}</p></div>
        <div className="projectColumns">
          <section className="railCard"><div className="railTitle"><h3>Intentions liées</h3><span>{intents?.length ?? 0}</span></div>{intents?.length ? intents.map((intent) => <Link className="railRow linkRow" href={intent.conversation_id ? `/conversations/${intent.conversation_id}` : "/intents"} key={intent.id}><strong>{intent.summary}</strong><small>{intent.type} · {intent.status}{intent.confidence ? ` · ${Math.round(Number(intent.confidence) * 100)} %` : ""}</small></Link>) : <p className="emptyState">Aucune intention liée.</p>}</section>
          <section className="railCard"><div className="railTitle"><h3>Conversations</h3><span>{conversations?.length ?? 0}</span></div>{conversations?.length ? conversations.map((conversation) => <Link className="railRow linkRow" href={`/conversations/${conversation.id}`} key={conversation.id}><strong>{conversation.title || "Conversation"}</strong><small>{conversation.status}</small></Link>) : <p className="emptyState">Aucune conversation liée.</p>}</section>
        </div>
      </section>
    </main>
  );
}
