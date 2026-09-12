/**
 * Sprachen der Landingpage.
 *
 * Dieselben zehn Sprachen, die auch der Admin der App spricht. Die Shop-Blöcke selbst gibt es
 * in allen 24 EU-Amtssprachen; für die Landingpage sind das die Märkte, in denen Shopify-Shops
 * tatsächlich in Zahl vorkommen. `LandingText` leitet sich aus der englischen Fassung ab, damit
 * die Typprüfung jede fehlende oder überzählige Zeile in den anderen Sprachen meldet.
 */
import type { SiteLang } from "../../../lib/site";
import { da } from "./da";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { nl } from "./nl";
import { pl } from "./pl";
import { pt } from "./pt";
import { sv } from "./sv";

export type LandingText = typeof en;

export const LANDING_T: Record<SiteLang, LandingText> = { en, de, fr, es, it, nl, pl, pt, sv, da };

/** Eigenbezeichnungen – eine Sprachauswahl, die niemand in einer fremden Sprache lesen muss. */
export const LANGUAGE_NAMES: Record<SiteLang, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  sv: "Svenska",
  da: "Dansk",
};

/**
 * Sprachen, für die es eigene Screenshots gibt (public/img/<lang>/). Für die übrigen zeigt die
 * Seite die englischen Aufnahmen – die Blöcke im Bild sind dann englisch, der Seitentext bleibt
 * in der Sprache des Besuchers. Neue Sprachen: `node scripts/screenshots/build.mjs <lang>`.
 */
const LANGS_WITH_SHOTS = new Set<string>(["de", "en", "fr", "es", "it", "nl"]);

export function shotLang(lang: SiteLang): SiteLang {
  return LANGS_WITH_SHOTS.has(lang) ? lang : "en";
}
