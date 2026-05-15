const Stripe = require("stripe");

const packages = {
  "Launch Standard - 3 hours - 50% deposit request": {
    name: "Launch Standard - 3 hour date hold",
    amount: 37450,
    description: "50% date-hold deposit for Full Proof Bartending Launch Standard service.",
  },
  "Launch Standard - 4 hours - 50% deposit request": {
    name: "Launch Standard - 4 hour date hold",
    amount: 44950,
    description: "50% date-hold deposit for Full Proof Bartending Launch Standard service.",
  },
};

function metadataFrom(data) {
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
    booking_intent: data.booking_intent,
    payment_timing: data.payment_timing,
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
            },
            unit_amount: selectedPackage.amount,
          },
          quantity: 1,
        },
      ],
      metadata: metadataFrom(data),
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
