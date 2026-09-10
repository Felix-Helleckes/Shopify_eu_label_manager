import { LoginErrorType, type LoginError } from "@shopify/shopify-app-react-router/server";

export function loginErrorMessage(loginErrors: LoginError): { shop?: string } {
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: "Bitte geben Sie Ihre Shop-Domain ein." };
  } else if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return { shop: "Bitte geben Sie eine gültige Shop-Domain ein (z. B. mein-shop.myshopify.com)." };
  }
  return {};
}
