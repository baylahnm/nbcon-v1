# 🚀 AI Tools - Complete Implementation Plan

**Created:** October 22, 2025  
**Status:** In Progress  
**Target:** 6 Interactive AI Tools with Uniform Design

---

## 📋 Overview

### Goal
Create 6 fully-functional, AI-integrated planning tools with **100% uniform styling** across all pages.

### Scope
1. ✅ **Page 1 Complete:** Project Setup & Planning (main hub)
2. ✅ **Tool 1 Complete:** Project Charter Generator
3. ✅ **Tool 2 Complete:** WBS Builder
4. 🔨 **Tool 3 Pending:** Stakeholder Mapper
5. 🔨 **Tool 4 Pending:** Risk Register
6. 🔨 **Tool 5 Pending:** Timeline Builder
7. 🔨 **Tool 6 Pending:** Resource Planner

---

## 🎨 Uniform Design System (All Tools Must Follow)

### Page Header (Settings-Style)
```tsx
Container: bg-primary-gradient h-10 w-10 rounded-xl shadow-md
Icon: h-5 w-5 text-white
Hover: hover:scale-110 transition-transform
```

### Layout System
```tsx
Main Container: p-4 space-y-4 (uniform 16px)
Card Headers: p-4 border-b border-border/40
Card Content: p-4 space-y-4
Grid Gaps: gap-4
```

### Icon Containers (Content Sections)
```tsx
Container: bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md
Icon: h-4 w-4 text-primary
```

### Backgrounds
```tsx
Content Areas: bg-background border border-border
Cards: border-border/50 (no gradients)
Hover: hover:shadow-md transition-all
```

### Buttons & Forms
```tsx
Primary Buttons: h-8 text-xs shadow-md
Icon Buttons: h-7 w-7 p-0
Dropdowns: border border-border h-10
Badges: bg-primary/10 text-primary border-primary/20 text-[9px]
```

---

## 🛠️ Tool 1: Project Charter Generator (Apply Uniform Styles)

**File:** `src/pages/4-free/others/features/ai-tools/tools/ProjectCharterTool.tsx`

### Changes Needed:
- [ ] Update page header icon to gradient style (40x40)
- [ ] Change main container padding to `p-4 space-y-4`
- [ ] Update all card headers to `p-4`
- [ ] Update all card content to `p-4 space-y-4`
- [ ] Replace any gradient backgrounds with solid `bg-background`
- [ ] Ensure all borders use `border-border` (full opacity)
- [ ] Update all icon containers to uniform style
- [ ] Verify all buttons use `h-8` (text) or `h-7 w-7` (icon)

---

## 🛠️ Tool 2: WBS Builder (Apply Uniform Styles)

**File:** `src/pages/4-free/others/features/ai-tools/tools/WBSBuilderTool.tsx`

### Changes Needed:
- [ ] Update page header icon to gradient style (40x40)
- [ ] Change main container padding to `p-4 space-y-4`
- [ ] Update all card headers to `p-4`
- [ ] Update all card content to `p-4 space-y-4`
- [ ] Replace any gradient backgrounds with solid `bg-background`
- [ ] Ensure all borders use `border-border` (full opacity)
- [ ] Update all icon containers to uniform style
- [ ] Verify tree node styling consistency

---

## 🆕 Tool 3: Stakeholder Mapper (Build New)

**Route:** `/free/ai-tools/planning/stakeholders`  
**File:** `src/pages/4-free/others/features/ai-tools/tools/StakeholderMapperTool.tsx`

### Core Features:
1. **Power/Interest Matrix** - 2x2 grid visualization
2. **Stakeholder List** - Table with name, role, power, interest, engagement strategy
3. **AI Generation** - Generate stakeholder analysis from project details
4. **Manual Entry** - Add/edit stakeholders
5. **Visual Mapping** - Drag-and-drop stakeholders on matrix
6. **Export** - PDF/Excel export

### UI Structure:
```tsx
Header: Gradient icon (Users) + Title + Back button
Matrix: 2x2 grid (High Power/Low Power × High Interest/Low Interest)
Sidebar: Stakeholder list with filters
Actions: Generate, Add, Export, Save
Progress: Track completion (stakeholders identified/strategies defined)
```

---

## 🆕 Tool 4: Risk Register (Build New)

**Route:** `/free/ai-tools/planning/risks`  
**File:** `src/pages/4-free/others/features/ai-tools/tools/RiskRegisterTool.tsx`

### Core Features:
1. **Risk Heat Map** - Probability × Impact matrix
2. **Risk List** - Table with risk, category, probability, impact, mitigation
3. **AI Generation** - Identify risks from project type/context
4. **Risk Scoring** - Automatic risk score calculation
5. **Mitigation Plans** - AI-suggested strategies
6. **Export** - PDF/Excel with heat map

### UI Structure:
```tsx
Header: Gradient icon (AlertTriangle) + Title + Back button
Heat Map: 5×5 grid (Probability vs Impact with color coding)
Risk List: Sortable table with filters (category, severity)
Actions: Generate Risks, Add Risk, Export, Save
Stats: Total risks, High/Medium/Low counts
```

---

## 🆕 Tool 5: Timeline Builder (Build New)

**Route:** `/free/ai-tools/planning/timeline`  
**File:** `src/pages/4-free/others/features/ai-tools/tools/TimelineBuilderTool.tsx`

### Core Features:
1. **Gantt Chart** - Visual timeline with task bars
2. **Critical Path** - Highlight critical path automatically
3. **AI Generation** - Create schedule from WBS
4. **Task Dependencies** - Link tasks with dependencies
5. **Milestones** - Add key project milestones
6. **Export** - PDF/Excel/MS Project

### UI Structure:
```tsx
Header: Gradient icon (Calendar) + Title + Back button
Gantt: Horizontal timeline with task bars
Task List: Left sidebar with task hierarchy
Actions: Generate Timeline, Add Task, Add Milestone, Export
Stats: Total duration, critical tasks, milestones
```

---

## 🆕 Tool 6: Resource Planner (Build New)

**Route:** `/free/ai-tools/planning/resources`  
**File:** `src/pages/4-free/others/features/ai-tools/tools/ResourcePlannerTool.tsx`

### Core Features:
1. **Resource Allocation** - Assign team members to tasks
2. **Workload View** - Timeline showing resource utilization
3. **AI Optimization** - Suggest optimal assignments
4. **Skill Matching** - Match skills to task requirements
5. **Conflict Detection** - Flag over-allocation
6. **Export** - PDF/Excel resource plan

### UI Structure:
```tsx
Header: Gradient icon (Target) + Title + Back button
Allocation Grid: Resources × Tasks matrix
Timeline: Resource workload over time
Actions: Auto-Assign, Add Resource, Export, Save
Stats: Utilization %, Over-allocated, Available
```

---

## 🔗 App Mapping & Integration

### Route Structure
```
/free/ai-tools/planning           → Main planning hub
  ├── /charter?project=X          → Charter Generator ✅
  ├── /wbs?project=X              → WBS Builder ✅
  ├── /stakeholders?project=X     → Stakeholder Mapper 🔨
  ├── /risks?project=X            → Risk Register 🔨
  ├── /timeline?project=X         → Timeline Builder 🔨
  └── /resources?project=X        → Resource Planner 🔨
```

### Navigation Flow
```
Main Hub → Select Project → Choose Tool → Generate with AI → Edit → Save → Return
```

### AI Integration Points
1. **Main Hub:** Quick access to AI chat for planning questions
2. **Each Tool:** "Generate with AI" button
3. **Section-Level:** AI suggestions for specific sections
4. **Export:** AI-generated summaries in exports

---

## 🤖 AI Integration Strategy

### useAiStore Integration
```typescript
// In each tool component
import { useAiStore } from '../../ai/store/useAiStore';

const { sendMessage, setComposerText } = useAiStore();

const handleAIGenerate = async (sectionId: string) => {
  setIsGenerating(true);
  
  const prompt = `Generate ${sectionId} for ${projectName}...`;
  const response = await sendMessage(prompt);
  
  // Parse response and populate section
  updateSection(sectionId, response);
  setIsGenerating(false);
};
```

### Tool-Specific Prompts

**Charter Generator:**
- "Generate project vision and objectives for [project]"
- "Define scope boundaries for [project type]"
- "Create success criteria for [project]"

**WBS Builder:**
- "Create work breakdown structure for [project]"
- "Suggest task hierarchy for [project type]"
- "Break down [phase] into detailed tasks"

**Stakeholder Mapper:**
- "Identify key stakeholders for [project]"
- "Analyze stakeholder power and interest for [project]"
- "Suggest engagement strategies for [stakeholder type]"

**Risk Register:**
- "Identify risks for [project type] in [location]"
- "Assess probability and impact of [risk]"
- "Suggest mitigation strategies for [risk category]"

**Timeline Builder:**
- "Create project schedule from WBS"
- "Calculate critical path for [tasks]"
- "Suggest optimal task sequence for [project]"

**Resource Planner:**
- "Optimize resource allocation for [tasks]"
- "Match engineers to tasks based on skills"
- "Identify resource conflicts in [timeframe]"

---

## 📦 File Structure

```
src/pages/4-free/others/features/ai-tools/
├── tools/
│   ├── ProjectCharterTool.tsx       ✅ (needs styling update)
│   ├── WBSBuilderTool.tsx           ✅ (needs styling update)
│   ├── StakeholderMapperTool.tsx    🔨 (to build)
│   ├── RiskRegisterTool.tsx         🔨 (to build)
│   ├── TimelineBuilderTool.tsx      🔨 (to build)
│   └── ResourcePlannerTool.tsx      🔨 (to build)
├── components/
│   ├── PromptCard.tsx               ✅
│   ├── CategorySection.tsx          ✅
│   ├── QuickActionsBar.tsx          ✅
│   ├── FloatingAIButton.tsx         ✅
│   └── index.ts                     ✅
└── data/
    └── prompts.ts                   ✅
```

---

## 🧪 Testing Plan

### For Each Tool:
1. ✅ Navigation from main hub works
2. ✅ Project ID passed via URL query param
3. ✅ Page header gradient icon (40x40, white icon)
4. ✅ All sections use uniform padding (p-4)
5. ✅ All icons use standard container style
6. ✅ AI generation button works
7. ✅ Content editable and saveable
8. ✅ Export functionality works
9. ✅ Back navigation returns to hub
10. ✅ No linter errors, no console errors

### Integration Testing:
1. Test workflow: Hub → Charter → WBS → Stakeholders → Risks → Timeline → Resources
2. Verify project context maintained across tools
3. Test AI generation in all tools
4. Verify uniform styling across all 6 tools
5. Test with all 11 themes

---

## 📊 Implementation Priority

### Phase 1: Style Updates (1-2 hours)
1. Update Charter Generator styling
2. Update WBS Builder styling
3. Test both tools

### Phase 2: Build New Tools (4-6 hours)
1. Stakeholder Mapper (1.5 hours)
2. Risk Register (1.5 hours)
3. Timeline Builder (2 hours)
4. Resource Planner (1.5 hours)

### Phase 3: Integration (1 hour)
1. Add routes for all tools
2. Update navigation logic
3. Connect AI generation
4. Test complete workflow

### Phase 4: Testing (1 hour)
1. Browser automation testing
2. Cross-theme verification
3. AI integration testing
4. Final QA

**Total Estimated Time:** 7-10 hours

---

## ✅ Success Criteria

- [ ] All 6 tools have identical design system
- [ ] All tools use gradient header icons (40x40)
- [ ] All tools use uniform padding (p-4 everywhere)
- [ ] All tools use solid backgrounds (no gradients)
- [ ] All tools work with all 11 themes
- [ ] All tools have AI generation working
- [ ] All tools have save/export working
- [ ] All tools tested with browser automation
- [ ] 0 linter errors, 0 console errors
- [ ] Complete navigation flow works

---

**Next Step:** Start with TODO #1 - Update Charter Generator styling

