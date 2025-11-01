# 2.0- 🛫 Checklist Sections 1 to 16

---

## 📂 **A. Core Setup**

**Objective:**

Establish the foundational **pnpm monorepo**, CI/CD pipelines, and Supabase environment for NBCON Engineering Co-Pilot.

**Scope:**

- Initialize monorepo + workspace pathing.
- Configure automated lint/type/test pipelines.
- Sync environment keys and Supabase connection.

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Initialize monorepo (`pnpm-workspace.yaml`, `tsconfig.base.json`) | Architecture | ✅ | Verified |
| Configure `.github/workflows` (CI + nightly E2E) | DevOps | ✅ | Lint + Unit + Playwright |
| Add `.env.example` to `apps/web/` | Backend | 🔲 | Include Supabase + Stripe vars |
| Verify build & test sequence (`pnpm install`, etc.) | All | 🔲 | Confirm local + CI consistency |

---

## 🧩 **B. Phase A — UI Unification**

**Objective:**

Unify multi-role portals into one **AppLayout** using **tier-based gating** and **shared sidebar/dashboard architecture**.

**Scope:**

- Consolidate legacy portals → `/portal/`.
- Implement theme tokens + responsive layout.
- Mount CoPilot Toolbar foundation.

| Task | Component | Status | Notes |
| --- | --- | --- | --- |
| Build `AppLayout.tsx` | Frontend | 🔲 | Shared container (header/sidebar/content) |
| Implement `TierAwareSidebar.tsx` | Frontend | 🔲 | Conditional menus by `subscriptionTier` |
| Create `UnifiedDashboard.tsx` | Frontend | 🔲 | Tier-aware widgets |
| Integrate `FeatureGate.tsx` | Frontend | 🔲 | Enforce plan restrictions |
| Connect unified routes (`AppRouter.tsx`) | Frontend | 🔲 | `/dashboard`, `/projects`, `/ai-tools`, `/settings` |
| Add base `CoPilotToolbar.tsx` | Frontend | 🔲 | AI/Docs/Agents hover actions |

---

## 🔐 **C. Phase B — Access & Data Model**

**Objective:**

Transition the system to **plan-based access** using `subscription_tier` + `is_admin` instead of `role`.

**Scope:**

- Migrate schema + RLS logic.
- Sync Stripe entitlements.
- Expose reusable tier helpers.

| Task | Module | Status | Notes |
| --- | --- | --- | --- |
| Add `usePortalAccess.ts` hook | Frontend | 🔲 | Fetch `tier` + `is_admin` |
| Implement `tierMeetsRequirement()` | Shared | 🔲 | Boolean comparison |
| Migrate Supabase schema | DBA | 🔲 | Drop `role`; add `is_admin` + `subscription_tier` |
| Sync Stripe price IDs | Backend | 🔲 | Ensure consistent plan mapping |

---

## 🗄️ **D. Phase C — Database & RLS Cleanup**

**Objective:**

Complete Supabase migration to **role-agnostic security** with logging and rollback safeguards.

**Scope:**

- Drop legacy `role` column.
- Rebuild policies with `is_admin`.
- Add audit logging + verification scripts.

| Task | SQL Migration | Status | Notes |
| --- | --- | --- | --- |
| Drop `profiles.role` column | DBA | 🔲 | After verification |
| Rewrite RLS policies | DBA | 🔲 | `auth.uid() = user_id OR is_admin` |
| Audit RLS completeness | Security | 🔲 | No table without RLS |
| Add tier-change audit trigger | Backend | 🔲 | Insert into `audit_log` |
| Tag DB release `v2.0.2-db` | DevOps | 🔲 | Baseline verified snapshot |

---

## 🧪 **E. Phase D — Testing & Documentation**

**Objective:**

Achieve complete reliability through **automated testing + living documentation.**

**Scope:**

- Implement unified Jest/Vitest/Playwright test matrix.
- Validate Stripe → Supabase → UI sync.
- Generate CI/CD coverage + docs.

| Task | Area | Status | Notes |
| --- | --- | --- | --- |
| Configure Jest + Vitest | DevOps | 🔲 | Shared config |
| Write unit tests (utils/hooks) | Frontend | 🔲 | ≥90% coverage |
| Add API + Stripe sync tests | Backend | 🔲 | Webhook + entitlement logic |
| Create RLS validation SQL tests | QA | 🔲 | Verify policy security |
| Implement E2E flow (login→AI→checkout) | QA | 🔲 | Full user scenario |
| Enable UI snapshots (Percy/Chromatic) | Frontend | 🔲 | Visual regression baseline |
| Generate docs (`pnpm run docs:generate`) | Docs | 🔲 | TSDoc + Swagger |
| Publish coverage badges | DevOps | 🔲 | README integration |

---

## ⚙️ **F. Phase E — Toolbar & Enhancements**

**Objective:**

Make the **CoPilot Toolbar** the unified intelligence layer — connecting the UI with agents, AI actions, and Supabase realtime updates.

**Scope:**

- Build modular toolbar with hover actions.
- Integrate AI chat, Docs, and Quick-Actions.
- Connect Realtime + Telemetry.

| Task | Component | Status | Notes |
| --- | --- | --- | --- |
| Build `CoPilotToolbar.tsx` | Frontend | 🔲 | Floating responsive layout |
| Add icon + action registry | Frontend | 🔲 | lucide-react + JSON config |
| Connect AI ChatPanel | AI Team | 🔲 | Shared Supabase context |
| Create Quick-Actions system | Frontend + Backend | 🔲 | Modular registry |
| Integrate FeatureGate by tier | Frontend | 🔲 | Lock actions by plan |
| Connect Supabase Realtime (`toolbar_updates`) | Backend | 🔲 | Push instant updates |
| Add telemetry tracking | DevOps | 🔲 | Log usage to analytics DB |
| Write E2E hover tests | QA | 🔲 | Validate interactions |
| Document in `/docs/ui-ux/Toolbar_Spec.md` | Docs | 🔲 | Include diagram + flow |

---

## 🤖 **G. Phase F — AI Agent Training & Coverage**

**Objective:**

Train and deploy **multi-disciplinary AI agents** for engineering, management, and analytics support.

**Scope:**

- Build Civil, Electrical, and Survey/GIS agents.
- Extend to Finance, Safety, and Admin.
- Establish training, feedback, and retraining cycles.

| Agent | Role | Status | Notes |
| --- | --- | --- | --- |
| Civil Co-Pilot | Civil design/QA | 🔲 | Core training |
| Electrical Co-Pilot | Electrical modeling | 🔲 | Load calc + scheduling |
| Survey & GIS Co-Pilot | Spatial data | 🔲 | LiDAR/GNSS interpretation |
| Safety/Finance/Admin Agents | Compliance + Ops | 🔲 | Phase 2 rollout |
| Document Playbooks | Docs | 🔲 | `/docs/5-AGENT_PLAYBOOKS.md` |

---

## 🚀 **H. Deployment & Governance**

**Objective:**

Deploy securely, validate releases, and maintain ownership tracking.

**Scope:**

- Execute pre-deploy checks + rollback plan.
- Keep risk register + runbook updated.
- Assign OWNERS for key domains.

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Verify `Rollout_Runbook.md` | Release Mgr | 🔲 | Backup + migration steps |
| Review `RiskRegister.md` | Governance | 🔲 | Weekly sign-off |
| Update `OWNERS.md` | Product Ops | 🔲 | Assign contacts |
| Execute staging deploy | DevOps | 🔲 | Tag `v2.0.3-staging` |
| Run smoke + admin tests | QA | 🔲 | Post-deploy verification |

---

## 🧭 **I. Milestones & Version Tags**

| Milestone | Tag | Outcome |
| --- | --- | --- |
| Layout + Sidebar Stable | v2.0.1 | Unified UI confirmed |
| RLS Migration Complete | v2.0.2 | DB cleaned & verified |
| Toolbar Beta | v2.0.3 | Toolbar live |
| First AI Agent Cycle | v2.1.0 | Civil + Electrical deployed |
| Stripe Integration Stable | v2.1.1 | Billing + entitlement live |
| Enterprise Integration | v2.2.0 | APIs connected |
| Production Rollout | v2.3.0 | Public launch |

---

## 💵 **J. Section 14 — Stripe Integration & Payment Gateway**

**Objective:**

Enable **secure billing + entitlement management** through Stripe, synchronized in real time with Supabase.

**Scope:**

- Implement checkout, billing portal, and webhooks.
- Map Stripe price IDs → `subscription_tier`.
- Automate tier gating + audit logs.

| Task | Component / File | Status | Notes |
| --- | --- | --- | --- |
| Create Stripe account + configure tiers | Product Ops | 🔲 | Free / Pro / Enterprise |
| Add env vars (`STRIPE_*`) | Backend | 🔲 | Add to `.env` + docs |
| Implement `checkout.ts` Edge Function | Backend | 🔲 | Session creation |
| Add `BillingPortalButton.tsx` | Frontend | 🔲 | Portal redirect |
| Build `/stripe-webhook` handler | Backend | 🔲 | Handles events + sync |
| Create `subscription_events` table | DBA | 🔲 | Log tier changes |
| Sync Stripe → Supabase | Backend | 🔲 | Update `profiles.subscription_tier` |
| Integrate FeatureGate with tier mapping | Frontend | 🔲 | Locks/unlocks tools |
| Add sandbox test cards | QA | 🔲 | 4242 test validation |
| Write E2E payment tests | QA | 🔲 | Full upgrade/downgrade flow |
| Update docs `/docs/payments/Stripe_Integration.md` | Docs | 🔲 | Flow diagrams |
| Add risk entry in `RiskRegister.md` | Governance | 🔲 | Webhook failure / quota overage |
| Include Stripe tasks in `Rollout_Runbook.md` | Release Mgr | 🔲 | Pre-deploy & rollback |
| Assign backend/ops owners in `OWNERS.md` | Product Ops | 🔲 | Add Slack handles |
| Tag release `v2.1.1-payments` | DevOps | 🔲 | Post-deploy smoke test. |

---