import { describe, expect, it } from "vitest";
import { ALL_PLANS, hasPro, hasWithdrawal, isPaidPlan, PLAN_BASIC, PLAN_FREE, PLAN_PRO, planFeatures } from "../app/lib/plans";
import { ADMIN_LOCALES, en, translator } from "../app/lib/admin-i18n";
import { MORE_ADMIN_STRINGS } from "../app/lib/admin-i18n.more";

describe("plans", () => {
  it("gates the withdrawal function to paid plans", () => {
    expect(hasWithdrawal(PLAN_FREE)).toBe(false);
    expect(hasWithdrawal(null)).toBe(false);
    expect(hasWithdrawal(PLAN_BASIC)).toBe(true);
    expect(hasWithdrawal(PLAN_PRO)).toBe(true);
    expect(isPaidPlan("Free")).toBe(false);
  });

  it("gates tagging and export to Pro", () => {
    expect(hasPro(PLAN_BASIC)).toBe(false);
    expect(hasPro(PLAN_PRO)).toBe(true);
  });

  it("has features for every plan in every admin language", () => {
    for (const plan of ALL_PLANS) {
      for (const locale of ADMIN_LOCALES) {
        const f = planFeatures(plan, locale);
        expect(f.length, `${plan}/${locale}`).toBeGreaterThanOrEqual(4);
      }
      expect(planFeatures(plan, "xx")).toEqual(planFeatures(plan, "en"));
    }
  });
});

describe("admin translations", () => {
  it("cover every English key in every language", () => {
    const keys = Object.keys(en);
    for (const [locale, dict] of Object.entries(MORE_ADMIN_STRINGS)) {
      const missing = keys.filter((k) => !(k in dict));
      expect(missing, locale).toEqual([]);
    }
  });

  it("interpolates variables and falls back to English", () => {
    const t = translator("de");
    expect(t("det.title", { ref: "WR-1" })).toBe("Widerruf WR-1");
    expect(translator("fr")("bil.start", { plan: "Basic" })).toBe("Démarrer Basic");
  });
});
