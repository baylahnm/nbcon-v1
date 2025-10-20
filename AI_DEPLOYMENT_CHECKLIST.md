# ✅ AI Assistant - Deployment Checklist

**Before deploying the AI Assistant to production, complete this checklist.**

---

## 🔑 Prerequisites

- [ ] OpenAI API account created
- [ ] OpenAI API key obtained (sk-...)
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Project linked (`supabase link --project-ref joloqygeooyntwxjpxwv`)

---

## 🛠️ Setup Steps

### 1. Environment Configuration

- [ ] OpenAI API key added to Supabase secrets
  ```bash
  supabase secrets set OPENAI_API_KEY=sk-...
  ```
- [ ] Verify secret exists
  ```bash
  supabase secrets list
  ```

### 2. Database Verification

- [ ] Verify `ai_conversations` table exists
- [ ] Verify `ai_messages` table exists
- [ ] Verify `ai_events` table exists
- [ ] Fix TICKET #002 if needed (event_data → data)
  ```sql
  ALTER TABLE ai_events RENAME COLUMN event_data TO data;
  ```
- [ ] Verify RLS policies are active
- [ ] Test insert permissions for logged-in users

### 3. Edge Function Deployment

- [ ] Deploy ai-chat function
  ```bash
  supabase functions deploy ai-chat
  ```
- [ ] Verify deployment success
  ```bash
  curl https://joloqygeooyntwxjpxwv.supabase.co/functions/v1/ai-chat
  ```
- [ ] Check function logs for errors
  ```bash
  supabase functions logs ai-chat
  ```

### 4. Frontend Integration

- [ ] `useAiStore.ts` updated with real backend calls
- [ ] All 30 dashboard prompts have onClick handlers
- [ ] `handlePromptSelect` function implemented
- [ ] Supabase client imported correctly
- [ ] No TypeScript errors
- [ ] No linter errors

---

## 🧪 Testing

### Basic Functionality

- [ ] **Test prompt pre-fill:**
  - Dashboard → AI Widget → Click any dropdown
  - Select a prompt
  - Verify it appears in composer

- [ ] **Test send message:**
  - Type or use prompt
  - Click Send
  - Verify loading state shows
  - Verify response appears (5-10 sec)

- [ ] **Test message persistence:**
  - Send message
  - Refresh page
  - Navigate to /free/ai
  - Verify message history loads

### Role-Based Testing

- [ ] **Test as Engineer** (info@nbcon.org)
  - Send: "Help me prepare for a structural engineering interview"
  - Verify response is engineering-focused

- [ ] **Test as Client** (mahdi.n.baylah@outlook.com)
  - Send: "How do I estimate project costs?"
  - Verify response is project management-focused

- [ ] **Test as Enterprise** (if account exists)
  - Send: "Help me manage multiple projects"
  - Verify response is portfolio management-focused

- [ ] **Test as Admin** (if account exists)
  - Send: "How do I analyze platform metrics?"
  - Verify response is admin-focused

### Language Testing

- [ ] Switch to Arabic in settings
- [ ] Send Arabic message: "ساعدني في إدارة المشروع"
- [ ] Verify AI responds in Arabic
- [ ] Switch back to English
- [ ] Verify AI responds in English

### Mode Testing

- [ ] **Chat mode:** General question → Fast response
- [ ] **Research mode:** Complex question → Detailed response
- [ ] **Agent mode:** Task request → Step-by-step breakdown
- [ ] **Image mode:** Image-related request

### All 30 Prompts

**Project Planning:**
- [ ] Create project charter
- [ ] Generate construction schedule
- [ ] Draft feasibility study
- [ ] Suggest risk mitigation
- [ ] Create milestone breakdown

**Cost & Budgeting:**
- [ ] Estimate site survey cost
- [ ] Generate BOQ template
- [ ] Calculate material costs
- [ ] Analyze budget variance
- [ ] Create cash flow projection

**Communication:**
- [ ] Draft client update email
- [ ] Write contractor letter
- [ ] Create site report
- [ ] Draft RFI
- [ ] Generate meeting minutes

**Compliance & Safety:**
- [ ] SCE verification checklist
- [ ] Safety inspection report
- [ ] HSE compliance checklist
- [ ] Building permit requirements
- [ ] QA procedures template

**Technical & Design:**
- [ ] Material specs
- [ ] MEP design considerations
- [ ] Concrete mix design
- [ ] Soil test analysis
- [ ] Load calculations

**Documentation:**
- [ ] Change order template
- [ ] As-built drawings checklist
- [ ] Punch list template
- [ ] Project closeout report
- [ ] Warranty documentation

### Error Handling

- [ ] Disconnect network → Send message
  - Verify error message appears
  - Verify retry works after reconnect

- [ ] Invalid API key (test in staging)
  - Verify friendly error message

- [ ] Rate limit hit (if possible)
  - Verify graceful handling

---

## 📊 Performance Checks

- [ ] First message response time: < 10 seconds
- [ ] Subsequent messages: < 8 seconds (with context)
- [ ] No memory leaks after 20+ messages
- [ ] UI remains responsive during generation
- [ ] Optimistic updates work smoothly

---

## 🔒 Security Verification

- [ ] OpenAI API key NOT in client-side code
- [ ] OpenAI API key NOT in git
- [ ] RLS policies enforced (test with different users)
- [ ] User can only access own conversations
- [ ] Admin can access all conversations (if policy exists)
- [ ] No CORS errors in production
- [ ] Authorization header required for edge function

---

## 💰 Cost Monitoring Setup

- [ ] Check OpenAI usage dashboard
  - https://platform.openai.com/usage

- [ ] Query token usage in database
  ```sql
  SELECT 
    COUNT(*) as messages,
    SUM(token_count) as total_tokens,
    SUM(cost_usd) as total_cost
  FROM ai_events
  WHERE created_at >= CURRENT_DATE;
  ```

- [ ] Set up usage alerts (optional)
  - OpenAI dashboard → Usage limits
  - Set daily/monthly caps

---

## 📱 Cross-Browser Testing

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Mac)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)

---

## 🚀 Production Deployment

### Pre-Deployment

- [ ] All tests pass
- [ ] No console errors
- [ ] No linter errors
- [ ] Documentation complete
- [ ] OpenAI key set in production Supabase
- [ ] Edge function deployed to production

### Post-Deployment

- [ ] Test with real user account
- [ ] Monitor error logs (first hour)
- [ ] Check token usage (first day)
- [ ] Verify cost is within budget
- [ ] Collect user feedback

---

## 📈 Success Metrics

### Week 1 Targets

- **Adoption:** > 20% of active users try AI
- **Engagement:** > 3 messages per user per session
- **Satisfaction:** > 80% positive feedback
- **Error Rate:** < 5% of requests
- **Response Time:** < 10 seconds average

### Month 1 Targets

- **Daily Active Users:** > 50% use AI at least once
- **Retention:** > 60% users return to AI within 7 days
- **Cost per User:** < $0.50/month
- **Error Rate:** < 2%

---

## 🆘 Emergency Contacts

**If something breaks:**

1. **Disable AI temporarily:**
   ```typescript
   // In DashboardContent.tsx
   const AI_ENABLED = false; // Quick kill switch
   
   {AI_ENABLED && <AIAssistantWidget />}
   ```

2. **Rollback edge function:**
   ```bash
   supabase functions deploy ai-chat --version-id <previous-version>
   ```

3. **Check logs:**
   ```bash
   supabase functions logs ai-chat --follow
   ```

---

## ✅ Final Checklist

Before marking complete:

- [ ] All 8 todos completed
- [ ] Edge function deployed
- [ ] Tested in all 4 roles
- [ ] Tested in both languages
- [ ] All 30 prompts working
- [ ] Documentation complete
- [ ] Cost monitoring active
- [ ] Team briefed on usage

---

**Deployment Status:** ⏳ Ready for testing  
**Production Ready:** After checklist completion  
**Estimated Setup Time:** 10 minutes  
**Estimated Testing Time:** 30 minutes

---

**Last Updated:** October 20, 2025  
**Maintained By:** Development Team

