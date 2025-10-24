# 🧪 Unified Project System - Testing Guide

**Test Date:** October 24, 2025  
**Phase:** Phase 1 + Phase 2 Complete  
**Status:** Ready for Testing

---

## 🎯 **What to Test**

### **System Components:**
1. ✅ Unified Project Store
2. ✅ Create Project Dialog
3. ✅ Planning Hub Integration
4. ✅ Gantt Tool Integration
5. ✅ Charter Generator (database)
6. ✅ WBS Builder (gantt_tasks)
7. ✅ Risk Register (database)
8. ✅ Stakeholder Mapper (database)
9. ✅ Resource Planner (gantt_resources)

---

## 🚀 **Quick Start Testing (15 minutes)**

### **Test 1: Project Creation**

**URL:** `http://localhost:8080/free/ai-tools/planning`

**Steps:**
1. Click "New Project" button
2. Fill form:
   - **Name:** "Riyadh Tower Construction"
   - **Description:** "50-story residential tower in downtown Riyadh"
   - **Type:** Construction
   - **Location:** Riyadh, Saudi Arabia
   - **Budget:** 150000000 SAR
   - **Currency:** SAR
   - **Status:** Planning
   - **Start Date:** Today's date
   - **End Date:** 2 years from today
3. Click "Create Project"

**Expected Results:**
- ✅ Dialog closes
- ✅ Toast: "Project created successfully"
- ✅ Project appears in dropdown
- ✅ Project auto-selected
- ✅ Project card shows details

**Verify in Database:**
```sql
SELECT * FROM gantt_projects 
WHERE name = 'Riyadh Tower Construction';
-- Should return 1 row
```

---

### **Test 2: Charter Generator Integration**

**URL:** `http://localhost:8080/free/ai-tools/planning`

**Steps:**
1. With project selected, click "Launch Tool" on Charter card
2. URL changes to: `/planning/charter?project={id}`
3. Verify page loads with:
   - ✅ Project name in header: "Riyadh Tower Construction - Charter"
   - ✅ 6 sections in left sidebar
   - ✅ Progress: "0% Complete"
   - ✅ Empty content area

4. Click on "Vision & Objectives" section
5. Edit content in textarea:
   ```
   Vision: Create a landmark residential tower that sets new standards for
   sustainable urban living in Riyadh.
   
   Objectives:
   - Complete construction within 24 months
   - Achieve LEED Gold certification
   - Deliver 500 premium residential units
   - Maintain budget within 150M SAR
   ```

6. Click outside textarea (triggers auto-save)
7. Wait for toast: "Saved - Section updated successfully"
8. Click "Mark Complete" button
9. Verify green checkmark appears in sidebar

**Refresh Test:**
10. Press F5 (refresh page)
11. Verify content is still there ✅
12. Verify section still marked complete ✅

**Expected Results:**
- ✅ Content persists after refresh
- ✅ Completion status persists
- ✅ Auto-save works on blur
- ✅ Character count updates

**Verify in Database:**
```sql
SELECT section_name, LEFT(content, 50) as content_preview, is_completed
FROM project_charter_sections
WHERE project_id = '{your-project-id}'
ORDER BY section_order;
-- Should show your content in Vision section
```

---

### **Test 3: Multi-Tool Navigation**

**Steps:**
1. From Charter Tool, click back arrow to Planning Hub
2. Verify project still selected in dropdown
3. Click "Launch Tool" on Risk Register card
4. URL: `/planning/risks?project={id}`
5. Verify header shows: "Riyadh Tower Construction - Risk Register"
6. Verify empty state shows (no risks yet)
7. Click back to Planning Hub
8. Launch Stakeholder Mapper
9. URL: `/planning/stakeholders?project={id}`
10. Verify header shows: "Riyadh Tower Construction - Stakeholders"
11. Verify 2×2 matrix with empty quadrants
12. Click back, launch WBS Builder
13. Verify message: "No Tasks Yet - Create tasks in Gantt Tool"

**Expected Results:**
- ✅ Same project in all tools
- ✅ Project name in every header
- ✅ Empty states appropriate
- ✅ Navigation smooth
- ✅ No 404 errors

---

### **Test 4: Data Persistence Across Session**

**Steps:**
1. While in Charter Tool with edited content
2. Close browser completely (not just tab)
3. Reopen browser
4. Navigate to: `http://localhost:8080/free/ai-tools/planning`
5. Verify "Riyadh Tower Construction" still in dropdown
6. Click "Launch Tool" on Charter
7. Verify your edited Vision section still there ✅

**Expected Results:**
- ✅ Project persists after browser close
- ✅ Selected project restored
- ✅ Charter content intact
- ✅ Completion status preserved

---

### **Test 5: Multi-Project Management**

**Steps:**
1. Return to Planning Hub
2. Create second project:
   - Name: "Jeddah Waterfront Development"
   - Type: Infrastructure
   - Budget: 250000000 SAR
3. Verify project auto-selected (new project)
4. Open Charter, add content to Scope section
5. Save and return to Planning Hub
6. Switch to "Riyadh Tower Construction" in dropdown
7. Open Charter
8. Verify Vision content from Test 2 still there
9. Switch back to "Jeddah Waterfront Development"
10. Open Charter
11. Verify Scope content from step 4 still there

**Expected Results:**
- ✅ No data mixing between projects
- ✅ Each project has independent data
- ✅ Switching preserves data
- ✅ Correct project shown in headers

---

## 🔍 **Detailed Testing**

### **Test 6: WBS Builder (Task Hierarchy)**

**Prerequisites:** Create tasks in Gantt Tool first

**Steps:**
1. Open Gantt Tool for your project
2. Create parent task: "Foundation Phase"
3. Create child task with parent_id: "Excavation"
4. Create child task with parent_id: "Concrete Pouring"
5. Save tasks
6. Navigate to WBS Builder
7. Click "Expand All"

**Expected Results:**
- ✅ Tree structure appears
- ✅ Foundation Phase at level 0
- ✅ Excavation and Concrete Pouring indented (level 1)
- ✅ Expand/collapse works
- ✅ Stats show correct totals

---

### **Test 7: Risk Register (CRUD Operations)**

**Note:** Requires Risk creation UI (currently placeholder)

**Verify:**
- ✅ Empty state shows when no risks
- ✅ Category filter works
- ✅ Statistics calculate correctly
- ✅ Risk level badges color-coded

**Manual Database Test:**
```sql
-- Insert test risk
INSERT INTO project_risks (
  project_id, title, category, probability, impact, mitigation_strategy
) VALUES (
  '{your-project-id}',
  'Weather delays',
  'schedule',
  4,
  3,
  'Build 2-week buffer into schedule'
);

-- Refresh Risk Register tool
-- Should show the risk with score 12 (Medium)
```

---

### **Test 8: Stakeholder Mapper (Matrix Display)**

**Manual Database Test:**
```sql
-- Insert test stakeholders
INSERT INTO project_stakeholders (project_id, name, role, organization, power_level, interest_level, engagement_strategy)
VALUES 
  ('{your-project-id}', 'Project Sponsor', 'Executive Sponsor', 'NEOM', 'high', 'high', 'Weekly status meetings, involve in major decisions'),
  ('{your-project-id}', 'Local Authority', 'Regulator', 'Riyadh Municipality', 'high', 'low', 'Quarterly compliance reports'),
  ('{your-project-id}', 'Community Rep', 'Stakeholder', 'Local Community', 'low', 'high', 'Monthly newsletters, open forums'),
  ('{your-project-id}', 'Vendor', 'Supplier', 'ABC Materials', 'low', 'low', 'Standard procurement communications');

-- Refresh Stakeholder Mapper tool
-- Should show 1 stakeholder in each quadrant
```

**Expected Results:**
- ✅ Manage Closely (High/High): Project Sponsor
- ✅ Keep Satisfied (High/Low): Local Authority
- ✅ Keep Informed (Low/High): Community Rep
- ✅ Monitor (Low/Low): Vendor

---

### **Test 9: Resource Planner (Team View)**

**Prerequisites:** Create resources in Gantt Tool

**Verify:**
- ✅ Empty state when no resources
- ✅ Links to Gantt Tool work
- ✅ Resource cards display
- ✅ Utilization bars render

---

## 🔒 **Security Testing (RLS)**

### **Test 10: User Isolation**

**Requirements:** 2 test accounts

**Steps:**
1. Sign in as User A (info@nbcon.org)
2. Create project: "User A Project"
3. Add charter content
4. Sign out
5. Sign in as User B (different account)
6. Open Planning Hub
7. Verify User A's project NOT visible
8. Create project: "User B Project"
9. Add charter content
10. Verify only User B's project shows
11. Sign out and back in as User A
12. Verify only User A's project shows

**Expected Results:**
- ✅ Complete user isolation
- ✅ No data leakage
- ✅ RLS working correctly

---

## ⚡ **Performance Testing**

### **Test 11: Load Times**

**Measure:**
- Planning Hub load: < 2s
- Project creation: < 1s
- Charter load: < 2s
- Data save: < 500ms
- Project switch: < 1s

**Steps:**
1. Open Network tab in DevTools
2. Navigate to Planning Hub
3. Measure time to interactive
4. Create project
5. Measure submission time
6. Open Charter
7. Measure load time

**Expected:**
- ✅ All operations feel instant
- ✅ No blocking UI
- ✅ Smooth transitions

---

## 🐛 **Error Testing**

### **Test 12: Error Handling**

**Test Invalid Data:**
1. Open Create Project dialog
2. Try to submit with empty name
3. Verify validation message shows
4. Fill name with just spaces
5. Verify validation catches it

**Test Network Errors:**
1. Open DevTools → Network tab
2. Set to "Offline"
3. Try to save charter section
4. Verify error toast shows
5. Set back to "Online"
6. Retry → Success

**Test Missing Project:**
1. Manually navigate to: `/planning/charter?project=invalid-uuid`
2. Verify graceful handling (empty state or redirect)

**Expected Results:**
- ✅ Validation prevents invalid data
- ✅ Network errors show user-friendly messages
- ✅ No crashes on edge cases

---

## ✅ **Test Results Template**

Use this to track your testing:

```markdown
## Test Results - [Your Name] - [Date]

### Test 1: Project Creation
- [ ] Created project via UI
- [ ] Project appeared in dropdown
- [ ] Project persisted after refresh
- [ ] Status: ⬜ PASS / ⬜ FAIL
- Notes: ___________________________

### Test 2: Charter Generator
- [ ] Loaded 6 sections
- [ ] Edited content
- [ ] Auto-save worked
- [ ] Content persisted
- [ ] Status: ⬜ PASS / ⬜ FAIL
- Notes: ___________________________

### Test 3: Multi-Tool Navigation
- [ ] All tools show same project
- [ ] Navigation smooth
- [ ] No 404 errors
- [ ] Status: ⬜ PASS / ⬜ FAIL
- Notes: ___________________________

### Test 4: Data Persistence
- [ ] Closed browser
- [ ] Reopened
- [ ] Data intact
- [ ] Status: ⬜ PASS / ⬜ FAIL
- Notes: ___________________________

### Test 5: Multi-Project
- [ ] Created 2+ projects
- [ ] No data mixing
- [ ] Switching works
- [ ] Status: ⬜ PASS / ⬜ FAIL
- Notes: ___________________________

### Overall Result:
⬜ ALL TESTS PASS - Ready for production
⬜ SOME TESTS FAIL - Issues found (see notes)
⬜ BLOCKED - Cannot test (environment issue)

Issues Found:
1. _________________________________
2. _________________________________

Recommendations:
_____________________________________
```

---

## 🔧 **Troubleshooting**

### **Project Not Appearing:**
```sql
-- Check if project was created
SELECT * FROM gantt_projects WHERE created_by = auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'gantt_projects';
```

### **Charter Sections Not Loading:**
```sql
-- Check if sections exist
SELECT * FROM project_charter_sections 
WHERE project_id = '{your-project-id}';

-- If empty, sections should auto-create on first load
```

### **Data Not Saving:**
```sql
-- Check RLS policies for inserts
SELECT * FROM pg_policies 
WHERE tablename = 'project_charter_sections' 
AND cmd = 'INSERT';

-- Try manual insert to test
INSERT INTO project_charter_sections (
  project_id, section_name, section_order, content
) VALUES (
  '{your-project-id}', 'Test', 1, 'Test content'
);
```

---

## 📝 **Bug Report Template**

If you find issues, report using this template:

```markdown
## Bug Report

**Date:** [Date]
**Tester:** [Your Name]
**Environment:** [Development / Production]

### Issue Description:
[Clear description of what went wrong]

### Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior:
[What should have happened]

### Actual Behavior:
[What actually happened]

### Screenshots:
[Attach if applicable]

### Console Errors:
```
[Paste any console errors]
```

### Database State:
```sql
-- Relevant queries showing data state
```

### Priority:
⬜ Critical (blocks testing)
⬜ High (major feature broken)
⬜ Medium (workaround exists)
⬜ Low (minor issue)

### Suggested Fix:
[Optional: Your thoughts on the fix]
```

---

## 🎊 **Success Criteria**

### **Test PASSES if:**

**Project Management:**
- [x] Can create projects via UI (no SQL)
- [x] Projects appear in all tools
- [x] Projects persist across sessions
- [x] Can switch between projects
- [x] RLS prevents seeing other users' projects

**Charter Generator:**
- [x] Loads 6 default sections
- [x] Can edit content
- [x] Auto-saves on blur
- [x] Can mark sections complete
- [x] Progress calculates correctly
- [x] Content persists after refresh

**WBS Builder:**
- [x] Shows tasks from Gantt (or empty state)
- [x] Builds hierarchy from parent_id
- [x] Expand/collapse works
- [x] Statistics accurate
- [x] Links to Gantt Tool work

**Risk Register:**
- [x] Shows empty state (or loads risks)
- [x] Category filter works
- [x] Risk level badges correct
- [x] Statistics calculate correctly

**Stakeholder Mapper:**
- [x] Shows empty 2×2 matrix (or loads stakeholders)
- [x] Quadrants render correctly
- [x] Statistics accurate

**Resource Planner:**
- [x] Shows empty state (or loads resources)
- [x] Resource cards display
- [x] Links to Gantt Tool work

**Cross-Cutting:**
- [x] Zero console errors
- [x] Zero TypeScript errors
- [x] All toasts work
- [x] All navigation works
- [x] Design consistent
- [x] Mobile responsive

---

## 🎯 **Test Coverage**

### **Functional Tests:**
- ✅ Project CRUD
- ✅ Charter sections CRUD
- ✅ WBS hierarchy display
- ✅ Risk display (pending creation UI)
- ✅ Stakeholder matrix (pending creation UI)
- ✅ Resource display

### **Integration Tests:**
- ✅ Cross-tool project selection
- ✅ Database persistence
- ✅ RLS enforcement
- ✅ Navigation consistency

### **UI/UX Tests:**
- ✅ Empty states
- ✅ Loading states
- ✅ Error states
- ✅ Success feedback
- ✅ Design consistency

### **Security Tests:**
- ✅ User isolation (RLS)
- ✅ Auth required
- ✅ Data validation

---

## 📊 **Expected Test Duration**

| Test Suite | Time | Priority |
|------------|------|----------|
| Quick Start (Tests 1-5) | 15 min | HIGH |
| Detailed Tests (6-9) | 30 min | MEDIUM |
| Security Test (10) | 10 min | HIGH |
| Performance Test (11) | 10 min | MEDIUM |
| Error Testing (12) | 15 min | MEDIUM |
| **TOTAL** | **80 min** | - |

---

## 🚀 **Ready to Test!**

**Start Here:**
```
http://localhost:8080/free/ai-tools/planning
```

**Test Account:**
```
Email: info@nbcon.org
Password: Qazwsx1234@
```

**What You Should See:**
1. Planning Hub with project selector
2. "New Project" button
3. 6 AI tool cards
4. Professional, theme-consistent design

**Good luck testing!** 🎯

---

**Guide Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** Ready for QA Testing

