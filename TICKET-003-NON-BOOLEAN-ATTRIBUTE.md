# 🎫 TICKET #003: React Non-Boolean Attribute Warning

**Created:** October 18, 2025  
**Status:** 🟡 **OPEN** - Low Priority  
**Page:** Learning (`/free/learning`)  
**Severity:** P3 - Low  
**User Impact:** None (dev console only)

---

## 🐛 Issue Description

React warning appears in browser console when rendering Learning page due to passing a boolean value to a non-boolean HTML attribute.

### Error Message:
```
Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: 
%s="%s" or %s={value.toString()}.
```

### Location:
- **Page:** `/free/learning`
- **Component:** Likely `HorizontalScrollCards.tsx:25`
- **Attribute:** `jsx={true}` (or similar)

---

## 📍 Steps to Reproduce

1. Navigate to `/free/learning`
2. Open browser DevTools → Console
3. Observe React warning on page load
4. Warning appears when course cards render

---

## 🎯 Root Cause

The code is passing a boolean value (`true` or `false`) to an HTML attribute that expects a string value or doesn't exist as a standard HTML attribute.

**Common Mistakes:**
```typescript
// ❌ Wrong - jsx is not a valid HTML attribute
<div jsx={true}>

// ❌ Wrong - boolean to string attribute
<div custom={true}>

// ✅ Correct - use data-* for custom attributes
<div data-jsx="true">

// ✅ Correct - remove if not needed
<div>
```

---

## 💡 Impact Analysis

### User Impact: ✅ None
- Learning page renders perfectly
- All course cards display correctly
- All interactions work normally
- No visible errors to users

### Developer Impact: 🟡 Low
- Console warning during development
- Code quality concern
- React best practices violation

### Technical Impact: 🟢 Very Low
- No performance impact
- No security impact
- No functionality impact

---

## ✅ Proposed Solution

### Fix: Remove or Convert Invalid Attribute

**File:** `src/pages/4-free/others/components/HorizontalScrollCards.tsx`

**Option 1: Remove the attribute** (Recommended)
```typescript
// Before (around line 25)
<div 
  jsx={true}
  className="horizontal-scroll-container"
>
  {children}
</div>

// After - Remove jsx attribute
<div className="horizontal-scroll-container">
  {children}
</div>
```

**Option 2: Convert to data attribute** (If needed for styling/JS)
```typescript
// Convert to valid data-* attribute
<div 
  data-jsx="true"
  className="horizontal-scroll-container"
>
  {children}
</div>
```

**Option 3: Use conditional class** (If for styling)
```typescript
// Use className instead
<div 
  className={cn(
    "horizontal-scroll-container",
    jsx && "jsx-enabled"
  )}
>
  {children}
</div>
```

**Estimated Time:** 5 minutes  
**Risk Level:** Very Low  
**Rollback:** Easy

---

## 🧪 Testing Plan

### Pre-Fix Verification:
1. Navigate to `/free/learning`
2. Open console
3. Confirm warning exists
4. Note exact line number from warning

### Post-Fix Verification:
1. Apply fix to HorizontalScrollCards.tsx
2. Save and hot-reload
3. Navigate to `/free/learning`
4. Open console - confirm NO warning
5. Test course carousel scrolling
6. Test all course card interactions
7. Verify no visual changes

### Expected Results:
- ✅ No console warnings
- ✅ Course carousel works identically
- ✅ Horizontal scrolling functional
- ✅ All course cards render correctly

---

## 📋 Acceptance Criteria

- [ ] Invalid attribute removed or converted
- [ ] Console warning eliminated
- [ ] Course carousel scrolling works
- [ ] All course card interactions preserved
- [ ] No visual regression
- [ ] Code follows React best practices
- [ ] No new warnings introduced

---

## 🔗 Related Files

**Application Code:**
- `src/pages/4-free/9-LearningPage.tsx` (page)
- `src/pages/4-free/others/components/HorizontalScrollCards.tsx:25` (component)

**Testing:**
- `BUTTON_INSPECTION_TICKETS.md` (main report)

---

## 🔍 Investigation Details

### Likely Location:
```typescript
// src/pages/4-free/others/components/HorizontalScrollCards.tsx

export const HorizontalScrollCards = ({
  children,
  // ... other props
}) => {
  return (
    <div
      jsx={true}  // ⚠️ LINE 25 - This is likely the issue
      className="..."
    >
      {children}
    </div>
  );
};
```

### Why This Happens:
- `jsx` is not a standard HTML attribute
- React expects string values for custom attributes
- Should use `data-*` prefix for custom attributes
- Or remove if not actually used

---

## 📊 Priority Justification

**Why Low Priority?**
- ✅ No user impact
- ✅ No functionality broken
- ✅ Simple 1-line fix
- ✅ Very low risk

**When to Fix:**
- During code quality cleanup
- When working on Learning page
- Before production audit
- As part of React warnings elimination

---

## 🎯 Success Metrics

**Before Fix:**
- Console warnings: 1 on Learning page
- Code quality: 97/100

**After Fix:**
- Console warnings: 0 on Learning page
- Code quality: 100/100
- Cleaner developer experience

---

**Status:** Ready for implementation when priority allows ✅

