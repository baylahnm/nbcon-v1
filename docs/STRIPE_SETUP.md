# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for nbcon Pro's subscription management system.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Stripe Dashboard Setup

#### Create Products and Prices

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Create Product**

Create the following products:

**Client Plan (SAR 45/month)**
- Product Name: `Client Plan`
- Price: `SAR 45.00` recurring monthly
- Copy the Price ID (starts with `price_`)

**Engineer Plan (SAR 60/month)**
- Product Name: `Engineer Plan`
- Price: `SAR 60.00` recurring monthly
- Copy the Price ID (starts with `price_`)

**Enterprise Plan (SAR 120/month)**
- Product Name: `Enterprise Plan`
- Price: `SAR 120.00` recurring monthly
- Copy the Price ID (starts with `price_`)

**Admin Plan (Free)**
- Product Name: `Admin Plan`
- Price: `SAR 0.00` recurring monthly
- Copy the Price ID (starts with `price_`)

#### Update Configuration

Update `src/lib/payments/stripe-config.ts` with your actual Price IDs:

```typescript
export const STRIPE_PRODUCTS = {
  client_monthly_45: {
    productId: 'prod_your_client_product_id',
    priceId: 'price_your_client_price_id', // Replace with actual ID
    name: 'Client Plan',
    amount: 4500,
    interval: 'month',
  },
  // ... update other plans similarly
};
```

### 3. Webhook Setup

#### Create Webhook Endpoint

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`

5. Copy the webhook signing secret (starts with `whsec_`)

#### Deploy Supabase Function

Deploy the webhook handler to Supabase:

```bash
# Deploy the webhook function
supabase functions deploy stripe-webhooks
```

### 4. Database Migration

Run the database migration to add billing fields:

```bash
# Apply the migration
supabase db push
```

Or manually run the SQL from `supabase/migrations/20240101000000_add_billing_fields.sql`

### 5. API Routes Setup

Create the following API routes in your backend (Vercel, Netlify, or similar):

- `/api/stripe/create-customer` - Create Stripe customer
- `/api/stripe/create-checkout-session` - Create checkout session
- `/api/stripe/create-portal-session` - Create billing portal session
- `/api/stripe/cancel-subscription` - Cancel subscription
- `/api/stripe/update-subscription` - Update subscription
- `/api/stripe/subscriptions/[customerId]` - Get customer subscriptions
- `/api/stripe/payment-methods/[customerId]` - Get payment methods

## 🧪 Testing

### Test Cards

Use these test card numbers in development:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`
- **Insufficient funds**: `4000 0000 0000 9995`

### Test Flow

1. Start your development server
2. Navigate to `/auth/account-type`
3. Select a paid plan
4. Use test card `4242 4242 4242 4242`
5. Complete the checkout process
6. Verify subscription appears in Stripe Dashboard

## 🔧 Configuration Options

### Currency and Region

The system is configured for Saudi Arabia (SAR currency). To change:

1. Update `STRIPE_CONFIG.currency` in `stripe-config.ts`
2. Update `STRIPE_CONFIG.country` in `stripe-config.ts`
3. Update price amounts in `STRIPE_PRODUCTS`
4. Update currency in database migration

### Tax Settings

Tax collection is enabled by default. To modify:

1. Update `automaticTax.enabled` in checkout session creation
2. Configure tax settings in Stripe Dashboard
3. Update `tax_id_collection` settings

## 🚨 Security Considerations

### Webhook Security

- Always verify webhook signatures
- Use HTTPS endpoints
- Validate event data before processing
- Implement idempotency for webhook handlers

### API Security

- Use environment variables for secrets
- Implement rate limiting
- Validate user authentication
- Sanitize input data

### Data Protection

- Encrypt sensitive data
- Implement proper RLS policies
- Regular security audits
- Monitor for suspicious activity

## 📊 Monitoring and Analytics

### Key Metrics to Track

- Subscription conversion rates
- Monthly recurring revenue (MRR)
- Churn rate
- Failed payment rates
- Customer lifetime value

### Stripe Dashboard

Monitor these sections regularly:
- **Customers** - Customer growth and activity
- **Subscriptions** - Active subscriptions and churn
- **Payments** - Payment success/failure rates
- **Disputes** - Chargebacks and disputes
- **Webhooks** - Webhook delivery status

## 🆘 Troubleshooting

### Common Issues

**Webhook not receiving events**
- Check webhook endpoint URL
- Verify webhook secret
- Check function deployment status
- Review webhook logs in Stripe Dashboard

**Payment failures**
- Verify Stripe keys are correct
- Check card details
- Review Stripe Dashboard for errors
- Check network connectivity

**Subscription not updating**
- Verify webhook is configured correctly
- Check database connection
- Review function logs
- Ensure RLS policies allow updates

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=stripe:*
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)

## 🎯 Next Steps

After setup is complete:

1. Test the full payment flow
2. Set up monitoring and alerts
3. Configure production webhooks
4. Implement admin billing dashboard
5. Add analytics and reporting
6. Set up automated email notifications
