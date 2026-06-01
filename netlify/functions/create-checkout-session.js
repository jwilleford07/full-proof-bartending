const Stripe = require("stripe");

const packages = {
  "Base Bartending - 3 hours": {
    name: "Base Bartending - 3 hours - 50% date hold",
    totalAmount: 59900,
    description: "50% date-hold deposit for Full Proof Bartending base service: 3 hours, one bartender, planning, professional tools, setup/cleanup, shopping guidance, and choose-later menu planning.",
  },
  "Base Bartending - 4 hours": {
    name: "Base Bartending - 4 hours - 50% date hold",
    totalAmount: 69900,
    description: "50% date-hold deposit for Full Proof Bartending base service: 4 hours, one bartender, planning, professional tools, setup/cleanup, shopping guidance, and choose-later menu planning.",
  },
};

const goBarOptions = {
  none: { label: "No GoBar", amount: 0 },
  pro: { label: "GoBar Pro", amount: 10000 },
  elite: { label: "GoBar Elite", amount: 20000 },
};

const premiumAddOnsRequiringGoBar = new Set([
  "Clear ice upgrades",
  "Smoked cocktails or smoke bubbles",
  "Espresso martini service",
  "Custom infusions",
  "Organic California dehydrated citrus",
  "Premium garnish styling",
  "Custom menu display/signage",
  "Total Wine guidance + ice service",
]);

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

function hasPremiumAddOnWithoutGoBar(data) {
  const goBarSelection = String(data.gobar_selection || "");
  if (goBarSelection && goBarSelection !== "none") return false;
  return selectedInterests(data).some((interest) => premiumAddOnsRequiringGoBar.has(String(interest)));
}

function packageWithSelections(selectedPackage, data) {
  const goBarSelection = String(data.gobar_selection || "none");
  const goBar = goBarOptions[goBarSelection] || goBarOptions.none;
  const totalWineIceSelected = selectedInterests(data).includes("Total Wine guidance + ice service");
  const totalAmount = selectedPackage.totalAmount + goBar.amount + (totalWineIceSelected ? 10000 : 0);

  return {
    ...selectedPackage,
    totalAmount,
    amount: Math.round(totalAmount / 2),
    name: `${selectedPackage.name}${goBar.amount ? ` + ${goBar.label}` : ""}${totalWineIceSelected ? " + Total Wine/Ice Bundle" : ""}`,
    description: [
      selectedPackage.description,
      goBar.amount ? `${goBar.label} rental included in this date hold.` : "No GoBar selected for this date hold.",
      totalWineIceSelected ? "Total Wine guidance + ice service bundle included." : "",
    ].filter(Boolean).join(" "),
    gobar_label: goBar.label,
    direct_addons: totalWineIceSelected ? "Total Wine guidance + ice service" : "",
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
    gobar_selection: data.gobar_selection,
    package_total: checkoutPackage.totalAmount ? `$${(checkoutPackage.totalAmount / 100).toFixed(2)}` : "",
    deposit_amount: checkoutPackage.amount ? `$${(checkoutPackage.amount / 100).toFixed(2)}` : "",
    direct_addons: checkoutPackage.direct_addons,
    booking_intent: data.booking_intent,
    interests: Array.isArray(data.interest) ? data.interest.join(", ") : data.interest,
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
  const goBarSelection = String(data.gobar_selection || "");
  if (guestBand === "126+") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "126+ guests require manual review before instant booking." }),
    };
  }

  if ((guestBand === "41-75" || guestBand === "76-125") && goBarSelection !== "elite") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "GoBar Elite is required for 41+ guests." }),
    };
  }

  if (hasPremiumAddOnWithoutGoBar(data)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Premium upgrades require GoBar Pro or GoBar Elite." }),
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
