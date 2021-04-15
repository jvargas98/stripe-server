/* eslint-disable no-console */
const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const cors = require("cors");

app.use(express.static("."));
app.use(express.json());
app.use(cors());

const calculateOrderAmount = (items) => {
  let amount = 0;

  items.forEach((item) => {
    amount += item.price;
  });

  return amount * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.listen(4242, () => console.log("Node server listening on port 4242!"));
