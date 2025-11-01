# 1.0 -👌nbcon Co-Pilot App Plan: Index

---

[1.1- 🏗️ Monorepo Scaffolding Plan ](1%201-%20%F0%9F%8F%97%EF%B8%8F%20Monorepo%20Scaffolding%20Plan%2029d608c2eef78037ba91df0362152ff0.md)

[**1.2- 🧭 Menu Navigation** ](1%202-%20%F0%9F%A7%AD%20Menu%20Navigation%2029d608c2eef78029bf41c1f4fff4c343.md)

[1.3- 🧾 Portal: Page Details & Purpose](1%203-%20%F0%9F%A7%BE%20Portal%20Page%20Details%20&%20Purpose%2029d608c2eef78018ac91d08d02b89d27.md)

[1.4- 🗺️ Portal: Subscription Plans](1%204-%20%F0%9F%97%BA%EF%B8%8F%20Portal%20Subscription%20Plans%2029d608c2eef7800abdc6ffc8262b3f56.md)

[2.0- 🛫 Checklist **Sections 1 to 16**](2%200-%20%F0%9F%9B%AB%20Checklist%20Sections%201%20to%2016%2029d608c2eef7804c8eccc2df8a64b267.md)

[**2.1-** 🎯 **Scope & Goal (Section 1)**](2%201-%20%F0%9F%8E%AF%20Scope%20&%20Goal%20(Section%201)%2029d608c2eef78058b599efc50b47592f.md)

[ **2.2-** 🗿 **Current State Recap (Section 2)**](2%202-%20%F0%9F%97%BF%20Current%20State%20Recap%20(Section%202)%2029d608c2eef780ba9491c5d81f102496.md)

[**2.3-** 🧠 **Phase A: UI Unification (Section 3)**](2%203-%20%F0%9F%A7%A0%20Phase%20A%20UI%20Unification%20(Section%203)%2029d608c2eef780efbc77f0aed3eea0ca.md)

[2.4- 🔐 **Phase B: Access & Data Model (Section 4)**](2%204-%20%F0%9F%94%90%20Phase%20B%20Access%20&%20Data%20Model%20(Section%204)%2029d608c2eef780fd9a40ca180e4a7a6b.md)

[2.5-🗄️**Phase C: Database & RLS Cleanup (Section 5)**](2%205-%F0%9F%97%84%EF%B8%8FPhase%20C%20Database%20&%20RLS%20Cleanup%20(Section%205)%2029d608c2eef780b385e3edd6cad6b076.md)

[**2.6 -** 🧪 **Phase D: Testing & Documentation (Section 6)**](2%206%20-%20%F0%9F%A7%AA%20Phase%20D%20Testing%20&%20Documentation%20(Section%206%2029d608c2eef780458037ddd75a214776.md)

[**2.7 -** ⚒️ **Phase E: Toolbar & Enhancements (Section 7)**](2%207%20-%20%E2%9A%92%EF%B8%8F%20Phase%20E%20Toolbar%20&%20Enhancements%20(Section%207%2029d608c2eef7807e8b6de681065decb9.md)

[**2.8 -** 🤖 **AI Agent Training Plan**  **(Section 8)**](2%208%20-%20%F0%9F%A4%96%20AI%20Agent%20Training%20Plan%20(Section%208)%2029d608c2eef780f985acda507203bf04.md)

[2.9 **-** 🌍 **Expanded AI Agent Coverage** **(Section 9)**](2%209%20-%20%F0%9F%8C%8D%20Expanded%20AI%20Agent%20Coverage%20(Section%209)%2029d608c2eef7803889a9edab67f971c2.md)

[**2.10 -** 🗺️ **Implementation Roadmap (Section 10)**](2%2010%20-%20%F0%9F%97%BA%EF%B8%8F%20Implementation%20Roadmap%20(Section%2010)%2029d608c2eef7809bac74fb1797e01082.md)

[2.11 - 🔁 **Post-Launch Monitoring & Continuous Improvement**  **(Section 11)**](2%2011%20-%20%F0%9F%94%81%20Post-Launch%20Monitoring%20&%20Continuous%20Impro%2029d608c2eef7808e9ec3fe1cd07bcd7c.md)

[**2.12 -** 🏛️ **Governance & Scaling Framework (Section 12)**](2%2012%20-%20%F0%9F%8F%9B%EF%B8%8F%20Governance%20&%20Scaling%20Framework%20(Section%20%2029d608c2eef78091b2c4f5935ab334ac.md)

[2.13 - 🤝 **Enterprise Integration & Partnerships** **(Section 13)**](2%2013%20-%20%F0%9F%A4%9D%20Enterprise%20Integration%20&%20Partnerships%20(Se%2029d608c2eef780f79eafdc9f7450b4b9.md)

[**2.14 -** 💵 **Stripe & Subscription Management System** **(Section 14)**](2%2014%20-%20%F0%9F%92%B5%20Stripe%20&%20Subscription%20Management%20System%20(%2029d608c2eef780b491ebd666c5e143cf.md)

[**2.15 -** 🧭 **Portal Navigation & Tier Visibility** (**Section 15**)](2%2015%20-%20%F0%9F%A7%AD%20Portal%20Navigation%20&%20Tier%20Visibility%20(Sect%2029d608c2eef780509651dd990b15c0ff.md)

[2.**16 -** 🔒**Testing & Deployment Enforcement** (**Section 16**)](2%2016%20-%20%F0%9F%94%92Testing%20&%20Deployment%20Enforcement%20(Section%20%2029d608c2eef7806e914af1b2e0970de1.md)

---

## **1.0 — Main Build Layer (Core Blueprints)**

---

### **1.1 — 🏗️ Monorepo Scaffolding Plan**

Defines NBCON’s **unified workspace foundation**.

Covers the structural blueprint for `apps/`, `packages/`, and `configs/`, dependency isolation under `pnpm`, TypeScript path mapping, and workspace guards.

Ensures modular scalability, reproducible builds, shared type safety, and consistent CI/CD pipelines across web + mobile + backend.

---

### **1.2 — 🧭 Menu Navigation**

Establishes the **navigation logic** and visibility rules for all tiers.

Implements the dynamic `TierAwareSidebar`, `FeatureGate`, and `menuConfig.ts` system to render routes based solely on `subscription_tier`.

Defines icon mapping, group hierarchy, and contextual routing between **Core**, **AI Tools**, **Finance**, and **Enterprise Ops**.

Guarantees one deterministic menu experience across Web, Mobile, and Docs.

---

### **1.3 — 🧾 Portal: Page Details & Purpose**

Comprehensive documentation of every portal page, its **function, data dependencies, and AI integration points**.

Lists expected user inputs, backend outputs, and plan-based access logic.

Acts as the **source-of-truth for frontend + backend teams** to synchronize UI, data models, and API endpoints.

Each page entry includes description, purpose, expected result, and connected AI agents.

---

### **1.4 — 🗺️ Portal: Subscription Plans**

Defines the **plan hierarchy** — Free, Basic, Pro, Enterprise — and maps all functional, AI, and financial entitlements.

Outlines Stripe → Supabase webhook synchronization and FeatureGate enforcement.

Includes quotas (projects per tier, AI tokens), billing portal URLs, and entitlement update workflow.

Provides the master **plan-to-feature matrix** for engineering, product, and billing teams.

---

## **2.0 — Execution Phases (Unified Build Process)**

---

### **2.1 — 🎯 Scope & Goal (Section 1)**

Defines NBCON PRO’s purpose as a **unified AI Co-Pilot for engineering**.

Eliminates multiple user roles in favor of a **single client persona** with contextual plan gating.

Targets one adaptive system where every interaction, dataset, and AI module is unified under Supabase + Stripe.

---

### **2.2 — 🗿 Current State Recap (Section 2)**

Full system audit of the current codebase and database.

Reviews monorepo architecture, RLS policies, schema inconsistencies, and legacy UI forks.

Documents which components remain stable and which require full refactor or removal prior to unification.

---

### **2.3 — 🧠 Phase A — UI Unification (Section 3)**

Rebuilds all front-end layers into a **single layout system** using `UnifiedDashboard` and `AppLayout`.

Merges legacy portals into one responsive React + Tailwind foundation.

Integrates `FeatureGate` to dynamically show/hide components by plan, replacing all role-based rendering logic.

---

### **2.4 — 🔐 Phase B — Access & Data Model (Section 4)**

Centralizes all access control within Supabase profiles using `subscription_tier` + `is_admin`.

Deletes deprecated `role` columns, adjusts RLS policies, and migrates auth logic into `usePortalAccess()`.

Guarantees plan-driven access for frontend and backend with zero role divergence.

---

### **2.5 — 🗄️ Phase C — Database & RLS Cleanup (Section 5)**

Performs database sanitization: drops legacy roles, rewrites RLS policies, and adds audit logging.

Implements rollback scripts and migration automation under `supabase/migrations/`.

Finalizes database release `v2.0.2-db` with policy validation and test coverage.

---

### **2.6 — 🧪 Phase D — Testing & Documentation (Section 6)**

Unifies testing infrastructure (Vitest + Playwright + SQL policy tests).

Enforces CI/CD pipeline checks for lint, type, unit, E2E before deploy.

Generates a live documentation suite (`/docs/tests`, `/docs/api`, `/docs/devops`) with coverage reports ≥ 90 %.

---

### **2.7 — ⚒️ Phase E — Toolbar & Enhancements (Section 7)**

Transforms the interface into an interactive AI command surface.

Launches `CoPilotToolbar` with quick-actions, AI hover cards, and Supabase Realtime updates.

Integrates telemetry, prompt history, and cross-page AI context sharing.

---

### **2.8 — 🤖 AI Agent Training Plan (Section 8)**

Defines data pipelines and training regimens for discipline-specific AI agents (Civil, Electrical, Mechanical, Surveying, GIS).

Outlines context windows, prompt patterns, feedback loops, and ground-truth datasets.

Ensures each agent responds with domain accuracy and consistency through ongoing reinforcement.

---

### **2.9 — 🌍 Expanded AI Agent Coverage (Section 9)**

Expands AI ecosystem to enterprise functions: Accounting, HR, Procurement, Safety, Legal, IT.

Standardizes persona definitions, prompt chaining, and model weights across domains.

Implements the `/docs/5-AGENT_PLAYBOOKS.md` framework for future agent governance.

---

### **2.10 — 🗺️ Implementation Roadmap (Section 10)**

Sequential deployment plan from development → staging → production.

Defines phase milestones, migration tags (`v2.0.1 → v2.3.0`), and release gates for each CI/CD stage.

Provides timeline, owners, and success metrics for delivery tracking.

---

### **2.11 — 🔁 Post-Launch Monitoring & Continuous Improvement (Section 11)**

Implements telemetry pipelines for auth failures, RLS exceptions, AI usage analytics, and UX feedback.

Automates data collection into Supabase + PostHog dashboards.

Operates weekly review loops to optimize stability, model accuracy, and user experience.

---

### **2.12 — 🏛️ Governance & Scaling Framework (Section 12)**

Defines data governance, AI ethics, and compliance policy structure.

Establishes domain owners, review committees, and change-approval protocols.

Aligns scaling and security with PDPL, ISO 27001, and Aramco client standards.

---

### **2.13 — 🤝 Enterprise Integration & Partnerships (Section 13)**

Blueprint for enterprise-grade interoperability (SSO, API, SDK hooks).

Supports integration with Aramco, municipalities, and engineering offices via secure data pipelines.

Documents authentication flows, SLA contracts, and partner onboarding models.

---

### **2.14 — 💵 Stripe & Subscription Management System (Section 14)**

Implements Stripe Checkout and Billing Portal for plan upgrades and renewals.

Handles webhooks to update `profiles.subscription_tier` and audit entitlement changes.

Integrates Stripe events with FeatureGate and TierAwareSidebar for real-time plan sync.

---

### **2.15 — 🧭 Portal Navigation & Tier Visibility (Section 15)**

Centralizes route logic and page visibility for Free, Pro, and Enterprise tiers.

Defines the visibility matrix for all modules and toolbar actions.

Ensures deterministic user journeys and zero cross-tier UI discrepancy.

---

### **2.16 — 🔒 Testing & Deployment Enforcement (Section 16)**

Final guard stage of the build pipeline.

CI/CD enforces lint, type, unit, E2E, and visual regression checks before merge.

Automatically tags validated builds and blocks non-compliant deployments from promotion.

---