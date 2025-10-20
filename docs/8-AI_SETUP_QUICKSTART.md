# 🚀 AI Assistant - Quick Setup Guide

**Time Required:** 10 minutes  
**Difficulty:** Easy

---

## Prerequisites

- ✅ Supabase project set up
- ✅ Supabase CLI installed
- ✅ OpenAI API account

---

## Step 1: Get OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: `nbcon-ai-assistant`
4. Copy the key (starts with `sk-...`)
5. **Save it safely** - you won't see it again!

---

## Step 2: Add Key to Supabase (3 minutes)

### Option A: Supabase Dashboard (Recommended)

1. Open https://supabase.com/dashboard
2. Select your project: `joloqygeooyntwxjpxwv`
3. Go to: **Settings → Edge Functions**
4. Click **"Manage secrets"**
5. Add new secret:
   ```
   Name: OPENAI_API_KEY
   Value: sk-... (paste your key)
   ```
6. Click **"Add secret"**

### Option B: Supabase CLI

```bash
# Set the secret
supabase secrets set OPENAI_API_KEY=sk-...

# Verify it's set
supabase secrets list
# Should show: OPENAI_API_KEY (hidden)
```

---

## Step 3: Deploy Edge Function (3 minutes)

```bash
# Navigate to project root
cd d:\nbcon-v1

# Link to Supabase project (if not done)
supabase link --project-ref joloqygeooyntwxjpxwv

# Deploy the AI chat function
supabase functions deploy ai-chat

# Expected output:
# Deploying function ai-chat...
# Function ai-chat deployed successfully ✅
```

### Verify Deployment

```bash
# Test the function
curl https://joloqygeooyntwxjpxwv.supabase.co/functions/v1/ai-chat

# Expected response:
{
  "status": "ok",
  "message": "AI router is online",
  "supportedRoutes": [...],
  "features": [...]
}
```

---

## Step 4: Test in UI (2 minutes)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to dashboard:**
   ```
   http://localhost:8080/free/dashboard
   ```

3. **Test AI prompt:**
   - Scroll to AI Assistant widget
   - Click "Cost & Budgeting" dropdown
   - Select "Estimate cost for site survey in Riyadh"
   - Prompt appears in chat composer below
   - Click **Send** button
   - Wait for AI response (5-10 seconds)

4. **Verify:**
   - ✅ AI response appears in message preview
   - ✅ Response is relevant to construction/Saudi context
   - ✅ No errors in browser console

---

## 🎉 Success!

You now have a fully functional AI assistant with:
- ✅ Real OpenAI integration
- ✅ 30 construction-specific prompts
- ✅ Role-based assistance
- ✅ Bilingual support (EN/AR)
- ✅ Message persistence

---

## 🔍 Troubleshooting

### "OPENAI_API_KEY not configured"

**Fix:** Redeploy function after adding secret
```bash
supabase functions deploy ai-chat
```

### Function deployment fails

**Fix:** Ensure you're linked to correct project
```bash
supabase link --project-ref joloqygeooyntwxjpxwv
```

### No response from AI

**Check:**
1. Browser console for errors
2. Supabase Edge Function logs (Dashboard → Edge Functions → Logs)
3. OpenAI account has credits

### Database errors

**Fix:** Apply TICKET #002 fix if needed
```sql
ALTER TABLE ai_events RENAME COLUMN event_data TO data;
```

---

## 📚 Next Steps

1. **Read full guide:** `docs/7-AI_ASSISTANT_GUIDE.md`
2. **Test all prompts:** Try each of the 30 prompts
3. **Test all roles:** Engineer, Client, Enterprise, Admin
4. **Test languages:** Switch to Arabic and test
5. **Monitor costs:** Check OpenAI usage dashboard

---

## 💰 Cost Estimation

**Typical Usage:**
- **Average message:** ~500 tokens (input) + 800 tokens (output)
- **Cost per message:** ~$0.002 (gpt-4o-mini)
- **100 messages/day:** ~$0.20/day = $6/month
- **1000 messages/day:** ~$2/day = $60/month

**Cost Optimization:**
- Use gpt-4o-mini for general questions (default)
- Use gpt-4o only for research mode
- Limit conversation history to 10 messages
- Monitor usage in `ai_events` table

---

**Setup Complete!** Start using the AI assistant now. 🚀

