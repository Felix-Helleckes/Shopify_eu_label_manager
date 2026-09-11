import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { requireShop } from "../lib/admin.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await requireShop(request, { billing: false });
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    nav: {
      overview: t("nav.overview"),
      withdrawals: t("nav.withdrawals"),
      guarantee: t("nav.guarantee"),
      settings: t("nav.settings"),
      billing: t("nav.billing"),
    },
  };
};

// Shopify's embedded-app checks look for this meta tag in addition to the App Bridge script tag.
export const meta = ({ data }: { data?: { apiKey: string } }) => [{ name: "shopify-api-key", content: data?.apiKey ?? "" }];

export default function App() {
  const { apiKey, nav } = useLoaderData<typeof loader>();

  return (
    <AppProvider apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">{nav.overview}</s-link>
        <s-link href="/app/withdrawals">{nav.withdrawals}</s-link>
        <s-link href="/app/guarantee">{nav.guarantee}</s-link>
        <s-link href="/app/settings">{nav.settings}</s-link>
        <s-link href="/app/billing">{nav.billing}</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
