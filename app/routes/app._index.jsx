import { json } from "@remix-run/node";
import { authenticate } from "~/utils/shopify.server";
import { prisma } from "~/utils/db.server";
import {
  Card,
  FormLayout,
  TextField,
  Button,
  DataTable,
  Checkbox,
} from "@shopify/polaris";
import { useLoaderData, useActionData, useNavigation, Form } from "@remix-run/react";
import { useState } from "react";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const shopDomain = admin.shop;

  const withdrawalLogs = await prisma.withdrawalLog.findMany({
    where: { shop: shopDomain },
    orderBy: { timestamp: "desc" },
    select: {
      id: true,
      customerName: true,
      orderNumber: true,
      email: true,
      timestamp: true,
      verificationHash: true,
      emailSent: true,
    },
  });

  let appSettings = await prisma.appSettings.findUnique({
    where: { shop: shopDomain },
  });

  if (!appSettings) {
    appSettings = await prisma.appSettings.create({
      data: {
        shop: shopDomain,
        warrantyLabelActive: false,
        commercialGuaranteeRules: {
          globalText: "",
          metafieldNamespace: "eu_compliance",
          metafieldKey: "commercial_guarantee",
        },
        customEmailTemplate: {
          subject: "Bestätigung Ihres Widerrufs",
          body: "Sehr geehrte/r {customerName},\\n\\nwir haben Ihren Widerruf vom {timestamp} erhalten.\\n\\nIhre Widerrufsdetails:\\n- Bestellnummer: {orderNumber}\\n- Name: {customerName}\\n- E-Mail: {email}\\n\\nWir werden Ihre Rücksendung umgehend bearbeiten.\\n\\nMit freundlichen Grüßen\\n{shopName}",
        },
      },
    });
  }

  return json({ withdrawalLogs, appSettings, shopDomain });
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const shopDomain = admin.shop;

  const formData = await request.formData();
  const warrantyLabelActive = formData.get("warrantyLabelActive") === "on";

  const commercialGuaranteeRules = {
    globalText: String(formData.get("globalGuaranteeText") || ""),
    metafieldNamespace: String(formData.get("metafieldNamespace") || "eu_compliance"),
    metafieldKey: String(formData.get("metafieldKey") || "commercial_guarantee"),
  };

  const customEmailTemplate = {
    subject: String(formData.get("emailSubject") || "Bestätigung Ihres Widerrufs"),
    body: String(formData.get("emailBody") || ""),
  };

  await prisma.appSettings.upsert({
    where: { shop: shopDomain },
    create: {
      shop: shopDomain,
      warrantyLabelActive,
      commercialGuaranteeRules,
      customEmailTemplate,
    },
    update: {
      warrantyLabelActive,
      commercialGuaranteeRules,
      customEmailTemplate,
    },
  });

  return json({ success: true, message: "Einstellungen gespeichert!" });
}

export default function AppIndex() {
  const { withdrawalLogs, appSettings, shopDomain } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("withdrawals");

  const handleExport = () => {
    setIsExporting(true);
    alert("Exporting withdrawal logs to CSV... (Feature simulated)");
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("withdrawals")}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: activeTab === "withdrawals" ? "2px solid #0062ff" : "1px solid #ddd",
            background: activeTab === "withdrawals" ? "#f0f6ff" : "white",
          }}
        >
          Widerrufe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: activeTab === "warranty" ? "2px solid #0062ff" : "1px solid #ddd",
            background: activeTab === "warranty" ? "#f0f6ff" : "white",
          }}
        >
          EU Gewährleistung
        </button>
      </div>

      {activeTab === "withdrawals" ? (
        <Card sectioned>
          <h2 style={{ marginTop: 0 }}>Widerruflog</h2>
          {actionData?.success && (
            <div style={{ marginBottom: 16, padding: 12, background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 4, color: "#155724" }}>
              {actionData.message}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <Button onClick={handleExport} disabled={isExporting} variant="primary">
              {isExporting ? "Exportiert..." : "Exportieren als CSV/PDF"}
            </Button>
          </div>
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text", "text", "text"]}
            headings={["ID", "Kundenname", "Bestellnummer", "E-Mail", "Timestamp", "Verifikationshash", "E-Mail gesendet"]}
            rows={withdrawalLogs.map((log) => [
              log.id,
              log.customerName,
              log.orderNumber,
              log.email,
              log.timestamp ? new Date(log.timestamp).toLocaleString() : "",
              log.verificationHash,
              log.emailSent ? "Ja" : "Nein",
            ])}
          />
        </Card>
      ) : (
        <Card sectioned>
          <h2 style={{ marginTop: 0 }}>EU Gewährleistungskonfiguration</h2>
          <Form method="post">
            <FormLayout>
              <FormLayout.Group>
                <Checkbox
                  id="warrantyLabelActive"
                  name="warrantyLabelActive"
                  label="EU Gewährleistungslabel aktivieren"
                  helpText="Aktivieren Sie dies, um das EU-Gewährleistungslabel auf Produktseiten anzuzeigen."
                  checked={appSettings?.warrantyLabelActive ?? false}
                />
              </FormLayout.Group>

              <TextField
                label="Globale Handelsgarantie-Text"
                helpText="Standardtext für zusätzliche freiwillige Handelsgarantie, falls kein Metafield gesetzt ist."
                id="globalGuaranteeText"
                name="globalGuaranteeText"
                value={appSettings?.commercialGuaranteeRules?.globalText ?? ""}
              />
              <TextField
                label="Namespace"
                id="metafieldNamespace"
                name="metafieldNamespace"
                value={appSettings?.commercialGuaranteeRules?.metafieldNamespace ?? "eu_compliance"}
              />
              <TextField
                label="Schlüssel"
                id="metafieldKey"
                name="metafieldKey"
                value={appSettings?.commercialGuaranteeRules?.metafieldKey ?? "commercial_guarantee"}
              />
              <TextField
                label="Betreff"
                id="emailSubject"
                name="emailSubject"
                value={appSettings?.customEmailTemplate?.subject ?? "Bestätigung Ihres Widerrufs"}
              />
              <TextField
                label="E-Mail-Body"
                id="emailBody"
                name="emailBody"
                value={appSettings?.customEmailTemplate?.body ?? ""}
                multiline={4}
              />

              <Button type="submit" variant="primary" loading={isSaving}>
                {isSaving ? "Speichere..." : "Einstellungen speichern"}
              </Button>
            </FormLayout>
          </Form>
          {actionData?.success && activeTab === "warranty" && (
            <div style={{ marginTop: 12, padding: 12, background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 4, color: "#155724" }}>
              {actionData.message}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}