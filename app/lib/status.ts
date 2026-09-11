/** Processing states of a withdrawal – shared between server and client code. English defaults; translations via statusLabels() in admin-i18n.ts. */
export const STATUS_KEYS = ["received", "processing", "refunded", "rejected"] as const;

export const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  processing: "In progress",
  refunded: "Refunded",
  rejected: "Rejected / invalid",
};
