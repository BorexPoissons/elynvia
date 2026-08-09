import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function IntentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: intent } = await supabase
    .from("intents")
    .select("id,type,status,summary,constraints,missing_information,confidence,source_text,conversation_id,project_id,created_at,updated_at")
    .eq("id", id)
    .single();

  if (!intent) notFound();
  const constraints = (intent.constraints ?? {}) as Record<string, unknown>;
  const missing = Array.isArray(intent.missing_information) ? intent.missing_information : [];

  return (
    <main className="detailShell">
      <header className="detailHeader"><Link href="/intents">← Intentions</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header>
      <section className="intentDetail">
        <p className="eyebrow">INTENTION · {intent.type.toUpperCase()}</p>
        <h1>{intent.summary}</h1>
        <div className="intentStatus"><span>{intent.status}</span>{intent.confidence != null && <span>Confiance {Math.round(Number(intent.confidence) * 100)} %</span>}</div>
        {intent.source_text && <section className="detailPanel"><h3>Demande originale</h3><p>{intent.source_text}</p></section>}
        <div className="projectColumns">
          <section className="detailPanel"><h3>Ce qu’ELYNVIA a compris</h3>{Object.keys(constraints).length ? <dl className="dataList">{Object.entries(constraints).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl> : <p className="emptyState">Aucune contrainte structurée pour le moment.</p>}</section>
          <section className="detailPanel"><h3>Informations à préciser</h3>{missing.length ? <ul className="missingList">{missing.map((item) => <li key={String(item)}>{String(item)}</li>)}</ul> : <p className="successState">L’intention contient les informations essentielles détectées.</p>}</section>
        </div>
        <div className="detailActions">{intent.conversation_id && <Link className="primaryLink" href={`/conversations/${intent.conversation_id}`}>Ouvrir la conversation</Link>}{intent.project_id && <Link className="secondaryLink" href={`/projects/${intent.project_id}`}>Ouvrir le projet</Link>}</div>
      </section>
    </main>
  );
}
