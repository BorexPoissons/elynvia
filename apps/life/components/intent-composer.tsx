"use client";

import { useActionState } from "react";
import { submitIntent, type IntentActionState } from "@/app/actions";

const initialState: IntentActionState = {};

export function IntentComposer() {
  const [state, action, pending] = useActionState(submitIntent, initialState);
  return (
    <form className="composer" action={action}>
      <div className="composerHead"><span className="composerSpark">✦</span><span>Ask ELYNVIA</span></div>
      <label className="sr-only" htmlFor="intent">Your intention</label>
      <textarea id="intent" name="intent" rows={4} required minLength={3} maxLength={20_000} placeholder="Tell me what you want to accomplish…" />
      {state.error ? <p className="formError" role="alert">{state.error}</p> : null}
      <div className="composerFooter"><span>Write naturally · any language · details are optional</span><button className="primaryButton sendButton" type="submit" disabled={pending}>{pending ? "Understanding…" : "Continue →"}</button></div>
    </form>
  );
}
