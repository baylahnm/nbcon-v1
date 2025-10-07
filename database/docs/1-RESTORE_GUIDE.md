# Database Restoration Guide for nbocn

## 🚨 Issue
Your Supabase database files were deleted and you need to restore your dashboard and database schema.

## 🛠️ Solution Options

### Option 1: Using Supabase CLI (Recommended)

1. **Start Docker Desktop**
   - Make sure Docker Desktop is running on your Windows machine
   - If not installed, download from: https://docs.docker.com/desktop/

2. **Run the restoration script**
   ```powershell
   cd D:\nbcon-v1
   .\restore-database.ps1
   ```

3. **If the script fails, try manual steps:**
   ```powershell
   # Login to Supabase
   npx supabase login
   
   # Link to your project
   npx supabase link --project-ref joloqygeooyntwxjpxwv
   
   # Apply migrations
   npx supabase db push
   ```

### Option 2: Manual Restoration via Supabase Dashboard

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/joloqygeooyntwxjpxwv
   - Navigate to "SQL Editor"

2. **Run migrations in order:**
   - Copy and paste each migration file content in this exact order:
     - `000-reset-database.sql` (only if you need to reset)
     - `001-base-schema.sql`
     - `001-core-tables.sql`
     - `002-conversations-messaging.sql`
     - `002-engineer-tables.sql`
     - `003-billing-subscriptions.sql`
     - `003-client-tables.sql`
     - `004-dashboard-layouts.sql`
     - `004-enterprise-tables.sql`
     - `005-admin-tables.sql`
     - `005-profile-extensions.sql`
     - `006-ai-service-modes.sql`
     - `006-shared-messaging.sql`
     - `007-ai-events-tracking.sql`
     - `007-shared-billing.sql`
     - `008-shared-dashboard.sql`
     - `009-shared-ai.sql`
     - `010-data-migration.sql`

3. **Execute each migration**
   - Click "Run" after pasting each migration
   - Wait for completion before moving to the next

### Option 3: Using the Combined SQL Script

1. **Go to Supabase SQL Editor**
2. **Copy and paste the content of `restore-database.sql`**
3. **Execute the script**

## 🔧 Environment Setup

After restoring the database, you'll need to set up your environment variables:

1. **Create a `.env` file** in your project root with:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://joloqygeooyntwxjpxwv.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # OpenAI Configuration (for AI functions)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Stripe Configuration (for billing)
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
   
   # Application Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://joloqygeooyntwxjpxwv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. **Get your API keys from Supabase Dashboard:**
   - Go to Settings > API
   - Copy the `anon` and `service_role` keys

## 🧪 Testing the Restoration

1. **Start your development server:**
   ```powershell
   npm run dev
   ```

2. **Test database connection:**
   - Check if you can access your dashboard
   - Verify that tables are created
   - Test user registration/login

## 🆘 Troubleshooting

### Docker Issues
- Make sure Docker Desktop is running
- Try running PowerShell as Administrator
- Restart Docker Desktop if needed

### Authentication Issues
- Make sure you're logged in: `npx supabase login`
- Check if you have access to the project
- Verify your project ID is correct

### Migration Errors
- Check the Supabase logs for specific error messages
- Make sure you're running migrations in the correct order
- Some migrations may need to be run individually if there are conflicts

## 📞 Need Help?

If you continue to have issues:
1. Check the Supabase dashboard for error logs
2. Verify your project settings and permissions
3. Make sure all required environment variables are set
4. Test with a simple query first before running complex migrations

## ✅ Success Indicators

You'll know the restoration is successful when:
- ✅ All tables are created in your Supabase dashboard
- ✅ You can start your development server without errors
- ✅ User registration/login works
- ✅ Dashboard loads properly
- ✅ AI functions are accessible
