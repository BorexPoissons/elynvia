export default function HomePage() {
  return (
    <main className="shell">
      <header className="brand">
        <span className="mark" aria-hidden="true">E</span>
        <div>
          <strong>ELYNVIA</strong>
          <span>Life</span>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">YOUR LIFE. YOUR AGENT.</p>
        <h1 id="hero-title">Qu’est-ce que je peux faire pour vous&nbsp;?</h1>
        <p className="intro">
          Dites simplement ce que vous souhaitez accomplir. ELYNVIA commence par
          comprendre votre intention, puis vous aide à avancer.
        </p>

        <form className="composer">
          <label className="sr-only" htmlFor="intent">Votre intention</label>
          <textarea
            id="intent"
            name="intent"
            rows={4}
            placeholder="Ex. Organise-moi cinq jours en Italie en septembre, pour deux personnes, avec un budget de 1’500 CHF…"
          />
          <div className="composerFooter">
            <span>Texte pour commencer · voix et fichiers viendront ensuite</span>
            <button type="submit" disabled aria-label="Envoyer bientôt disponible">
              Bientôt
            </button>
          </div>
        </form>
      </section>

      <footer>ELYNVIA · From intention to action.</footer>
    </main>
  );
}
