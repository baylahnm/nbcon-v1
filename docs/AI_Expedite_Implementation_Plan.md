# AI Expedite Implementation Plan

**Document Version:** 1.0  
**Date:** January 2025  
**Status:** Implementation Ready

---

## 🎯 **EXECUTIVE SUMMARY**

This document outlines a comprehensive plan to integrate AI capabilities across NBCON's engineering services platform, enabling users to expedite their workflows through intelligent automation, service-specific AI modes, and smart toolchains.

**Goal:** Transform NBCON from a traditional marketplace into an AI-powered engineering platform that accelerates project delivery and improves user experience.

---

## 🏗️ **ARCHITECTURE OVERVIEW**

### **Core Principles**
- **Single routing point** with drop-in Edge Function for custom models
- **Mode-first UX** that maps directly to service workflows
- **Memory persistence** using Supabase with vector search
- **Agent tool hooks** for service automation
- **Comprehensive guardrails** and observability

### **Technical Stack**
- **Frontend:** React + TypeScript + existing `useAiStore`
- **Backend:** Supabase Edge Functions + PostgreSQL + pgvector
- **AI Models:** Multi-provider routing (OpenAI, Vertex, custom)
- **Observability:** OpenTelemetry + structured logging

---

## 📋 **IMPLEMENTATION PHASES**

## **Phase 0: Foundation Setup** (Week 1-2)

### **1.1 Model Routing Infrastructure**
```typescript
// aiClient.ts - Enhanced routing with feature flags
type ModelRoute = "openai:gpt-4.1-mini" | "vertex:gemini-1.5" | "local:nbcon-edge";
type Mode = "chat" | "research" | "image" | "agent" | "connectors" | 
           "site-inspection" | "structural-analysis" | "hvac-design" | 
           "electrical-design" | "surveying" | "hse-consulting" | 
           "drone-surveying" | "equipment-maintenance" | "soil-testing";

interface AiCall {
  mode: Mode;
  prompt: string;
  userId: string;
  budgetMs?: number;        // SLA guard
  budgetUsd?: number;       // cost guard
  traceId?: string;
  metadata?: Record<string, any>;
}
```

### **1.2 Supabase Edge Function**
```typescript
// supabase/functions/ai/index.ts
// - Zod validation
// - Idempotency keys
// - OpenTelemetry tracing
// - Multi-provider routing
```

### **1.3 Database Schema Extensions**
```sql
-- Thread-level service context
ALTER TABLE threads ADD COLUMN IF NOT EXISTS service_mode TEXT;
ALTER TABLE threads ADD COLUMN IF NOT EXISTS service_metadata JSONB;

-- Vector memory for RAG
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS message_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON message_memory USING ivfflat (embedding vector_l2_ops);
```

---

## **Phase 1: Service-Specific Modes** (Week 3-4)

### **1.1 Service Mode Configuration**
```typescript
// useAiStore - Data-driven service modes
export const MODES: Record<string, {
  system: string;
  tools: ToolKey[];
  inputSchema?: any;
  costCap?: number;
  timeCap?: number;
}> = {
  "site-inspection": {
    system: "You are a civil site inspection AI. Be concise, cite findings with page/filename.",
    tools: ["ocr", "defect-detection", "report", "crm"],
    costCap: 0.50,
    timeCap: 10000
  },
  "structural-analysis": {
    system: "You are a structural engineering assistant. Use Saudi Building Code references.",
    tools: ["report", "calculations", "code-compliance"],
    costCap: 1.00,
    timeCap: 15000
  },
  "hvac-design": {
    system: "You are an HVAC design specialist. Focus on energy efficiency and Saudi climate conditions.",
    tools: ["load-calculations", "equipment-selection", "energy-modeling"],
    costCap: 0.75,
    timeCap: 12000
  },
  // ... additional service modes
};
```

### **1.2 UI Integration**
- Update mode switcher to read from `MODES` configuration
- Add service-specific icons and descriptions
- Implement mode-aware prompt assembly

### **1.3 Memory Enhancement**
- Implement vector search for context retrieval
- Add PII redaction before memory storage
- Create memory hydration system

---

## **Phase 2: Agent Tools & Automation** (Week 5-6)

### **2.1 Tool Definition System**
```typescript
// server: agentTools.ts
export const tools = {
  crm_update: {
    schema: z.object({ 
      leadId: z.string(), 
      stage: z.enum(["new", "qualified", "won", "lost"]) 
    }),
    run: async (args) => { /* call CRM API */ }
  },
  schedule_site_visit: {
    schema: z.object({ 
      projectId: z.string(), 
      dateISO: z.string() 
    }),
    run: async (args) => { /* calendar integration */ }
  },
  generate_report: {
    schema: z.object({ 
      templateId: z.string(), 
      data: z.record(z.any()) 
    }),
    run: async (args) => { /* report generation */ }
  }
} as const;
```

### **2.2 Service-Specific Tools**
- **Site Inspection:** Image analysis, defect detection, report generation
- **Structural Analysis:** Load calculations, code compliance checking
- **HSE Consulting:** Risk assessment, compliance monitoring
- **Drone Surveying:** Data processing, 3D model generation

### **2.3 Automation Hooks**
- Integrate with existing project management system
- Connect to calendar and scheduling
- Link to CRM and lead management

---

## **Phase 3: Production Readiness** (Week 7-8)

### **3.1 Guardrails Implementation**
- **Validation:** Zod schemas on client and server
- **Rate Limiting:** Per user/tenant/mode limits
- **Content Filtering:** Role-based content policies
- **File Security:** Enhanced file validation and virus scanning

### **3.2 Observability & Monitoring**
```typescript
// OpenTelemetry integration
const tracer = trace.getTracer('nbcon-ai');

// Key metrics to track:
// - p50/p95 latency per mode
// - Tool success rate (≥ 98%)
// - Cost per session
// - Error rates by provider
// - Cache hit rates
```

### **3.3 Performance Optimization**
- **Streaming responses** via Server-Sent Events
- **Caching** for deterministic operations
- **Retry logic** with exponential backoff
- **Cold-start optimization** for Edge Functions

---

## **Phase 4: Testing & Validation** (Week 9-10)

### **4.1 Testing Matrix**
- **Unit Tests:** Prompt builders, reducers, tool schemas
- **Contract Tests:** aiClient ↔ Edge Function
- **E2E Tests:** Cypress/Playwright for each service mode
- **Load Tests:** 50-200 concurrent AI calls

### **4.2 Evaluation Framework**
```typescript
// Eval harness for quality assurance
const evalFixtures = [
  {
    mode: "site-inspection",
    input: "Analyze this construction site image...",
    expected: {
      contains: ["safety violations", "structural concerns"],
      format: "json",
      maxTokens: 500
    }
  }
];
```

### **4.3 Shadow Testing**
- Route small percentage of traffic to candidate models
- Compare responses and performance
- A/B test different providers

---

## **Phase 5: Rollout Strategy** (Week 11-12)

### **5.1 Phased Deployment**
1. **Phase 0:** Internal team only (behind feature flag)
2. **Phase 1:** 10% of users (canary deployment)
3. **Phase 2:** 50% of users (gradual expansion)
4. **Phase 3:** 100% rollout with monitoring

### **5.2 Success Metrics**
- **Latency:** p50 ≤ 2.5s, p95 ≤ 6s
- **Reliability:** Tool success rate ≥ 98%
- **User Experience:** First result usefulness rate
- **Cost Management:** Cost per session within budget
- **Stability:** Crash-free sessions ≥ 99.5%

---

## 🔧 **TECHNICAL IMPLEMENTATION DETAILS**

### **Service Mode Mapping**
| Service | AI Mode | Key Tools | Specialization |
|---------|---------|-----------|----------------|
| Site Inspection | `site-inspection` | OCR, Defect Detection, Report Gen | Visual analysis, compliance checking |
| Structural Analysis | `structural-analysis` | Calculations, Code Compliance | Load analysis, Saudi Building Code |
| HVAC Design | `hvac-design` | Load Calc, Equipment Selection | Energy efficiency, climate adaptation |
| Electrical Design | `electrical-design` | Circuit Design, Code Compliance | Power systems, safety standards |
| Surveying | `surveying` | Data Processing, Mapping | Precision measurements, GIS |
| HSE Consulting | `hse-consulting` | Risk Assessment, Compliance | Safety protocols, regulatory compliance |
| Drone Surveying | `drone-surveying` | Image Processing, 3D Modeling | Aerial data, photogrammetry |
| Equipment Maintenance | `equipment-maintenance` | Diagnostic, Scheduling | Predictive maintenance, repair planning |
| Soil Testing | `soil-testing` | Analysis, Reporting | Geotechnical assessment, lab results |

### **Cost Management Strategy**
- **Per-mode cost caps** to prevent runaway expenses
- **User-level budgets** with alerts and cutoffs
- **Provider cost comparison** with automatic switching
- **Usage analytics** for optimization

### **Security Considerations**
- **PII redaction** before memory storage
- **Role-based access** to AI features
- **Content filtering** based on user permissions
- **Audit logging** for all AI interactions

---

## 📊 **SUCCESS METRICS & KPIs**

### **Performance Metrics**
- **Response Time:** p50 ≤ 2.5s, p95 ≤ 6s
- **Availability:** 99.9% uptime
- **Error Rate:** < 2% for AI calls
- **Tool Success Rate:** ≥ 98%

### **Business Metrics**
- **User Engagement:** AI feature adoption rate
- **Service Efficiency:** Time saved per project
- **Cost per Session:** Within budget targets
- **User Satisfaction:** Thumbs-up rate, feedback scores

### **Technical Metrics**
- **Cache Hit Rate:** ≥ 80% for deterministic operations
- **Memory Retrieval:** Relevant context found ≥ 90%
- **Model Accuracy:** Service-specific quality scores
- **System Load:** Handles 200+ concurrent users

---

## 🚀 **NEXT STEPS**

### **Immediate Actions (This Week)**
1. **Set up development environment** for Edge Functions
2. **Create database migrations** for vector memory
3. **Implement basic model routing** infrastructure
4. **Design service mode configuration** schema

### **Short-term Goals (Next 2 Weeks)**
1. **Build first service mode** (site-inspection)
2. **Implement vector memory** system
3. **Create basic agent tools** for automation
4. **Set up observability** infrastructure

### **Medium-term Goals (Next Month)**
1. **Complete all 9 service modes**
2. **Implement comprehensive testing**
3. **Deploy to staging environment**
4. **Begin phased rollout**

---

## 📚 **RESOURCES & REFERENCES**

### **Technical Documentation**
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [OpenTelemetry JavaScript SDK](https://opentelemetry.io/docs/instrumentation/js/)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [Zod Schema Validation](https://zod.dev/)

### **AI Model Providers**
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Vertex AI](https://cloud.google.com/vertex-ai)
- [Anthropic Claude API](https://docs.anthropic.com/)

### **Testing Frameworks**
- [Cypress E2E Testing](https://www.cypress.io/)
- [Playwright Testing](https://playwright.dev/)
- [Jest Unit Testing](https://jestjs.io/)

---

**Document Owner:** AI Implementation Team  
**Last Updated:** January 2025  
**Next Review:** February 2025
