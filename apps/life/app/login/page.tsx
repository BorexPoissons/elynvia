"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = {};

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState);
  const state = loginState.error || loginState.message ? loginState : signupState;

  return (
    <main className="authShell">
      <section className="authBrand">
        <div className="authTop"><Link className="brandLockup" href="/welcome"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></Link><LanguageSelector compact /></div>
        <div className="authStory"><p className="eyebrow">YOUR LIFE. YOUR AGENT.</p><h1>One place for<br/><span>what matters next.</span></h1><p className="intro">Start with an intention. ELYNVIA helps understand it, structure it and move it toward a useful result.</p><div className="authProof"><span>✓ Private by design</span><span>✓ Your context, under your control</span><span>✓ Built for natural conversation</span></div></div>
        <p className="authQuote">“I’ll ask ELYNVIA.”</p>
      </section>

      <section className="authPanel">
        <div className="authCard" aria-label="Sign in to ELYNVIA">
          <div><p className="eyebrow">ELYNVIA LIFE</p><h2>Welcome</h2><p className="muted">Sign in to continue, or create your ELYNVIA ID.</p></div>
          <form>
            <label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" placeholder="8 characters minimum" minLength={8} required />
            {state.error ? <p className="formError" role="alert">{state.error}</p> : null}{state.message ? <p className="formSuccess" role="status">{state.message}</p> : null}
            <div className="authActions"><button className="primaryButton authPrimary" formAction={loginAction} disabled={loginPending || signupPending}>Sign in →</button><button className="secondaryButton" formAction={signupAction} disabled={loginPending || signupPending}>Create an account</button></div>
          </form>
          <p className="authFineprint">By continuing, you’re entering the ELYNVIA Life foundation experience. <Link href="/welcome">Learn about ELYNVIA</Link>.</p>
        </div>
      </section>
    </main>
  );
}
