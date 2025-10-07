-- Verify All Tables in nbocn Database
-- This script checks if all required tables are created and properly structured

-- Check if all core tables exist
SELECT 
    'Core Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') 
        THEN '✅ profiles table exists'
        ELSE '❌ profiles table missing'
    END as status
UNION ALL
SELECT 
    'Core Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'account_numbers' AND table_schema = 'public') 
        THEN '✅ account_numbers table exists'
        ELSE '❌ account_numbers table missing'
    END
UNION ALL
SELECT 
    'Core Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies' AND table_schema = 'public') 
        THEN '✅ companies table exists'
        ELSE '❌ companies table missing'
    END
UNION ALL
SELECT 
    'Core Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs' AND table_schema = 'public') 
        THEN '✅ jobs table exists'
        ELSE '❌ jobs table missing'
    END;

-- Check Engineer Tables
SELECT 
    'Engineer Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_profiles' AND table_schema = 'public') 
        THEN '✅ engineer_profiles table exists'
        ELSE '❌ engineer_profiles table missing'
    END as status
UNION ALL
SELECT 
    'Engineer Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_skills' AND table_schema = 'public') 
        THEN '✅ engineer_skills table exists'
        ELSE '❌ engineer_skills table missing'
    END
UNION ALL
SELECT 
    'Engineer Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_portfolio' AND table_schema = 'public') 
        THEN '✅ engineer_portfolio table exists'
        ELSE '❌ engineer_portfolio table missing'
    END
UNION ALL
SELECT 
    'Engineer Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_certifications' AND table_schema = 'public') 
        THEN '✅ engineer_certifications table exists'
        ELSE '❌ engineer_certifications table missing'
    END
UNION ALL
SELECT 
    'Engineer Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_ratings' AND table_schema = 'public') 
        THEN '✅ engineer_ratings table exists'
        ELSE '❌ engineer_ratings table missing'
    END
UNION ALL
SELECT 
    'Engineer Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'engineer_availability' AND table_schema = 'public') 
        THEN '✅ engineer_availability table exists'
        ELSE '❌ engineer_availability table missing'
    END;

-- Check Client Tables
SELECT 
    'Client Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_profiles' AND table_schema = 'public') 
        THEN '✅ client_profiles table exists'
        ELSE '❌ client_profiles table missing'
    END as status
UNION ALL
SELECT 
    'Client Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_projects' AND table_schema = 'public') 
        THEN '✅ client_projects table exists'
        ELSE '❌ client_projects table missing'
    END
UNION ALL
SELECT 
    'Client Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_postings' AND table_schema = 'public') 
        THEN '✅ job_postings table exists'
        ELSE '❌ job_postings table missing'
    END
UNION ALL
SELECT 
    'Client Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_reviews' AND table_schema = 'public') 
        THEN '✅ client_reviews table exists'
        ELSE '❌ client_reviews table missing'
    END
UNION ALL
SELECT 
    'Client Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_preferences' AND table_schema = 'public') 
        THEN '✅ client_preferences table exists'
        ELSE '❌ client_preferences table missing'
    END
UNION ALL
SELECT 
    'Client Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_companies' AND table_schema = 'public') 
        THEN '✅ client_companies table exists'
        ELSE '❌ client_companies table missing'
    END;

-- Check Messaging Tables
SELECT 
    'Messaging Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations' AND table_schema = 'public') 
        THEN '✅ conversations table exists'
        ELSE '❌ conversations table missing'
    END as status
UNION ALL
SELECT 
    'Messaging Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') 
        THEN '✅ messages table exists'
        ELSE '❌ messages table missing'
    END
UNION ALL
SELECT 
    'Messaging Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants' AND table_schema = 'public') 
        THEN '✅ conversation_participants table exists'
        ELSE '❌ conversation_participants table missing'
    END
UNION ALL
SELECT 
    'Messaging Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'message_reactions' AND table_schema = 'public') 
        THEN '✅ message_reactions table exists'
        ELSE '❌ message_reactions table missing'
    END
UNION ALL
SELECT 
    'Messaging Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'message_attachments' AND table_schema = 'public') 
        THEN '✅ message_attachments table exists'
        ELSE '❌ message_attachments table missing'
    END;

-- Check Billing Tables
SELECT 
    'Billing Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans' AND table_schema = 'public') 
        THEN '✅ subscription_plans table exists'
        ELSE '❌ subscription_plans table missing'
    END as status
UNION ALL
SELECT 
    'Billing Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions' AND table_schema = 'public') 
        THEN '✅ subscriptions table exists'
        ELSE '❌ subscriptions table missing'
    END
UNION ALL
SELECT 
    'Billing Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments' AND table_schema = 'public') 
        THEN '✅ payments table exists'
        ELSE '❌ payments table missing'
    END
UNION ALL
SELECT 
    'Billing Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices' AND table_schema = 'public') 
        THEN '✅ invoices table exists'
        ELSE '❌ invoices table missing'
    END
UNION ALL
SELECT 
    'Billing Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_methods' AND table_schema = 'public') 
        THEN '✅ payment_methods table exists'
        ELSE '❌ payment_methods table missing'
    END
UNION ALL
SELECT 
    'Billing Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_tracking' AND table_schema = 'public') 
        THEN '✅ usage_tracking table exists'
        ELSE '❌ usage_tracking table missing'
    END;

-- Check Dashboard Tables
SELECT 
    'Dashboard Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_layouts' AND table_schema = 'public') 
        THEN '✅ dashboard_layouts table exists'
        ELSE '❌ dashboard_layouts table missing'
    END as status
UNION ALL
SELECT 
    'Dashboard Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_widgets' AND table_schema = 'public') 
        THEN '✅ dashboard_widgets table exists'
        ELSE '❌ dashboard_widgets table missing'
    END
UNION ALL
SELECT 
    'Dashboard Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_widget_preferences' AND table_schema = 'public') 
        THEN '✅ user_widget_preferences table exists'
        ELSE '❌ user_widget_preferences table missing'
    END
UNION ALL
SELECT 
    'Dashboard Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_templates' AND table_schema = 'public') 
        THEN '✅ dashboard_templates table exists'
        ELSE '❌ dashboard_templates table missing'
    END
UNION ALL
SELECT 
    'Dashboard Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dashboard_analytics' AND table_schema = 'public') 
        THEN '✅ dashboard_analytics table exists'
        ELSE '❌ dashboard_analytics table missing'
    END;

-- Check AI Tables
SELECT 
    'AI Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_service_modes' AND table_schema = 'public') 
        THEN '✅ ai_service_modes table exists'
        ELSE '❌ ai_service_modes table missing'
    END as status
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_events' AND table_schema = 'public') 
        THEN '✅ ai_events table exists'
        ELSE '❌ ai_events table missing'
    END
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_conversations' AND table_schema = 'public') 
        THEN '✅ ai_conversations table exists'
        ELSE '❌ ai_conversations table missing'
    END
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_messages' AND table_schema = 'public') 
        THEN '✅ ai_messages table exists'
        ELSE '❌ ai_messages table missing'
    END
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_tools' AND table_schema = 'public') 
        THEN '✅ ai_tools table exists'
        ELSE '❌ ai_tools table missing'
    END
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_tool_usage' AND table_schema = 'public') 
        THEN '✅ ai_tool_usage table exists'
        ELSE '❌ ai_tool_usage table missing'
    END
UNION ALL
SELECT 
    'AI Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_usage_analytics' AND table_schema = 'public') 
        THEN '✅ ai_usage_analytics table exists'
        ELSE '❌ ai_usage_analytics table missing'
    END;

-- Check Enterprise Tables
SELECT 
    'Enterprise Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_companies' AND table_schema = 'public') 
        THEN '✅ enterprise_companies table exists'
        ELSE '❌ enterprise_companies table missing'
    END as status
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_teams' AND table_schema = 'public') 
        THEN '✅ enterprise_teams table exists'
        ELSE '❌ enterprise_teams table missing'
    END
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_team_members' AND table_schema = 'public') 
        THEN '✅ enterprise_team_members table exists'
        ELSE '❌ enterprise_team_members table missing'
    END
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_projects' AND table_schema = 'public') 
        THEN '✅ enterprise_projects table exists'
        ELSE '❌ enterprise_projects table missing'
    END
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_procurement' AND table_schema = 'public') 
        THEN '✅ enterprise_procurement table exists'
        ELSE '❌ enterprise_procurement table missing'
    END
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_vendors' AND table_schema = 'public') 
        THEN '✅ enterprise_vendors table exists'
        ELSE '❌ enterprise_vendors table missing'
    END
UNION ALL
SELECT 
    'Enterprise Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enterprise_analytics' AND table_schema = 'public') 
        THEN '✅ enterprise_analytics table exists'
        ELSE '❌ enterprise_analytics table missing'
    END;

-- Check Admin Tables
SELECT 
    'Admin Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_audit_logs' AND table_schema = 'public') 
        THEN '✅ admin_audit_logs table exists'
        ELSE '❌ admin_audit_logs table missing'
    END as status
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_system_settings' AND table_schema = 'public') 
        THEN '✅ admin_system_settings table exists'
        ELSE '❌ admin_system_settings table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_user_management' AND table_schema = 'public') 
        THEN '✅ admin_user_management table exists'
        ELSE '❌ admin_user_management table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_platform_analytics' AND table_schema = 'public') 
        THEN '✅ admin_platform_analytics table exists'
        ELSE '❌ admin_platform_analytics table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_support_tickets' AND table_schema = 'public') 
        THEN '✅ admin_support_tickets table exists'
        ELSE '❌ admin_support_tickets table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_support_messages' AND table_schema = 'public') 
        THEN '✅ admin_support_messages table exists'
        ELSE '❌ admin_support_messages table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_feature_flags' AND table_schema = 'public') 
        THEN '✅ admin_feature_flags table exists'
        ELSE '❌ admin_feature_flags table missing'
    END
UNION ALL
SELECT 
    'Admin Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_notifications' AND table_schema = 'public') 
        THEN '✅ admin_notifications table exists'
        ELSE '❌ admin_notifications table missing'
    END;

-- Check Other Important Tables
SELECT 
    'Other Tables Check' as category,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verifications' AND table_schema = 'public') 
        THEN '✅ verifications table exists'
        ELSE '❌ verifications table missing'
    END as status
UNION ALL
SELECT 
    'Other Tables Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_applications' AND table_schema = 'public') 
        THEN '✅ job_applications table exists'
        ELSE '❌ job_applications table missing'
    END;

-- Summary count
SELECT 
    'SUMMARY' as category,
    'Total tables found: ' || COUNT(*) as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
