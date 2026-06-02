const HIGHLEVEL_API_BASE_URL = process.env.FULL_PROOF_HIGHLEVEL_API_BASE_URL || "https://services.leadconnectorhq.com";
const HIGHLEVEL_API_VERSION = process.env.FULL_PROOF_HIGHLEVEL_API_VERSION || "2021-07-28";

function env(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : "") || "";
}

function highLevelConfig() {
  return {
    accessToken: env("FULL_PROOF_HIGHLEVEL_ACCESS_TOKEN", "HIGHLEVEL_ACCESS_TOKEN").trim(),
    locationId: env("FULL_PROOF_HIGHLEVEL_LOCATION_ID", "HIGHLEVEL_LOCATION_ID").trim(),
    pipelineId: env("FULL_PROOF_HIGHLEVEL_EVENT_PIPELINE_ID", "HIGHLEVEL_EVENT_PIPELINE_ID").trim(),
    stageId: env("FULL_PROOF_HIGHLEVEL_EVENT_STAGE_ID", "HIGHLEVEL_EVENT_STAGE_ID").trim(),
    assignedTo: env("FULL_PROOF_HIGHLEVEL_ASSIGNED_TO", "HIGHLEVEL_ASSIGNED_TO").trim(),
  };
}

function selectedInterests(data) {
  if (Array.isArray(data.interest)) return data.interest.filter(Boolean);
  if (data.interest) return [data.interest];
  return [];
}

function splitName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function truthy(value) {
  return ["1", "true", "yes", "y", "on"].includes(String(value || "").trim().toLowerCase());
}

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
  );
}

function leadSummary(data) {
  return [
    `Event date: ${data.event_date || "not provided"}`,
    `Service window: ${data.service_window || "not provided"}`,
    `Location / venue: ${data.location || "not provided"}`,
    `Guest count: ${data.guest_count || "not provided"} (${data.guest_count_band || "no band"})`,
    `Event type: ${data.event_type || "not provided"}`,
    `Menu path: ${data.menu_path || "not provided"}`,
    `Package choice: ${data.package_choice || "not provided"}`,
    `Bar selection: ${data.bar_selection || "not provided"}`,
    `Booking intent: ${data.booking_intent || "not provided"}`,
    `Instant upgrades: ${selectedInterests(data).join(", ") || "none"}`,
    `Extra signature cocktails: ${data.extra_signature_cocktails || "0"}`,
    `Extra bartender hours: ${data.extra_bartender_hours || "0"}`,
    `Premium notes: ${data.premium_notes || "none"}`,
    `Notes: ${data.notes || "none"}`,
    `Lead source: ${data.lead_source || "Website"} / ${data.lead_source_detail || "not provided"} / ${data.lead_source_notes || "none"}`,
    `Preferred contact: ${data.contact_preference || "not provided"}`,
    `SMS consent: ${data.sms_consent ? "Yes" : "No"}`,
    `Instant-book status: ${instantBookStatus(data)}`,
  ].join("\n");
}

function instantBookStatus(data) {
  const guestBand = String(data.guest_count_band || "");
  const barSelection = String(data.bar_selection || "");
  const interests = selectedInterests(data);
  const premiumSelected = interests.length > 0 || Number(data.extra_signature_cocktails || 0) > 0;

  if (guestBand === "126+") return "Manual Review";
  if ((guestBand === "41-75" || guestBand === "76-125") && barSelection !== "elite") return "Manual Review";
  if (premiumSelected && barSelection === "none") return "Manual Review";
  if (data.booking_intent === "Reserve instant-book package") return "Eligible";
  return "Not Yet Qualified";
}

async function highLevelRequest(path, payload) {
  const config = highLevelConfig();
  const response = await fetch(`${HIGHLEVEL_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Version: HIGHLEVEL_API_VERSION,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const message = body.message || body.error || text || `HighLevel request failed with ${response.status}`;
    throw new Error(message);
  }

  return body;
}

function contactIdFrom(response) {
  return response?.contact?.id || response?.id || response?.contactId || "";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const config = highLevelConfig();
  if (!config.accessToken || !config.locationId) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configured: false, message: "HighLevel sync is not configured." }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  const { firstName, lastName } = splitName(data.name);
  const tags = [
    "website-booking-inquiry",
    "new-lead",
    truthy(data.sms_consent) ? "sms-consent-yes" : "sms-consent-no",
    data.booking_intent === "Reserve instant-book package" ? "date-hold-intent" : "",
  ].filter(Boolean);

  try {
    const contact = await highLevelRequest("/contacts/upsert", compact({
      locationId: config.locationId,
      firstName,
      lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.lead_source_detail || data.lead_source || "Website",
      tags,
    }));

    const contactId = contactIdFrom(contact);
    if (!contactId || !config.pipelineId || !config.stageId) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configured: true,
          contactSynced: Boolean(contactId),
          opportunitySynced: false,
          reason: contactId ? "Missing event pipeline or stage env vars." : "HighLevel did not return a contact id.",
        }),
      };
    }

    const opportunityName = [
      data.name || "Website lead",
      data.event_date,
      data.location,
      data.guest_count ? `${data.guest_count} guests` : "",
    ].filter(Boolean).join(" | ");

    const opportunity = await highLevelRequest("/opportunities/upsert", compact({
      locationId: config.locationId,
      contactId,
      pipelineId: config.pipelineId,
      stageId: config.stageId,
      assignedTo: config.assignedTo,
      name: opportunityName,
      status: "open",
      source: data.lead_source_detail || data.lead_source || "Website",
      notes: leadSummary(data),
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        configured: true,
        contactSynced: true,
        opportunitySynced: true,
        contactId,
        opportunityId: opportunity?.opportunity?.id || opportunity?.id || "",
      }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "HighLevel sync failed." }),
    };
  }
};
