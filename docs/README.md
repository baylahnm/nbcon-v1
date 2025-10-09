# 📚 nbcon Documentation

**Last Updated:** October 9, 2025  
**Status:** Production Ready (pending database fix)

---

## 🎯 **Quick Navigation**

### 🔴 **URGENT - Start Here**
→ **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** - Apply critical database fix (2 minutes)

### 📖 **Main Guides**
1. **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)** - Architecture, tech stack, codebase overview
2. **[AUTH_GUIDE.md](AUTH_GUIDE.md)** - Authentication system (flows, security, testing)
3. **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** - Database schema, fixes, error handling
4. **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Recent updates, testing reports

---

## 🚀 **Quick Start**

### For New Developers
```bash
1. Read: PROJECT_GUIDE.md (architecture overview)
2. Read: AUTH_GUIDE.md (auth system)
3. Start dev server: npm run dev
4. Open: http://localhost:8080/auth
```

### For Testing
```bash
1. Read: AUTH_GUIDE.md → Testing section
2. Start server: npm run dev
3. Follow test credentials in guide
```

### For Database Issues
```bash
1. Read: DATABASE_GUIDE.md
2. Apply SQL fix (2 minutes)
3. Test signup flow
4. Review cleanup analysis (see DATABASE_GUIDE.md → Cleanup section)
```

---

## 📊 **Project Stats**

```
Total Files:        701 source files
Components:         565 React components
Database Tables:    48 tables
Documentation:      5 organized guides
Tech Stack:         React 18 + TypeScript + Supabase
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
├── README.md                   # This file - main entry point
├── PROJECT_GUIDE.md            # Architecture & codebase overview
├── AUTH_GUIDE.md               # Authentication system
├── DATABASE_GUIDE.md           # Database schema & fixes
└── IMPLEMENTATION_GUIDE.md     # Recent updates & testing

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
- **PROJECT_GUIDE** - What the system is and how it's built
- **AUTH_GUIDE** - How authentication works
- **DATABASE_GUIDE** - How data is structured and fixed
- **IMPLEMENTATION_GUIDE** - What was recently done

---

## 💡 **Common Tasks**

| Task | Guide | Section |
|------|-------|---------|
| Understand architecture | PROJECT_GUIDE | Architecture |
| Learn auth flow | AUTH_GUIDE | Auth Flows |
| Fix 406 errors | DATABASE_GUIDE | Critical Fixes |
| Test signup | AUTH_GUIDE | Testing |
| Make auth changes | AUTH_GUIDE | Developer Guide |
| Check recent work | IMPLEMENTATION_GUIDE | Session Summary |

---

## 🆘 **Getting Help**

### Questions?
- Architecture questions → PROJECT_GUIDE.md
- Auth not working → AUTH_GUIDE.md
- Database errors → DATABASE_GUIDE.md
- What changed → IMPLEMENTATION_GUIDE.md

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
