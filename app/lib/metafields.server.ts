import type { GraphqlClient } from "./withdrawal.server";

export const METAFIELD_NAMESPACE = "eu_compliance";

export const PRODUCT_DEFINITIONS = [
  {
    key: "guarantee_years",
    name: "Producer guarantee: duration in years (GARAN)",
    type: "number_integer",
    description: "Duration of the producer's commercial guarantee of durability in years. The GARAN label is shown only for more than 2 years.",
  },
  {
    key: "guarantee_producer",
    name: "Producer guarantee: producer / brand (GARAN)",
    type: "single_line_text_field",
    description: "Name of the producer granting the durability guarantee (field 'Brand/Trademark' of the label).",
  },
  {
    key: "guarantee_model",
    name: "Producer guarantee: model identifier (GARAN)",
    type: "single_line_text_field",
    description: "Model identifier the guarantee applies to (field 'Model identifier' of the label).",
  },
  {
    key: "guarantee_terms_url",
    name: "Producer guarantee: link to the guarantee terms",
    type: "url",
    description: "Optional: link to the producer's full guarantee terms.",
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
