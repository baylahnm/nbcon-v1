import { ReactNode } from "react";

const order = ["free", "basic", "pro", "enterprise"] as const;
export type Tier = typeof order[number];

export function FeatureGate({ requiredTier, currentTier = "free", children }: { requiredTier?: Tier; currentTier?: Tier; children: ReactNode }) {
  if (!requiredTier) return <>{children}</>; 
  const allowed = order.indexOf(currentTier) >= order.indexOf(requiredTier);
  if (!allowed) return <div data-testid="feature-locked">Upgrade to unlock</div>;
  return <>{children}</>;
}
