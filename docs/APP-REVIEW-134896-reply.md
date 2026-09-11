# Antwort an den Prüfer (Partner Dashboard → App Store review → View feedback)

Englisch, zum Einfügen in das Antwortfeld der Rückmeldung 134896.

---

Thank you for the detailed report and the screenshots — they were exactly what we needed.

**What we changed**

We removed every case where a block rendered something in the theme editor that the storefront does
not render. There were four:

1. `withdrawal-button` and `withdrawal-embed` showed a note in the theme editor when the shop is on
   our free plan, and nothing on the storefront. They are now empty in both.
2. `durability-label` showed a placeholder in the theme editor when a product has no durability
   guarantee of more than two years, and nothing on the storefront. It is now empty in both — the
   harmonised label may not be shown for guarantees of two years or less.
3. `legal-guarantee-notice` opened its collapsible variant automatically in the theme editor only.
   It now behaves identically in both.

Why a block can legitimately be empty is now explained in the block's settings panel instead of in
the preview, so the rendered page is identical in the theme editor and on the storefront.

This is released as app version `eu-compliance-suite-11`.

**On the cart template specifically**

We re-tested the two blocks you used. `legal-guarantee-notice` and `repair-info` contain no
conditional logic at all — they always output markup, independent of plan, product, template or
language. We placed both into an `apps` section of `templates/cart.json` on a test store and loaded
the cart on the storefront (no theme editor, no `design_mode`): the section
`shopify-section-template--…__apps` renders with both notices, above the footer.

So if neither notice appeared on your storefront cart while both appeared in the editor, the `apps`
section was not part of the published template at the time of the storefront request. We reproduced
that state ourselves: after adding a block and saving, `templates/cart.json` still contained only
`cart-items` and `cart-footer`. We have added an explicit reminder in the app (dashboard and
guarantee page, all ten admin languages) to press Save in the theme editor after adding a block.

If the notices are still missing on your next test, could you confirm whether the `apps` section
appears in the saved `templates/cart.json` of the published theme? That would tell us immediately
whether the problem is in our rendering or in the template that reaches the storefront, and we will
fix it the same day.

Thank you,
Felix Helleckes — EU Compliance Suite
