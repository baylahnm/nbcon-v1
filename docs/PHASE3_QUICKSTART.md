# ⚡ Phase 3: Quick Start Guide for Engineers

**Sprint 1 Week 1 — Get Up and Running in 30 Minutes**

---

## 🎯 Your Mission (This Week)

Build the **token tracking foundation** and **integrate agent UI** into existing pages.

**End Goal:** Users can select specialized agents and see their token usage.

---

## ✅ Pre-Flight Checklist

Before you start coding:

- [ ] Pull latest from `main` branch
- [ ] Run `pnpm install` (verify dependencies)
- [ ] Run `npm run dev` (verify app starts on port 8082)
- [ ] Run `node scripts/verify-phase1-3.js` (verify all migrations applied)
- [ ] Open `docs/PHASE3_EXECUTION_PLAN.md` (read your assigned Epic)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Verify Database

```bash
# Run verification script
node scripts/verify-phase1-3.js

# Expected output:
# ✅ Authentication successful
# ✅ get_ai_threads RPC works (X threads)
# ✅ create_ai_thread RPC works
# ✅ Found 9 specialized agents
# ✅ ai_agent_usage table exists
# ✅ get_user_monthly_usage RPC works
# 🎉 ALL PHASES VERIFIED
```

If all ✅ → proceed  
If any ❌ → notify team lead

---

### Step 2: Explore the Code

**Backend Engineers:**
```bash
# Token tracking schema
open supabase/migrations/20250126000003_token_tracking_monetization.sql

# Agent service (reference implementation)
open src/shared/services/agentService.ts

# Your task: Implement token service
touch src/shared/services/tokenService.ts
```

**Frontend Engineers:**
```bash
# Agent UI components (already built)
open src/pages/4-free/others/features/ai/components/AgentSelector.tsx
open src/pages/4-free/others/features/ai/components/AgentWorkspace.tsx
open src/pages/4-free/others/features/ai/components/TokenUsageWidget.tsx

# Your task: Integrate into dashboard
open src/pages/4-free/others/features/dashboard/components/DashboardContent.tsx
```

**QA Engineers:**
```bash
# Test structure (stub)
open tests/smoke/phase3-smoke.spec.ts

# Your task: Expand test coverage
# - Unit tests for token service
# - Integration tests for quota enforcement
# - E2E tests for agent selection workflow
```

---

## 🎨 What You're Building (Visual)

### Dashboard Integration (Frontend Task)

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT DASHBOARD                                        │
│  ┌─────────────────┐  ┌────────────────────┐           │
│  │ AI Assistant    │  │ Specialized Agents │           │
│  │ Widget          │  │                    │           │
│  │ - 30 Prompts    │  │ [Civil] [Elec]     │           │
│  │ - Chat          │  │ [Structural] [HSE] │  ← NEW    │
│  └─────────────────┘  │ [HVAC] [Survey]    │           │
│                        │ [Drone] [Maint]    │           │
│  ┌─────────────────┐  └────────────────────┘           │
│  │ Token Usage     │                                    │
│  │ Widget          │  ← NEW                             │
│  │ - Monthly usage │                                    │
│  │ - Cost tracking │                                    │
│  │ - Quota meter   │                                    │
│  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Sprint 1 Tasks (Your Assignments)

### **Backend Lead** (40 hours)

**Priority 1: Token Service Layer** (Day 1-3)
```typescript
// File: src/shared/services/tokenService.ts

export async function logTokenUsage(params: {
  agent_id: string;
  session_id: string;
  discipline: string;
  workflow_id: string;
  tokens_prompt: number;
  tokens_completion: number;
  model_used: string;
  processing_time_ms?: number;
}): Promise<void> {
  // TODO: Implement using Supabase insert
  // Reference: docs/PHASE3_EXECUTION_PLAN.md → Task 1.2
}

export async function checkUserQuota(estimatedTokens: number): Promise<{
  allowed: boolean;
  remaining: number;
  quota: number;
}> {
  // TODO: Call check_user_quota RPC
  // Return structured result
}
```

**Acceptance:**
- [ ] logTokenUsage() inserts to ai_agent_usage
- [ ] checkUserQuota() calls RPC and returns correctly
- [ ] Unit tests passing (>90% coverage)
- [ ] TypeScript errors: 0
- [ ] Linter errors: 0

**Priority 2: Integrate into useAiStore** (Day 4-5)
```typescript
// File: src/shared/stores/useAiStore.ts
// In sendMessage() method:

// After AI response received:
if (data.usage) {
  await logTokenUsage({
    agent_id: activeAgentId || 'general',
    session_id: currentSessionId,
    discipline: activeAgent?.discipline || 'general',
    workflow_id: currentWorkflow || 'chat',
    tokens_prompt: data.usage.prompt_tokens,
    tokens_completion: data.usage.completion_tokens,
    model_used: data.model,
    processing_time_ms: data.processing_time_ms,
  });
}
```

**Acceptance:**
- [ ] Every AI message logs token usage
- [ ] Data visible in Supabase dashboard
- [ ] Integration test passing

---

### **Frontend Lead** (40 hours)

**Priority 1: Dashboard Integration** (Day 1-3)
```typescript
// File: src/pages/4-free/others/features/dashboard/components/DashboardContent.tsx

import { AgentSelector } from '../../ai/components/AgentSelector';
import { TokenUsageWidget } from '../../ai/components/TokenUsageWidget';

// Add after AI Assistant widget (around line 150):

{/* Specialized AI Agents */}
<Card className="border-border/50">
  <CardHeader className="p-4 border-b border-border/40">
    <div className="flex items-center gap-3">
      <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <CardTitle className="text-base font-bold tracking-tight">
          Specialized AI Agents
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          9 discipline-specific engineering assistants
        </p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="p-4">
    <AgentSelector
      onSelectAgent={(agent) => {
        // Navigate to agent workspace
        navigate(`/free/ai/agents/${agent.discipline}`);
      }}
    />
  </CardContent>
</Card>

{/* Token Usage */}
<TokenUsageWidget />
```

**Acceptance:**
- [ ] Agent selector visible in dashboard
- [ ] All 9 agents display correctly
- [ ] Click agent → navigates to workspace
- [ ] TokenUsageWidget shows usage data
- [ ] Responsive on mobile/tablet/desktop
- [ ] Works in Arabic (RTL)

**Priority 2: Project Workspace Integration** (Day 4-5)
```typescript
// File: src/pages/4-free/13-MyProjectsPage.tsx

// Add "AI Agents" tab to project detail
<Tabs>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="timeline">Timeline</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
    <TabsTrigger value="ai-agents">
      <Sparkles className="h-4 w-4 mr-1.5" />
      AI Agents
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="ai-agents">
    <AgentSelector
      projectContext={selectedProject}
      onSelectAgent={(agent) => launchAgentForProject(agent, selectedProject.id)}
    />
  </TabsContent>
</Tabs>
```

**Acceptance:**
- [ ] AI Agents tab appears in project view
- [ ] Agent selector works in project context
- [ ] Can launch agent with project pre-filled

---

### **QA Engineer** (40 hours)

**Priority 1: Unit Tests** (Day 1-2)
```typescript
// File: tests/unit/tokenService.test.ts

describe('Token Service', () => {
  test('logTokenUsage inserts to database', async () => {
    // Arrange
    const mockParams = {
      agent_id: 'test-agent',
      session_id: 'test-session',
      discipline: 'civil',
      workflow_id: 'boq_generation',
      tokens_prompt: 1000,
      tokens_completion: 500,
      model_used: 'gpt-4o-mini',
    };
    
    // Act
    await logTokenUsage(mockParams);
    
    // Assert
    const { data } = await supabase
      .from('ai_agent_usage')
      .select('*')
      .eq('session_id', 'test-session')
      .single();
    
    expect(data.tokens_total).toBe(1500);
    expect(data.cost_usd).toBeGreaterThan(0);
  });
  
  test('checkUserQuota enforces limits', async () => {
    // Test quota enforcement
  });
});
```

**Acceptance:**
- [ ] >90% code coverage on tokenService
- [ ] All edge cases tested
- [ ] Tests passing in CI

**Priority 2: Integration Tests** (Day 3-4)
```typescript
// File: tests/integration/agent-workflow.test.ts

describe('Agent Workflow Integration', () => {
  test('Complete workflow: Select agent → Invoke → Log tokens', async () => {
    // End-to-end integration test
  });
});
```

**Priority 3: E2E Tests** (Day 5)
```typescript
// File: tests/e2e/agent-selection.spec.ts

test('User can select agent from dashboard', async ({ page }) => {
  await page.goto('/free/dashboard');
  await page.click('text=Civil Engineering Assistant');
  await expect(page).toHaveURL(/.*\/ai\/agents\/civil/);
});
```

---

## 📖 Reference Documentation

### **Must Read Before Coding:**

1. **Your Epic Assignment:**
   - `docs/PHASE3_EXECUTION_PLAN.md` → Find your Epic → Read tasks

2. **Technical Reference:**
   - `docs/PHASE1_AI_STACK_INTEGRATION.md` → Supabase patterns
   - `docs/PHASE2_SPECIALIZED_AGENTS_COMPLETE.md` → Agent architecture
   - `docs/AI_AGENTS_IMPLEMENTATION_COMPLETE.md` → Quick reference

3. **Database Schema:**
   - `supabase/migrations/20250126000003_token_tracking_monetization.sql`
   - See tables, views, RPCs

---

## 🧪 Testing Your Code

### Run Tests

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# All tests
pnpm test

# Coverage report
pnpm test:coverage
```

---

### Manual Testing

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:8082/free/dashboard

# Verify:
# 1. Specialized AI Agents card appears
# 2. 9 agents display
# 3. Click agent → navigates to workspace
# 4. Token usage widget shows (if you have usage)
# 5. No console errors
# 6. No linter errors in terminal
```

---

## 🆘 Getting Help

### Common Issues

**"Agent selector not showing"**
- Check: Did you import AgentSelector?
- Check: Is AgentSelector.tsx in correct location?
- Check: Browser console for errors

**"Token usage widget is empty"**
- Check: Have you made any AI interactions yet?
- Check: Run `node scripts/verify-phase1-3.js`
- Check: Supabase table `ai_agent_usage` has rows

**"Tests failing"**
- Run: `pnpm lint --fix` (auto-fix linting)
- Run: `pnpm typecheck` (check TypeScript)
- Check: Test file imports are correct

---

### Who to Ask

**Database/Backend Questions:**
- Backend Lead
- Reference: `agentService.ts` (working example)

**UI/Frontend Questions:**
- Frontend Lead
- Reference: `AgentSelector.tsx` (working example)

**Testing Questions:**
- QA Engineer
- Reference: `tests/` directory

**Product Questions:**
- Product Manager
- Reference: `PHASE2_USER_STORIES_AGENTS.md`

---

## 📅 Daily Standup (9 AM)

**Format (5 min per person):**
- Yesterday: What I completed
- Today: What I'm working on
- Blockers: Any issues

**Example:**
```
Yesterday: Implemented tokenService.logTokenUsage() [Task 1.2]
Today: Adding quota check to useAiStore [Task 1.3]
Blockers: Need clarification on quota reset logic - will ask Backend Lead
```

---

## 🏆 Definition of Done

Your task is DONE when:

- [ ] Code implemented and works locally
- [ ] Unit tests written and passing
- [ ] Integration test written (if applicable)
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Code reviewed by peer (PR approved)
- [ ] Tested in browser (manual QA)
- [ ] Works in Arabic (if UI change)
- [ ] Documentation updated (if new pattern)
- [ ] Merged to main

---

## 🎯 Sprint 1 Goal

**"Enable token economics and integrate agent UI in 3 pages"**

**By end of Week 2, we should have:**
- ✅ Every AI interaction logs token usage
- ✅ Users can see monthly usage in dashboard
- ✅ Quota system blocks users when exceeded
- ✅ Agent selector working in dashboard
- ✅ Agent selector working in project workspace
- ✅ Agent selector working in engineer portal
- ✅ All tests passing
- ✅ 0 bugs in production

---

## 💡 Pro Tips

1. **Start Small:** Get one thing working, then expand
2. **Test Early:** Don't wait until the end to test
3. **Ask Questions:** Better to ask than guess wrong
4. **Use Examples:** Copy patterns from existing code
5. **Document As You Go:** Future you will thank you
6. **Commit Often:** Small commits are easier to review
7. **Check Lint:** Run `pnpm lint` before committing

---

## 🚀 You've Got This!

**Remember:**
- Phase 1 & 2 are DONE → Foundation is solid
- You're building on proven architecture
- Team is here to help
- We ship quality > speed

**Let's make this the best AI engineering platform in MENA! 💪**

---

**Questions? Check `docs/PHASE3_EXECUTION_PLAN.md` or ask in team Slack**


