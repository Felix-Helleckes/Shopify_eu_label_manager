/** Processing states of a withdrawal – shared between server and client code. */
export const STATUS_LABELS: Record<string, string> = {
  received: "Eingegangen",
  processing: "In Bearbeitung",
  refunded: "Erstattet",
  rejected: "Abgelehnt / ungültig",
};
