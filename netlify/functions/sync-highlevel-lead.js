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
    createOwnerTasks: !["0", "false", "no", "off"].includes(
      env("FULL_PROOF_HIGHLEVEL_CREATE_OWNER_TASKS", "HIGHLEVEL_CREATE_OWNER_TASKS").trim().toLowerCase()
    ),
    customFieldIds: parseJsonMapping(
      env("FULL_PROOF_HIGHLEVEL_EVENT_CUSTOM_FIELD_IDS", "HIGHLEVEL_EVENT_CUSTOM_FIELD_IDS")
    ),
  };
}

function parseJsonMapping(raw = "") {
  if (!String(raw).trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => String(value || "").trim())
    );
  } catch {
    return {};
  }
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

function ownerTaskBody(data, opportunityId = "") {
  return [
    "Confirm event fit and decide the next pipeline move.",
    "",
    "Checklist:",
    "- Event date, city/venue, guest count, event type, and service window",
    "- Alcohol plan, GoBar interest, menu path, and preferred contact method",
    "- Whether this is instant-book eligible, manual review, or missing info",
    "- If eligible, send the simplest package recommendation and date-hold next step",
    "- If review is needed, identify the risk before quoting",
    "",
    opportunityId ? `Opportunity ID: ${opportunityId}` : "",
    "",
    leadSummary(data),
  ].filter((line) => line !== "").join("\n");
}

function sameDayDueDate() {
  return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
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

function guestCountBandValue(value = "") {
  if (value === "0-40") return "Up to 40";
  return value;
}

function barSelectionValue(value = "") {
  if (value === "none") return "None";
  if (value === "pro") return "GoBar Pro";
  if (value === "elite") return "GoBar Elite";
  return value;
}

function packageRecommendationValue(value = "") {
  if (!value || value === "Not sure yet") return "";
  if (value.includes("3 hours")) return "Base Bartending - 3 hours";
  if (value.includes("4 hours")) return "Base Bartending - 4 hours";
  return value;
}

function buildEventCustomFields(data, fieldIds = {}) {
  const fieldValueMap = {
    lead_source: data.lead_source || "Website",
    lead_source_detail: data.lead_source_detail || data.lead_source || "Website",
    best_contact_method: data.contact_preference,
    event_type: data.event_type,
    event_date: data.event_date,
    venue: data.location,
    guest_count: data.guest_count,
    guest_count_band: guestCountBandValue(data.guest_count_band),
    service_hours: data.service_window,
    event_time_window: data.service_window,
    menu_path: data.menu_path,
    gobar_selection: barSelectionValue(data.bar_selection),
    addon_interest: selectedInterests(data).join(", "),
    instant_book_status: instantBookStatus(data),
    package_recommendation: packageRecommendationValue(data.package_choice),
    quote_status: "Not Sent",
    contract_status: "Not Sent",
    deposit_status: "Not Sent",
    review_status: "Not Requested",
    proof_status: "Not Requested",
  };

  return Object.entries(fieldIds)
    .map(([key, id]) => ({ id, field_value: fieldValueMap[key] }))
    .filter((field) => field.id && field.field_value !== undefined && field.field_value !== null && String(field.field_value).trim() !== "");
}

async function highLevelRequest(path, payload, method = "POST") {
  const config = highLevelConfig();
  const response = await fetch(`${HIGHLEVEL_API_BASE_URL}${path}`, {
    method,
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

function opportunityIdFrom(response) {
  return response?.opportunity?.id || response?.id || response?.opportunityId || "";
}

async function createOwnerTask(contactId, data, opportunityId = "") {
  const config = highLevelConfig();
  if (!config.createOwnerTasks || !contactId) {
    return { skipped: true, reason: config.createOwnerTasks ? "Missing contact id." : "Owner task creation disabled." };
  }

  return highLevelRequest(`/contacts/${encodeURIComponent(contactId)}/tasks`, compact({
    title: "Qualify event fit",
    body: ownerTaskBody(data, opportunityId),
    dueDate: sameDayDueDate(),
    completed: false,
    assignedTo: config.assignedTo,
  }));
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
    const eventCustomFields = buildEventCustomFields(data, config.customFieldIds);

    const contact = await highLevelRequest("/contacts/upsert", compact({
      locationId: config.locationId,
      firstName,
      lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.lead_source_detail || data.lead_source || "Website",
      tags,
      customFields: eventCustomFields.length ? eventCustomFields : undefined,
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

    const opportunity = await highLevelRequest("/opportunities/", compact({
      locationId: config.locationId,
      contactId,
      pipelineId: config.pipelineId,
      pipelineStageId: config.stageId,
      assignedTo: config.assignedTo,
      name: opportunityName,
      status: "open",
      customFields: eventCustomFields.length ? eventCustomFields : undefined,
    }));
    const opportunityId = opportunityIdFrom(opportunity);

    let taskResult = null;
    let taskError = "";
    try {
      taskResult = await createOwnerTask(contactId, data, opportunityId);
    } catch (error) {
      taskError = error.message || "HighLevel task sync failed.";
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        configured: true,
        contactSynced: true,
        opportunitySynced: true,
        taskSynced: Boolean(taskResult?.task?.id || taskResult?.id || taskResult?.taskId),
        taskId: taskResult?.task?.id || taskResult?.id || taskResult?.taskId || "",
        taskError,
        contactId,
        opportunityId,
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
