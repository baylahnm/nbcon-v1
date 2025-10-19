# 🎫 TICKET #001: AI Events Database Column Missing

**Created:** October 18, 2025  
**Status:** 🟠 **OPEN** - Medium Priority  
**Page:** AI Assistant (`/free/ai`)  
**Severity:** P2 - Medium  
**User Impact:** None (invisible issue)

---

## 🐛 Issue Description

AI event logging fails when users interact with the AI Assistant due to a missing database column.

### Error Message:
```
[ERROR] Failed to load resource: 400
@ https://joloqygeooyntwxjpxwv.supabase.co/rest/v1/ai_events

[ERROR] Failed to log event: 
{
  code: "PGRST204",
  details: null,
  hint: null,
  message: "Could not find the 'data' column of 'ai_events'"
}
```

### Location:
- **File:** `aiClient.ts:277`
- **Table:** `ai_events`
- **Missing Column:** `data` (JSONB)

---

## 📍 Steps to Reproduce

1. Navigate to `/free/ai`
2. Open browser DevTools → Console
3. Observe error message on page load
4. Error repeats when trying to log AI interactions

---

## 🎯 Root Cause

The `ai_events` table schema is missing the `data` column that the application code expects to use for storing additional event metadata in JSON format.

**Expected Schema:**
```sql
CREATE TABLE ai_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT,
  service_mode TEXT,
  data JSONB,  -- ⚠️ THIS COLUMN IS MISSING
  created_at TIMESTAMP
);
```

---

## 💡 Impact Analysis

### User Impact: ✅ None
- AI Assistant chat interface works perfectly
- Users can send messages and receive responses
- No visible errors or broken functionality
- UX is completely unaffected

### Business Impact: ⚠️ Medium
- ❌ AI interaction analytics NOT tracked
- ❌ User behavior data NOT collected
- ❌ Cannot analyze which AI features are most used
- ❌ Missing insights for product improvement

### Technical Impact: 🟡 Low
- Console errors clutter development environment
- Error monitoring tools may alert unnecessarily
- Logs contain repeated error messages

---

## ✅ Proposed Solution

### Fix: Add Missing Database Column

**File:** `supabase/fixes/013-add-ai-events-data-column.sql`

```sql
-- Add missing data column
ALTER TABLE ai_events 
ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_ai_events_data 
ON ai_events USING gin(data);
```

**Estimated Time:** 5 minutes  
**Risk Level:** Low (additive change, no breaking changes)  
**Rollback:** Easy (can drop column if needed)

---

## 🧪 Testing Plan

### Pre-Fix Verification:
1. Navigate to `/free/ai`
2. Open console - confirm error exists
3. Check Supabase logs - confirm 400 errors

### Post-Fix Verification:
1. Run SQL fix script in Supabase SQL Editor
2. Verify column exists:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'ai_events' AND column_name = 'data';
   -- Expected: data | jsonb
   ```
3. Navigate to `/free/ai`
4. Open console - confirm NO errors
5. Send test message in AI chat
6. Check ai_events table - confirm event logged with data

### Expected Results:
- ✅ No console errors
- ✅ Events logged successfully
- ✅ Data column populated
- ✅ Analytics tracking restored

---

## 📋 Acceptance Criteria

- [ ] SQL migration script created
- [ ] Column added to ai_events table
- [ ] GIN index created for performance
- [ ] Console errors eliminated
- [ ] Event logging successful
- [ ] Analytics tracking working
- [ ] No regression in AI Assistant functionality
- [ ] Documentation updated

---

## 🔗 Related Files

**Database:**
- `supabase/fixes/013-add-ai-events-data-column.sql` (fix script)

**Application Code:**
- `src/pages/4-free/others/ai/aiClient.ts:277` (logging call)
- `src/pages/4-free/7-AIAssistantPage.tsx` (AI page)

**Documentation:**
- `BUTTON_INSPECTION_TICKETS.md` (main report)

---

## 📊 Priority Justification

**Why Medium Priority?**
- ✅ No user-facing impact (invisible to users)
- ⚠️ Analytics broken (business insight loss)
- ✅ Easy fix (5 minute migration)
- ✅ Low risk (additive change)

**Why Not High Priority?**
- Users can use all AI features normally
- No data corruption or security risk
- No revenue impact

**Why Not Low Priority?**
- Analytics data valuable for product decisions
- Error monitoring alerts may trigger
- Quick fix available

---

## 🚀 Deployment Notes

**Deployment Strategy:** Direct migration (no feature flag needed)

**Steps:**
1. Test on development branch first
2. Apply to staging environment
3. Verify analytics working
4. Apply to production during low-traffic period
5. Monitor error logs for 24 hours

**Rollback Plan:**
```sql
-- If issues arise, simply drop the column
ALTER TABLE ai_events DROP COLUMN IF EXISTS data;
DROP INDEX IF EXISTS idx_ai_events_data;
```

**Monitoring:**
- Check Supabase error logs (next 24 hours)
- Verify ai_events table is populating
- Confirm no 400/PGRST204 errors
- Monitor query performance (should be same or better)

---

## ✅ Sign-Off

**Reported By:** AI Browser Automation  
**Verified By:** _Pending_  
**Approved By:** _Pending_  
**Applied By:** _Pending_  
**Date Applied:** _Pending_

---

**Status:** Ready for implementation ✅

