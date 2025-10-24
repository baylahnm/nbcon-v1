# 🧪 Project Unification - Testing Guide

**Created:** October 24, 2025  
**Phase:** Phase 1 Testing  
**Status:** Ready to test  
**Estimated Time:** 30 minutes

---

## 📋 Test Overview

**What We're Testing:**
- ✅ Unified project store (useProjectStore)
- ✅ Project creation via UI (CreateProjectDialog)
- ✅ Planning Hub integration
- ✅ Gantt Tool integration
- ✅ Data persistence across sessions
- ✅ Project selection sharing

---

## 🚀 Pre-Test Setup

### **Requirements:**

1. **Dev server running:**
   ```bash
   npm run dev
   # Should be at http://localhost:8080
   ```

2. **Logged in as test user:**
   ```
   Email: info@nbcon.org
   Password: 1234@
   ```

3. **Database accessible:**
   - Supabase project: joloqygeooyntwxjpxwv
   - Tables exist: gantt_projects, gantt_tasks

4. **Migrations applied (for Phase 2):**
   - Optional: Only if testing charter/risks/stakeholders
   - Files in: `supabase/migrations/20241024*.sql`

---

## ✅ Test Scenario 1: Create Project via Planning Hub

### **Objective:** Verify users can create projects via UI and they persist

### **Steps:**

1. **Navigate to Planning Hub:**
   ```
   http://localhost:8080/free/ai-tools/planning
   ```

2. **Observe initial state:**
   - [ ] Page loads without errors
   - [ ] Project selector shows loading spinner (if first load)
   - [ ] After load, shows either:
     - Projects dropdown (if user has projects)
     - OR "No Projects Yet" empty state

3. **Click "New Project" button:**
   - [ ] Button in header (top right)
   - [ ] Dialog opens
   - [ ] Dialog title: "Create New Project"
   - [ ] All form fields visible

4. **Fill form with test data:**
   ```
   Project Name: Test Construction Project
   Description: Testing unified project creation system
   Project Type: Construction
   Status: Planning
   Location: Riyadh, Saudi Arabia
   Start Date: 2025-11-01
   End Date: 2026-06-30
   Budget: 1500000
   Currency: SAR
   ```

5. **Submit form:**
   - [ ] Click "Create Project" button
   - [ ] Button shows loading state ("Creating...")
   - [ ] Success toast appears
   - [ ] Dialog closes

6. **Verify project created:**
   - [ ] Project appears in dropdown immediately
   - [ ] Project is auto-selected
   - [ ] Project card shows details:
     - Name: "Test Construction Project"
     - Status badge: "planning"
     - Progress: 0%
     - Type: "construction"
     - Tasks: 0

**Expected Results:**
- ✅ No console errors
- ✅ Project created in database
- ✅ Project visible in UI
- ✅ Project auto-selected

**Verify in Database:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM gantt_projects 
WHERE created_by = auth.uid() 
ORDER BY created_at DESC 
LIMIT 1;

-- Should show your new project
```

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 2: Project Persistence

### **Objective:** Verify projects persist across page refreshes

### **Steps:**

1. **Note selected project ID:**
   - Look at project card in Planning Hub
   - Remember project name

2. **Refresh page:**
   - Press F5 or Ctrl+R
   - Wait for page to reload

3. **Verify project restored:**
   - [ ] Project dropdown shows same projects
   - [ ] Same project is auto-selected
   - [ ] Project details still visible
   - [ ] Progress still shows

4. **Close and reopen browser:**
   - Close browser completely
   - Reopen and navigate to Planning Hub
   - [ ] Projects still present
   - [ ] Selection restored (from Zustand persist)

**Expected Results:**
- ✅ Projects persist across refreshes
- ✅ Selection persists across sessions
- ✅ No data loss

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 3: Use Project in Gantt Tool

### **Objective:** Verify project selection works across tools

### **Steps:**

1. **From Planning Hub:**
   - Ensure project is selected
   - Scroll to "Gantt Chart Builder" card
   - Click "Launch Tool →" button

2. **Verify navigation:**
   - [ ] URL is: `/free/ai-tools/planning/gantt?project={uuid}`
   - [ ] Gantt tool loads
   - [ ] Project info shown in header/toolbar

3. **Create a task:**
   - Click "Add Task" button (if available)
   - Fill task details:
     ```
     Title: Site Preparation
     Start Date: 2025-11-01
     End Date: 2025-11-15
     Duration: 14 days
     ```
   - Save task

4. **Verify task created:**
   - [ ] Task appears in Gantt chart
   - [ ] Task bar visible on timeline
   - [ ] Task details correct

5. **Go back to Planning Hub:**
   - Click back button or navigate manually
   - [ ] Same project still selected
   - [ ] Progress updated (now > 0%)
   - [ ] Task count shows 1

**Expected Results:**
- ✅ Project ID passed via URL
- ✅ Same project in both tools
- ✅ Tasks created in Gantt
- ✅ Progress updates in Planning Hub

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 4: Create Project via Gantt Tool

### **Objective:** Verify dual creation paths work

### **Steps:**

1. **Navigate to Gantt Tool (empty state):**
   ```
   http://localhost:8080/free/ai-tools/planning/gantt
   ```
   
2. **If you have projects:**
   - Temporarily deselect in Planning Hub
   - OR use a fresh account with no projects

3. **See empty state:**
   - [ ] Message: "No Projects Found"
   - [ ] Two buttons visible:
     - "Create Project"
     - "AI Generate"

4. **Click "Create Project":**
   - [ ] CreateProjectDialog opens
   - [ ] Same form as Planning Hub

5. **Create project:**
   ```
   Name: Gantt Test Project
   Type: Infrastructure
   Location: Jeddah
   Budget: 2000000
   Currency: SAR
   ```

6. **Verify project created:**
   - [ ] Success toast
   - [ ] Project loads in Gantt tool
   - [ ] Can now add tasks

7. **Go to Planning Hub:**
   - [ ] New project appears in dropdown
   - [ ] Can select it
   - [ ] Shows in project list

**Expected Results:**
- ✅ Both creation paths work
- ✅ Projects sync across tools
- ✅ Database is single source of truth

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 5: Multiple Projects

### **Objective:** Verify users can have many projects and switch between them

### **Steps:**

1. **Create 3 projects:**
   - Project A: "Residential Tower"
   - Project B: "Shopping Mall"
   - Project C: "Highway Extension"

2. **Verify all appear in dropdown:**
   - [ ] Planning Hub shows all 3
   - [ ] Ordered by creation date (newest first)

3. **Switch between projects:**
   - Select Project A
   - [ ] Details update
   - Launch Gantt Tool
   - [ ] URL has Project A ID
   - Go back to Planning Hub
   - Select Project B
   - [ ] Details update
   - Launch Gantt Tool
   - [ ] URL has Project B ID

4. **Add tasks to different projects:**
   - Project A: Add 2 tasks
   - Project B: Add 3 tasks
   - Project C: Add 1 task

5. **Verify task isolation:**
   - Select Project A in Gantt
   - [ ] Shows only 2 tasks
   - Select Project B in Gantt
   - [ ] Shows only 3 tasks
   - Select Project C in Gantt
   - [ ] Shows only 1 task

**Expected Results:**
- ✅ Multiple projects supported
- ✅ Switching works correctly
- ✅ Data isolated per project
- ✅ No data mixing

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 6: Form Validation

### **Objective:** Verify CreateProjectDialog validates inputs

### **Steps:**

1. **Test required fields:**
   - Open CreateProjectDialog
   - Leave name blank
   - Try to submit
   - [ ] Error message: "Project name must be at least 3 characters"

2. **Test name length:**
   - Enter "AB" (2 chars)
   - Try to submit
   - [ ] Error message shown
   - Enter "ABC" (3 chars)
   - [ ] Error clears

3. **Test date validation:**
   - Start Date: 2026-01-01
   - End Date: 2025-12-31 (before start)
   - Try to submit
   - [ ] Error message: "End date must be after start date"

4. **Test budget validation:**
   - Enter -1000 (negative)
   - Try to submit
   - [ ] Error message: "Budget must be a positive number"

5. **Test valid submission:**
   - Fill all fields correctly
   - [ ] Submit button enabled
   - [ ] No errors shown
   - [ ] Creates successfully

**Expected Results:**
- ✅ Validation prevents invalid data
- ✅ Error messages clear and helpful
- ✅ Valid data submits successfully

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 7: Empty States

### **Objective:** Verify empty states guide users appropriately

### **Steps:**

1. **Planning Hub - No Projects:**
   - Use fresh account OR delete all projects
   - Navigate to Planning Hub
   - [ ] Empty state shows
   - [ ] Icon: Briefcase
   - [ ] Message: "No Projects Yet"
   - [ ] Button: "Create Project"
   - Click button
   - [ ] Dialog opens

2. **Gantt Tool - No Projects:**
   - Navigate to `/free/ai-tools/planning/gantt`
   - [ ] Empty state shows
   - [ ] Message: "No Projects Found"
   - [ ] Two buttons: "Create Project" + "AI Generate"

3. **Tool with Project but No Data:**
   - Create project but don't add tasks
   - Open Gantt tool
   - [ ] Shows "No tasks yet" message
   - [ ] Provides "Add Task" action

**Expected Results:**
- ✅ Empty states are informative
- ✅ Provide clear next actions
- ✅ Guide users to create data

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 8: Loading States

### **Objective:** Verify loading indicators during async operations

### **Steps:**

1. **Initial load:**
   - Navigate to Planning Hub (clear cache first)
   - [ ] Spinner shows while loading projects
   - [ ] Spinner disappears when loaded

2. **Creating project:**
   - Fill CreateProjectDialog
   - Click submit
   - [ ] Button shows "Creating..." with spinner
   - [ ] Button disabled during creation

3. **Loading tasks:**
   - Navigate to Gantt tool
   - [ ] Loading state while fetching tasks
   - [ ] Chart appears when loaded

**Expected Results:**
- ✅ Loading states visible
- ✅ UI remains responsive
- ✅ No flash of empty content

**Status:** ⬜ PENDING

---

## ✅ Test Scenario 9: Error Handling

### **Objective:** Verify graceful error handling

### **Steps:**

1. **Network error simulation:**
   - Open DevTools → Network tab
   - Set to "Offline"
   - Try to create project
   - [ ] Error toast shows
   - [ ] Error message user-friendly
   - [ ] Can retry after going online

2. **Invalid data:**
   - Try to create project with extremely long name (>500 chars)
   - [ ] Validation catches it
   - [ ] OR database constraint catches it
   - [ ] User sees clear error

3. **Permission error:**
   - (Advanced) Try to access another user's project via URL
   - [ ] RLS blocks access
   - [ ] Shows "Project not found" or permission denied

**Expected Results:**
- ✅ Errors handled gracefully
- ✅ User-friendly messages
- ✅ No crashes or white screens

**Status:** ⬜ PENDING

---

## 🔐 Security Testing

### **Test: Row-Level Security**

**Objective:** Verify users can only see their own projects

**Setup:**
1. Create User A: `usera@test.com`
2. Create User B: `userb@test.com`

**Test:**

1. **As User A:**
   - Create project: "User A Project"
   - Note project ID

2. **As User B:**
   - Navigate to Planning Hub
   - [ ] Does NOT see "User A Project"
   - Try to navigate to: `/free/ai-tools/planning/gantt?project={user-a-project-id}`
   - [ ] Shows "Project not found" or loads empty
   - [ ] Cannot see User A's tasks

3. **Database verification:**
   ```sql
   -- As User B (different session)
   SELECT * FROM gantt_projects WHERE id = '{user-a-project-id}';
   -- Should return: 0 rows (RLS blocks)
   ```

**Expected Results:**
- ✅ User A sees only their projects
- ✅ User B sees only their projects
- ✅ No data leakage
- ✅ RLS enforced at database level

**Status:** ⬜ PENDING

---

## 📊 Performance Testing

### **Test: Load Time Benchmarks**

**Measure:**
- Planning Hub initial load: < 3 seconds
- CreateProjectDialog open: < 300ms
- Project creation: < 2 seconds
- Gantt tool load: < 3 seconds
- Task creation: < 1 second

**How to Measure:**
```javascript
// In browser console
performance.mark('start');
// Perform action
performance.mark('end');
performance.measure('action', 'start', 'end');
console.log(performance.getEntriesByType('measure'));
```

**Status:** ⬜ PENDING

---

## 🎯 Acceptance Criteria

### **Must Pass ALL:**

**Project Creation:**
- [ ] Can create project via Planning Hub
- [ ] Can create project via Gantt Tool
- [ ] Both methods persist to database
- [ ] Form validation works
- [ ] Success/error toasts show

**Project Selection:**
- [ ] Projects load from database
- [ ] Can select from dropdown
- [ ] Selection persists after refresh
- [ ] Selection shared across tools

**Data Persistence:**
- [ ] Projects persist across sessions
- [ ] Tasks persist with projects
- [ ] Progress calculated correctly
- [ ] No data loss on refresh

**Cross-Tool Integration:**
- [ ] Planning Hub → Gantt Tool works
- [ ] Project ID passed via URL
- [ ] Same project in both tools
- [ ] Data syncs correctly

**Security:**
- [ ] RLS enforced
- [ ] Users see only their projects
- [ ] Can't access others' data

**Error Handling:**
- [ ] Network errors handled
- [ ] Invalid data rejected
- [ ] User-friendly messages
- [ ] No crashes

**Code Quality:**
- [ ] Zero linter errors
- [ ] Zero TypeScript errors
- [ ] Zero console errors in browser
- [ ] Theme-consistent UI

---

## 🐛 Known Issues to Watch For

### **Potential Issues:**

**Issue 1: Projects not loading**
- **Symptom:** Dropdown stays empty
- **Cause:** Auth not ready, RLS blocking
- **Check:** Browser console for errors
- **Fix:** Ensure logged in, check RLS policies

**Issue 2: Selection not persisting**
- **Symptom:** Selection lost on refresh
- **Cause:** Zustand persist not working
- **Check:** localStorage for `nbcon-project-store`
- **Fix:** Clear localStorage and retry

**Issue 3: Tasks not showing**
- **Symptom:** Gantt chart empty
- **Cause:** Project ID mismatch, RLS blocking
- **Check:** Network tab, database query
- **Fix:** Verify project_id foreign key

**Issue 4: Form won't submit**
- **Symptom:** Button disabled or no action
- **Cause:** Validation errors, network error
- **Check:** Console for validation errors
- **Fix:** Fill all required fields correctly

---

## 📝 Test Results Template

### **Test Session Information:**

```
Date: YYYY-MM-DD
Tester: [Your Name]
Environment: Development (localhost:8080)
Browser: Chrome/Firefox/Safari [Version]
User Account: info@nbcon.org
```

### **Test Results:**

| Scenario | Status | Time | Notes |
|----------|--------|------|-------|
| 1. Create Project (Planning Hub) | ⬜ PASS / ❌ FAIL | __s | |
| 2. Project Persistence | ⬜ PASS / ❌ FAIL | __s | |
| 3. Use in Gantt Tool | ⬜ PASS / ❌ FAIL | __s | |
| 4. Create Project (Gantt) | ⬜ PASS / ❌ FAIL | __s | |
| 5. Multiple Projects | ⬜ PASS / ❌ FAIL | __s | |
| 6. Form Validation | ⬜ PASS / ❌ FAIL | __s | |
| 7. Empty States | ⬜ PASS / ❌ FAIL | __s | |
| 8. Loading States | ⬜ PASS / ❌ FAIL | __s | |
| 9. Error Handling | ⬜ PASS / ❌ FAIL | __s | |

**Overall Result:** ⬜ PASS / ❌ FAIL

**Issues Found:** 
```
(List any issues discovered during testing)
```

**Screenshots:**
```
(Attach screenshots of key screens)
```

---

## 🔄 Regression Testing

### **Verify Nothing Broke:**

**Planning Hub:**
- [ ] All 6 tool cards visible
- [ ] Recent activities show
- [ ] How It Works section present
- [ ] Quick actions work
- [ ] Page styling intact

**Gantt Tool:**
- [ ] Chart renders correctly
- [ ] Tabs work (Gantt View, Tasks, etc.)
- [ ] Toolbar functional
- [ ] XScroll horizontal scrolling works
- [ ] No layout breaking

**Other Pages:**
- [ ] Dashboard still loads
- [ ] Navigation still works
- [ ] No new console errors

---

## 🎉 Success Criteria

### **Phase 1 is successful if:**

**Core Functionality:**
- ✅ Users can create projects via UI
- ✅ Projects persist across sessions
- ✅ Planning Hub uses real database
- ✅ Gantt Tool integrated
- ✅ Same projects across both tools

**Quality:**
- ✅ Zero linter errors
- ✅ Zero TypeScript errors  
- ✅ Zero console errors
- ✅ Professional UI (theme-consistent)

**Security:**
- ✅ RLS enforced
- ✅ Users isolated
- ✅ No data leakage

**Performance:**
- ✅ All operations under target time
- ✅ No lag or freezing
- ✅ Smooth user experience

**Documentation:**
- ✅ Implementation guide complete
- ✅ Testing guide complete
- ✅ CHANGELOG updated
- ✅ Diagnostic document updated

---

## 🚀 Quick Test (5 Minutes)

### **Minimal Test to Verify Core Functionality:**

1. **Open Planning Hub**
2. **Click "New Project"**
3. **Fill form quickly:**
   - Name: "Quick Test"
   - Type: Construction
4. **Submit**
5. **Verify:**
   - [ ] Project appears
   - [ ] Can select it
6. **Refresh page**
7. **Verify:**
   - [ ] Project still there
8. **✅ CORE WORKING**

---

## 📞 Reporting Issues

### **If Tests Fail:**

**Gather Information:**
1. Screenshot of error
2. Browser console log (F12 → Console)
3. Network requests (F12 → Network)
4. Steps to reproduce

**Check Common Causes:**
- Not logged in?
- Database migrations not applied?
- RLS policies missing?
- TypeScript errors in code?
- Import paths wrong?

**Report Format:**
```markdown
## Issue: [Brief description]

**Scenario:** [Which test scenario]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Console Errors:** [Paste errors]
**Screenshot:** [Attach image]
**Steps to Reproduce:** [List steps]
```

---

## ✅ Next Steps After Testing

### **If All Tests Pass:**

1. ✅ Mark Phase 1 as complete
2. 🔜 Start Phase 2 (integrate remaining 5 tools)
3. 📝 Update production documentation
4. 🚀 Deploy to production (optional)

### **If Tests Fail:**

1. 🐛 Debug and fix issues
2. 🔄 Re-run failed tests
3. ✅ Verify fixes work
4. 📝 Update this guide with lessons learned

---

## 📚 Resources

**Documentation:**
- `docs/PROJECT_SELECTION_DIAGNOSTIC.md` - Analysis and solution design
- `docs/PROJECT_UNIFICATION_COMPLETE.md` - Implementation summary
- `docs/PHASE_2_INTEGRATION_GUIDE.md` - Next phase instructions

**Code:**
- `src/pages/4-free/others/stores/useProjectStore.ts` - Unified store
- `src/pages/4-free/others/features/ai-tools/components/CreateProjectDialog.tsx` - Creation form
- `src/pages/4-free/15-AIToolsPlanningPage.tsx` - Planning Hub
- `src/pages/4-free/others/features/ai-tools/tools/GanttChartTool.tsx` - Gantt Tool

**Database:**
- `supabase/migrations/20241024*.sql` - New tables

---

**Ready to test! Follow the scenarios above and report results.** 🧪

**Estimated Time:** 30 minutes for full testing  
**Critical Test:** Scenarios 1-4 (15 minutes minimum)

**Let's make sure everything works before Phase 2!** 🚀

