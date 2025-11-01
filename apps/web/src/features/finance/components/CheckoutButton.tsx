import { useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

export function CheckoutButton({ priceLookupKey }: { priceLookupKey: string }) {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!stripe) return;
    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookup_key: priceLookupKey }),
      });
      const { id: sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={loading} onClick={handleCheckout} data-testid="checkout-button">
      {loading ? "Loading..." : "Upgrade"}
    </button>
  );
}
