# Supabase Database Reorganization Plan

**Last Updated:** December 19, 2024  
**Version:** 2.1  
**Status:** Implemented

## Overview
This plan outlines the reorganization of the Supabase database with numbered migrations and role-based file organization.

## Current State Analysis
- 7 existing migrations (001-007)
- Core tables: profiles, companies, jobs, conversations, messages, etc.
- User roles: engineer, client, enterprise, admin
- Existing fixes in `supabase/fixes/` directory

## New Organization Structure

### 1. Migration Numbering System
```
supabase/
├── migrations/
│   ├── 001-base-schema.sql          # Core user/auth tables
│   ├── 002-engineer-tables.sql      # Engineer-specific tables
│   ├── 003-client-tables.sql        # Client-specific tables
│   ├── 004-enterprise-tables.sql    # Enterprise-specific tables
│   ├── 005-admin-tables.sql         # Admin-specific tables
│   ├── 006-shared-messaging.sql     # Messaging system
│   ├── 007-shared-billing.sql       # Billing/subscriptions
│   ├── 008-shared-dashboard.sql     # Dashboard layouts
│   ├── 009-shared-ai.sql           # AI features
│   └── 010-data-migration.sql      # Sample data
├── role-migrations/
│   ├── engineer/
│   │   ├── 001-profiles.sql
│   │   ├── 002-skills.sql
│   │   └── 003-portfolio.sql
│   ├── client/
│   │   ├── 001-profiles.sql
│   │   └── 002-projects.sql
│   ├── enterprise/
│   │   ├── 001-companies.sql
│   │   ├── 002-teams.sql
│   │   └── 003-projects.sql
│   └── admin/
│       ├── 001-audit-logs.sql
│       └── 002-system-config.sql
└── functions/
    ├── engineer/
    ├── client/
    ├── enterprise/
    └── admin/
```

## Implementation Steps

### Step 1: Backup Current Database
```bash
supabase db dump --data-only > backup_data.sql
supabase db dump --schema-only > backup_schema.sql
```

### Step 2: Create Reset Migration
Create a new migration that drops all existing tables and recreates them with the new structure.

### Step 3: Role-Based Table Organization
- **Engineer Tables**: skills, portfolio, certifications, ratings
- **Client Tables**: projects, job_postings, reviews
- **Enterprise Tables**: companies, teams, enterprise_projects, procurement
- **Admin Tables**: audit_logs, system_settings, user_management
- **Shared Tables**: messages, billing, dashboard_layouts, ai_events

### Step 4: Update RLS Policies
Reorganize Row Level Security policies by role for better maintainability.

### Step 5: Update Functions
Organize Edge Functions by role for better code organization.

## Benefits of New Structure
1. **Clear Role Separation**: Each role has its own migration files
2. **Better Maintainability**: Easy to find and update role-specific features
3. **Scalability**: Easy to add new features per role
4. **Team Collaboration**: Different developers can work on different roles
5. **Deployment Control**: Can deploy role-specific changes independently

## Migration Strategy
1. Create new numbered migrations (001-010)
2. Move existing content to appropriate role-based files
3. Test each migration individually
4. Create comprehensive reset script
5. Update documentation

## Next Steps
1. ✅ Analyze current structure
2. ✅ Create new migration files
3. ✅ Implement role-based organization (cleaned up duplicates)
4. 🔄 Test new structure
5. ⏳ Update documentation
