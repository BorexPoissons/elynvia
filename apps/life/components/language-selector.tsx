"use client";

import { useEffect, useState } from "react";
import { defaultLanguage, normalizeLanguage, supportedLanguages } from "@/lib/i18n";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const saved = window.localStorage.getItem("elynvia-language");
    const detected = normalizeLanguage(saved || window.navigator.language);
    setLanguage(detected);
    document.documentElement.lang = detected;
    document.documentElement.dir = detected === "ar" ? "rtl" : "ltr";
  }, []);

  function changeLanguage(value: string) {
    const next = normalizeLanguage(value);
    setLanguage(next);
    window.localStorage.setItem("elynvia-language", next);
    document.cookie = `elynvia-language=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }

  return (
    <label className={`languageSelector ${compact ? "compactLanguage" : ""}`}>
      <span aria-hidden="true">◎</span>
      <span className="sr-only">Language</span>
      <select aria-label="Language" value={language} onChange={(event) => changeLanguage(event.target.value)}>
        {supportedLanguages.map((item) => <option key={item.code} value={item.code}>{item.native}</option>)}
      </select>
    </label>
  );
}
