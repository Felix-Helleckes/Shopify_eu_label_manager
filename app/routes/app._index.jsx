import { json } from "@remix-run/node";
import { authenticate } from "~/utils/shopify.server"; // Adjust the path as per your project
import { prisma } from "~/utils/db.server";
import {
  Tabs,
  TabList,
  TabPanel,
  Card,
  Section,
  FormLayout,
  TextField,
  ChoiceList,
  Button,
  DataTable,
  TextContainer,
  Stack,
  Heading,
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
    // Parse the JSON strings from the form fields
    let commercialGuaranteeRules;
    let customEmailTemplate;
    try {
      commercialGuaranteeRules = JSON.parse(formData.get("commercialGuaranteeRules"));
      customEmailTemplate = JSON.parse(formData.get("customEmailTemplate"));
    } catch (e) {
      alert("Fehler beim Parsen der Einstellungen. Bitte überprüfen Sie die Eingaben.");
      return;
    }

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
    <>
      <Tabs>
        <TabList>
          <Tab label="Widerrufe (Withdrawals)" />
          <Tab label="EU Gewährleistung (Warranty Label)" />
        </TabList>

        <TabPanel>
          <Card sectioned>
            <Heading size="2">Widerruflog</Heading>
            <Stack>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                variant="primary"
              >
                {isExporting ? "Exportiert..." : "Exportieren als CSV/PDF"}
              </Button>
            </Stack>
            <Section>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Content>
                    <DataTable.Row>
                      <DataTable.Heading>ID</DataTable.Heading>
                      <DataTable.Heading>Kundenname</DataTable.Heading>
                      <DataTable.Heading>Bestellnummer</DataTable.Heading>
                      <DataTable.Heading>E-Mail</DataTable.Heading>
                      <DataTable.Heading>Timestamp</DataTable.Heading>
                      <DataTable.Heading>Verifikationshash</DataTable.Heading>
                      <DataTable.Heading>E-Mail gesendet</DataTable.Heading>
                    </DataTable.Row>
                  </DataTable.Content>
                </DataTable.Header>
                <DataTable.Body>
                  {withdrawalLogs.map((log) => (
                    <DataTable.Row key={log.id}>
                      <DataTable.Content>{log.id}</DataTable.Content>
                      <DataTable.Content>{log.customerName}</DataTable.Content>
                      <DataTable.Content>{log.orderNumber}</DataTable.Content>
                      <DataTable.Content>{log.email}</DataTable.Content>
                      <DataTable.Content>
                        {log.timestamp.toLocaleString()}
                      </DataTable.Content>
                      <DataTable.Content>{log.verificationHash}</DataTable.Content>
                      <DataTable.Content>
                        {log.emailSent ? "Ja" : "Nein"}
                      </DataTable.Content>
                    </DataTable.Row>
                  ))}
                </DataTable.Body>
              </DataTable>
            </Section>
          </Card>
        </TabPanel>

        <TabPanel>
          <Card sectioned>
            <Heading size="2">EU Gewährleistungskonfiguration</Heading>
            <FormLayout onSubmit={handleSaveSettings}>
              <FormLayout.Field
                label="EU Gewährleistungslabel aktivieren"
                helpText="Aktivieren Sie dies, um das EU-Gewährleistungslabel auf Produktseiten anzuzeigen."
              >
                <Checkbox
                  id="warrantyLabelActive"
                  name="warrantyLabelActive"
                  checked={appSettings?.warrantyLabelActive ?? false}
                />
              </FormLayout.Field>

              <FormLayout.Field
                label="Globale Handelsgarantie-Text"
                helpText="Standardtext für zusätzliche freiwillige Handelsgarantie, falls kein Metafield gesetzt ist."
              >
                <TextField
                  id="globalGuaranteeText"
                  name="commercialGuaranteeRules"
                  value={JSON.stringify(
                    appSettings?.commercialGuaranteeRules?.globalText ?? ""
                  )}
                />
              </FormLayout.Field>

              <FormLayout.Field
                label="Metafield-Konfiguration für Handelsgarantie"
                helpText="Definieren Sie den Namespace und Schlüssel des Produkt-Metafields, aus dem die Handelsgarantie gelesen werden soll."
              >
                <Stack>
                  <TextField
                    label="Namespace"
                    id="metafieldNamespace"
                    name="commercialGuaranteeRules"
                    value={JSON.stringify(
                      appSettings?.commercialGuaranteeRules?.metafieldNamespace ??
                        "eu_compliance"
                    )}
                  />
                  <TextField
                    label="Schlüssel"
                    id="metafieldKey"
                    name="commercialGuaranteeRules"
                    value={JSON.stringify(
                      appSettings?.commercialGuaranteeRules?.metafieldKey ??
                        "commercial_guarantee"
                    )}
                  />
                </Stack>
              </FormLayout.Field>

              <FormLayout.Field
                label="E-Mail-Vorlage für Widerrufsbestätigung"
                helpText="Passen Sie die Betreffzeile und den Inhalt der automatischen Widerrufsbestätigung-E-Mail an."
              >
                <Stack>
                  <TextField
                    label="Betreff"
                    id="emailSubject"
                    name="customEmailTemplate"
                    value={JSON.stringify(
                      appSettings?.customEmailTemplate?.subject ??
                        "Bestätigung Ihres Widerrufs"
                    )}
                  />
                  <TextField
                    label="E-Mail-Body"
                    id="emailBody"
                    name="customEmailTemplate"
                    value={JSON.stringify(
                      appSettings?.customEmailTemplate?.body ??
                        "Sehr geehrte/r {customerName},\n\nwir haben Ihren Widerruf vom {timestamp} erhalten.\n\nIhre Widerrufsdetails:\n- Bestellnummer: {orderNumber}\n- Name: {customerName}\n- E-Mail: {email}\n\nWir werden Ihre Rücksendung umgehend bearbeiten.\n\nMit freundlichen Grüßen\n{shopName}"
                    )}
                  />
                </Stack>
              </FormLayout.Field>

              <Stack>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Einstellungen speichern
                </Button>
              </Stack>
            </FormLayout>
          </Card>
        </TabPanel>
      </Tabs>
    </>
  );
}