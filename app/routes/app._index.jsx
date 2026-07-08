import { json } from "@remix-run/node";
import { authenticate } from "~/utils/shopify.server"; // Adjust the path as per your project
import { prisma } from "~/utils/db.server";
import {
  Card,
  FormLayout,
  TextField,
  Button,
  DataTable,
  Checkbox,
} from "@shopify/polaris";
import { useLoaderData, useState } from "react";

export async function loader({ request }) {
  // Authenticate the request to get the current shop
  const { admin } = await authenticate.admin(request);
  const shopDomain = admin.shop;

  // Fetch withdrawal logs for this shop
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

  // Fetch app settings for this shop
  let appSettings = await prisma.appSettings.findUnique({
    where: { shop: shopDomain },
  });

  // If settings don't exist, create default ones
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
          body: "Sehr geehrte/r {customerName},\n\nwir haben Ihren Widerruf vom {timestamp} erhalten.\n\nIhre Widerrufsdetails:\n- Bestellnummer: {orderNumber}\n- Name: {customerName}\n- E-Mail: {email}\n\nWir werden Ihre Rücksendung umgehend bearbeiten.\n\nMit freundlichen Grüßen\n{shopName}",
        },
      },
    });
  }

  return json({ withdrawalLogs, appSettings, shopDomain });
}

export default function AppIndex() {
  const { withdrawalLogs, appSettings, shopDomain } = useLoaderData();
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("withdrawals");

  // Function to handle export to CSV (simulated)
  const handleExport = () => {
    setIsExporting(true);
    // In a real app, you would generate a CSV or PDF and trigger a download
    // For now, we'll just show an alert and reset after a delay
    alert("Exporting withdrawal logs to CSV... (Feature simulated)");
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  // Function to handle saving app settings
  const handleSaveSettings = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
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

    await prisma.appSettings.update({
      where: { shop: shopDomain },
      data: {
        warrantyLabelActive,
        commercialGuaranteeRules,
        customEmailTemplate,
      },
    });

    alert("Einstellungen gespeichert!");
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("withdrawals")}
          style={{ padding: "8px 12px", borderRadius: "6px", border: activeTab === "withdrawals" ? "2px solid #0062ff" : "1px solid #ddd", background: activeTab === "withdrawals" ? "#f0f6ff" : "white" }}
        >
          Widerrufe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          style={{ padding: "8px 12px", borderRadius: "6px", border: activeTab === "warranty" ? "2px solid #0062ff" : "1px solid #ddd", background: activeTab === "warranty" ? "#f0f6ff" : "white" }}
        >
          EU Gewährleistung
        </button>
      </div>

      {activeTab === "withdrawals" ? (
        <Card sectioned>
          <h2 style={{ marginTop: 0 }}>Widerruflog</h2>
          <div style={{ marginBottom: "16px" }}>
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
          <FormLayout onSubmit={handleSaveSettings}>
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
              value={appSettings?.customEmailTemplate?.body ?? "Sehr geehrte/r {customerName},\n\nwir haben Ihren Widerruf vom {timestamp} erhalten.\n\nIhre Widerrufsdetails:\n- Bestellnummer: {orderNumber}\n- Name: {customerName}\n- E-Mail: {email}\n\nWir werden Ihre Rücksendung umgehend bearbeiten.\n\nMit freundlichen Grüßen\n{shopName}"}
              multiline={4}
            />

            <Button type="submit" variant="primary">
              Einstellungen speichern
            </Button>
          </FormLayout>
        </Card>
      )}
    </div>
  );
}