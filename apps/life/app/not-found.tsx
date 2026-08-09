import Link from "next/link";

export default function NotFound() { return <main className="notFoundPage"><div className="brandLockup"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div><section><p className="eyebrow">404 · LOST CONTEXT</p><h1>This path doesn’t lead anywhere yet.</h1><p>ELYNVIA couldn’t find the page you requested. Your workspace and data haven’t been changed.</p><div className="detailActions"><Link className="primaryLink" href="/">Go to Life →</Link><Link className="secondaryLink" href="/welcome">About ELYNVIA</Link></div></section></main>; }
