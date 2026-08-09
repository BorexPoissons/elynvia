export const supportedLanguages = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "pl", label: "Polish", native: "Polski" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]["code"];
export const defaultLanguage: LanguageCode = "en";

export function normalizeLanguage(value?: string | null): LanguageCode {
  const code = value?.trim().toLowerCase().split(/[-_]/)[0];
  return supportedLanguages.some((language) => language.code === code)
    ? (code as LanguageCode)
    : defaultLanguage;
}
