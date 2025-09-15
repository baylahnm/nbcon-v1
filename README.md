# Product Requirements Document (PRD)

## nbcon – Engineering Marketplace Platform

**Document Version:** 1.0
**Date:** January 2025
**Status:** Draft

---

## 1. EXECUTIVE SUMMARY

nbcon is a revolutionary engineering marketplace platform designed specifically for Saudi Arabia's engineering sector, combining Uber's on-demand convenience with LinkedIn's professional networking capabilities. The platform connects certified engineers with clients through AI-powered matching, supporting everything from quick site inspections to complex multi-phase projects. It features geofenced check-ins, milestone-based escrow payments, real-time tracking, and Saudi Council of Engineers (SCE) credential verification.

The platform directly supports Saudi Vision 2030 by creating the Kingdom's first comprehensive digital ecosystem for professional engineering services, incorporating IoT integration, predictive analytics, blockchain verification, and robust compliance frameworks.

---

## 2. PRODUCT OVERVIEW

### 2.1 Product Vision

Create a trusted, efficient, and compliant digital marketplace that transforms how engineering services are procured, delivered, and managed in Saudi Arabia.

### 2.2 Value Proposition

* **For Clients:** Instant access to verified engineers, transparent pricing, milestone-based payments, and quality assurance
* **For Engineers:** Steady project pipeline, secure payments, professional growth, and streamlined operations
* **For Enterprises:** Workforce optimization, compliance management, and comprehensive analytics
* **For the Kingdom:** Digital transformation of engineering sector aligned with Vision 2030

### 2.3 Key Differentiators

* Saudi-first design with full Arabic/RTL support and Hijri calendar integration
* SCE verification and compliance built-in
* Geofenced check-in system for site verification
* ZATCA-compliant e-invoicing
* Milestone-based escrow system
* Real-time bilingual messaging with translation

---

## 3. GOALS AND OBJECTIVES

### 3.1 Business Goals

* Capture 30% of Saudi Arabia's engineering services market within 3 years
* Process SAR 500M in gross merchandise value (GMV) by Year 2
* Achieve 10,000+ verified engineers on platform
* Maintain 95% on-time project delivery rate
* Achieve Net Promoter Score (NPS) of 70+

### 3.2 User Goals

* **Engineers:** Find consistent work, get paid reliably, build reputation
* **Clients:** Access quality engineers quickly, manage projects efficiently, ensure compliance
* **Enterprises:** Optimize resource utilization, maintain compliance, reduce procurement friction

### 3.3 Technical Goals

* Sub-1.5 second page load times
* 99.9% uptime SLA
* Real-time synchronization across all touchpoints
* Offline-first architecture with seamless sync
* WCAG 2.2 AA accessibility compliance

---

## 4. TARGET USERS

### 4.1 Primary Personas

**Engineer (Service Provider)**

* Demographics: 25-45 years, SCE certified, 3+ years experience
* Needs: Steady income, professional growth, payment security
* Pain Points: Irregular work, payment delays, client acquisition

**Client (Individual/SMB)**

* Demographics: Property owners, small businesses, project managers
* Needs: Quick access to qualified engineers, transparent pricing, quality assurance
* Pain Points: Finding verified engineers, project management complexity, compliance

**Enterprise Client**

* Demographics: Large corporations, government entities, real estate developers
* Needs: Bulk procurement, workforce management, compliance tracking
* Pain Points: Vendor management, invoice processing, regulatory compliance

**Platform Administrator**

* Demographics: Internal operations team
* Needs: Platform health monitoring, dispute resolution, compliance management
* Pain Points: Fraud detection, quality control, incident management

### 4.2 User Segments by Role

* **Engineers:** 10,000+ target users
* **Individual Clients:** 50,000+ target users
* **Enterprise Clients:** 500+ organizations
* **Admin Users:** 50+ internal staff

---

## 5. KEY FEATURES AND REQUIREMENTS

### 5.1 Core Features

#### 5.1.1 Authentication & Onboarding

* Phone-based OTP authentication
* Role selection (Engineer/Client/Enterprise)
* Profile creation with SCE verification
* KYC/AML compliance checks
* Service area definition (engineers)
* Company association (enterprise users)

#### 5.1.2 Dashboard (Role-Aware)

* **Engineer Dashboard:** Jobs nearby, active projects, earnings, milestones, verification status
* **Client Dashboard:** Active jobs, awaiting quotes, payment status, recommended engineers, compliance indicators
* **Enterprise Dashboard:** Portfolio overview, workforce utilization, financial snapshot, compliance metrics, team management

#### 5.1.3 Browse & Discovery

* 30 engineering service categories
* Advanced filtering (location, price, rating, SCE status)
* Engineer profiles with portfolios
* Favorites functionality
* AI-powered recommendations

#### 5.1.4 Job Management

* Job creation wizard (quick/advanced/emergency)
* Quote management system
* Milestone-based project structure
* Real-time status tracking
* File sharing & version control
* Integrated messaging per job

#### 5.1.5 Financial System

* **Escrow:** Milestone funding, automated release, dispute resolution, multi-party approval
* **Invoicing:** ZATCA e-invoices, VAT (15%), multiple payment methods, reconciliation
* **Payouts:** Scheduled disbursements, multiple withdrawal options, tax documentation, reporting

#### 5.1.6 Communication

* Real-time messaging, file attachments (100MB), voice notes (with transcription), translation (EN↔AR), video calls, project group chats

#### 5.1.7 Location Services

* Geofenced check-in/out, real-time tracking, service area management, distance-based matching, site verification

#### 5.1.8 Analytics & Reporting

* Role-specific dashboards, custom reports, export (CSV/PDF), real-time metrics, predictive analytics, compliance reporting

#### 5.1.9 Help & Support

* Bilingual knowledge base, ticket system, live chat, tutorials, system status, community forums

### 5.2 Advanced Features

* **AI/ML:** Smart matching, price recommendation, fraud detection, quality prediction, demand forecasting
* **IoT Integration:** Sensor monitoring, alerts, performance tracking
* **Blockchain:** Credential verification, immutable contracts, audit trail, digital signatures

---

## 6. TECHNICAL REQUIREMENTS

### 6.1 Technology Stack

* **Frontend:** Vite + React + TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **State Management:** Zustand
* **Routing:** React Router
* **Backend:** Supabase (Auth, Postgres, Storage, Edge Functions)
* **Realtime:** Supabase Realtime
* **Maps:** Maplibre/Leaflet
* **Analytics:** Custom event system

### 6.2 Architecture

* Monorepo, component-based architecture, PWA, offline-first, responsive, cloud-native deployment

### 6.3 Database Schema

* Profiles, companies, jobs, bids, milestones, escrows, invoices, payments, messages, files, reviews, verifications

### 6.4 API Design

* RESTful + GraphQL (complex queries)
* WebSocket for realtime
* Rate limiting, versioning, OpenAPI docs

### 6.5 Performance

* Page Load < 1.5s
* API < 200ms (p95)
* Realtime < 100ms latency
* File uploads up to 100MB
* 10,000+ concurrent users

---

## 7. USER EXPERIENCE REQUIREMENTS

### 7.1 Design System

* Token-based theming
* Consistent component library
* Light/Dark support
* Motion design guidelines
* Responsive breakpoints
* Print-friendly layouts

### 7.1.1 Theme System

**Brand Colors**

* Primary: `#27c862` (Green)
* Success: `#1e9e6b`
* Warning: `#d76e00`
* Danger: `#c9342a`

**Light Theme**

* Primary: `#27c862`
* Background: `#ffffff`
* Surface/Card: `#efefef`
* Foreground: `#101010`
* Border/Input: `#e6e6e6`

**Dark Theme**

* Primary: `#27c862`
* Background: `#000000`
* Surface/Card: `#202020`
* Foreground: `#e8e8e8`
* Secondary: `#202020`
* Border/Input: `#202020`

### 7.2 Accessibility

* WCAG 2.2 AA compliance
* Screen reader & keyboard support
* Focus management
* Contrast ratio ≥ 4.5:1
* Touch targets ≥ 44px
* Semantic HTML + ARIA roles

### 7.3 Mobile Experience

* Native-like performance
* Touch-optimized UI
* Offline mode
* Push notifications
* GPS/location services
* Camera integration
* Biometric authentication

---

## 8. LOCALIZATION REQUIREMENTS

* Bilingual: English + Arabic (RTL support)
* Hijri calendar, Friday–Saturday weekend
* Local phone, SAR currency, Arabic numerals
* Prayer time considerations
* ZATCA, VAT, PDPL, SCE integration

---

## 9. COMPLIANCE & SECURITY

* **Data Protection (PDPL):** Consent mgmt, data minimization, breach notification
* **Financial Compliance:** VAT, AML/KYC, ZATCA e-invoicing, withholding tax
* **Security:** E2E encryption, 2FA, WebAuthn, OWASP, security audits
* **Professional Compliance:** SCE verification, license validation, credential mgmt, indemnity tracking

---

## 10. SUCCESS METRICS

* **Business:** GMV, Take Rate, MAU, CAC, LTV, Churn
* **Operational:** Job completion, match speed, dispute resolution time, uptime
* **User Satisfaction:** NPS, CSAT, retention, feature adoption, app ratings
* **Quality:** On-time delivery, verification rate, review rate, rework %

---

## 11. IMPLEMENTATION ROADMAP

* **Patch 1:** Auth & Onboarding
* **Patch 2:** Job Management
* **Patch 3:** Payments & Finance
* **Patch 4:** Mobile & Settings
* **Patch 5:** Admin Dashboard
* **Patch 6–9:** Advanced analytics, IoT, blockchain, website

**Launch Phases:**

1. Beta (100 engineers) – Months 1–2
2. Riyadh release – Months 3–4
3. Expansion to major cities – Months 5–6
4. National rollout – Months 7–12

---

## 12. RISKS & MITIGATIONS

* **Scalability issues →** Load testing, auto-scaling, CDN
* **Payment failures →** Multi-gateway redundancy, offline queues
* **Low adoption →** Incentive programs, guaranteed earnings
* **Regulatory changes →** Compliance team, flexible architecture
* **Fraud/data breaches →** AI fraud detection, encryption, audits

---

## 13. DEPENDENCIES

* **External:** SCE APIs, ZATCA, payment gateways, SMS/WhatsApp, map providers
* **Internal:** Design system, localization, compliance/legal, customer support, marketing

---

## 14. APPENDICES

* Service Categories (EN/AR)
* User Flow Diagrams
* API Documentation
* Compliance Matrix
* Glossary

---