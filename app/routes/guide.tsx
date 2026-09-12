/** English guide to the 2026 EU duties. German version: /leitfaden. */
import { useLoaderData } from "react-router";
import { operator } from "../lib/operator";
import { GUIDE, GUIDE_PATH, GuidePage, guideJsonLd } from "../lib/guide";
import { socialMeta } from "../lib/site";

export const loader = async () => ({
  appStoreUrl: process.env.APP_STORE_URL || "",
  supportEmail: operator.supportEmail,
});

export function meta() {
  const t = GUIDE.en;
  return [
    { title: t.metaTitle },
    { name: "description", content: t.metaDescription },
    { name: "author", content: operator.name },
    ...socialMeta({
      lang: "en",
      path: GUIDE_PATH.en,
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
    ...guideJsonLd("en").map((schema) => ({ "script:ld+json": schema })),
  ];
}

export default function Guide() {
  const { appStoreUrl, supportEmail } = useLoaderData<typeof loader>();
  return <GuidePage lang="en" appStoreUrl={appStoreUrl} supportEmail={supportEmail} />;
}
