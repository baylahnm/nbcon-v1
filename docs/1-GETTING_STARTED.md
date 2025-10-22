# 🚀 nbcon - Getting Started Guide

**Last Updated:** October 22, 2025  
**Status:** Production Ready  
**Version:** 2.3 (AI Tools Update)

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [What is nbcon?](#what-is-nbcon)
3. [Project Stats](#project-stats)
4. [Tech Stack](#tech-stack)
5. [File Organization](#file-organization)
6. [Authentication](#authentication)
7. [Database Setup](#database-setup)
8. [Common Tasks](#common-tasks)

---

## ⚡ Quick Start

### For New Developers (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:8080/auth

# 4. Test with existing account
Email: info@nbcon.org
Password: Qazwsx1234@
```

### For Testing

**Test Accounts:**
- **Engineer:** info@nbcon.org / Qazwsx1234@
- **Client:** mahdi.n.baylah@outlook.com / Qazwsx1234@

---

## 🎯 What is nbcon?

**nbcon** is Saudi Arabia's first comprehensive digital marketplace for professional engineering services.

### Core Features

**🚗 Uber-like** - On-demand engineer matching  
**💼 LinkedIn-style** - Professional networking  
**🤖 AI-powered** - Smart matching and assistance  
**📍 Geofenced** - Check-ins for site verification  
**💰 Escrow** - Milestone-based payments  
**🏗️ SCE compliant** - Saudi Council of Engineers integration

### Four User Roles

1. **Engineers** - Find work, manage jobs, track earnings
2. **Clients** - Post jobs, browse engineers, manage projects
3. **Enterprises** - Team management, procurement, analytics
4. **Admins** - Platform oversight, risk management, analytics

---

## 📊 Project Stats

```
Total Files:        735+ source files
Components:         596+ React components  
Database Tables:    55 tables
Documentation:      8 essential guides (6 core + 2 AI tools)
Tech Stack:         React 18 + TypeScript + Supabase + shadcn/ui
Languages:          English + Arabic (RTL)
Status:             100% Production Ready
AI Tools:           6 interactive planning tools ✅ 🆕
```

---

## 🎨 Tech Stack

### Frontend
```
Framework:      React 18.3 + TypeScript 5.x
Build Tool:     Vite 5.x
UI Library:     shadcn/ui (74+ components)
Styling:        Tailwind CSS 4.x
State:          Zustand (persistent stores)
Routing:        React Router 6.x
i18n:           i18next + react-i18next
Animations:     Framer Motion
Maps:           Leaflet/Maplibre
Icons:          Lucide React
```

### Backend
```
BaaS:           Supabase
Database:       PostgreSQL 15
Auth:           Supabase Auth + OAuth (Google, Facebook)
Storage:        Supabase Storage (file uploads)
Realtime:       Supabase Realtime (WebSockets)
Edge Functions: Deno-based serverless
```

### Infrastructure
```
Hosting:        Vercel
Payments:       Stripe
Analytics:      Custom event tracking
```

---

## 📁 File Organization

### Numbered Documentation System

Documentation files use **numbered prefixes** for chronological/logical ordering:

```
docs/
├── 1-GETTING_STARTED.md          # This file - Quick start
├── 2-ARCHITECTURE_GUIDE.md       # System architecture & codebase
├── 3-UI_DESIGN_SYSTEM.md         # Complete UI/UX patterns
└── 4-PRODUCTION_GUIDE.md         # Deployment & bug fixing
```

**Benefits:**
- Easy to identify file age/sequence at a glance
- Faster navigation and file discovery
- Clear documentation progression
- Better organization for growing codebases

### Application Structure

```
src/pages/
├── 1-HomePage/          # Public landing + shared components
│   └── others/          # Shared UI, i18n, auth, utilities (200+ files)
├── 2-auth/              # Authentication system (4 signup flows)
├── 3-admin/             # Admin portal (8 pages)
├── 4-free/            # Client portal (12 pages)
├── 5-engineer/          # Engineer portal (14 pages) ⭐
└── 6-enterprise/        # Enterprise portal (12 pages)

supabase/
├── migrations/          # 11 database migrations
├── fixes/               # 12 fix scripts
└── functions/           # 4 edge functions
```

---

## 🔐 Authentication

### Signup Flow (5 Steps)

```
Step 1: /auth (Email/Password + OTP)
  └─ Create Supabase auth account
  └─ Set password once
  └─ Send email verification

Step 2: /auth/verify
  └─ Enter 6-digit OTP
  └─ Verify email

Step 3: /auth/account-type
  └─ Select role (Engineer/Client/Enterprise/Admin)
  └─ View pricing

Step 4: /signup/{role}
  └─ Pre-filled: email, name, phone
  └─ Role-specific business data

Step 5: /{role}/dashboard
  └─ Profile created ✅
  └─ Account number assigned ✅
```

### Key Auth Files

```typescript
// Auth store (USE THIS)
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";

// Signup utilities
import { 
  performSignup,      // Initial signup with password
  createProfileOnly   // Role-specific profile creation
} from "@/pages/2-auth/others/utils/signup-helper";

// Error monitoring
import { errorMonitor } from "@/pages/2-auth/others/utils/error-monitor";
```

---

## 🗄️ Database Setup

### 🔴 Critical Fix Required (2 minutes)

**Problem:** Missing INSERT policy causes 406 errors during signup

**Solution:**

1. Open Supabase SQL Editor
2. Copy contents of `supabase/fixes/012-safe-incremental-fix.sql`
3. Paste and click "Run"
4. Verify success messages

**What it fixes:**
- ✅ Missing INSERT policy on profiles table
- ✅ Creates engineer_profiles table
- ✅ Renames tables (job_postings → jobs)
- ✅ Adds performance indexes
- ✅ Creates update triggers

### Core Tables (55 total)

**Authentication:**
- `profiles` - User profiles with roles
- `verifications` - KYC verification
- `account_numbers` - Auto-generated account IDs

**Engineers:**
- `engineer_profiles`, `engineer_skills`, `engineer_portfolio`
- `engineer_certifications`, `engineer_ratings`, `engineer_availability`

**Jobs & Projects:**
- `jobs`, `job_bids`, `job_milestones`, `project_tasks`

**Messaging:**
- `conversations`, `messages`

**Billing:**
- `subscription_plans`, `subscriptions`, `payments`, `invoices`

**AI:**
- `ai_service_modes`, `ai_events`, `ai_messages`, `ai_tools`

---

## 💡 Common Tasks

### Start Development

```bash
# Install dependencies
pnpm install

# Start dev server (port 8080)
npm run dev

# Open in browser
http://localhost:8080/auth
```

### Test Signup Flow

1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Fill form with test data
4. Enter OTP from email
5. Select role (Engineer/Client/Enterprise)
6. Complete role-specific profile
7. Verify redirect to correct dashboard

### Add New Page

1. Identify account type (engineer/client/enterprise/admin)
2. Create numbered file: `src/pages/5-engineer/15-NewPage.tsx`
3. Add route in `src/routes/RoleRouter.tsx`
4. Use standard page structure (see Architecture Guide)
5. Apply UI design patterns (see UI Design System)

### Fix Database Issue

1. Check error in browser console
2. If 406 error → Apply `012-safe-incremental-fix.sql`
3. If other error → Check `4-PRODUCTION_GUIDE.md`
4. Verify fix with test signup

---

## 🎨 UI Design Standards

### Typography (Standardized)

```tsx
// Page & Section Headers
text-base (16px) font-bold tracking-tight

// Card Titles  
text-base (16px) font-bold

// Body Text
text-sm (14px) leading-relaxed

// Labels & Captions
text-xs (12px) font-medium

// Button Text
text-xs (12px)

// Stats/Numbers
text-3xl (30px) or text-xl (20px) font-bold
```

### Color System

**Primary Brand:** `hsl(142 65% 47%)` → `#1e9e6b` (Green)

**Status Colors:**
- **Success:** Green (`bg-green-500/10 text-green-600`)
- **Warning:** Amber (`bg-amber-500/10 text-amber-600`)
- **Danger:** Red (`bg-red-500/10 text-red-600`)
- **Info:** Blue (`bg-blue-500/10 text-blue-600`)
- **Primary:** Brand (`bg-primary/10 text-primary`)

### Card Pattern (Standard)

```tsx
<Card className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
  <CardHeader className="p-5 pb-3 border-b border-border/40">
    <div className="flex items-center gap-3">
      <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <CardTitle className="text-base font-bold tracking-tight">Title</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">Subtitle</p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-5 space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Button Pattern (Standard)

```tsx
// Primary Action
<Button className="h-8 text-xs shadow-md hover:shadow-xl">
  <Icon className="h-3.5 w-3.5 mr-1.5" />
  Primary Action
</Button>

// Secondary Action
<Button variant="outline" className="h-8 text-xs">
  <Icon className="h-3.5 w-3.5 mr-1.5" />
  Secondary Action
</Button>
```

### Form Component Updates (v2.1)

```tsx
// SelectTrigger with consistent theme styling
<SelectTrigger className="bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
  <SelectValue placeholder="Select option" />
</SelectTrigger>

// Switch with proper border
<Switch className="border-input" />

// Textarea with theme background
<Textarea className="bg-background" />
```

**For complete UI patterns:** See `2-ARCHITECTURE_GUIDE.md` → UI Component Patterns

---

## 🌍 Internationalization (i18n)

### Usage

```typescript
import { useTranslation } from 'react-i18next';
import { useNamespace } from '@/pages/1-HomePage/others/lib/i18n/useNamespace';

// Load namespaces
const ready = useNamespace(['engineer', 'common']);
const { t } = useTranslation(['engineer', 'common']);
if (!ready) return null;

// Use translations
<h1>{t('engineer:dashboard.title')}</h1>
<Button>{t('common:actions.save')}</Button>
```

### Format Helpers

```typescript
import { formatSAR, formatDate } from '@/pages/1-HomePage/others/lib/i18n/intl';

formatSAR(45)           // "SAR 45.00" (en) | "٤٥٫٠٠ ر.س." (ar)
formatDate(new Date())  // "Jan 15, 2024" (en) | "١٥ يناير ٢٠٢٤" (ar)
```

---

## 🆘 Troubleshooting

### "User already exists" Error

**Cause:** Using `performSignup()` in role-specific forms  
**Fix:** Use `createProfileOnly()` instead

### 406 RLS Policy Violation

**Cause:** Missing INSERT policy on profiles table  
**Fix:** Apply `supabase/fixes/012-safe-incremental-fix.sql`

### Wrong Dashboard After Login

**Cause:** Profile role mismatch  
**Fix:** Delete test user, clear browser cache, apply database fix, retry

### Form Not Pre-filling

**Cause:** Missing auth store access  
**Fix:** Import and use `useAuthStore()` to get user data

---

## 📚 Learn More

### Essential Reading (Ordered)

1. **This File** - Getting started basics
2. **2-ARCHITECTURE_GUIDE.md** - System architecture, codebase structure, portal features
3. **3-UI_DESIGN_SYSTEM.md** - Complete UI/UX patterns and component library
4. **4-PRODUCTION_GUIDE.md** - Bug fixing, deployment, testing workflows

### Quick Links

| Task | Guide | Section |
|------|-------|---------|
| Understand architecture | 2-ARCHITECTURE_GUIDE | Architecture & Structure |
| Learn auth flow | This file | Authentication |
| Fix 406 errors | This file | Database Setup |
| Use UI components | 3-UI_DESIGN_SYSTEM | Component Patterns |
| Follow design standards | 3-UI_DESIGN_SYSTEM | Design Principles |
| Fix bugs | 4-PRODUCTION_GUIDE | Bug Fixing Workflow |
| Deploy to production | 4-PRODUCTION_GUIDE | Deployment Guide |

---

## 🎯 Engineer Portal - Quick Overview

### 14 Pages (All Production-Ready)

1. **Dashboard** - Command center with AI assistant, quick actions, stats
2. **Jobs** - AI-powered job marketplace with matching
3. **Calendar** - Modern calendar with events and scheduling
4. **Check-In** - Geofenced time tracking with analytics
5. **Upload Deliverable** - File upload with quality assurance
6. **Messages** - Professional messaging system
7. **Network** - LinkedIn-style professional networking ✨
8. **Learning** - Udemy-style course platform 🎓
9. **Finance** - Financial hub with invoices and payments
10. **AI Assistant** - Multi-mode AI chat interface
11. **Profile** - LinkedIn-style professional profile
12. **Ranking** - Annual prizes and leaderboard (SAR 2M+ pool)
13. **Help** - Support articles and contact options
14. **Settings** - Account preferences and configuration

### Recent Updates (October 2025)

**✅ AI Planning Tools** - 6 interactive tools: Charter, WBS, Stakeholders, Risks, Timeline, Resources 🆕  
**✅ AI Assistant Integration** - Full OpenAI backend with 30 construction-specific prompts, role-based assistance  
**✅ Uniform Design System** - Theme-agnostic styling across all AI tools  
**✅ ScrollArea Component** - Fixed vertical scrolling with proper overflow handling  
**✅ Edge Function Deployment** - AI chat function ready for production  
**✅ TypeScript Fixes** - Resolved Deno import errors in Supabase functions  
**✅ Database Schema** - AI tables ready with proper RLS policies

---

## 🔗 Component Import Paths

### shadcn/ui Components

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { toast } from '@/pages/1-HomePage/others/components/ui/sonner';
```

### Icons

```tsx
import { Icon1, Icon2 } from 'lucide-react';
```

### Navigation

```tsx
import { Link, useNavigate } from 'react-router-dom';
```

---

## ⚠️ Known Issues

### 🔴 Critical (Requires Fix)

**Missing INSERT policy on profiles table**
- **Impact:** 406 errors during signup
- **Fix:** Apply `supabase/fixes/012-safe-incremental-fix.sql`
- **Time:** 2 minutes
- **Guide:** See "Database Setup" section above

### 🟡 Minor (Non-blocking)

- Redirect loop after sign out (fix included in SQL)
- Some admin pages are placeholders (work in progress)

---

## 🎓 Learning Path

### Day 1: Orientation (2 hours)

1. Read this file (Getting Started) - **20 min**
2. Start dev server and explore the UI - **30 min**
3. Read Architecture Guide → Account Isolation section - **30 min**
4. Test signup flow with different roles - **40 min**

### Day 2: Development (4 hours)

1. Read Architecture Guide → Complete - **1 hour**
2. Read UI Design System → Design Patterns - **1 hour**
3. Build a simple component following patterns - **2 hours**

### Day 3: Production (3 hours)

1. Apply database fix - **10 min**
2. Test all authentication flows - **30 min**
3. Read Production Guide → Bug Fixing - **1 hour**
4. Practice fixing a bug from checklist - **1.5 hours**

---

## 🆘 Getting Help

### Questions?

- **Architecture questions** → 2-ARCHITECTURE_GUIDE.md
- **Auth not working** → This file → Authentication section
- **Database errors** → This file → Database Setup section
- **UI design standards** → 3-UI_DESIGN_SYSTEM.md
- **Bug fixing** → 4-PRODUCTION_GUIDE.md

### Code References

**Best Examples:**
- Auth: `src/pages/2-auth/signup/ClientSignup.tsx`
- Dashboard: `src/pages/5-engineer/1-DashboardPage.tsx`
- Profile: `src/pages/5-engineer/15-ProfilePage.tsx`
- Network: `src/pages/5-engineer/6-NetworkPage.tsx`
- Learning: `src/pages/5-engineer/7-LearningPage.tsx`

**Routing:**
- `src/routes/RoleRouter.tsx`

**Types:**
- `src/shared/supabase/types.ts`

---

## ✅ Quick Checklist

### Before Making Changes

- [ ] Read relevant documentation section
- [ ] Understand the account isolation architecture
- [ ] Check existing component patterns
- [ ] Follow UI design standards (16px/12px typography)
- [ ] Test with multiple roles

### After Making Changes

- [ ] No linter errors
- [ ] TypeScript types correct
- [ ] Components responsive (mobile/tablet/desktop)
- [ ] Dark mode compatible
- [ ] Follows UI design patterns
- [ ] Tested with real data

---

## 🎉 You're Ready!

You now have everything you need to start developing. Next steps:

1. **Start dev server** and explore the application
2. **Read Architecture Guide** to understand the codebase structure
3. **Browse UI Design System** to see component patterns
4. **Build something!** Start with a simple component

**Welcome to nbcon! Let's build something amazing.** 🚀

---

---

## 🤖 **AI Assistant Integration**

### **Quick Setup (5 Minutes)**

#### **Step 1: Get OpenAI API Key**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-...`)

#### **Step 2: Add to Supabase**
1. Open Supabase Dashboard
2. Go to **Project Settings → Edge Functions → Secrets**
3. Add new secret:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...` (your key)
4. Click "Add Secret"

#### **Step 3: Deploy Edge Function**
```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref joloqygeooyntwxjpxwv

# Deploy
supabase functions deploy ai-chat

# Verify
curl https://joloqygeooyntwxjpxwv.supabase.co/functions/v1/ai-chat
```

#### **Step 4: Test**
1. Start app: `npm run dev`
2. Navigate to `/free/dashboard`
3. Try any AI prompt from dropdown menus
4. Or go to `/free/ai` for full chat

---

### **AI Features**

#### **30 Construction-Specific Prompts**

Organized in 6 categories:
1. **Project Planning** (5 prompts)
2. **Cost & Budgeting** (5 prompts)
3. **Communication** (5 prompts)
4. **Compliance & Safety** (5 prompts)
5. **Technical & Design** (5 prompts)
6. **Documentation** (5 prompts)

#### **Role-Based Assistance**

**Engineer:**
- Technical questions, job matching, SCE compliance
- Career guidance, project planning

**Client:**
- Project planning, cost estimation
- Engineer selection, budget management
- Regulatory compliance, risk mitigation

**Enterprise:**
- Portfolio management, procurement
- Team coordination, financial analytics

**Admin:**
- User management, platform analytics
- Risk assessment, policy enforcement

#### **Multiple AI Modes**

- **Chat** - General conversation (gpt-4o-mini, fast)
- **Research** - In-depth analysis (gpt-4o, comprehensive)
- **Image** - Image generation/analysis (gpt-4o)
- **Agent** - Task breakdown (gpt-4o, structured)

#### **Bilingual Support**
- English (EN) - Default
- Arabic (AR) - Full RTL support
- AI responds in selected language

---

### **AI System Architecture**

```
User Interface (React)
  ├── Dashboard AI Widget (30 prompts)
  └── AI Chat Page (/free/ai)
        │
        ↓
    useAiStore (Zustand)
        │
        ↓
 Supabase Edge Function
    (ai-chat/index.ts)
        │
        ↓
    OpenAI API
 (gpt-4o / gpt-4o-mini)
```

**Data Flow:**
1. User selects prompt or types message
2. Message sent to edge function
3. Edge function adds role-based system prompt
4. OpenAI generates response
5. Response saved to database
6. UI updates with response

---

### **AI Database Schema**

#### **Tables:**

**ai_conversations** (Threads)
```sql
id                UUID PRIMARY KEY
user_id           UUID → profiles(user_id)
conversation_title TEXT
ai_service_mode   TEXT
is_active         BOOLEAN
created_at        TIMESTAMPTZ
```

**ai_messages** (Chat History)
```sql
id              UUID PRIMARY KEY
conversation_id UUID → ai_conversations(id)
message_type    TEXT ('user', 'assistant', 'system')
content         TEXT
metadata        JSONB (tokens, model, mode, language)
created_at      TIMESTAMPTZ
```

**ai_events** (Analytics)
```sql
id                UUID PRIMARY KEY
user_id           UUID → profiles(user_id)
event_type        TEXT
data              JSONB
ai_model          TEXT
token_count       INTEGER
cost_usd          DECIMAL(10,6)
created_at        TIMESTAMPTZ
```

---

### **AI Edge Function API**

**Endpoint:** `https://joloqygeooyntwxjpxwv.supabase.co/functions/v1/ai-chat`

**Request:**
```typescript
{
  message: string;              // Required
  threadId?: string;            // Optional
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  language: 'en' | 'ar';        // Optional
  mode: string;                 // Optional: 'chat', 'research', 'agent'
  conversationHistory?: Array;  // Last 10 messages
}
```

**Response:**
```typescript
{
  status: 'success';
  threadId: string;
  response: string;             // AI response
  model: string;                // e.g., 'gpt-4o-mini'
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

---

### **AI Troubleshooting**

**"OPENAI_API_KEY not configured":**
- Check Supabase Dashboard → Edge Functions → Secrets
- Verify key exists
- Redeploy: `supabase functions deploy ai-chat`

**"User not authenticated":**
- Sign in at `/auth`
- Check browser console
- Clear localStorage and re-login

**"Failed to generate response":**
- Check OpenAI key is valid
- Verify OpenAI account has credits
- Check browser console for detailed error

**Column name mismatch (ai_events):**
```sql
-- Fix if needed
ALTER TABLE ai_events RENAME COLUMN event_data TO data;
CREATE INDEX IF NOT EXISTS idx_ai_events_data ON ai_events USING gin(data);
```

---

### **AI Usage Examples**

**From Dashboard:**
1. Click any AI prompt dropdown (e.g., "Cost & Budgeting")
2. Select prompt (e.g., "Estimate cost for site survey")
3. Prompt auto-fills in composer
4. Click Send or edit first
5. AI response appears

**From AI Page (/free/ai):**
1. Navigate to AI Assistant
2. Select mode (Chat/Research/Image/Agent)
3. Type message or use prompts
4. View full conversation history
5. Manage threads (create, star, archive)

**Programmatic:**
```typescript
import { useAiStore } from '@/pages/4-free/others/features/ai/store/useAiStore';

const { sendMessage, setComposerText } = useAiStore();

// Pre-fill prompt
setComposerText("Help me estimate project costs");

// Send message
await sendMessage("Your message");
```

---

### **AI Cost Monitoring**

**Track Usage:**
```sql
-- Daily usage by role
SELECT 
  p.role,
  COUNT(*) as messages,
  SUM(ae.token_count) as tokens,
  SUM(ae.cost_usd) as cost
FROM ai_events ae
JOIN profiles p ON ae.user_id = p.user_id
WHERE ae.created_at >= CURRENT_DATE
GROUP BY p.role;
```

**Set Budget Limits:**
1. OpenAI dashboard → Usage limits
2. Set daily/monthly caps
3. Monitor costs regularly

---

### **AI Deployment Checklist**

#### **Prerequisites:**
- [ ] OpenAI API account created
- [ ] API key obtained (sk-...)
- [ ] Supabase CLI installed
- [ ] Project linked

#### **Setup:**
- [ ] OpenAI key added to Supabase secrets
- [ ] Verify secret exists: `supabase secrets list`
- [ ] Deploy function: `supabase functions deploy ai-chat`
- [ ] Verify deployment works
- [ ] Check function logs: `supabase functions logs ai-chat`

#### **Database:**
- [ ] Verify `ai_conversations` table exists
- [ ] Verify `ai_messages` table exists
- [ ] Verify `ai_events` table exists
- [ ] Fix column name if needed (event_data → data)
- [ ] Verify RLS policies active

#### **Testing:**
- [ ] Test prompt pre-fill from dashboard
- [ ] Test send message
- [ ] Test message persistence (refresh page)
- [ ] Test as all 4 roles
- [ ] Test English and Arabic
- [ ] Test all 4 modes (Chat, Research, Agent, Image)
- [ ] Test all 30 prompts (6 categories × 5 each)

#### **Performance:**
- [ ] First message < 10 seconds
- [ ] Subsequent messages < 8 seconds
- [ ] No memory leaks after 20+ messages
- [ ] UI remains responsive

#### **Security:**
- [ ] API key NOT in client code
- [ ] API key NOT in git
- [ ] RLS policies enforced
- [ ] Users only access own conversations
- [ ] Authorization required for edge function

#### **Cost Monitoring:**
- [ ] Check OpenAI usage dashboard
- [ ] Query token usage in database
- [ ] Set up usage alerts (optional)

---

### **AI Best Practices**

**For Users:**
1. **Be Specific** - Detailed prompts get better responses
2. **Use Pre-Built Prompts** - 30 prompts cover common needs
3. **Provide Context** - Mention project type, location, constraints
4. **Review Responses** - AI provides guidance, not guarantees
5. **Use Research Mode** - For complex technical questions

**For Developers:**
1. **Never expose OpenAI key** - Always use edge functions
2. **Validate inputs** - Use Zod schemas
3. **Handle errors gracefully** - User-friendly messages
4. **Optimize context** - Send only last 10 messages
5. **Monitor costs** - Track token usage
6. **Test across roles** - Different system prompts
7. **Support both languages** - Test EN and AR

---

### **AI Implementation Status**

| Feature | Status | Notes |
|---------|--------|-------|
| Edge Function | ✅ Complete | `supabase/functions/ai-chat/index.ts` |
| Database Schema | ✅ Verified | Migration 20240101000009 |
| useAiStore | ✅ Complete | Real OpenAI calls |
| Dashboard Prompts | ✅ Complete | All 30 wired |
| Role-Based Prompts | ✅ Complete | 4 role contexts |
| Language Support | ✅ Complete | EN/AR |
| Message Persistence | ✅ Complete | Saved to DB |
| Error Handling | ✅ Complete | Graceful fallbacks |
| Streaming | ⏳ Pending | Future enhancement |
| Attachments | ⏳ Pending | UI ready, backend needed |

---

**Documentation Version:** 3.0 (AI Integration Included)  
**Last Review:** October 21, 2025  
**Maintained By:** Development Team

