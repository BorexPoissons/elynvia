import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: projects } = await supabase.from("projects").select("id,title,status,description,updated_at").order("updated_at", { ascending: false });
  return <main className="detailShell"><header className="detailHeader"><Link className="backLink" href="/">← Home</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="listPage"><div className="pageTitleRow"><div><p className="eyebrow">ELYNVIA LIFE</p><h1>Projects</h1><p className="pageLead">Bigger intentions become living projects, keeping context and progress together.</p></div><Link className="primaryButton" href="/">Start with an intention →</Link></div><div className="listGrid">{projects?.length ? projects.map((project) => <Link className="listCard projectCard" href={`/projects/${project.id}`} key={project.id}><div className="cardMeta"><span className="statusDot"/><span>{project.status}</span></div><strong>{project.title}</strong><p>{project.description || "An ELYNVIA project built from your intention."}</p><small>Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(project.updated_at))}</small><span className="cardArrow">→</span></Link>) : <div className="emptyPanel"><span className="emptyGlyph">◇</span><h2>No projects yet</h2><p>When an intention needs more than one step, ELYNVIA can turn it into a project.</p><Link className="primaryButton" href="/">Start an intention →</Link></div>}</div></section></main>;
}
