"use client";

import { useActionState } from "react";
import { submitIntent, type IntentActionState } from "@/app/actions";

const initialState: IntentActionState = {};

export function IntentComposer() {
  const [state, action, pending] = useActionState(submitIntent, initialState);

  return (
    <form className="composer" action={action}>
      <label className="sr-only" htmlFor="intent">Votre intention</label>
      <textarea
        id="intent"
        name="intent"
        rows={4}
        required
        minLength={3}
        maxLength={20_000}
        placeholder="Ex. Organise-moi cinq jours en Italie en septembre, pour deux personnes, avec un budget de 1’500 CHF…"
      />
      {state.error ? <p className="formError" role="alert">{state.error}</p> : null}
      <div className="composerFooter">
        <span>ELYNVIA transforme votre demande en intention structurée.</span>
        <button className="primaryButton" type="submit" disabled={pending}>
          {pending ? "Analyse…" : "Envoyer →"}
        </button>
      </div>
    </form>
  );
}
