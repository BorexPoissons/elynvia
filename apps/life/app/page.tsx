import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "./actions";
import { IntentComposer } from "@/components/intent-composer";
import { LanguageSelector } from "@/components/language-selector";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");
  const [{ data: projects }, { data: intents }] = await Promise.all([
    supabase.from("projects").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(4),
    supabase.from("intents").select("id,summary,type,status,created_at,conversation_id").order("created_at", { ascending: false }).limit(5),
  ]);
  const firstName = user.user_metadata?.display_name?.split(" ")[0] || user.email?.split("@")[0] || "there";
  const initial = firstName.slice(0, 1).toUpperCase();

  return (
    <main className="appShell">
      <aside className="sidebar">
        <Link className="brandLockup" href="/"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></Link>
        <div className="productPill">LIFE</div>
        <nav className="mainNav" aria-label="Life navigation">
          <Link className="navItem active" href="/"><i>⌂</i><span>Home</span></Link><Link className="navItem" href="/conversations"><i>◯</i><span>Conversations</span></Link><Link className="navItem" href="/projects"><i>□</i><span>Projects</span></Link><Link className="navItem" href="/intents"><i>◎</i><span>Intents</span></Link>
        </nav>
        <div className="sidebarSpacer" />
        <div className="sidebarUtility"><LanguageSelector compact /><Link className="accountMini" href="/profile"><span className="avatar">{initial}</span><div><strong>{firstName}</strong><small>ELYNVIA ID</small></div><span>›</span></Link></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div><p className="topKicker">ELYNVIA LIFE</p><h2>Good to see you, {firstName}.</h2></div><div className="topActions"><span className="privacyBadge">● Private workspace</span><form action={signOut}><button className="ghostButton" type="submit">Sign out</button></form></div></header>
        <div className="lifeCanvas">
          <section className="centerStage">
            <div className="homeIntro"><span className="miniGlyph">✦</span><h1>What would you like<br/><span>to accomplish?</span></h1><p>Tell me naturally. I’ll understand the goal, organize what matters and help you move it forward.</p></div>
            <IntentComposer />
            <div className="promptChips" aria-label="Example requests"><span>✈ Plan a five-day trip to Italy</span><span>⌕ Help me compare electric cars</span><span>✦ Organize an important celebration</span></div>
            <section className="suggestions"><div className="sectionLine"><h3>Start with an idea</h3><span>ELYNVIA turns natural requests into structured Intents</span></div><div className="suggestionGrid"><article><b>↗</b><strong>Travel</strong><span>Plan a trip around your dates, people and budget.</span></article><article><b>⌕</b><strong>Research</strong><span>Compare options and make a confident decision.</span></article><article><b>◇</b><strong>Organize</strong><span>Turn a complex idea into a clear project.</span></article><article><b>⌂</b><strong>Everyday life</strong><span>Get help navigating services and practical tasks.</span></article></div></section>
          </section>
          <aside className="contextRail">
            <section className="railWelcome"><span>YOUR SPACE</span><strong>Life at a glance</strong><p>Your active context, without the noise.</p></section>
            <section className="railCard"><div className="railTitle"><h3>Active projects</h3><Link href="/projects">View all</Link></div>{projects?.length ? projects.map((project) => <Link className="railRow linkRow" href={`/projects/${project.id}`} key={project.id}><span className="rowDot"/><div><strong>{project.title}</strong><small>{project.status}</small></div></Link>) : <p className="emptyState">Bigger intentions will become projects here.</p>}</section>
            <section className="railCard"><div className="railTitle"><h3>Recent intents</h3><Link href="/intents">View all</Link></div>{intents?.length ? intents.map((intent) => <Link className="railRow linkRow" href={`/intents/${intent.id}`} key={intent.id}><div><strong>{intent.summary}</strong><small>{intent.type} · {intent.status}</small></div></Link>) : <p className="emptyState">Your first understood intention will appear here.</p>}</section>
            <section className="railCard memoryPreview"><div className="railTitle"><h3>Memory</h3><span>Coming later</span></div><p>Personal memory will remain inspectable, editable and under your control.</p></section>
          </aside>
        </div>
      </section>
    </main>
  );
}
