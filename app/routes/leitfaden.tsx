/** Deutscher Leitfaden zu den EU-Pflichten 2026. Englische Fassung: /guide. */
import { useLoaderData } from "react-router";
import { operator } from "../lib/operator";
import { GUIDE, GUIDE_PATH, GuidePage, guideJsonLd } from "../lib/guide";
import { socialMeta } from "../lib/site";

export const loader = async () => ({
  appStoreUrl: process.env.APP_STORE_URL || "",
  supportEmail: operator.supportEmail,
});

export function meta() {
  const t = GUIDE.de;
  return [
    { title: t.metaTitle },
    { name: "description", content: t.metaDescription },
    { name: "author", content: operator.name },
    ...socialMeta({
      lang: "de",
      path: GUIDE_PATH.de,
      alternates: [
        ["de", GUIDE_PATH.de],
        ["en", GUIDE_PATH.en],
      ],
      pathDefault: GUIDE_PATH.en,
      title: t.metaTitle,
      description: t.metaDescription,
      imageAlt: t.imageAlt,
      type: "article",
    }),
    ...guideJsonLd("de").map((schema) => ({ "script:ld+json": schema })),
  ];
}

export default function Leitfaden() {
  const { appStoreUrl, supportEmail } = useLoaderData<typeof loader>();
  return <GuidePage lang="de" appStoreUrl={appStoreUrl} supportEmail={supportEmail} />;
}
