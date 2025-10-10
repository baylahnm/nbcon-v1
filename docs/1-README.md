# 📚 nbcon Documentation

**Last Updated:** October 9, 2025  
**Status:** Production Ready (pending database fix)

---

## 🎯 **Quick Navigation**

### 🔴 **URGENT - Start Here**
→ **[4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)** - Apply critical database fix (2 minutes)

### 📖 **Main Guides**
1. **[2-PROJECT_GUIDE.md](2-PROJECT_GUIDE.md)** - Architecture, tech stack, codebase overview
2. **[3-AUTH_GUIDE.md](3-AUTH_GUIDE.md)** - Authentication system (flows, security, testing)
3. **[4-DATABASE_GUIDE.md](4-DATABASE_GUIDE.md)** - Database schema, fixes, error handling
4. **[5-IMPLEMENTATION_GUIDE.md](5-IMPLEMENTATION_GUIDE.md)** - Recent updates, testing reports
5. **[6-SESSION_SUMMARY_OCT9_EVENING.md](6-SESSION_SUMMARY_OCT9_EVENING.md)** - Evening session updates
6. **[7-FINANCE_IMPLEMENTATION_SUMMARY.md](7-FINANCE_IMPLEMENTATION_SUMMARY.md)** - Financial Hub implementation
7. **[8-ENGINEER_PORTAL_AUDIT_REPORT.md](8-ENGINEER_PORTAL_AUDIT_REPORT.md)** - Comprehensive portal audit
8. **[9-Components-UI.md](9-Components-UI.md)** - HeroUI components guide & usage
9. **[10-DASHBOARD_IMPLEMENTATION.md](10-DASHBOARD_IMPLEMENTATION.md)** - Engineer Dashboard complete redesign ✨

---

## 🚀 **Quick Start**

### For New Developers
```bash
1. Read: 2-PROJECT_GUIDE.md (architecture overview)
2. Read: 3-AUTH_GUIDE.md (auth system)
3. Start dev server: npm run dev
4. Open: http://localhost:8080/auth
```

### For Testing
```bash
1. Read: 3-AUTH_GUIDE.md → Testing section
2. Start server: npm run dev
3. Follow test credentials in guide
```

### For Database Issues
```bash
1. Read: 4-DATABASE_GUIDE.md
2. Apply SQL fix (2 minutes)
3. Test signup flow
4. Review cleanup analysis (see 4-DATABASE_GUIDE.md → Cleanup section)
```

---

## 📊 **Project Stats**

```
Total Files:        707 source files (+6 dashboard components)
Components:         571 React components (+6 new)
Database Tables:    48 tables
Documentation:      10 organized guides (chronologically numbered)
Tech Stack:         React 18 + TypeScript + Supabase + HeroUI + shadcn MCP
Languages:          English + Arabic (RTL)
Status:             Production Ready
```

---

## 🎯 **What is nbcon?**

Saudi Arabia's first comprehensive digital marketplace for professional engineering services:
- 🚗 Uber-like on-demand engineer matching
- 💼 LinkedIn-style professional networking
- 🤖 AI-powered smart assistance
- 📍 Geofenced check-ins
- 💰 Escrow payments
- 🏗️ SCE compliance

**Vision 2030 Alignment:** Digitizing Saudi Arabia's engineering services sector

---

## 🔐 **Key Features**

### Four User Roles
- **Engineers** - Find work, manage jobs, track earnings
- **Clients** - Post jobs, browse engineers, manage projects
- **Enterprises** - Team management, procurement, analytics
- **Admins** - Platform oversight, risk management, analytics

### Core Functionality
- ✅ Role-based dashboards
- ✅ Real-time messaging
- ✅ AI assistants
- ✅ Bilingual (EN/AR)
- ✅ Mobile-responsive
- ✅ Payment processing

---

## ⚠️ **Known Issues**

### 🔴 Critical (Blocker)
**Missing INSERT policy on profiles table**
- **Impact:** 406 errors during signup
- **Fix:** Apply `supabase/fixes/012-safe-incremental-fix.sql`
- **Time:** 2 minutes
- **Guide:** DATABASE_GUIDE.md

### 🟡 Minor (Non-blocking)
- Redirect loop after sign out (fix included in SQL)
- Some admin pages are placeholders (work in progress)

---

## 📁 **File Organization**

```
docs/
├── 1-README.md                              # This file - main entry point
├── 2-PROJECT_GUIDE.md                       # Architecture & codebase overview
├── 3-AUTH_GUIDE.md                          # Authentication system
├── 4-DATABASE_GUIDE.md                      # Database schema & fixes
├── 5-IMPLEMENTATION_GUIDE.md                # Recent updates & testing
├── 6-SESSION_SUMMARY_OCT9_EVENING.md        # Oct 9 evening session
├── 7-FINANCE_IMPLEMENTATION_SUMMARY.md      # Financial Hub implementation
├── 8-ENGINEER_PORTAL_AUDIT_REPORT.md        # Engineer Portal audit
└── 9-Components-UI.md                       # HeroUI components guide

src/pages/
├── 1-HomePage/                 # Public landing + shared components
├── 2-auth/                     # Authentication system
├── 3-admin/                    # Admin portal (8 pages)
├── 4-client/                   # Client portal (12 pages)
├── 5-engineer/                 # Engineer portal (13 pages)
└── 6-enterprise/               # Enterprise portal (12 pages)

supabase/
├── migrations/                 # 11 database migrations
├── fixes/                      # 12 fix scripts
└── functions/                  # 4 edge functions
```

---

## 🎓 **Documentation Philosophy**

Each guide is **self-contained and focused**:
- **2-PROJECT_GUIDE** - What the system is and how it's built
- **3-AUTH_GUIDE** - How authentication works
- **4-DATABASE_GUIDE** - How data is structured and fixed
- **5-IMPLEMENTATION_GUIDE** - What was recently done
- **6-SESSION_SUMMARY** - Oct 9 evening updates
- **7-FINANCE_IMPLEMENTATION** - Financial Hub details
- **8-ENGINEER_PORTAL_AUDIT** - Portal testing report
- **9-COMPONENTS_UI** - HeroUI component library guide

---

## 💡 **Common Tasks**

| Task | Guide | Section |
|------|-------|---------|
| Understand architecture | 2-PROJECT_GUIDE | Architecture |
| Learn auth flow | 3-AUTH_GUIDE | Auth Flows |
| Fix 406 errors | 4-DATABASE_GUIDE | Critical Fixes |
| Test signup | 3-AUTH_GUIDE | Testing |
| Make auth changes | 3-AUTH_GUIDE | Developer Guide |
| Check recent work | 5-IMPLEMENTATION_GUIDE | Session Summary |
| View portal audit | 8-ENGINEER_PORTAL_AUDIT | Full Report |
| Use HeroUI components | 9-COMPONENTS_UI | Component Examples |

---

## 🆘 **Getting Help**

### Questions?
- Architecture questions → 2-PROJECT_GUIDE.md
- Auth not working → 3-AUTH_GUIDE.md
- Database errors → 4-DATABASE_GUIDE.md
- What changed → 5-IMPLEMENTATION_GUIDE.md
- Portal features → 8-ENGINEER_PORTAL_AUDIT_REPORT.md
- How to use components → 9-Components-UI.md

### Code References
- Best auth example: `src/pages/2-auth/signup/ClientSignup.tsx`
- Auth helpers: `src/pages/2-auth/others/utils/signup-helper.ts`
- Auth store: `src/pages/2-auth/others/stores/auth.ts`
- Routing: `src/routes/RoleRouter.tsx`
- Types: `src/shared/supabase/types.ts`

---

**Quality:** Production-grade, comprehensive, organized ✅
**Last Review:** October 9, 2025  
**Maintained By:** Development Team
