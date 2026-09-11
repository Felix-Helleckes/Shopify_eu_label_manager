import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { hasPro, requireWithdrawalPlan } from "../lib/billing.server";
import { withdrawalsToCsv } from "../lib/withdrawal.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, plan, t } = await requireShop(request);
  requireWithdrawalPlan(plan, request);
  if (!hasPro(plan)) throw redirect("/app/billing?upgrade=export");
  const rows = await db.withdrawal.findMany({ where: { shop: shop.domain }, orderBy: { submittedAt: "desc" } });
  const csv = withdrawalsToCsv(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${t("wd.file")}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
};
