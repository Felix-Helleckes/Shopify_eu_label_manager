import type { GraphqlClient } from "./withdrawal.server";

export const METAFIELD_NAMESPACE = "eu_compliance";

export const PRODUCT_DEFINITIONS = [
  {
    key: "guarantee_years",
    name: "Herstellergarantie: Dauer in Jahren (GARAN)",
    type: "number_integer",
    description: "Dauer der gewerblichen Haltbarkeitsgarantie des Herstellers in Jahren. Nur bei mehr als 2 Jahren wird die GARAN-Kennzeichnung angezeigt.",
  },
  {
    key: "guarantee_producer",
    name: "Herstellergarantie: Hersteller / Marke (GARAN)",
    type: "single_line_text_field",
    description: "Name des Herstellers, der die Haltbarkeitsgarantie gewährt (Feld „Brand/Trademark“ der Kennzeichnung).",
  },
  {
    key: "guarantee_model",
    name: "Herstellergarantie: Modellkennung (GARAN)",
    type: "single_line_text_field",
    description: "Modellkennung, für die die Garantie gilt (Feld „Model identifier“ der Kennzeichnung).",
  },
  {
    key: "guarantee_terms_url",
    name: "Herstellergarantie: Link zu den Garantiebedingungen",
    type: "url",
    description: "Optional: Link zu den vollständigen Garantiebedingungen des Herstellers.",
  },
] as const;

const LIST_DEFINITIONS = `#graphql
  query EuComplianceDefinitions($namespace: String!) {
    metafieldDefinitions(first: 20, ownerType: PRODUCT, namespace: $namespace) {
      nodes { key name type { name } }
    }
  }
`;

const CREATE_DEFINITION = `#graphql
  mutation EuComplianceCreateDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id key }
      userErrors { field message code }
    }
  }
`;

export async function listProductDefinitions(admin: GraphqlClient): Promise<string[]> {
  const res = await admin.graphql(LIST_DEFINITIONS, { variables: { namespace: METAFIELD_NAMESPACE } });
  const json = (await res.json()) as { data?: { metafieldDefinitions: { nodes: { key: string }[] } } };
  return json.data?.metafieldDefinitions.nodes.map((n) => n.key) ?? [];
}

export async function ensureProductDefinitions(admin: GraphqlClient): Promise<{ created: string[]; errors: string[] }> {
  const existing = await listProductDefinitions(admin);
  const created: string[] = [];
  const errors: string[] = [];
  for (const def of PRODUCT_DEFINITIONS) {
    if (existing.includes(def.key)) continue;
    const res = await admin.graphql(CREATE_DEFINITION, {
      variables: {
        definition: {
          name: def.name,
          namespace: METAFIELD_NAMESPACE,
          key: def.key,
          type: def.type,
          ownerType: "PRODUCT",
          description: def.description,
          pin: true,
          access: { storefront: "PUBLIC_READ" },
        },
      },
    });
    const json = (await res.json()) as {
      data?: { metafieldDefinitionCreate: { createdDefinition: { key: string } | null; userErrors: { message: string; code: string }[] } };
      errors?: { message: string }[];
    };
    const payload = json.data?.metafieldDefinitionCreate;
    if (payload?.createdDefinition) created.push(payload.createdDefinition.key);
    const errs = [...(payload?.userErrors ?? []).map((e) => `${def.key}: ${e.message}`), ...(json.errors ?? []).map((e) => `${def.key}: ${e.message}`)];
    // "TAKEN" means it exists already (race) – not an error for us.
    errors.push(...errs.filter((e) => !/taken|already/i.test(e)));
  }
  return { created, errors };
}
