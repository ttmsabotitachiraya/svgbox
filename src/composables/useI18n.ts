import { ref, computed } from "vue";
import en from "../i18n/en";
import th from "../i18n/th";

export type Language = "th" | "en";

// ── Singleton reactive state ──────────────────────────────────────────────────
// This lives at module level so all components share the same language ref.
// Any component that calls useI18n() will reactively update when language changes.

const _language = ref<Language>(
  (() => {
    try {
      const stored = localStorage.getItem("svgbox_lang");
      if (stored === "th" || stored === "en") return stored;
    } catch {
      // localStorage unavailable
    }
    return "en";
  })(),
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const messages = { th, en };

/**
 * Resolve a dot-notation key against the active translation object.
 * Falls back to the key itself if the path is not found.
 *
 * Accessing `_language.value` inside this function is intentional —
 * Vue tracks it as a reactive dependency so any template that calls `t()`
 * will re-render automatically when the language changes.
 */
function resolve(key: string): string {
  const dict = messages[_language.value] as Record<string, unknown>;
  const parts = key.split(".");
  let node: unknown = dict;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return key;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : key;
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useI18n() {
  /** Current active language (reactive). */
  const language = computed(() => _language.value);

  /** Translate a dot-notation key into the active language string. */
  const t = (key: string): string => resolve(key);

  /**
   * Change the active language and persist the choice in localStorage.
   * All components that use `t()` will re-render automatically.
   */
  const setLanguage = (lang: Language): void => {
    _language.value = lang;
    try {
      localStorage.setItem("svgbox_lang", lang);
    } catch {
      // localStorage unavailable — change still takes effect in memory
    }
  };

  /** Toggle between Thai and English. */
  const toggleLanguage = (): void => {
    setLanguage(_language.value === "th" ? "en" : "th");
  };

  return {
    language,
    t,
    setLanguage,
    toggleLanguage,
  };
}
