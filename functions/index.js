const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Stripe init
  const stripe = require("stripe")(functions.config().stripe.secret_key);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "https://localhost:5500/success",
    cancel_url: "https://localhost:5500/cancel",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: (100) * 100, // 10000 = 100 USD
          product_data: {
            name: "New camera",
          },
        },
      },
    ],
  });

  return {
    url: session.url,
  };
});
