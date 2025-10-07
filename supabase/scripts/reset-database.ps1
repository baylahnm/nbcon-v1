# Supabase Database Reset and Rebuild Script (PowerShell)
# This script will reset your Supabase database and apply all new migrations

Write-Host "🚀 Starting Supabase Database Reset and Rebuild..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Visit: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a Supabase project directory
if (-not (Test-Path "supabase/config.toml")) {
    Write-Host "❌ Not in a Supabase project directory. Please run this from your project root." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Current project status:" -ForegroundColor Cyan
supabase status

# Ask for confirmation
Write-Host ""
Write-Host "⚠️  WARNING: This will DELETE ALL DATA in your Supabase database!" -ForegroundColor Yellow
Write-Host "   Make sure you have backed up any important data." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Operation cancelled." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Step 1: Stopping local Supabase services..." -ForegroundColor Cyan
supabase stop

Write-Host ""
Write-Host "🗑️  Step 2: Resetting database..." -ForegroundColor Cyan
supabase db reset

Write-Host ""
Write-Host "📦 Step 3: Applying new migrations..." -ForegroundColor Cyan
supabase db push

Write-Host ""
Write-Host "🔧 Step 4: Starting local services..." -ForegroundColor Cyan
supabase start

Write-Host ""
Write-Host "📊 Step 5: Checking database status..." -ForegroundColor Cyan
supabase status

Write-Host ""
Write-Host "✅ Database reset and rebuild completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Check the Supabase dashboard at: http://localhost:54323"
Write-Host "   2. Verify all tables were created correctly"
Write-Host "   3. Test your application with the new structure"
Write-Host ""
Write-Host "📚 Migration files applied:" -ForegroundColor Cyan
Write-Host "   • 000-reset-database.sql (Clean slate)"
Write-Host "   • 001-base-schema.sql (Core user/auth)"
Write-Host "   • 002-engineer-tables.sql (Engineer features)"
Write-Host "   • 003-client-tables.sql (Client features)"
Write-Host "   • 004-enterprise-tables.sql (Enterprise features)"
Write-Host "   • 005-admin-tables.sql (Admin features)"
Write-Host "   • 006-shared-messaging.sql (Messaging system)"
Write-Host "   • 007-shared-billing.sql (Billing/subscriptions)"
Write-Host "   • 008-shared-dashboard.sql (Dashboard layouts)"
Write-Host "   • 009-shared-ai.sql (AI features)"
Write-Host "   • 010-data-migration.sql (Sample data)"
Write-Host ""

# Get database URL and anon key
$status = supabase status --output env
$dbUrl = ($status | Where-Object { $_ -match "SUPABASE_DB_URL" }) -split "=" | Select-Object -Last 1
$anonKey = ($status | Where-Object { $_ -match "SUPABASE_ANON_KEY" }) -split "=" | Select-Object -Last 1

Write-Host "🔗 Database URL: $dbUrl" -ForegroundColor Magenta
Write-Host "🔑 Anon Key: $anonKey" -ForegroundColor Magenta
