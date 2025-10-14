// TODO: Install Stripe packages first: pnpm add @stripe/stripe-js stripe
// import { loadStripe, Stripe } from '@stripe/stripe-js';
type Stripe = any;
const loadStripe = async (key: string): Promise<Stripe | null> => {
  console.warn('[stripe-service] Stripe not installed yet - install @stripe/stripe-js package');
  return null;
};
import { STRIPE_CONFIG, STRIPE_PRODUCTS, STRIPE_ERROR_MESSAGES } from './stripe-config';
import { supabase } from '@/shared/supabase/client';

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Subscription data structure
export interface Subscription {
  id: string;
  customerId: string;
  priceId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

// Payment method data structure
export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

// Create a customer in Stripe
export async function createCustomer(userId: string, email: string, name: string) {
  try {
    const response = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create customer');
    }

    const { customer } = await response.json();
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

// Create a checkout session
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const sessionId = await createCheckoutSession(priceId, userId, successUrl, cancelUrl);

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

// Create a billing portal session
export async function createBillingPortalSession(userId: string, returnUrl: string) {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Get customer's subscriptions
export async function getCustomerSubscriptions(userId: string): Promise<Subscription[]> {
  try {
    // TODO: Add stripe_customer_id column to profiles table first
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const stripeCustomerId = (profile as any)?.stripe_customer_id;
    if (!stripeCustomerId) {
      return [];
    }

    const response = await fetch(`/api/stripe/subscriptions/${stripeCustomerId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    const { subscriptions } = await response.json();
    return subscriptions;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        cancelAtPeriodEnd,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
  prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'create_prorations'
) {
  try {
    const response = await fetch('/api/stripe/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newPriceId,
        prorationBehavior,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

// Get payment methods
export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    // TODO: Add stripe_customer_id column to profiles table first
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const stripeCustomerId = (profile as any)?.stripe_customer_id;
    if (!stripeCustomerId) {
      return [];
    }

    const response = await fetch(`/api/stripe/payment-methods/${stripeCustomerId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    const { paymentMethods } = await response.json();
    return paymentMethods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Handle Stripe errors
export function getStripeErrorMessage(error: any): string {
  if (error.type === 'card_error' || error.type === 'validation_error') {
    return STRIPE_ERROR_MESSAGES[error.code as keyof typeof STRIPE_ERROR_MESSAGES] || 
           error.message || 
           STRIPE_ERROR_MESSAGES.generic_error;
  }
  
  return error.message || STRIPE_ERROR_MESSAGES.generic_error;
}

// Get price ID for a plan
export function getPriceIdForPlan(plan: string): string {
  return STRIPE_PRODUCTS[plan as keyof typeof STRIPE_PRODUCTS]?.priceId || '';
}

// Check if a plan requires payment
export function isPaidPlan(plan: string): boolean {
  const product = STRIPE_PRODUCTS[plan as keyof typeof STRIPE_PRODUCTS];
  return product ? product.amount > 0 : false;
}
