import { Elements } from "@stripe/react-stripe-js";
import { ReactNode } from "react";
import { getStripeClient } from "../shared/services/stripe/client";

const stripePromise = getStripeClient();

export function StripeProvider({ children }: { children: ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
