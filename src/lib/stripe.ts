import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Using the stable 2024 version to ensure compatibility
  apiVersion: "2024-12-18.acacia" as any, 
});