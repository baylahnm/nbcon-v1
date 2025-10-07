#!/bin/bash

# Supabase Database Reset and Rebuild Script
# This script will reset your Supabase database and apply all new migrations

echo "🚀 Starting Supabase Database Reset and Rebuild..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first."
    echo "   Visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in a Supabase project directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory. Please run this from your project root."
    exit 1
fi

echo "📋 Current project status:"
supabase status

# Ask for confirmation
echo ""
echo "⚠️  WARNING: This will DELETE ALL DATA in your Supabase database!"
echo "   Make sure you have backed up any important data."
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operation cancelled."
    exit 1
fi

echo ""
echo "🔄 Step 1: Stopping local Supabase services..."
supabase stop

echo ""
echo "🗑️  Step 2: Resetting database..."
supabase db reset

echo ""
echo "📦 Step 3: Applying new migrations..."
supabase db push

echo ""
echo "🔧 Step 4: Starting local services..."
supabase start

echo ""
echo "📊 Step 5: Checking database status..."
supabase status

echo ""
echo "✅ Database reset and rebuild completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "   1. Check the Supabase dashboard at: http://localhost:54323"
echo "   2. Verify all tables were created correctly"
echo "   3. Test your application with the new structure"
echo ""
echo "📚 Migration files applied:"
echo "   • 000-reset-database.sql (Clean slate)"
echo "   • 001-base-schema.sql (Core user/auth)"
echo "   • 002-engineer-tables.sql (Engineer features)"
echo "   • 003-client-tables.sql (Client features)"
echo "   • 004-enterprise-tables.sql (Enterprise features)"
echo "   • 005-admin-tables.sql (Admin features)"
echo "   • 006-shared-messaging.sql (Messaging system)"
echo "   • 007-shared-billing.sql (Billing/subscriptions)"
echo "   • 008-shared-dashboard.sql (Dashboard layouts)"
echo "   • 009-shared-ai.sql (AI features)"
echo "   • 010-data-migration.sql (Sample data)"
echo ""
echo "🔗 Database URL: $(supabase status --output env | grep SUPABASE_DB_URL | cut -d'=' -f2)"
echo "🔑 Anon Key: $(supabase status --output env | grep SUPABASE_ANON_KEY | cut -d'=' -f2)"
