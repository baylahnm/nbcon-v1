import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('Checkout session completed:', session.id)
  
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!customerId || !subscriptionId) {
    console.error('Missing customer ID or subscription ID in checkout session')
    return
  }

  // Update user's Stripe customer ID and subscription status
  const { error } = await supabase
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after checkout:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription created:', subscription.id)
  
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!customerId || !priceId) {
    console.error('Missing customer ID or price ID in subscription')
    return
  }

  // Map price ID to plan
  const planMapping: Record<string, string> = {
    'price_client_monthly_45': 'client_monthly_45',
    'price_engineer_monthly_60': 'engineer_monthly_60',
    'price_enterprise_monthly_120': 'enterprise_monthly_120',
    'price_admin_free': 'admin_free'
  }

  const plan = planMapping[priceId] || 'free'

  // Update user's subscription information
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after subscription creation:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription updated:', subscription.id)
  
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id

  if (!customerId || !priceId) {
    console.error('Missing customer ID or price ID in subscription update')
    return
  }

  // Map price ID to plan
  const planMapping: Record<string, string> = {
    'price_client_monthly_45': 'client_monthly_45',
    'price_engineer_monthly_60': 'engineer_monthly_60',
    'price_enterprise_monthly_120': 'enterprise_monthly_120',
    'price_admin_free': 'admin_free'
  }

  const plan = planMapping[priceId] || 'free'

  // Update user's subscription information
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after subscription update:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription deleted:', subscription.id)
  
  const customerId = subscription.customer as string

  if (!customerId) {
    console.error('Missing customer ID in subscription deletion')
    return
  }

  // Update user's subscription status to canceled
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after subscription deletion:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  const customerId = invoice.customer as string

  if (!customerId) {
    console.error('Missing customer ID in invoice payment')
    return
  }

  // Update user's subscription status to active
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after successful payment:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Invoice payment failed:', invoice.id)
  
  const customerId = invoice.customer as string

  if (!customerId) {
    console.error('Missing customer ID in failed invoice payment')
    return
  }

  // Update user's subscription status to past_due
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating profile after failed payment:', error)
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  console.log('Trial will end:', subscription.id)
  
  const customerId = subscription.customer as string

  if (!customerId) {
    console.error('Missing customer ID in trial end notification')
    return
  }

  // You might want to send a notification to the user about their trial ending
  // This could involve sending an email or updating a notification in the database
  
  const trialEndDate = new Date(subscription.trial_end! * 1000)
  console.log(`Trial ending for customer ${customerId} on ${trialEndDate.toISOString()}`)
}
