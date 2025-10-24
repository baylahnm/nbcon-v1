# 🧪 Final QA Test Guide - Unified Project System

**Date:** October 24, 2025  
**Phase:** Post-QA Production Verification  
**Time Required:** 15 minutes  
**Status:** Ready to Execute

---

## 🎯 **Quick Test Checklist**

Execute these 6 quick tests to verify the unified system works perfectly:

---

### ✅ **Test 1: Project Creation & Auto-Selection** (2 min)

**Goal:** Verify project creation UI and auto-selection

**Steps:**
```
1. Navigate to: http://localhost:8080/free/ai-tools/planning
2. Click "New Project" button
3. Fill form:
   - Name: "Test Solar Farm"
   - Description: "QA testing project"
   - Type: "Infrastructure"
   - Budget: 500000
   - Currency: SAR
   - Status: "Planning"
4. Click "Create Project"
5. Wait for toast: "Project created successfully!"
```

**Expected Results:**
- ✅ Project appears in dropdown selector
- ✅ Project is auto-selected
- ✅ URL updates to include `?project=<uuid>`
- ✅ Project card shows in Planning Hub

**If Failed:** Check browser console for errors

---

### ✅ **Test 2: Charter Persistence** (3 min)

**Goal:** Verify Charter data persists across page refreshes

**Steps:**
```
1. From Planning Hub, click "Launch Tool" on Charter Generator card
2. Verify URL: /free/ai-tools/planning/charter?project=<uuid>
3. Wait for 6 sections to load
4. Click "Vision & Objectives" tab
5. Type: "This is a test vision statement for our solar farm project"
6. Click outside the textarea (triggers auto-save)
7. Wait for toast: "Section updated successfully"
8. Press F5 to refresh the page
9. Verify the text you entered is still there
```

**Expected Results:**
- ✅ Text persists after refresh
- ✅ Same project ID in URL
- ✅ No data loss
- ✅ Section marked as edited

**If Failed:** Check RLS policies on `project_charter_sections` table

---

### ✅ **Test 3: URL Parameter Sync** (2 min)

**Goal:** Verify URL ↔ Store bidirectional sync works

**Steps:**
```
1. While in Charter (URL: /charter?project=abc123)
2. Click "Back to Planning Hub"
3. Verify URL: /planning?project=abc123 (same project ID)
4. Click "Launch Tool" on Risk Register
5. Verify URL: /risks?project=abc123 (same project ID)
6. Click "Back to Planning Hub"
7. Select different project from dropdown
8. Click "Launch Tool" on Charter
9. Verify URL has NEW project ID
```

**Expected Results:**
- ✅ Project ID consistent across navigation
- ✅ URL updates when project changes
- ✅ Store updates when URL changes
- ✅ Bidirectional sync working

**If Failed:** Check `useProjectParamSync` hook integration

---

### ✅ **Test 4: Cross-Tool Data Isolation** (3 min)

**Goal:** Verify each tool loads its own data per project

**Steps:**
```
1. Ensure "Test Solar Farm" is selected
2. Open Charter → Add text to "Vision & Objectives"
3. Return to Planning Hub
4. Create SECOND project: "Hospital Building"
5. Open Charter for "Hospital Building"
6. Verify Vision section is EMPTY (not showing Solar Farm content)
7. Add different text for Hospital
8. Switch back to "Test Solar Farm" project
9. Open Charter
10. Verify Solar Farm text is intact (not replaced)
```

**Expected Results:**
- ✅ Each project has independent Charter data
- ✅ No data mixing between projects
- ✅ Switching projects loads correct data
- ✅ Both projects maintain their own content

**If Failed:** Check queries filter by `project_id` correctly

---

### ✅ **Test 5: Direct URL Access** (2 min)

**Goal:** Verify direct links and bookmarks work

**Steps:**
```
1. While in Charter with project selected, copy full URL:
   Example: http://localhost:8080/free/ai-tools/planning/charter?project=abc123
2. Open new browser tab (or close and reopen browser)
3. Paste URL directly into address bar
4. Press Enter
```

**Expected Results:**
- ✅ Charter loads with correct project
- ✅ Project is selected in store
- ✅ Charter sections load
- ✅ Previously entered content shows
- ✅ No "No Project Selected" error

**If Failed:** Check `useProjectParamSync` hook reads URL on mount

---

### ✅ **Test 6: RLS Enforcement** (3 min)

**Goal:** Verify users can only see their own projects

**Steps:**
```
1. Sign in as: info@nbcon.org / Qazwsx1234@
2. Create project: "Private Project A"
3. Note the project in Planning Hub
4. Click "Sign Out"
5. Sign in as different user (create new account or use mahdi.n.baylah@outlook.com)
6. Navigate to Planning Hub
7. Check project list
```

**Expected Results:**
- ✅ "Private Project A" is NOT visible to second user
- ✅ Second user sees only their own projects (or none if new)
- ✅ RLS preventing cross-user data access
- ✅ Database security working

**If Failed:** Run RLS verification SQL (see below)

---

## 🔍 **Troubleshooting**

### **Issue: Project not appearing after creation**

**Check:**
```sql
-- Verify project was created
SELECT * FROM gantt_projects 
WHERE created_by = auth.uid() 
ORDER BY created_at DESC 
LIMIT 5;
```

**Fix:** Ensure user is authenticated and RLS policies exist

---

### **Issue: Charter content not saving**

**Check:**
```sql
-- Verify RLS on charter sections
SELECT * FROM pg_policies 
WHERE tablename = 'project_charter_sections';

-- Try manual insert
INSERT INTO project_charter_sections (project_id, section_name, section_order, content)
VALUES (
  '<your-project-id>',
  'Test Section',
  99,
  'Test content'
);
```

**Fix:** Apply migration `20241024000001_project_charter_sections.sql`

---

### **Issue: URL parameter not syncing**

**Check Browser Console:**
```javascript
// Verify hook is running
// Should see store updates when URL changes
```

**Fix:** Ensure `useProjectParamSync()` is called at top of component

---

### **Issue: "No Project Selected" after refresh**

**Check:**
1. URL has `?project=<uuid>` parameter
2. Project exists in database
3. User owns the project (created_by matches)

**Fix:** Clear localStorage and re-select project

---

## 📊 **Success Criteria**

### **All Tests Must Pass:**

- [ ] Test 1: Project Creation ✅
- [ ] Test 2: Charter Persistence ✅
- [ ] Test 3: URL Parameter Sync ✅
- [ ] Test 4: Data Isolation ✅
- [ ] Test 5: Direct URL Access ✅
- [ ] Test 6: RLS Enforcement ✅

**If all 6 pass:** System is production ready! 🎉

---

## 🚀 **Post-Test Actions**

### **After All Tests Pass:**

1. ✅ Mark system as verified
2. ✅ Update team on readiness
3. ✅ Prepare for production deployment
4. ✅ Plan user onboarding

### **Deployment Preparation:**

```bash
# 1. Build for production
npm run build

# 2. Test production build locally
npm run preview

# 3. Verify all routes work in preview

# 4. Deploy to staging/production
# (Follow your deployment process)
```

---

## 🎊 **Expected Outcome**

**After completing these 6 tests (15 minutes total):**

✅ **100% confidence** in the unified project system  
✅ **Zero errors** confirmed  
✅ **Production ready** verified  
✅ **User experience** polished  
✅ **Data security** enforced  
✅ **Performance** optimized

**Status:** Ready to serve users! 🚀

---

**Test Guide Version:** 1.0  
**Created:** October 24, 2025  
**Updated:** October 24, 2025  
**Maintained By:** QA Team

🎯 **Let's verify perfection!**

