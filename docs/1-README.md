# 📚 nbcon Documentation

Welcome to the nbcon project documentation! This document provides an overview of the current project structure, organization, and authentication system.

## 📖 **Documentation Index**

### Core Documentation
1. **`1-README.md`** (This file) - Project overview and structure
2. **`2-ORGANIZATION_SUMMARY.md`** - Detailed architecture and organization
3. **`3-PRODUCT_REQUIREMENTS.md`** - Product specifications
4. **`4-AUTH_REBUILD_PLAN.md`** - Initial auth system planning

### Authentication System Documentation ⭐
5. **`5-AUTH_SYSTEM_GUIDE.md`** - **START HERE** - Complete auth system overview
6. **`6-AUTH_MIGRATION_GUIDE.md`** - For developers making changes
7. **`7-AUTH_TESTING_GUIDE.md`** - Manual testing instructions
8. **`8-AUTH_IMPLEMENTATION_SUMMARY.md`** - Quick reference summary

## 🎯 **Project Overview**

nbocn is a comprehensive engineering services platform that connects clients with qualified engineers across Saudi Arabia. The platform supports four main user roles:

- **Engineers** - Individual professionals offering engineering services
- **Clients** - Companies and individuals seeking engineering services  
- **Enterprises** - Large organizations with complex project needs
- **Admins** - Platform administrators and managers

## 📁 **Current Project Structure**

The project has been completely reorganized with a clean, account-specific architecture:

```
src/pages/
├── 1-HomePage.tsx                    # Main landing page
├── 2-auth/                          # Authentication system
│   ├── EmailAuth.tsx
│   ├── PhoneAuth.tsx
│   ├── ProfileSetup.tsx
│   ├── VerifyOTP.tsx
│   ├── RoleSelection.tsx
│   ├── registration/                # Role-specific registration
│   └── others/                      # Auth-related components & features
├── 3-admin/                         # Admin role pages
│   ├── 1-AdminDashboardPage.tsx
│   ├── 2-UsersPage.tsx
│   ├── 3-ProjectsPage.tsx
│   ├── 4-MessagesPage.tsx
│   ├── 5-PaymentsPage.tsx
│   ├── 6-AnalyticsPage.tsx
│   ├── 7-RiskCenterPage.tsx
│   ├── 8-SettingsPage.tsx
│   └── others/                      # Admin-specific features
├── 4-client/                        # Client role pages
│   ├── 1-DashboardPage.tsx
│   ├── 2-ProfilePage.tsx
│   ├── 3-BrowseEngineersPage.tsx
│   ├── 4-PostJobPage.tsx
│   ├── 5-CalendarPage.tsx
│   ├── 6-NetworkPage.tsx
│   ├── 7-LearningPage.tsx
│   ├── 8-AIAssistantPage.tsx
│   ├── 9-MessagesPage.tsx
│   ├── 10-PaymentsPage.tsx
│   ├── 11-HelpPage.tsx
│   ├── 12-SettingsPage.tsx
│   └── others/                      # Client-specific features
├── 5-engineer/                      # Engineer role pages
│   ├── 1-DashboardPage.tsx
│   ├── 2-JobsPage.tsx
│   ├── 3-CalendarPage.tsx
│   ├── 4-MessagesPage.tsx
│   ├── 5-UploadDeliverablePage.tsx
│   ├── 6-NetworkPage.tsx
│   ├── 7-LearningPage.tsx
│   ├── 8-AIAssistantPage.tsx
│   ├── 9-PaymentsPage.tsx
│   ├── 10-HelpPage.tsx
│   ├── 11-SettingsPage.tsx
│   ├── 12-CheckIn.tsx
│   ├── 13-RankingPage.tsx
│   └── others/                      # Engineer-specific features
├── 6-enterprise/                    # Enterprise role pages
│   ├── 1-DashboardPage.tsx
│   ├── 3-CalendarPage.tsx
│   ├── 4-TeamPage.tsx
│   ├── 5-AnalyticsPage.tsx
│   ├── 6-FinancePage.tsx
│   ├── 7-ProcurementPage.tsx
│   ├── 8-LearningPage.tsx
│   ├── 9-AIAssistantPage.tsx
│   ├── 10-PaymentsPage.tsx
│   ├── 11-HelpPage.tsx
│   ├── 12-SettingsPage.tsx
│   └── others/                      # Enterprise-specific features
├── 7-Forbidden.tsx                  # Access denied page
├── 8-index.tsx                      # Main app entry point
└── 9-NotFound.tsx                   # 404 error page
```

## 🏗️ **Architecture Benefits**

### **Complete Account Isolation**
Each account type has its own `others/` directory containing:
- **Components** - UI components specific to that account
- **Features** - Business logic and functionality
- **Stores** - State management (auth, theme, calendar, etc.)
- **Types** - TypeScript definitions
- **Utils** - Utility functions and permissions
- **API** - Account-specific API clients

### **Clean Organization**
- **Numbered pages** for clear ordering and navigation
- **Self-contained accounts** with no shared dependencies
- **Easy maintenance** - work on one account without affecting others
- **Scalable structure** - add new features to specific accounts easily

## 🚀 **Key Features**

### **Authentication & Authorization**
- Google OAuth integration
- Role-based access control
- Secure session management
- Profile setup and verification

### **Role-Specific Functionality**
- **Engineers**: Job management, check-in system, portfolio, deliverables
- **Clients**: Project posting, engineer browsing, payment processing
- **Enterprises**: Team management, complex projects, analytics
- **Admins**: User management, platform oversight, risk assessment

### **Core Platform Features**
- Real-time messaging system
- Calendar and scheduling
- File upload and management
- Payment processing and billing
- AI-powered assistance
- Learning and development
- Analytics and reporting

## 🛠️ **Technology Stack**

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth + Google OAuth
- **Payments**: Stripe integration
- **Deployment**: Vercel

## 🗄️ **Database Organization**

The Supabase backend is now cleanly organized:

```
supabase/
├── config.toml                           # Main configuration
├── migrations/                           # Clean numbered migrations
│   ├── 001-core-tables.sql              # Core profiles, jobs, companies
│   ├── 002-conversations-messaging.sql  # Chat system tables
│   ├── 003-billing-subscriptions.sql    # Stripe integration
│   ├── 004-dashboard-layouts.sql        # Custom dashboard layouts
│   ├── 005-profile-extensions.sql       # Extended profile fields
│   ├── 006-ai-service-modes.sql         # AI service configurations
│   └── 007-ai-events-tracking.sql       # AI interaction tracking
├── fixes/                               # Organized fix scripts
│   ├── 001-date-fields.sql             # Date field constraints
│   ├── 002-jobs-rls-policies.sql       # Jobs table RLS fixes
│   ├── 003-conversations-rls.sql       # Messaging RLS fixes
│   └── 004-storage-policies.sql        # Storage bucket policies
├── functions/                           # Edge functions
│   ├── ai/                             # AI router and services
│   ├── ai-service/                     # Service-specific AI handlers
│   └── stripe-webhooks/                # Payment webhook handlers
└── scripts/                            # Utility scripts
    └── cli-version.txt                 # CLI version tracking
```

## 📊 **Current Status**

✅ **Complete Account Isolation** - All stores, types, and utils moved to account-specific directories  
✅ **Clean File Organization** - Numbered pages with clear structure  
✅ **No Shared Dependencies** - Each account is self-contained  
✅ **Organized Database** - Supabase migrations and fixes properly structured  
✅ **Production Ready** - All core functionality implemented  
✅ **Scalable Architecture** - Easy to maintain and extend  

## 🎯 **Next Steps**

The platform is now fully organized and ready for:
1. **Feature Development** - Add new features to specific account types
2. **Performance Optimization** - Implement code splitting and lazy loading
3. **Testing** - Add comprehensive test coverage
4. **Documentation** - Create detailed API and component documentation

---

**Last Updated:** January 2025  
**Status:** Production Ready ✅