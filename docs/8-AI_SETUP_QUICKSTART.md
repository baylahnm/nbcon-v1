# 🤖 AI Assistant - Quick Setup

**Last Updated:** December 20, 2024  
**Version:** 1.0  
**Status:** ✅ Production Ready

---

## ⚡ 5-Minute Setup

### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-...`)

### Step 2: Add to Supabase
1. Open Supabase Dashboard
2. Go to **Project Settings → Edge Functions → Secrets**
3. Add new secret:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...` (your key)
4. Click "Add Secret"

### Step 3: Deploy Edge Function
```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref joloqygeooyntwxjpxwv

# Deploy the function
supabase functions deploy ai-chat

# Verify deployment
curl https://joloqygeooyntwxjpxwv.supabase.co/functions/v1/ai-chat
```

### Step 4: Test AI Assistant
1. Start your app: `npm run dev`
2. Navigate to `/free/dashboard`
3. Try any AI prompt from the dropdown menus
4. Or go to `/free/ai` for full chat interface

---

## 🎯 What You Get

### 30 Construction-Specific Prompts
- **Project Planning** (5 prompts)
- **Cost & Budgeting** (5 prompts)  
- **Communication** (5 prompts)
- **Compliance & Safety** (5 prompts)
- **Technical & Design** (5 prompts)
- **Documentation** (5 prompts)

### Role-Based AI Assistance
- **Engineer** - Technical questions, job matching, SCE compliance
- **Client** - Project planning, cost estimation, engineer selection
- **Enterprise** - Portfolio management, procurement, analytics
- **Admin** - User management, platform monitoring

### Features
- ✅ Real OpenAI integration (gpt-4o/gpt-4o-mini)
- ✅ Bilingual support (English/Arabic)
- ✅ Conversation history
- ✅ Message persistence
- ✅ Error handling
- ✅ Cost tracking

---

## 🔧 Troubleshooting

### "OPENAI_API_KEY not configured"
- Check Supabase Dashboard → Edge Functions → Secrets
- Verify `OPENAI_API_KEY` exists
- Redeploy: `supabase functions deploy ai-chat`

### "User not authenticated"
- Sign in at `/auth`
- Check browser console for auth errors
- Clear localStorage and re-login

### "Failed to generate response"
- Check OpenAI API key is valid
- Verify OpenAI account has credits
- Check browser console for detailed error

---

## 📚 Full Documentation

For complete details, see:
- **[7-AI_ASSISTANT_GUIDE.md](7-AI_ASSISTANT_GUIDE.md)** - Complete setup, features, API reference
- **[6-CLIENT_FREE_PORTAL.md](6-CLIENT_FREE_PORTAL.md)** - Client portal with AI integration

---

**Ready to use AI-powered construction assistance!** 🚀