/**
 * Stripe Webhook Handler - Phase B Integration
 * 
 * Syncs subscription tiers from Stripe events to profiles.subscription_tier column.
 * 
 * @version 2.0.0
 * @updated February 2, 2025 (Phase B)
 * @see docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
 * @see docs/nbcon-new-plan/2 14- 💵 Stripe & Subscription Management System (Section 14)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================================
// TIER TYPE DEFINITIONS
// ============================================================================

type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise'

// ============================================================================
// STRIPE PRICE ID TO TIER MAPPING
// ============================================================================

/**
 * Map Stripe price IDs to subscription tiers
 * 
 * Supports environment variables for dynamic configuration:
 * - STRIPE_PRICE_BASIC
 * - STRIPE_PRICE_PRO
 * - STRIPE_PRICE_ENTERPRISE
 * 
 * Falls back to hardcoded mappings for backward compatibility.
 */
function getPriceIdToTierMapping(): Record<string, SubscriptionTier> {
  const mapping: Record<string, SubscriptionTier> = {}
  
  // Read from environment variables (preferred)
  const priceBasic = Deno.env.get('STRIPE_PRICE_BASIC')
  const pricePro = Deno.env.get('STRIPE_PRICE_PRO')
  const priceEnterprise = Deno.env.get('STRIPE_PRICE_ENTERPRISE')
  
  if (priceBasic) mapping[priceBasic] = 'basic'
  if (pricePro) mapping[pricePro] = 'pro'
  if (priceEnterprise) mapping[priceEnterprise] = 'enterprise'
  
  // Legacy price IDs (for backward compatibility during migration)
  mapping['price_client_monthly_45'] = 'basic' // Legacy client plan → basic
  mapping['price_engineer_monthly_60'] = 'pro' // Legacy engineer plan → pro
  mapping['price_enterprise_monthly_120'] = 'enterprise' // Legacy enterprise plan → enterprise
  mapping['price_admin_free'] = 'free' // Legacy admin plan → free
  
  // Additional fallback mappings (common Stripe naming patterns)
  // Add any other price IDs that might exist in your Stripe account
  mapping['price_basic_monthly'] = 'basic'
  mapping['price_pro_monthly'] = 'pro'
  mapping['price_enterprise_monthly'] = 'enterprise'
  
  return mapping
}

/**
 * Map Stripe price ID to subscription tier
 * 
 * @param priceId - Stripe price ID from subscription
 * @returns Subscription tier or 'free' if not found
 */
function mapPriceIdToTier(priceId: string | undefined): SubscriptionTier {
  if (!priceId) {
    console.warn('[Webhook] No price ID provided, defaulting to free tier')
    return 'free'
  }
  
  const mapping = getPriceIdToTierMapping()
  const tier = mapping[priceId]
  
  if (!tier) {
    console.warn(`[Webhook] Unknown price ID: ${priceId}, defaulting to free tier`)
    return 'free'
  }
  
  console.log(`[Webhook] Mapped price ID ${priceId} to tier: ${tier}`)
  return tier
}

// ============================================================================
// RETRY UTILITIES
// ============================================================================

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 * 
 * @param fn - Function to retry
 * @param retries - Number of retries remaining
 * @param delay - Current delay in milliseconds
 * @returns Result of function or throws error after all retries
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries,
  delay: number = RETRY_CONFIG.initialDelay
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      console.error('[Webhook] Max retries exceeded, throwing error')
      throw error
    }
    
    const nextDelay = Math.min(
      delay * RETRY_CONFIG.backoffMultiplier,
      RETRY_CONFIG.maxDelay
    )
    
    console.warn(`[Webhook] Retry attempt (${RETRY_CONFIG.maxRetries - retries + 1}/${RETRY_CONFIG.maxRetries}) after ${delay}ms delay`)
    await sleep(delay)
    
    return retryWithBackoff(fn, retries - 1, nextDelay)
  }
}

// ============================================================================
// TIER UPDATE HELPER
// ============================================================================

/**
 * Update subscription tier in profiles table with retry logic
 * 
 * Phase B: Updates profiles.subscription_tier column directly.
 * This replaces the old subscription_plan field logic.
 * 
 * @param supabase - Supabase client
 * @param customerId - Stripe customer ID
 * @param tier - Subscription tier to set
 * @param subscriptionId - Optional Stripe subscription ID
 * @param subscriptionStatus - Optional subscription status
 * @returns true if update succeeded, false otherwise
 */
async function updateSubscriptionTier(
  supabase: any,
  customerId: string,
  tier: SubscriptionTier,
  subscriptionId?: string,
  subscriptionStatus?: string
): Promise<boolean> {
  // Validate tier
  const validTiers: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise']
  if (!validTiers.includes(tier)) {
    console.error(`[Webhook] Invalid tier: ${tier}, skipping update`)
    return false
  }
  
  const updateData: any = {
    subscription_tier: tier,
    updated_at: new Date().toISOString(),
  }
  
  // Optional fields
  if (subscriptionId) {
    updateData.stripe_subscription_id = subscriptionId
  }
  
  if (subscriptionStatus) {
    updateData.subscription_status = subscriptionStatus
  }
  
  try {
    const result = await retryWithBackoff(async () => {
      const { data, error, count } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('stripe_customer_id', customerId)
        .select('user_id, subscription_tier')
      
      if (error) {
        throw new Error(`Supabase update error: ${error.message}`)
      }
      
      if (!data || data.length === 0) {
        throw new Error(`No profile found for customer ID: ${customerId}`)
      }
      
      return { data, count }
    })
    
    console.log(`[Webhook] Successfully updated tier to ${tier} for customer ${customerId}`, {
      userId: result.data[0]?.user_id,
      newTier: result.data[0]?.subscription_tier,
      subscriptionId,
    })
    
    return true
  } catch (error) {
    console.error(`[Webhook] Failed to update subscription tier after retries:`, {
      customerId,
      tier,
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret')
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

/**
 * Handle checkout.session.completed event
 * 
 * Phase B: Syncs subscription tier to profiles.subscription_tier after successful checkout.
 * 
 * @param session - Stripe checkout session
 * @param supabase - Supabase client
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('[Webhook] Checkout session completed:', {
    sessionId: session.id,
    customerId: session.customer,
    subscriptionId: session.subscription,
    mode: session.mode,
  })
  
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in checkout session')
    return
  }

  // If subscription was created, we'll handle it via customer.subscription.created event
  // But we still need to update the customer ID and potentially the tier if available
  if (subscriptionId) {
    try {
      // Fetch subscription to get price ID and determine tier
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2023-10-16',
      })
      
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      const tier = mapPriceIdToTier(priceId)
      
      console.log('[Webhook] Checkout completed with subscription, syncing tier:', {
        subscriptionId,
        priceId,
        tier,
        status: subscription.status,
      })
      
      // Update tier and customer ID
      await updateSubscriptionTier(
        supabase,
        customerId,
        tier,
        subscriptionId,
        subscription.status
      )
      
      // Also ensure stripe_customer_id is set
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('stripe_customer_id', customerId)
      
    } catch (error) {
      console.error('[Webhook] Error fetching subscription in checkout handler:', error)
      // Still update customer ID even if subscription fetch fails
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('stripe_customer_id', customerId)
    }
  } else {
    // One-time payment or setup, just update customer ID
    console.log('[Webhook] Checkout completed without subscription (one-time payment)')
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('stripe_customer_id', customerId)
  }
}

/**
 * Handle customer.subscription.created event
 * 
 * Phase B: Syncs subscription tier to profiles.subscription_tier when subscription is created.
 * 
 * @param subscription - Stripe subscription object
 * @param supabase - Supabase client
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('[Webhook] Subscription created:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
  })
  
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in subscription created event')
    return
  }

  if (!priceId) {
    console.error('[Webhook] Missing price ID in subscription created event')
    return
  }

  // Map price ID to subscription tier (Phase B)
  const tier = mapPriceIdToTier(priceId)

  console.log('[Webhook] Syncing subscription tier on creation:', {
    subscriptionId: subscription.id,
    priceId,
    tier,
    status: subscription.status,
  })

  // Update subscription tier with retry logic
  const success = await updateSubscriptionTier(
    supabase,
    customerId,
    tier,
    subscription.id,
    subscription.status
  )

  if (!success) {
    console.error('[Webhook] Failed to update subscription tier on creation')
    // Log to subscription_events table if it exists (for audit trail)
    try {
      await supabase.from('subscription_events').insert({
        event_type: 'subscription.created',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        tier: tier,
        status: subscription.status,
        error: 'Failed to update profile.subscription_tier',
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('[Webhook] Could not log to subscription_events table:', err)
    }
  }
}

/**
 * Handle customer.subscription.updated event
 * 
 * Phase B: Syncs subscription tier to profiles.subscription_tier when subscription changes
 * (upgrade, downgrade, status change, etc.).
 * 
 * @param subscription - Stripe subscription object
 * @param supabase - Supabase client
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('[Webhook] Subscription updated:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
  
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in subscription update')
    return
  }

  // Handle canceled subscriptions (revert to free tier)
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    console.log('[Webhook] Subscription canceled/unpaid, reverting to free tier')
    await updateSubscriptionTier(
      supabase,
      customerId,
      'free',
      subscription.id,
      subscription.status
    )
    return
  }

  if (!priceId) {
    console.error('[Webhook] Missing price ID in subscription update')
    return
  }

  // Map price ID to subscription tier (Phase B)
  const tier = mapPriceIdToTier(priceId)

  console.log('[Webhook] Syncing subscription tier on update:', {
    subscriptionId: subscription.id,
    priceId,
    tier,
    status: subscription.status,
    previousTier: 'unknown', // Could be fetched from DB for comparison
  })

  // Update subscription tier with retry logic
  const success = await updateSubscriptionTier(
    supabase,
    customerId,
    tier,
    subscription.id,
    subscription.status
  )

  if (!success) {
    console.error('[Webhook] Failed to update subscription tier on update')
    // Log to subscription_events table if it exists
    try {
      await supabase.from('subscription_events').insert({
        event_type: 'subscription.updated',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        tier: tier,
        status: subscription.status,
        error: 'Failed to update profile.subscription_tier',
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('[Webhook] Could not log to subscription_events table:', err)
    }
  }
}

/**
 * Handle customer.subscription.deleted event
 * 
 * Phase B: Reverts subscription tier to 'free' when subscription is deleted.
 * 
 * @param subscription - Stripe subscription object
 * @param supabase - Supabase client
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('[Webhook] Subscription deleted:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
  })
  
  const customerId = subscription.customer as string

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in subscription deletion')
    return
  }

  console.log('[Webhook] Reverting tier to free on subscription deletion')

  // Revert to free tier when subscription is deleted
  const success = await updateSubscriptionTier(
    supabase,
    customerId,
    'free',
    undefined, // No subscription ID (deleted)
    'canceled'
  )

  if (!success) {
    console.error('[Webhook] Failed to revert tier to free on subscription deletion')
    // Log to subscription_events table if it exists
    try {
      await supabase.from('subscription_events').insert({
        event_type: 'subscription.deleted',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        tier: 'free',
        status: 'canceled',
        error: 'Failed to update profile.subscription_tier',
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('[Webhook] Could not log to subscription_events table:', err)
    }
  }
}

/**
 * Handle invoice.payment_succeeded event
 * 
 * Phase B: Updates subscription status when payment succeeds.
 * Tier should already be set via subscription.updated, but we ensure status is active.
 * 
 * @param invoice - Stripe invoice object
 * @param supabase - Supabase client
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('[Webhook] Invoice payment succeeded:', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    subscriptionId: invoice.subscription,
  })
  
  const customerId = invoice.customer as string

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in invoice payment')
    return
  }

  // Update subscription status to active (tier should already be set from subscription events)
  try {
    await retryWithBackoff(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', customerId)

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`)
      }
      
      console.log('[Webhook] Successfully updated subscription status to active')
    })
  } catch (error) {
    console.error('[Webhook] Failed to update subscription status after payment:', error)
  }
}

/**
 * Handle invoice.payment_failed event
 * 
 * Phase B: Updates subscription status when payment fails.
 * Tier remains unchanged, only status updates to past_due.
 * 
 * @param invoice - Stripe invoice object
 * @param supabase - Supabase client
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('[Webhook] Invoice payment failed:', {
    invoiceId: invoice.id,
    customerId: invoice.customer,
    subscriptionId: invoice.subscription,
  })
  
  const customerId = invoice.customer as string

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in failed invoice payment')
    return
  }

  // Update subscription status to past_due (tier remains unchanged)
  try {
    await retryWithBackoff(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', customerId)

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`)
      }
      
      console.log('[Webhook] Successfully updated subscription status to past_due')
    })
  } catch (error) {
    console.error('[Webhook] Failed to update subscription status after payment failure:', error)
  }
}

/**
 * Handle customer.subscription.trial_will_end event
 * 
 * Phase B: Logs trial end notification. Tier remains unchanged until trial actually ends.
 * 
 * @param subscription - Stripe subscription object
 * @param supabase - Supabase client
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  console.log('[Webhook] Trial will end:', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  })
  
  const customerId = subscription.customer as string

  if (!customerId) {
    console.error('[Webhook] Missing customer ID in trial end notification')
    return
  }

  // Log trial end event for future notification system
  // Tier remains unchanged until trial actually ends (handled by subscription.updated)
  const trialEndDate = subscription.trial_end 
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null
  
  console.log(`[Webhook] Trial ending for customer ${customerId} on ${trialEndDate}`)
  
  // Optional: Log to subscription_events table for notification system
  try {
    await supabase.from('subscription_events').insert({
      event_type: 'trial_will_end',
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      metadata: { trial_end: trialEndDate },
      created_at: new Date().toISOString(),
    }).catch(() => {
      // Table might not exist, silently fail
    })
  } catch (err) {
    // Ignore errors if table doesn't exist
  }
}
