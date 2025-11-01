import Stripe from "stripe";

export function createStripeClient(): Stripe | null {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" });
}

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    const stripe = createStripeClient();
    if (!stripe) return null;
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return null;
  }
}
