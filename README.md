# 🚀 nbcon - Saudi Arabia's Engineering Services Marketplace

**Version:** 2.0  
**Status:** Production Ready  
**Last Updated:** October 12, 2025

---

## 📖 Documentation

**All documentation consolidated into 4 essential guides:**

### Quick Links

- 📚 **[Documentation Hub](docs/README.md)** - Start here for navigation
- 🚀 **[Getting Started](docs/1-GETTING_STARTED.md)** - Quick start & basics
- 🏗️ **[Architecture Guide](docs/2-ARCHITECTURE_GUIDE.md)** - System design & features
- 🎨 **[UI Design System](docs/3-UI_DESIGN_SYSTEM.md)** - Components & patterns
- 🔧 **[Production Guide](docs/4-PRODUCTION_GUIDE.md)** - Bug fixing & deployment

---

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
npm run dev

# Open browser
http://localhost:8080/auth
```

**Test Account:**
```
Email: info@nbcon.org
Password: Qazwsx1234@
```

---

## 🎯 What is nbcon?

Saudi Arabia's first comprehensive digital marketplace for professional engineering services.

### Key Features

- 🚗 **Uber-like** on-demand engineer matching
- 💼 **LinkedIn-style** professional networking
- 🤖 **AI-powered** smart assistance
- 📍 **Geofenced** check-ins for site verification
- 💰 **Escrow** milestone-based payments
- 🏗️ **SCE compliant** with Saudi Council of Engineers

### Four User Roles

1. **Engineers** - Find work, manage jobs, track earnings
2. **Clients** - Post jobs, browse engineers, manage projects
3. **Enterprises** - Team management, procurement, analytics
4. **Admins** - Platform oversight, risk management

---

## 📊 Project Stats

```
Files:          725+ source files
Components:     590+ React components  
Database:       55 tables
Tech Stack:     React 18 + TypeScript + Supabase + shadcn/ui
Languages:      English + Arabic (RTL)
Status:         100% Production Ready
```

---

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)  
**Hosting:** Vercel  
**Payments:** Stripe  
**State:** Zustand  
**i18n:** i18next

---

## 📁 Project Structure

```
src/pages/
├── 1-HomePage/          # Public landing + shared components
├── 2-auth/              # Authentication (4 signup flows)
├── 3-admin/             # Admin portal (8 pages)
├── 4-client/            # Client portal (12 pages)
├── 5-engineer/          # Engineer portal (14 pages) ⭐
└── 6-enterprise/        # Enterprise portal (12 pages)

supabase/
├── migrations/          # 11 database migrations
├── fixes/               # 12 fix scripts
└── functions/           # 4 edge functions

docs/
├── README.md                  # Documentation hub
├── 1-GETTING_STARTED.md       # Quick start guide
├── 2-ARCHITECTURE_GUIDE.md    # System architecture
├── 3-UI_DESIGN_SYSTEM.md      # UI/UX patterns
└── 4-PRODUCTION_GUIDE.md      # Bug fixing & deployment
```

---

## ⚠️ Important: Apply Database Fix First

Before testing signup, apply the critical database fix:

1. Open Supabase SQL Editor
2. Run `supabase/fixes/012-safe-incremental-fix.sql`
3. Verify success messages

**Time:** 2 minutes  
**Fixes:** 406 errors during signup

See [4-PRODUCTION_GUIDE.md](docs/4-PRODUCTION_GUIDE.md) for details.

---

## 🎓 Learning Resources

### For New Developers

1. Read [Getting Started](docs/1-GETTING_STARTED.md) - **20 min**
2. Explore running application - **30 min**
3. Read [Architecture Guide](docs/2-ARCHITECTURE_GUIDE.md) - **40 min**

### For Designers

1. Read [UI Design System](docs/3-UI_DESIGN_SYSTEM.md) - **30 min**
2. Study component examples - **1 hour**

### For DevOps

1. Read [Production Guide](docs/4-PRODUCTION_GUIDE.md) - **25 min**
2. Review deployment procedures - **30 min**

---

## 🌟 Recent Highlights

### October 2025 Redesigns

**✅ Learning Center (Udemy-Style)**
- Full-screen video player
- Dynamic course pages
- Progress tracking & certificates
- Learning paths & skill assessments

**✅ Network Page (LinkedIn-Style)**
- Connection strength indicators
- Rich metadata display
- Activity timeline
- Request management

**✅ Profile Page (Supabase Integrated)**
- 8 main sections
- Real-time data from 6 tables
- LinkedIn-style design
- Profile completion tracking

**✅ Jobs Page (AI-Powered)**
- AI matching scores
- Earnings calculator
- Skills gap analysis
- Map view with radius filter

---

## 📞 Support

**Questions?** See [Documentation Hub](docs/README.md)  
**Issues?** Check [Production Guide](docs/4-PRODUCTION_GUIDE.md) → Troubleshooting  
**Contributing?** Follow patterns in [Architecture Guide](docs/2-ARCHITECTURE_GUIDE.md)

---

## 📄 License

Proprietary - nbcon © 2025

---

**Built with ❤️ for Saudi Arabia's Vision 2030**
