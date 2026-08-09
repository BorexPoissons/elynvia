import Link from "next/link";
import { LanguageSelector } from "@/components/language-selector";

const steps = [
  ["01", "Say what you want", "No forms, no hunting for the right app. Start naturally, in your own words."],
  ["02", "ELYNVIA understands", "Your request becomes a structured Intent: goal, context, constraints and what still matters."],
  ["03", "It organizes", "Complex goals can become Projects, keeping decisions, conversations and next steps together."],
  ["04", "Move toward action", "ELYNVIA is designed to progressively connect the right tools, services and agents—with you in control."],
];

const examples = [
  ["Travel", "Plan five days in Italy in September for two, under CHF 1,500."],
  ["Life admin", "Help me compare my options and organize everything I need to do next."],
  ["Research", "Find the best solution for my needs, explain the trade-offs, then help me decide."],
];

export default function WelcomePage() {
  return (
    <main className="landingPage">
      <header className="landingNav">
        <Link className="brandLockup" href="/welcome"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></Link>
        <nav className="landingLinks" aria-label="Main navigation"><a href="#how">How it works</a><a href="#life">Life</a><a href="#trust">Trust</a></nav>
        <div className="landingActions"><LanguageSelector compact /><Link className="textButton" href="/login">Sign in</Link><Link className="primaryButton" href="/login">Start with ELYNVIA</Link></div>
      </header>

      <section className="landingHero">
        <div className="heroAura" aria-hidden="true" />
        <p className="eyebrow">ELYNVIA LIFE · YOUR PERSONAL AGENT</p>
        <h1>From intention<br/><span>to action.</span></h1>
        <p className="heroLead">Tell ELYNVIA what you want to accomplish. It understands the goal, organizes what matters and helps you move forward—with less friction and more control.</p>
        <div className="heroActions"><Link className="primaryButton heroCta" href="/login">Ask ELYNVIA <span>→</span></Link><a className="secondaryButton heroCta" href="#how">Discover how it works</a></div>
        <p className="heroPromise">Your Life. Your Agent. · Private by design · Built for the world</p>
        <div className="intentDemo">
          <div className="demoPrompt"><span className="demoAvatar">P</span><p>I want to spend five days in Italy in September with my partner. Maximum budget CHF 1,500.</p></div>
          <div className="demoFlow"><span>Natural request</span><b>→</b><span className="activeFlow">Intent understood</span><b>→</b><span>Useful next step</span></div>
          <div className="demoIntent"><div><small>ELYNVIA INTENT</small><strong>Italy trip · 5 days · 2 people</strong></div><div className="intentPills"><span>September</span><span>≤ CHF 1,500</span><span>Needs departure city</span></div><b className="confidence">94% understood</b></div>
        </div>
      </section>

      <section className="landingSection" id="how">
        <div className="sectionIntro"><p className="eyebrow">ONE SIMPLE INTERFACE</p><h2>You shouldn’t need to know<br/>which tool to use first.</h2><p>Digital life is fragmented. ELYNVIA starts with the outcome you want—not with an app, a form or a menu.</p></div>
        <div className="stepsGrid">{steps.map(([number,title,text]) => <article className="stepCard" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="lifeSection" id="life">
        <div className="lifeCopy"><p className="eyebrow">ELYNVIA LIFE</p><h2>A personal agent built around your intentions.</h2><p>Simple questions stay simple. Bigger ambitions become structured projects. Context remains useful, inspectable and under your control.</p><Link className="primaryButton heroCta" href="/login">Enter ELYNVIA Life →</Link></div>
        <div className="exampleStack">{examples.map(([label,text],index) => <article className="exampleCard" key={label}><span className={`exampleIcon icon${index}`}>✦</span><div><small>{label}</small><p>“{text}”</p></div></article>)}</div>
      </section>

      <section className="trustSection" id="trust">
        <p className="eyebrow">TRUST IS A PRODUCT FEATURE</p><h2>Powerful assistance.<br/>Human control.</h2>
        <div className="trustGrid"><article><b>◌</b><h3>Private by design</h3><p>Personal data is treated as personal—not as an advertising feed.</p></article><article><b>✓</b><h3>You stay in control</h3><p>Memory and consequential actions are designed around explicit user control.</p></article><article><b>↻</b><h3>AI without lock-in</h3><p>ELYNVIA is the durable product. AI providers are replaceable engines behind it.</p></article><article><b>◎</b><h3>International from day one</h3><p>Languages, currencies and diverse contexts are part of the architecture, not an afterthought.</p></article></div>
      </section>

      <section className="finalCta"><span className="brandGlyph largeGlyph">✦</span><p className="eyebrow">YOUR LIFE. YOUR AGENT.</p><h2>What would you like<br/>to accomplish?</h2><Link className="primaryButton heroCta" href="/login">Start with ELYNVIA →</Link></section>
      <footer className="landingFooter"><div className="brandLockup"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div><p>From intention to action.</p><LanguageSelector compact /></footer>
    </main>
  );
}
