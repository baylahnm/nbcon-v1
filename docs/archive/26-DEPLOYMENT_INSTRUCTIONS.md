# 🚀 AI Token Widget - Quick Deployment

**Date:** October 29, 2025  
**Status:** Ready for Production Deployment

---

## ⚡ Quick Start (5 Minutes)

### **Step 1: Apply Database Migration**

```bash
cd supabase
supabase migration up 20251029000001_deploy_production_quotas
```

### **Step 2: Seed Quota Data**

```bash
psql $DATABASE_URL -f seeds/seed_ai_token_quotas.sql
```

### **Step 3: Disable Mock Data** (if enabled)

```bash
# Remove from .env.local:
# VITE_USE_MOCK_TOKENS=true

# Or explicitly set:
VITE_USE_MOCK_TOKENS=false
```

### **Step 4: Restart Application**

```bash
pnpm dev
```

### **Step 5: Verify**

1. Open sidebar
2. See "AI Tokens" widget in footer
3. Check console for: `[TokenService] ✅ Got quota from RPC`
4. Verify limit shows 10,000 for free users

---

## ✅ Verification Checklist

- [ ] Migration applied successfully
- [ ] All users have quota records (`SELECT COUNT(*) FROM user_ai_quotas`)
- [ ] RPC function works (`SELECT * FROM get_user_quota_status()`)
- [ ] `VITE_USE_MOCK_TOKENS` removed or set to false
- [ ] Console shows database data (not mock)
- [ ] Widget visible in sidebar
- [ ] Tests passing (`pnpm test tokenWidget`)

---

## 📊 What Gets Deployed

**Database Objects:**
- ✅ `user_ai_quotas` table (quota tracking)
- ✅ `get_user_quota_status()` RPC (optimized queries)
- ✅ `reset_monthly_quotas()` function (cron jobs)
- ✅ `initialize_user_quota()` function (user setup)
- ✅ Auto-initialization trigger (new users)
- ✅ Auto-update trigger (subscription changes)

**Quota Limits:**
| Tier | Tokens/Month | Requests/Month |
|------|--------------|----------------|
| Free | 10,000 | 100 |
| Basic | 50,000 | 500 |
| Pro | 200,000 | 2,000 |
| Enterprise | 10,000,000 | 10,000 |

---

## 🔧 Troubleshooting

**Widget Not Showing?**
```bash
# Check if user has quota
psql $DATABASE_URL -c "SELECT * FROM user_ai_quotas WHERE user_id = 'user-id';"

# Re-seed if needed
psql $DATABASE_URL -f supabase/seeds/seed_ai_token_quotas.sql
```

**Still Seeing Mock Data?**
```bash
# Check environment
echo $VITE_USE_MOCK_TOKENS

# Should be empty or "false"
# If "true", remove from .env.local and restart
```

**Console Errors?**
```bash
# Verify migration applied
psql $DATABASE_URL -c "\d user_ai_quotas"

# Should show table structure
# If not, re-run migration
```

---

## 📚 Full Documentation

For complete deployment guide:
→ **`docs/AI_TOKEN_WIDGET_PRODUCTION_DEPLOYMENT.md`**

For diagnostic/troubleshooting:
→ **`docs/TOKEN_WIDGET_DIAGNOSTIC_GUIDE.md`**

---

## 🎯 Success Criteria

✅ **Deployment Complete When:**
1. Widget renders in sidebar for all users
2. Console shows real database queries
3. Free users see 10,000 token limit
4. All tests passing (8/8)
5. No mock data in production

---

**Need Help?** Check the full deployment guide or run diagnostics:
```bash
pnpm tsx scripts/diagnostics/check-token-widget.ts
```

