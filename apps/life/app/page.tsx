import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "./actions";
import { IntentComposer } from "@/components/intent-composer";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: projects }, { data: intents }] = await Promise.all([
    supabase.from("projects").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(4),
    supabase.from("intents").select("id,summary,type,status,created_at,conversation_id").order("created_at", { ascending: false }).limit(5),
  ]);

  const firstName = user.user_metadata?.display_name?.split(" ")[0] || user.email?.split("@")[0] || "vous";

  return (
    <main className="appShell">
      <aside className="sidebar">
        <div className="brandLockup"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div>
        <nav className="mainNav" aria-label="Navigation principale">
          <Link className="navItem active" href="/">⌂ <span>Accueil</span></Link>
          <Link className="navItem" href="/conversations">◯ <span>Conversations</span></Link>
          <Link className="navItem" href="/projects">□ <span>Projets</span></Link>
          <Link className="navItem" href="/intents">◎ <span>Intentions</span></Link>
        </nav>
        <div className="sidebarSpacer" />
        <Link className="accountMini" href="/profile"><span className="avatar">{firstName.slice(0, 1).toUpperCase()}</span><div><strong>{firstName}</strong><small>ELYNVIA Life · Profil</small></div></Link>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><h2>Bonjour {firstName} <span aria-hidden="true">👋</span></h2><p>Que puis-je faire pour vous aujourd’hui&nbsp;?</p></div>
          <form action={signOut}><button className="ghostButton" type="submit">Déconnexion</button></form>
        </header>

        <div className="lifeCanvas">
          <section className="centerStage">
            <div className="heroBrand"><div className="wordmark">ELYNVIA</div><p>Your Life. Your Agent.</p></div>
            <IntentComposer />
            <div className="promptChips" aria-label="Exemples">
              <span>✈ Organise-moi un week-end en Italie</span>
              <span>▣ Je cherche une voiture électrique</span>
              <span>✦ Aide-moi à organiser un anniversaire</span>
            </div>
            <section className="suggestions">
              <h3>Pour commencer</h3>
              <div className="suggestionGrid">
                <article><b>☀</b><strong>Voyage</strong><span>Préparez une escapade ou des vacances.</span></article>
                <article><b>⌕</b><strong>Recherche</strong><span>Comparez une option ou un produit.</span></article>
                <article><b>◫</b><strong>Organisation</strong><span>Transformez une idée en projet clair.</span></article>
                <article><b>⌂</b><strong>Services</strong><span>Préparez une recherche locale structurée.</span></article>
              </div>
            </section>
          </section>

          <aside className="contextRail">
            <section className="railCard"><div className="railTitle"><h3>Projets actifs</h3><Link href="/projects">Voir tout</Link></div>{projects?.length ? projects.map((project) => <Link className="railRow linkRow" href={`/projects/${project.id}`} key={project.id}><strong>{project.title}</strong><small>{project.status}</small></Link>) : <p className="emptyState">Vos projets apparaîtront ici quand une intention nécessitera plusieurs étapes.</p>}</section>
            <section className="railCard"><div className="railTitle"><h3>Intentions récentes</h3><Link href="/intents">Voir tout</Link></div>{intents?.length ? intents.map((intent) => <Link className="railRow linkRow" href={`/intents/${intent.id}`} key={intent.id}><strong>{intent.summary}</strong><small>{intent.type} · {intent.status}</small></Link>) : <p className="emptyState">Commencez par décrire ce que vous souhaitez accomplir.</p>}</section>
            <section className="railCard memoryPreview"><div className="railTitle"><h3>Mémoire</h3><span>Plus tard</span></div><p>La mémoire personnelle sera ajoutée seulement avec des contrôles explicites pour consulter, modifier ou supprimer ce qui est retenu.</p></section>
          </aside>
        </div>
      </section>
    </main>
  );
}
