"use client";

import { useActionState } from "react";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = {};

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState);
  const state = loginState.error || loginState.message ? loginState : signupState;

  return (
    <main className="authShell">
      <section className="authBrand">
        <div className="brandLockup"><span className="brandGlyph">✦</span><strong>ELYNVIA</strong></div>
        <p className="eyebrow">YOUR LIFE. YOUR AGENT.</p>
        <h1>Une intention.<br />Un point de départ.</h1>
        <p className="intro">Connectez-vous pour retrouver vos conversations, intentions et projets.</p>
      </section>

      <section className="authCard" aria-label="Connexion à ELYNVIA">
        <div>
          <p className="eyebrow">ELYNVIA LIFE</p>
          <h2>Bienvenue</h2>
          <p className="muted">Un seul compte pour commencer. L’écosystème viendra ensuite.</p>
        </div>
        <form>
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
          {state.error ? <p className="formError" role="alert">{state.error}</p> : null}
          {state.message ? <p className="formSuccess" role="status">{state.message}</p> : null}
          <div className="authActions">
            <button className="primaryButton" formAction={loginAction} disabled={loginPending || signupPending}>Se connecter</button>
            <button className="secondaryButton" formAction={signupAction} disabled={loginPending || signupPending}>Créer un compte</button>
          </div>
        </form>
      </section>
    </main>
  );
}
