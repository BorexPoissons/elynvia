import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: projects } = await supabase.from("projects").select("id,title,status,description,updated_at").order("updated_at", { ascending: false });
  return <main className="detailShell"><header className="detailHeader"><Link href="/">← Accueil</Link><div className="brandLockup compact"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div></header><section className="listPage"><p className="eyebrow">LIFE</p><h1>Projets</h1><div className="listGrid">{projects?.length ? projects.map((project) => <article className="listCard" key={project.id}><strong>{project.title}</strong><span>{project.status}</span><p>{project.description || "Projet ELYNVIA"}</p></article>) : <p className="emptyState">Les intentions importantes pourront devenir des projets.</p>}</div></section></main>;
}
