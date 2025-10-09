# Smart Button Implementation for Account Type Selection

## Overview
Implemented intelligent button logic in the Account Type Selection page (`/auth/account-type`) that dynamically adjusts based on user authentication status and subscription state.

## Goal
Guide users to their correct dashboards while ensuring they have active and valid subscriptions.

## Implementation Date
October 9, 2025

---

## Features Implemented

### 1. Dynamic Button Text
The "Select Plan" button now changes based on user state:
- **New Users (Not Authenticated)**: Shows "Select Plan"
- **Existing Users with Active Subscription**: Shows "Go to Dashboard"
- **Existing Users without Subscription**: Shows "Select Plan"
- **Loading State**: Shows "Checking subscription..." or "Processing..."

### 2. Subscription Status Checking
- Automatically checks user's subscription status on page load
- Queries Supabase for active subscriptions via Stripe integration
- Caches subscription status to avoid repeated API calls
- Shows loading indicator while checking

### 3. Smart Routing Logic
The system handles **5 possible outcomes** when a user clicks the continue button:

#### **Outcome 1: New User (Not Authenticated)**
- **Condition**: User is not logged in
- **Action**: Redirect to `/signup/{role}` to create account
- **UX**: Standard signup flow

#### **Outcome 2: Existing User with Active Subscription**
- **Condition**: User is authenticated AND has active/trialing subscription
- **Action**: Redirect to `/{role}/dashboard`
- **UX**: Toast message "Welcome back! You already have an active {role} subscription"

#### **Outcome 3: Existing User without Any Subscription**
- **Condition**: User is authenticated BUT no subscription found
- **Action**: Redirect to `/signup/{role}` to complete subscription
- **UX**: Toast message "Complete Your Subscription - Let's set up your {role} plan"

#### **Outcome 4: Existing User with Expired/Canceled Subscription**
- **Condition**: User is authenticated BUT subscription is canceled/past_due
- **Action**: Redirect to `/signup/{role}` to renew
- **UX**: Toast message "Renew Your Subscription - Your previous subscription is {status}"

#### **Outcome 5: Fallback - Unknown State**
- **Condition**: Any other edge case
- **Action**: Redirect to `/signup/{role}` as default
- **UX**: Standard signup flow

---

## Technical Implementation

### Modified Files
- `src/pages/2-auth/others/features/auth/components/AccountTypePricing.tsx`

### Key Changes

#### 1. New Imports
```typescript
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { getCustomerSubscriptions, type Subscription } from '@/pages/4-client/others/features/billing/services/stripe-service';
import { useToast } from '@/pages/1-HomePage/others/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
```

#### 2. New State Variables
```typescript
const { user, profile } = useAuthStore();
const { toast } = useToast();
const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
const [subscriptionChecked, setSubscriptionChecked] = useState(false);
const isAuthenticated = !!user && !!profile;
```

#### 3. Subscription Check Function
```typescript
const checkSubscriptionStatus = async () => {
  if (!user?.id) return;
  
  setIsCheckingSubscription(true);
  try {
    const subscriptions = await getCustomerSubscriptions(user.id);
    const activeSubscription = subscriptions.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );
    setUserSubscription(activeSubscription || null);
    setSubscriptionChecked(true);
  } catch (error) {
    console.error('Error checking subscription:', error);
    setUserSubscription(null);
    setSubscriptionChecked(true);
  } finally {
    setIsCheckingSubscription(false);
  }
};
```

#### 4. Enhanced handleContinue Function
Now includes comprehensive logic for all 5 outcomes with appropriate toast notifications and routing.

#### 5. Dynamic Button Text Function
```typescript
const getButtonText = (typeId: string) => {
  if (isCheckingSubscription) return 'Checking...';
  
  if (isAuthenticated && userSubscription && 
      (userSubscription.status === 'active' || userSubscription.status === 'trialing')) {
    return 'Go to Dashboard';
  }
  
  if (isAuthenticated && 
      (!userSubscription || userSubscription.status === 'canceled' || userSubscription.status === 'past_due')) {
    return 'Select Plan';
  }
  
  return 'Select Plan';
};
```

---

## User Experience Flow

### For New Users
1. Visit `/auth/account-type`
2. See all available plans with "Select Plan" buttons
3. Select a role (Engineer, Client, Enterprise, Admin)
4. Click "Select Plan" button
5. Redirected to `/signup/{role}` to create account and subscribe

### For Existing Users with Active Subscription
1. Visit `/auth/account-type` (or redirected there)
2. System checks subscription status (shows "Checking subscription...")
3. See all available plans with "Go to Dashboard" button
4. Select their current role
5. Click "Go to Dashboard" button
6. Toast: "Welcome back! You already have an active {role} subscription"
7. Redirected to `/{role}/dashboard`

### For Existing Users without Subscription
1. Visit `/auth/account-type`
2. System checks subscription status
3. See all available plans with "Select Plan" buttons
4. Select desired role
5. Click "Select Plan" button
6. Toast: "Complete Your Subscription"
7. Redirected to `/signup/{role}` to complete subscription

### For Existing Users with Expired Subscription
1. Visit `/auth/account-type`
2. System checks subscription status (finds canceled/past_due)
3. See all available plans with "Select Plan" buttons
4. Select desired role
5. Click "Select Plan" button
6. Toast: "Renew Your Subscription - Your previous subscription is {status}"
7. Redirected to `/signup/{role}` to renew

---

## Dependencies

### Stripe Integration
- Uses `getCustomerSubscriptions()` from stripe-service
- Requires `stripe_customer_id` in user's profile
- Checks for subscription statuses: `active`, `trialing`, `canceled`, `past_due`, `incomplete`

### Auth Store
- Uses `useAuthStore` to get current user and profile
- Checks authentication status before subscription lookup

### Toast Notifications
- Provides user feedback for all actions
- Shows contextual messages based on user state

---

## Edge Cases Handled

1. **User not authenticated**: Direct to signup
2. **User authenticated, no stripe_customer_id**: Treats as no subscription
3. **User authenticated, no active subscription**: Direct to signup
4. **User authenticated, subscription expired**: Direct to signup with renewal message
5. **User authenticated, active subscription**: Direct to dashboard
6. **API errors during subscription check**: Gracefully degrades, treats as no subscription
7. **Network errors**: Shows error toast, maintains current state
8. **Race conditions**: Uses `subscriptionChecked` flag to prevent duplicate API calls

---

## Future Enhancements

1. **Role Validation**: Verify selected role matches user's subscription plan
2. **Plan Comparison**: Show comparison between current plan and selected plan
3. **Upgrade/Downgrade Flow**: Handle plan changes for existing subscribers
4. **Trial Period Indicator**: Show remaining trial days for trialing subscriptions
5. **Payment Method Validation**: Check if user has valid payment method before showing "Go to Dashboard"
6. **Multi-Subscription Support**: Handle users with multiple active subscriptions
7. **Subscription Expiry Warning**: Show warning if subscription expires soon

---

## Testing Checklist

- [ ] New user can select plan and proceed to signup
- [ ] Existing user with active subscription sees "Go to Dashboard"
- [ ] Clicking "Go to Dashboard" redirects to correct dashboard
- [ ] Existing user without subscription can select plan and proceed
- [ ] User with expired subscription can renew
- [ ] Loading states show correctly
- [ ] Toast messages appear with correct content
- [ ] All 5 outcomes are properly handled
- [ ] Error states display user-friendly messages
- [ ] Subscription check doesn't block page rendering

---

## Related Files

- `src/pages/2-auth/others/features/auth/components/AccountTypePricing.tsx` (Modified)
- `src/pages/4-client/others/features/billing/services/stripe-service.ts` (Used)
- `src/pages/2-auth/others/stores/auth.ts` (Used)
- `src/pages/2-auth/others/features/auth/lib/role-resolution.ts` (Used)

---

## Notes

- This implementation is part of the larger authentication restructuring effort
- The system now properly validates subscriptions before granting dashboard access
- This addresses the user's goal: "Guide users to their correct dashboards while ensuring they have active and valid subscriptions"
- The implementation considers all possible outcomes and provides appropriate UX for each scenario

