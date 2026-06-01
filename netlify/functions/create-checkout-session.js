const Stripe = require("stripe");

const packages = {
  "Base Bartending - 3 hours": {
    name: "Base Bartending - 3 hours - 50% date hold",
    totalAmount: 59900,
    description: "50% date-hold deposit for Full Proof Bartending base service: 3 hours, one bartender, planning, professional tools, setup/cleanup, shopping guidance, included bar supplies, and choose-later menu planning.",
  },
  "Base Bartending - 4 hours": {
    name: "Base Bartending - 4 hours - 50% date hold",
    totalAmount: 69900,
    description: "50% date-hold deposit for Full Proof Bartending base service: 4 hours, one bartender, planning, professional tools, setup/cleanup, shopping guidance, included bar supplies, and choose-later menu planning.",
  },
};

const barOptions = {
  none: { label: "No Full Proof bar", amount: 0 },
  pro: { label: "Full Proof Pro Bar", amount: 10000 },
  elite: { label: "Full Proof Elite Bar", amount: 20000 },
};

const directAddOns = {
  "Espresso martini service": { label: "Espresso martinis", amount: 10000, requiresBarRental: true },
  "ORI ice press service": { label: "ORI ice press", amount: 20000, requiresBarRental: true },
  "Smoke package": { label: "Smoke package", amount: 10000, requiresBarRental: true },
  "Smoke + bubble package": { label: "Smoke + bubble package", amount: 15000, requiresBarRental: true },
};

const quantityAddOns = {
  extra_signature_cocktails: { label: "Extra signature cocktail", amount: 10000 },
  extra_bartender_hours: { label: "Extra bartender hour", amount: 10000 },
};

const PRODUCTION_ORIGIN = "https://fullproofbartending.com";
const LOCAL_ORIGIN_PATTERN = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

function checkoutOriginFrom(headers = {}) {
  const requestOrigin = headers.origin || headers.Origin || "";
  const allowedOrigins = new Set([PRODUCTION_ORIGIN, process.env.URL].filter(Boolean));

  if (allowedOrigins.has(requestOrigin) || LOCAL_ORIGIN_PATTERN.test(requestOrigin)) {
    return requestOrigin;
  }

  return PRODUCTION_ORIGIN;
}

function selectedInterests(data) {
  if (Array.isArray(data.interest)) return data.interest;
  if (data.interest) return [data.interest];
  return [];
}

function hasPremiumAddOnWithoutBarRental(data) {
  const barSelection = String(data.bar_selection || "");
  if (barSelection && barSelection !== "none") return false;
  return selectedInterests(data).some((interest) => directAddOns[String(interest)]?.requiresBarRental);
}

function hasConflictingSmokePackages(data) {
  const interests = selectedInterests(data).map(String);
  return interests.includes("Smoke package") && interests.includes("Smoke + bubble package");
}

function selectedDirectAddOns(data) {
  return selectedInterests(data)
    .map((interest) => directAddOns[String(interest)])
    .filter(Boolean);
}

function selectedQuantityAddOns(data) {
  return Object.entries(quantityAddOns)
    .map(([field, option]) => {
      const quantity = Math.max(0, Number.parseInt(data[field], 10) || 0);
      return quantity ? { ...option, quantity } : null;
    })
    .filter(Boolean);
}

function directAddOnSummary(data) {
  const fixedAddOns = selectedDirectAddOns(data).map((option) => option.label);
  const countedAddOns = selectedQuantityAddOns(data).map((option) => `${option.quantity} ${option.label}${option.quantity === 1 ? "" : "s"}`);
  return [...fixedAddOns, ...countedAddOns].join(", ");
}

function directAddOnAmount(data) {
  const fixedAmount = selectedDirectAddOns(data).reduce((total, option) => total + option.amount, 0);
  const quantityAmount = selectedQuantityAddOns(data).reduce((total, option) => total + option.quantity * option.amount, 0);
  return fixedAmount + quantityAmount;
}

function packageWithSelections(selectedPackage, data) {
  const barSelection = String(data.bar_selection || "none");
  const bar = barOptions[barSelection] || barOptions.none;
  const addOnAmount = directAddOnAmount(data);
  const directAddons = directAddOnSummary(data);
  const totalAmount = selectedPackage.totalAmount + bar.amount + addOnAmount;

  return {
    ...selectedPackage,
    totalAmount,
    amount: Math.round(totalAmount / 2),
    name: `${selectedPackage.name}${bar.amount ? ` + ${bar.label}` : ""}${directAddons ? " + instant upgrades" : ""}`,
    description: [
      selectedPackage.description,
      bar.amount ? `${bar.label} rental included in this date hold.` : "No Full Proof bar selected for this date hold.",
      directAddons ? `Instant-book upgrades included: ${directAddons}.` : "",
    ].filter(Boolean).join(" "),
    bar_label: bar.label,
    direct_addons: directAddons,
  };
}

function metadataFrom(data, checkoutPackage) {
  const fields = {
    name: data.name,
    phone: data.phone,
    contact_preference: data.contact_preference,
    event_date: data.event_date,
    service_window: data.service_window,
    location: data.location,
    guest_count: data.guest_count,
    guest_count_band: data.guest_count_band,
    event_type: data.event_type,
    menu_path: data.menu_path,
    package_choice: data.package_choice,
    bar_selection: data.bar_selection,
    bar_label: checkoutPackage.bar_label,
    package_total: checkoutPackage.totalAmount ? `$${(checkoutPackage.totalAmount / 100).toFixed(2)}` : "",
    deposit_amount: checkoutPackage.amount ? `$${(checkoutPackage.amount / 100).toFixed(2)}` : "",
    direct_addons: checkoutPackage.direct_addons,
    booking_intent: data.booking_intent,
    interests: Array.isArray(data.interest) ? data.interest.join(", ") : data.interest,
    extra_signature_cocktails: data.extra_signature_cocktails,
    extra_bartender_hours: data.extra_bartender_hours,
    premium_notes: data.premium_notes,
    notes: data.notes,
    source: data.source,
  };

  return Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => value)
      .map(([key, value]) => [key, String(value).slice(0, 500)])
  );
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Stripe is not configured yet." }),
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

  const selectedPackage = packages[data.package_choice];
  if (!selectedPackage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "This package is not available for direct deposit." }),
    };
  }

  const guestBand = String(data.guest_count_band || "");
  const barSelection = String(data.bar_selection || "");
  if (guestBand === "126+") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "126+ guests require manual review before instant booking." }),
    };
  }

  if ((guestBand === "41-75" || guestBand === "76-125") && barSelection !== "elite") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Full Proof Elite Bar is required for 41+ guests." }),
    };
  }

  if (hasPremiumAddOnWithoutBarRental(data)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Instant-book craft upgrades require Full Proof Pro Bar or Full Proof Elite Bar." }),
    };
  }

  if (hasConflictingSmokePackages(data)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Choose either the smoke package or the smoke + bubble package, not both." }),
    };
  }

  const email = String(data.email || "").trim();
  if (!email || !data.event_date || !data.location || !data.guest_count) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required event details." }),
    };
  }

  const origin = checkoutOriginFrom(event.headers);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkoutPackage = packageWithSelections(selectedPackage, data);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: checkoutPackage.name,
              description: checkoutPackage.description,
            },
            unit_amount: checkoutPackage.amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        description: checkoutPackage.name,
      },
      metadata: metadataFrom(data, checkoutPackage),
      success_url: `${origin}/success.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#event-inquiry`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Unable to create Stripe Checkout session." }),
    };
  }
};
