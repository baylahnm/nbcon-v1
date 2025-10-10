# 📐 Project Guide - Architecture & Codebase Overview

**Last Updated:** October 9, 2025  
**Status:** Production Ready

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Directory Structure](#directory-structure)
5. [Database Schema](#database-schema)
6. [UI Components](#ui-components)
7. [Internationalization](#internationalization)
8. [Code Organization](#code-organization)
9. [Performance](#performance)

---

## 🎯 Project Overview

### What is nbcon?

**nbcon** is Saudi Arabia's first comprehensive digital marketplace for professional engineering services.

**Core Concept:**
- 🚗 **Uber-like** - On-demand engineer matching
- 💼 **LinkedIn-style** - Professional networking
- 🤖 **AI-powered** - Smart matching and assistance
- 📍 **Geofenced** - Check-ins for site verification
- 💰 **Escrow** - Milestone-based payments
- 🏗️ **SCE compliant** - Saudi Council of Engineers integration

**Vision 2030 Alignment:** Digitizing Saudi Arabia's engineering services sector

### Key Features

**For Engineers:**
- Browse jobs near you
- Geofenced check-in/check-out
- Upload deliverables
- Track earnings & payments
- Manage portfolio & certifications
- Kanban board for active jobs

**For Clients:**
- Post job requests
- Browse certified engineers
- Smart quote comparison
- Project milestone tracking
- Secure escrow payments
- ZATCA-compliant invoicing

**For Enterprises:**
- Team & workforce management
- Multi-project portfolio view
- Advanced procurement workflows
- Financial analytics & reporting
- Vendor management
- Custom quotation builder

**For Admins:**
- User management dashboard
- Platform analytics
- Risk center & fraud detection
- System settings
- Audit logs

---

## 🏗️ Architecture

### Account-Isolated Structure

**Core Principle:** Complete isolation - each account type is self-contained with no shared dependencies.

```
src/pages/
├── 1-HomePage/          # Public landing page + shared components
│   ├── HomePage.tsx     # Main landing page
│   └── others/          # Shared UI, i18n, auth, utilities (200+ files)
│       ├── components/  # Reusable UI components
│       ├── lib/         # Utilities & configuration
│       ├── stores/      # State management
│       └── config/      # App configuration
│
├── 2-auth/              # Authentication system
│   ├── signup/          # 4 role-specific signup forms
│   │   ├── ClientSignup.tsx
│   │   ├── EngineerSignup.tsx
│   │   ├── EnterpriseSignup.tsx
│   │   └── AdminSignup.tsx
│   └── others/          # Auth components, guards, layouts
│       ├── features/    # Core auth logic
│       ├── layouts/     # Role-specific layouts
│       ├── utils/       # Helper functions (retry, error monitor)
│       └── stores/      # Auth state
│
├── 3-admin/             # Admin Portal
│   ├── 1-AdminDashboardPage.tsx
│   ├── 2-UsersPage.tsx
│   ├── 3-ProjectsPage.tsx
│   ├── 4-MessagesPage.tsx
│   ├── 5-PaymentsPage.tsx
│   ├── 6-AnalyticsPage.tsx
│   ├── 7-RiskCenterPage.tsx
│   ├── 8-SettingsPage.tsx
│   └── others/          # Admin-specific features
│
├── 4-client/            # Client Portal (12 pages)
│   ├── 1-DashboardPage.tsx
│   ├── 2-ProfilePage.tsx
│   ├── 3-BrowseEngineersPage.tsx
│   ├── 4-PostJobPage.tsx
│   ├── (... 8 more pages)
│   └── others/          # Client-specific features
│       ├── ai/
│       ├── billing/
│       ├── browse/
│       ├── dashboard/
│       └── messages/
│
├── 5-engineer/          # Engineer Portal (13 pages)
│   ├── 1-DashboardPage.tsx
│   ├── 2-JobsPage.tsx
│   ├── 12-CheckIn.tsx
│   ├── 13-RankingPage.tsx
│   └── others/          # Engineer-specific features
│       ├── ai/
│       ├── checkin/
│       ├── deliverables/
│       ├── jobs/
│       └── messages/
│
└── 6-enterprise/        # Enterprise Portal (12 pages)
    ├── 1-DashboardPage.tsx
    ├── 6-FinancePage.tsx
    ├── 7-ProcurementPage.tsx
    └── others/          # Enterprise-specific features
        ├── ai/
        ├── finance/
        ├── procurement/
        └── vendors/
```

### Benefits of This Architecture

1. **Complete Account Isolation** - No shared dependencies between account types
2. **Easy Maintenance** - Work on one account without affecting others
3. **Scalable** - Add new features to specific accounts easily
4. **Clear Boundaries** - No confusion about where code belongs
5. **Numbered Pages** - Clear ordering and navigation

---

## 🎨 Tech Stack

### Frontend

```
Framework:      React 18.3 + TypeScript 5.x
Build Tool:     Vite 5.x
UI Library:     shadcn/ui (74+ components)
Styling:        Tailwind CSS 3.x
State:          Zustand (persistent stores)
Routing:        React Router 6.x
i18n:           i18next + react-i18next
Animations:     Framer Motion
Maps:           Leaflet/Maplibre
```

### Backend

```
BaaS:           Supabase
Database:       PostgreSQL 15
Auth:           Supabase Auth + OAuth (Google, Facebook)
Storage:        Supabase Storage (file uploads)
Realtime:       Supabase Realtime (WebSockets)
Edge Functions: Deno-based serverless functions
```

### Infrastructure

```
Hosting:        Vercel
Payments:       Stripe
Analytics:      Custom event tracking
```

---

## 📁 Directory Structure

### Core Application (src/)

```
src/
├── App.tsx                 # Main app entry point
├── main.tsx                # React DOM render
├── index.css               # Global styles (Tailwind)
├── vite-env.d.ts           # Vite type definitions
│
├── routes/
│   └── RoleRouter.tsx      # Role-based routing logic (214 lines)
│
├── shared/
│   └── supabase/
│       ├── client.ts       # Centralized Supabase client
│       └── types.ts        # Auto-generated database types (638 lines)
│
└── pages/                  # See Architecture section above
```

### Database (supabase/)

```
supabase/
├── config.toml             # Supabase configuration
│
├── migrations/             # 11 database migrations
│   ├── 20240101000001_base_schema.sql
│   ├── 20240101000002_engineer_tables.sql
│   ├── 20240101000003_client_tables.sql
│   ├── 20240101000004_enterprise_tables.sql
│   ├── 20240101000005_admin_tables.sql
│   ├── 20240101000006_shared_messaging.sql
│   ├── 20240101000007_shared_billing.sql
│   ├── 20240101000008_shared_dashboard.sql
│   ├── 20240101000009_shared_ai.sql
│   └── 20240101000010_data_migration.sql
│
├── fixes/                  # 12 fix scripts
│   ├── 001-008: Historical fixes
│   ├── 009: Missing INSERT policy (quick fix)
│   ├── 010: Comprehensive fix
│   ├── 011: Complete production fix
│   └── 012: Safe incremental fix ⭐ LATEST
│
└── functions/              # Edge functions
    ├── ai/                 # AI router
    ├── ai-service/         # Service-specific AI handlers
    └── stripe-webhooks/    # Payment webhook handlers
```

---

## 🗄️ Database Schema

### Core Tables (48 total)

**Authentication:**
- `profiles` - User profiles with roles
- `verifications` - KYC verification
- `account_numbers` - Auto-generated account IDs

**Engineers:**
- `engineer_profiles` - Engineer-specific data
- `engineer_skills` - Skill tags
- `engineer_portfolio` - Project portfolio
- `engineer_certifications` - Licenses & certs
- `engineer_ratings` - Performance ratings
- `engineer_availability` - Work calendar

**Clients:**
- `client_profiles` - Client-specific data
- `client_projects` - Project history
- `client_reviews` - Service reviews
- `client_preferences` - Settings & preferences

**Enterprises:**
- `enterprise_companies` - Company data
- `enterprise_teams` - Team structure
- `enterprise_projects` - Project portfolio
- `enterprise_procurement` - Procurement workflows
- `enterprise_vendors` - Vendor management
- `enterprise_analytics` - Business metrics

**Admins:**
- `admin_audit_logs` - System audit trail
- `admin_system_settings` - Platform configuration
- `admin_notifications` - Alert system

**Jobs & Projects:**
- `jobs` - Job postings and assignments
- `job_bids` - Engineer quotes
- `job_milestones` - Project phases
- `project_tasks` - Task breakdown

**Messaging:**
- `conversations` - Chat threads
- `messages` - Individual messages

**Billing:**
- `subscription_plans` - Service tiers
- `subscriptions` - User subscriptions
- `payments` - Payment records
- `invoices` - Billing documents

**Dashboards:**
- `dashboard_layouts` - Custom dashboard configs
- `dashboard_widgets` - Widget definitions
- `user_widget_preferences` - User preferences

**AI:**
- `ai_service_modes` - 9 engineering specializations
- `ai_events` - Interaction tracking
- `ai_messages` - Chat history
- `ai_tools` - Tool integrations

---

## 🎨 UI Components

### shadcn/ui Components (74 total)

```
Form Controls:      button, input, textarea, select, checkbox, radio, slider
Layout:             card, dialog, sheet, tabs, accordion, separator
Feedback:           toast, alert, badge, progress, skeleton
Navigation:         dropdown-menu, navigation-menu, breadcrumb, pagination
Data Display:       table, avatar, tooltip, popover
Advanced:           calendar, command, context-menu, carousel, scroll-area
```

### Custom Components

```
Auth:               AuthContent, VerifyOTP, AccountTypePricing
Dashboard:          Customizable widget system (role-specific)
Messaging:          Chat interface, file sharing
AI:                 Chat drawer, tool menus
Jobs:               Kanban boards, job cards
Finance:            Invoice builder, quotation builder
Forms:              Phone input, VAT fields, billing address, payment methods
```

---

## 🌍 Internationalization (i18n)

### Languages Supported

- ✅ **English (en)** - Left-to-right
- ✅ **Arabic (ar)** - Right-to-left with full RTL layout support

### Translation Files (16 JSON files)

```
common.json          Shared UI strings, buttons, validation
auth.json            Authentication flows
registration.json    Signup forms (all 4 roles)
homepage.json        Landing page content
admin.json           Admin dashboard
client.json          Client dashboard
engineer.json        Engineer dashboard  
enterprise.json      Enterprise dashboard
```

### i18n Features

- ✅ Automatic RTL/LTR switching
- ✅ Lazy-loaded namespaces
- ✅ SAR currency formatting
- ✅ Arabic numeral formatting
- ✅ Language switcher component

### How to Use i18n

**1. Import hooks:**
```typescript
import { useTranslation } from 'react-i18next';
import { useNamespace } from '@/pages/1-HomePage/others/lib/i18n/useNamespace';
```

**2. Load namespaces:**
```typescript
const ready = useNamespace(['client', 'common']);
const { t } = useTranslation(['client', 'common']);
if (!ready) return null; // Must be AFTER all hooks
```

**3. Use translations:**
```typescript
<h1>{t('client:dashboard.title')}</h1>
<Button>{t('common:actions.save')}</Button>
```

**4. Format currency & dates:**
```typescript
import { formatSAR, formatDate } from '@/pages/1-HomePage/others/lib/i18n/intl';

formatSAR(45)           // "SAR 45.00" (en) | "٤٥٫٠٠ ر.س." (ar)
formatDate(new Date())  // "Jan 15, 2024" (en) | "١٥ يناير ٢٠٢٤" (ar)
```

---

## 📐 Code Organization Principles

### 1. Account Isolation

Each role (admin, client, engineer, enterprise) is:
- ✅ Self-contained with own `features/`
- ✅ Independent stores & types
- ✅ No cross-dependencies
- ✅ Easy to maintain separately

### 2. Numbered Pages

```
1-DashboardPage.tsx    → Clear ordering
2-ProfilePage.tsx      → Easy navigation
3-BrowseEngineersPage.tsx
```

### 3. Feature-Based Organization

```
others/features/
├── ai/               Complete AI feature
├── dashboard/        Complete dashboard feature
├── messages/         Complete messaging feature
└── ...
```

### 4. Shared Components in 1-HomePage

All reusable, account-agnostic components live in:
```
src/pages/1-HomePage/others/
├── components/ui/      # shadcn/ui library
├── components/auth/    # Auth forms
├── lib/i18n/          # Internationalization
└── lib/auth/          # Auth guards
```

---

## 🚀 Performance Optimizations

### Code Splitting

- ✅ React.lazy() for heavy layouts (Enterprise)
- ✅ Dynamic imports for analytics pages
- ✅ Route-based splitting

**Example:**
```typescript
const EnterpriseLayout = React.lazy(() => import("..."));
const AnalyticsPage = React.lazy(() => import("..."));
const FinancePage = React.lazy(() => import("..."));
```

### Database Optimization

- ✅ Indexes on user_id, role columns
- ✅ GIN indexes for JSONB fields
- ✅ Optimized RLS policies (SECURITY DEFINER function)

### Frontend Optimization

- ✅ Memoized components
- ✅ Lazy-loaded i18n namespaces
- ✅ Debounced search inputs
- ✅ Virtual scrolling for long lists

---

## 📊 Codebase Statistics

```
Total Files:        701 source files
                    565 .tsx (React components)
                    136 .ts (TypeScript utilities/types)
                     23 .sql (Database migrations/fixes)
                     16 .md (Documentation)

Lines of Code:      ~50,000+ lines (estimated)
Components:         ~565 React components
Database Tables:    48 tables across 11 migrations
API Endpoints:      4 Edge Functions
Translation Files:  16 locale files (EN/AR)
```

---

## 🎯 Next Steps

**For New Developers:**
1. Read this guide to understand architecture
2. Read [3-AUTH_GUIDE.md](3-AUTH_GUIDE.md) to understand authentication
3. Explore example components in each role directory
4. Start with simple tasks in one account type

**For Adding Features:**
1. Identify which account type (admin, client, engineer, enterprise)
2. Add to that account's `others/features/` directory
3. Create numbered page if it needs a route
4. Add i18n translations to relevant namespace
5. Test in isolation

**For Database Changes:**
1. Read [4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)
2. Create migration in `supabase/migrations/`
3. Add RLS policies
4. Update TypeScript types
5. Test with all roles

---

**This architecture enables:**
- ✅ Parallel development (teams work on different accounts)
- ✅ Easy onboarding (clear boundaries)
- ✅ Scalable growth (add features without conflicts)
- ✅ Maintainable codebase (isolated concerns)

---

**For more details:**
- Authentication → [3-AUTH_GUIDE.md](3-AUTH_GUIDE.md)
- Database → [4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)
- Recent work → [5-IMPLEMENTATION_GUIDE.md](5-IMPLEMENTATION_GUIDE.md)
- Portal audit → [8-ENGINEER_PORTAL_AUDIT_REPORT.md](8-ENGINEER_PORTAL_AUDIT_REPORT.md)

