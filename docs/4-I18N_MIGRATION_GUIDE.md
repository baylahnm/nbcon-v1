# 🌍 i18n Migration Guide

## Overview

This guide explains how to use and extend the bilingual (EN ↔ AR) internationalization system in the nbcon app.

---

## ✅ What's Already Done

**Infrastructure (100% Complete)**
- ✅ i18next + react-i18next configured
- ✅ Automatic RTL/LTR switching
- ✅ Language detection (URL → localStorage → cookie → browser)
- ✅ Lazy-loaded namespaces for performance
- ✅ SAR currency & date formatters

**Translation Namespaces Created**
- ✅ `common.json` - Shared UI strings (buttons, validation, errors)
- ✅ `auth.json` - Authentication & account selection
- ✅ `registration.json` - All signup forms
- ✅ `homepage.json` - Landing page content
- ✅ `admin.json` - Admin dashboard
- ✅ `client.json` - Client dashboard
- ✅ `engineer.json` - Engineer dashboard
- ✅ `enterprise.json` - Enterprise dashboard

**Fully Migrated Pages**
- Account Type Selection
- Client/Engineer/Enterprise Signup
- HomePage
- Error pages (404, 403)
- Admin Dashboard (partial)

---

## 📁 File Structure

```
src/pages/1-HomePage/others/lib/i18n/
├── i18n.ts                # Main i18next configuration
├── dir.ts                 # RTL/LTR direction controller
├── useNamespace.ts        # Lazy loading hook
├── intl.ts                # Currency/date formatters
└── locales/
    ├── en/               # English translations
    │   ├── common.json
    │   ├── auth.json
    │   ├── registration.json
    │   ├── homepage.json
    │   ├── admin.json
    │   ├── client.json
    │   ├── engineer.json
    │   └── enterprise.json
    └── ar/               # Arabic translations
        └── (same structure)
```

---

## 🚀 How to Migrate a Page

### Step 1: Import i18n Hooks

```tsx
import { useTranslation } from 'react-i18next';
import { useNamespace } from '@/pages/1-HomePage/others/lib/i18n/useNamespace';
```

### Step 2: Add Hooks at Component Start

```tsx
export default function MyPage() {
  // Load required namespaces
  const ready = useNamespace(['client', 'common']);
  const { t } = useTranslation(['client', 'common']);
  
  // All other hooks...
  const [state, setState] = useState();
  
  // Early return AFTER all hooks
  if (!ready) return null;
  
  return (...);
}
```

⚠️ **Critical:** Place `if (!ready) return null;` AFTER all hooks to avoid React Rules of Hooks violations.

### Step 3: Replace Text Strings

**Before:**
```tsx
<h1>Client Dashboard</h1>
<Button>Save Changes</Button>
```

**After:**
```tsx
<h1>{t('client:dashboard.title')}</h1>
<Button>{t('common:actions.save')}</Button>
```

### Step 4: Add LanguageSwitcher (Optional)

```tsx
import { LanguageSwitcher } from '@/pages/1-HomePage/others/components/i18n/LanguageSwitcher';

<LanguageSwitcher /> // Add to navbar/header
```

---

## 🎯 Translation Key Naming

**Pattern:** `namespace:section.subsection.key`

**Examples:**
```tsx
t('common:actions.save')              // ✅ Good
t('client:dashboard.stats.active')    // ✅ Good
t('engineer:jobs.filters.location')   // ✅ Good
```

**Namespace Selection:**
- `common` - Buttons, validation, navigation, errors
- `auth` - Login, signup, account selection
- `registration` - Signup forms
- `homepage` - Landing page
- `admin/client/engineer/enterprise` - Role-specific pages

---

## 💱 Format Currency & Dates

**Import Formatters:**
```tsx
import { formatSAR, formatDate, formatNumber } from '@/pages/1-HomePage/others/lib/i18n/intl';
```

**Usage:**
```tsx
formatSAR(45)           // "SAR 45.00" (en) | "٤٥٫٠٠ ر.س." (ar)
formatDate(new Date())  // "Jan 15, 2024" (en) | "١٥ يناير ٢٠٢٤" (ar)
formatNumber(1234.56)   // "1,234.56" (en) | "١٬٢٣٤٫٥٦" (ar)
```

---

## 🔄 Add New Language

1. **Copy translation folders:**
   ```
   cp -r src/pages/1-HomePage/others/lib/i18n/locales/en locales/fr
   ```

2. **Translate JSON values** (keep keys unchanged)

3. **Update i18n.ts:**
   ```ts
   export const SUPPORTED_LANGS = ['en', 'ar', 'fr'] as const;
   ```

4. **Update dir.ts** (if RTL language):
   ```ts
   const dir = ['ar', 'he', 'fa'].includes(lang) ? 'rtl' : 'ltr';
   ```

5. **Add to LanguageSwitcher.tsx:**
   ```tsx
   <SelectItem value="fr">Français</SelectItem>
   ```

---

## 🧪 Testing

**Test Language Switching:**
1. Navigate to any migrated page
2. Click LanguageSwitcher in header
3. Toggle EN ↔ AR
4. Verify:
   - Text translates
   - Layout flips RTL/LTR
   - Numbers/dates format correctly

**Test URLs:**
- http://localhost:8081/auth/account-type
- http://localhost:8081/signup/client
- http://localhost:8081/home

**Force Language via URL:**
- http://localhost:8081/home?lng=ar
- http://localhost:8081/home?lng=en

---

## 📝 Common Patterns

### Interpolation
```tsx
// Translation file:
"welcome": "Welcome, {{name}}!"

// Usage:
t('homepage:welcome', { name: userName })
```

### Plurals
```tsx
// Translation file:
"items": "{{count}} item",
"items_other": "{{count}} items"

// Usage:
t('common:items', { count: 5 })  // "5 items"
```

### HTML in Translations
```tsx
<p dangerouslySetInnerHTML={{ 
  __html: t('auth:accountType.youSelected', { accountType: 'Client' })
}} />
```

---

## 🎨 RTL/LTR Styling Tips

**Use Logical Properties (Preferred):**
```css
/* Instead of margin-left */
margin-inline-start: 1rem;

/* Instead of padding-right */
padding-inline-end: 0.5rem;
```

**Tailwind Logical Utilities:**
```tsx
<div className="ps-4 pe-2">  {/* padding-inline-start/end */}
<div className="ms-auto">     {/* margin-inline-start */}
```

**Conditional RTL:**
```tsx
const isRTL = i18n.language === 'ar';
<div className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
```

---

## 🐛 Troubleshooting

**"Rendered more hooks than during the previous render"**
- **Cause:** `if (!ready) return null;` placed before other hooks
- **Fix:** Move early return AFTER all hooks

**"Translation key not found"**
- Check namespace is loaded: `useNamespace(['missing-namespace'])`
- Verify key exists in JSON file
- Check syntax: `t('namespace:key.subkey')`

**"Language not switching"**
- Clear localStorage: `localStorage.removeItem('i18nextLng')`
- Check `SUPPORTED_LANGS` includes the language
- Verify translation files exist

**RTL layout broken**
- Check `watchDirection()` is called in App.tsx
- Verify `dir` attribute on `<html>` element
- Use logical CSS properties instead of left/right

---

## 📊 Current Migration Status

**Completed:** 62/62 pages (100% namespaces created)

**Fully Migrated:**
- Public & Auth pages (8 pages)
- Signup flow (4 pages)
- Admin Dashboard (partial - 2 pages)

**Namespace Ready (Needs Page Migration):**
- Remaining Admin pages (6 pages)
- All Client pages (14 pages)
- All Engineer pages (14 pages)
- All Enterprise pages (13 pages)

**Pattern Established:** Copy from migrated examples above

---

## 🎓 Best Practices

1. **Keep translations in sync** - Update both EN & AR files
2. **Use descriptive keys** - `dashboard.stats.activeProjects` not `stat1`
3. **Reuse common strings** - Check `common.json` before adding new keys
4. **Group related keys** - Use nested objects for organization
5. **Test both languages** - Always verify AR translations render correctly
6. **Lazy load namespaces** - Only load what the page needs

---

## 📚 Resources

- i18next Docs: https://www.i18next.com/
- React-i18next: https://react.i18next.com/
- Arabic Localization Guide: https://phrase.com/blog/posts/guide-to-rtl-translation/

---

**Questions?** Check migrated pages for examples:
- `src/pages/2-auth/others/features/auth/components/AccountTypePricing.tsx`
- `src/pages/2-auth/signup/ClientSignup.tsx`
- `src/pages/1-HomePage/HomePage.tsx`

