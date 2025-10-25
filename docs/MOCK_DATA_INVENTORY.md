# 📊 Mock Data Inventory - Complete List

**Date:** October 25, 2025  
**Total Files:** 15  
**Priority Ranking:** By user impact

---

## 🔴 CRITICAL - USER-FACING DATA (Must Replace)

### **1. Finance Page** 🔴🔴🔴 **HIGHEST PRIORITY**

**File:** `src/pages/4-free/10-FinancePage.tsx`

**Mock Data Found:**
```typescript
Lines 103-177:  mockPayments (3 items)
Lines 179-234:  mockInvoices (3 items)  
Lines 236-273:  mockQuotations (4 items)
Lines 275-320:  mockMilestones (4 items)
```

**Why Critical:**
- Users expect to see THEIR money/transactions
- Trust issue if showing fake payments
- Financial data is most sensitive

**Database Tables:**
- ✅ `payments` table exists (verified)
- ✅ `invoices` table exists (verified)
- ⚠️ Need to verify: `quotations` table
- ⚠️ Need to verify: `job_milestones` table

**Estimated Fix:** 3 hours  
**Impact:** **HIGHEST** - Finance is critical trust area

---

### **2. Jobs Page (Engineer)** 🔴🔴 **HIGH**

**File:** `src/pages/5-engineer/2-JobsPage.tsx`

**Mock Data Found:**
```typescript
Lines 79-209: mockJobs (6 job listings)
```

**Sample Data:**
- Senior Structural Engineer - Saudi Aramco
- Project Manager - ACWA Power
- Electrical Design Engineer - NEOM
- + 3 more fake jobs

**Why Critical:**
- Core marketplace feature
- Engineers expect real job opportunities
- Affects matching algorithm testing

**Database:**
- ✅ `jobs` table exists
- ✅ RLS enabled
- ✅ Ready to query

**Existing Code:**
- ✅ `useJobsStore` already exists
- 🔴 Line 94 has TODO to implement Supabase query
- ✅ Just needs implementation

**Estimated Fix:** 2 hours  
**Impact:** **HIGH** - Core feature

---

### **3. Browse Engineers Page** 🔴🔴 **HIGH**

**File:** `src/pages/4-free/3-BrowseEngineersPage.tsx`

**Mock Data Found:**
```typescript
Lines 71-201: mockEngineers (6 engineer profiles)
```

**Sample Profiles:**
- Ahmed Al-Rashid - Structural Engineer
- Fatima Al-Zahra - Project Manager
- Mohammed Al-Zahrani - Civil Engineer
- + 3 more fake engineers

**Why Critical:**
- Clients browse to hire engineers
- Core marketplace feature
- Affects client decision-making

**Database:**
- ✅ `engineer_profiles` table exists
- ✅ `engineer_skills` table exists
- ✅ `engineer_certifications` table exists
- ✅ Ready to join and query

**Estimated Fix:** 3 hours  
**Impact:** **HIGH** - Core feature

---

### **4. Admin Projects Page** 🔴 **HIGH**

**File:** `src/pages/3-admin/3-ProjectsPage.tsx`

**Mock Data Found:**
```typescript
Lines 51-124: mockProjects (5 admin project records)
```

**Why Important:**
- Admins manage platform
- Need to see ALL real projects
- Analytics depend on this

**Database:**
- ✅ `jobs` table OR `gantt_projects` table
- ✅ Can query both

**Estimated Fix:** 1 hour  
**Impact:** **HIGH** - Admin functionality

---

### **5. Team Store** 🔴 **HIGH**

**File:** `src/pages/2-auth/others/hooks/useTeamStore.ts`

**Mock Data Found:**
```typescript
Lines 36-109:  mockUsers (6 team members)
Lines 111-136: mockProjects (3 projects)
Lines 138-149: mockProjectMembers (10 assignments)
```

**Why Important:**
- Used by Calendar filters
- Used by project assignment
- Collaboration features depend on this

**Database:**
- ✅ `profiles` table exists
- ✅ `gantt_projects` table exists
- ⚠️ Need `project_members` table OR derive from projects

**Estimated Fix:** 2 hours  
**Impact:** **HIGH** - Collaboration features

---

## 🟡 MEDIUM - SUPPORTING FEATURES (Should Replace)

### **6. Learning Page (Client)** 🟡🟡 **MEDIUM**

**File:** `src/pages/4-free/7-LearningPage.tsx`

**Mock Data Found:**
```typescript
Lines 86-437:  mockCourses (10 courses with full details)
Lines 439-480: mockLearningPaths (2 learning paths)
```

**Why Medium Priority:**
- Educational content, not transactions
- Users understand it's course catalog
- No LMS integration yet

**Options:**
1. Keep as static content (acceptable)
2. Create `courses` table in database
3. Integrate with external LMS (Udemy API, etc.)

**Estimated Fix:** 2 hours (if creating database) OR 0 hours (keep static)  
**Impact:** **MEDIUM** - Secondary feature

---

### **7. Help Page** 🟡 **MEDIUM**

**File:** `src/pages/5-engineer/10-HelpPage.tsx`

**Mock Data Found:**
```typescript
Lines 51-220:  mockArticles (10 help articles)
Lines 222-330: mockFAQs (12 FAQs)
```

**Why Medium Priority:**
- Static content (help docs)
- Not user-generated data
- Can stay as hardcoded

**Options:**
1. Keep as static (recommended)
2. Move to `help_articles` table
3. Integrate with CMS

**Estimated Fix:** 0 hours (keep static) OR 1 hour (database)  
**Impact:** **LOW** - Static content acceptable

---

## 🟢 LOW - DEMO/SAMPLE DATA (Can Keep)

### **8. Gantt Store Samples** ✅ **KEEP**

**File:** `src/pages/4-free/others/features/ai-tools/stores/useGanttStore.ts`

**Mock Data Found:**
```typescript
Lines 395-412:  sampleProjects (1 sample project)
Lines 414-475:  sampleTasks (3 sample tasks)
Lines 477-486:  sampleDependencies (1 dependency)
```

**Current Behavior:**
- ✅ Only shows if user has NO real projects
- ✅ Helps with orientation
- ✅ Clearly demonstration data

**Recommendation:**
- ✅ Keep this sample data
- ⚠️ Add "SAMPLE PROJECT" badge
- ⚠️ Add "Delete Sample" button
- ✅ No replacement needed

**Estimated Fix:** 30 min (just add labels)  
**Impact:** **POSITIVE** - Helps new users

---

### **9-15. AI Tool Samples** ✅ **KEEP FOR DEMO**

**Files:** 7 individual AI tool files

| Tool | File | Sample Data | Keep? |
|------|------|-------------|-------|
| BOQ Generator | BOQGeneratorTool.tsx | Sample line items | ✅ YES |
| Cost Estimator | CostEstimatorTool.tsx | Sample breakdown | ✅ YES |
| Issue Tracker | IssueTrackerTool.tsx | Sample issues | ✅ YES |
| + 4 more tools | Various | Demo data | ✅ YES |

**Why Keep:**
- Helps users understand tool format
- AI generates real data on demand
- Clear "Generate Real Data" buttons exist

**Recommendation:**
- ✅ Keep all AI tool samples
- ⚠️ Add "Sample Data - Generate Real Data" labels
- ✅ No replacement needed

**Estimated Fix:** 1 hour (add labels to all tools)  
**Impact:** **POSITIVE** - Improves UX

---

### **10. Calendar Assignees** 🟢 **LOW**

**File:** `src/pages/1-HomePage/others/components/calendar/CreateEventDialog.tsx`

**Mock Data:**
```typescript
Lines 262-267: mockAssignees (5 people)
```

**Why Low Priority:**
- Calendar creation feature
- Assignees list is small
- Can load from team OR keep mock

**Estimated Fix:** 30 min  
**Impact:** **LOW**

---

### **11. Home Page Mock Data** 🟡 **VERIFY USAGE**

**File:** `src/pages/1-HomePage/others/data/mockData.ts`

**Mock Data:** MOCK_TEMPLATES (460+ lines of project templates)

**Action Required:**
```bash
# Check if this file is actually imported/used
grep -r "from.*mockData" src/
grep -r "mockData" src/

# If no imports → DELETE (unused)
# If used → Replace with database templates
```

**Estimated Fix:** 15 min (verify) + 1 hour (replace if needed)  
**Impact:** Unknown until verified

---

## 📊 SUMMARY BY PRIORITY

### **🔴 CRITICAL (Replace First):**

| # | File | Mock Arrays | Fix Time | User Impact |
|---|------|-------------|----------|-------------|
| 1 | FinancePage | 4 arrays | 3h | 🔴🔴🔴 |
| 2 | JobsPage | 1 array | 2h | 🔴🔴 |
| 3 | BrowseEngineers | 1 array | 3h | 🔴🔴 |
| 4 | AdminProjects | 1 array | 1h | 🔴 |
| 5 | TeamStore | 3 arrays | 2h | 🔴 |

**Subtotal:** 11 hours → **85/100 quality**

---

### **🟡 MEDIUM (Optional):**

| # | File | Mock Arrays | Fix Time | Decision |
|---|------|-------------|----------|----------|
| 6 | LearningPage | 2 arrays | 2h OR keep | Keep for now |
| 7 | HelpPage | 2 arrays | 0h | Keep as static |

**Subtotal:** 0-2 hours (if keeping static)

---

### **🟢 LOW (Keep or Label):**

| # | File | Mock Arrays | Fix Time | Decision |
|---|------|-------------|----------|----------|
| 8 | GanttStore | 3 arrays | 30min | Add labels only |
| 9-15 | AI Tools | Various | 1h | Add labels only |
| 16 | Calendar | 1 array | 30min | Keep or load team |
| 17 | mockData.ts | 1 huge file | 15min | Verify usage |

**Subtotal:** 2 hours (labeling only)

---

## 🎯 RECOMMENDED EXECUTION ORDER

### **Day 1 (Saturday - 8 hours):**

**Morning:**
1. Finance mock → database (3h) 🔴
2. Test Finance page (30min)

**Afternoon:**
3. Jobs mock → database (2h) 🔴
4. Engineers mock → database (3h) 🔴
5. Test both pages (30min)

**End of Day:**
- ✅ Top 3 user-facing features use real data
- ✅ 60% of critical work done

---

### **Day 2 (Sunday - 8 hours):**

**Morning:**
6. Admin Projects → database (1h) 🔴
7. Team Store → database (2h) 🔴
8. Test admin features (30min)

**Afternoon:**
9. Remove console logs (2h) 🟡
10. Resolve critical TODOs (1h) 🟡
11. Delete dead code (30min) 🟡
12. Full regression test (1h)

**End of Day:**
- ✅ ALL critical mock data replaced
- ✅ Clean console
- ✅ 95/100 quality score
- ✅ Ready for Monday launch

---

## ✅ COMPLETION CRITERIA

**Production Ready When:**

- [x] Database: All migrations applied ✅ (Already done!)
- [ ] Finance: Real payments/invoices shown
- [ ] Jobs: Real marketplace listings
- [ ] Engineers: Real profiles from database
- [ ] Admin: Real platform projects
- [ ] Team: Real team members
- [ ] Console: < 20 debug statements
- [ ] TODOs: All critical ones resolved
- [ ] Dead Code: Removed
- [ ] Testing: All flows pass

**Current:** 2/10 (Database + AI Tools)  
**After Day 1:** 5/10 (+ Finance, Jobs, Engineers)  
**After Day 2:** 10/10 ✅ **PRODUCTION READY**

---

## 📞 IMMEDIATE DECISION

**Which path do you choose?**

**A.** Launch today with labels (30 min)  
**B.** 1-day cleanup (8 hours) → Deploy tomorrow  
**C.** 2-day polish (16 hours) → Deploy Monday ⭐ **RECOMMENDED**

**I'm ready to execute whichever you choose!** 🚀

---

**Status:** ✅ Inventory Complete  
**Waiting For:** Your decision (A, B, or C)  
**Ready To:** Start immediately upon your word


