// Stripe configuration for nbcon
export const STRIPE_CONFIG = {
  // These should be set in your environment variables
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  
  // Currency and region settings
  currency: 'SAR',
  country: 'SA',
  
  // Stripe API version
  apiVersion: '2023-10-16',
  
  // Payment method types we accept
  paymentMethodTypes: ['card'],
  
  // Billing address collection
  billingAddressCollection: 'required',
  
  // Tax settings for Saudi Arabia
  automaticTax: {
    enabled: true,
  },
};

// Stripe Product IDs - These need to be created in your Stripe dashboard
export const STRIPE_PRODUCTS = {
  client_monthly_45: {
    productId: 'prod_client_monthly_45', // Replace with actual Stripe product ID
    priceId: 'price_client_monthly_45',  // Replace with actual Stripe price ID
    name: 'Client Plan',
    amount: 4500, // 45 SAR in halalas (cents)
    interval: 'month',
  },
  engineer_monthly_60: {
    productId: 'prod_engineer_monthly_60',
    priceId: 'price_engineer_monthly_60',
    name: 'Engineer Plan',
    amount: 6000, // 60 SAR in halalas
    interval: 'month',
  },
  enterprise_monthly_120: {
    productId: 'prod_enterprise_monthly_120',
    priceId: 'price_enterprise_monthly_120',
    name: 'Enterprise Plan',
    amount: 12000, // 120 SAR in halalas
    interval: 'month',
  },
  admin_free: {
    productId: 'prod_admin_free',
    priceId: 'price_admin_free',
    name: 'Admin Plan',
    amount: 0,
    interval: 'month',
  },
};

// Error messages for common Stripe errors
export const STRIPE_ERROR_MESSAGES = {
  card_declined: 'Your card was declined. Please try a different payment method.',
  expired_card: 'Your card has expired. Please update your payment method.',
  insufficient_funds: 'Your card has insufficient funds. Please try a different card.',
  incorrect_cvc: 'Your card\'s security code is incorrect. Please check and try again.',
  processing_error: 'An error occurred while processing your card. Please try again.',
  generic_error: 'Something went wrong. Please try again or contact support.',
};

// Subscription status mapping
export const SUBSCRIPTION_STATUS = {
  active: 'active',
  trialing: 'trialing',
  past_due: 'past_due',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'incomplete_expired',
  unpaid: 'unpaid',
} as const;

export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUS;
