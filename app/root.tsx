import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { htmlLang } from "./lib/site";

export const loader = ({ request }: LoaderFunctionArgs) => ({ lang: htmlLang(request) });

export default function App() {
  const { lang } = useLoaderData<typeof loader>();
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
