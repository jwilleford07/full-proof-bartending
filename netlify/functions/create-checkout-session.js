const Stripe = require("stripe");

const packages = {
  "Launch Special Basic": {
    name: "Launch Special Basic - 50% date hold",
    totalAmount: 69900,
    founderEligible: true,
    description: "50% date-hold deposit for Full Proof Bartending Launch Special Basic service.",
  },
  "Launch Special Cups + Garnishes": {
    name: "Launch Special with cups and garnishes - 50% date hold",
    totalAmount: 79900,
    founderEligible: false,
    description: "50% date-hold deposit for Full Proof Bartending Launch Special with cups and garnishes.",
  },
};

const FOUNDER_PROMO_CODE = "FOUNDER";
const FOUNDER_DISCOUNT_AMOUNT = 10000;

function normalizedPromoCode(data) {
  return String(data.promo_code || "").trim().toUpperCase();
}

function packageWithPromo(selectedPackage, data) {
  const promoCode = normalizedPromoCode(data);
  const promoApplied = promoCode === FOUNDER_PROMO_CODE && selectedPackage.founderEligible;
  const totalAmount = Math.max(0, selectedPackage.totalAmount - (promoApplied ? FOUNDER_DISCOUNT_AMOUNT : 0));

  return {
    ...selectedPackage,
    totalAmount,
    amount: Math.round(totalAmount / 2),
    description: promoApplied
      ? `${selectedPackage.description} FOUNDER launch promo applied to one of the first 10 Basic bookings.`
      : selectedPackage.description,
    promo_applied: promoApplied ? FOUNDER_PROMO_CODE : "",
    founder_offer: promoApplied ? "First 10 Basic bookings only. $599 launch price with future rate lock." : "",
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
    event_type: data.event_type,
    package_choice: data.package_choice,
    package_total: checkoutPackage.totalAmount ? `$${(checkoutPackage.totalAmount / 100).toFixed(2)}` : "",
    deposit_amount: checkoutPackage.amount ? `$${(checkoutPackage.amount / 100).toFixed(2)}` : "",
    promo_code: normalizedPromoCode(data),
    promo_applied: checkoutPackage.promo_applied,
    founder_offer: checkoutPackage.founder_offer,
    booking_intent: data.booking_intent,
    interests: Array.isArray(data.interest) ? data.interest.join(", ") : data.interest,
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

  const email = String(data.email || "").trim();
  if (!email || !data.event_date || !data.service_window || !data.location || !data.guest_count) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required event details." }),
    };
  }

  const origin = event.headers.origin || process.env.URL || "https://fullproofbartending.com";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkoutPackage = packageWithPromo(selectedPackage, data);

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
