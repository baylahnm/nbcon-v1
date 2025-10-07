# Supabase Database Restoration Script
# This script helps restore your database using existing migrations

Write-Host "🚀 Starting Supabase Database Restoration..." -ForegroundColor Green

# Check if Supabase CLI is available
try {
    $supabaseVersion = npx supabase --version 2>$null
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

# Check if user is logged in
Write-Host "🔐 Checking authentication..." -ForegroundColor Yellow
try {
    npx supabase projects list > $null 2>&1
    Write-Host "✅ Authenticated with Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Not authenticated. Please run: npx supabase login" -ForegroundColor Red
    exit 1
}

# Link to project
Write-Host "🔗 Linking to project joloqygeooyntwxjpxwv..." -ForegroundColor Yellow
try {
    npx supabase link --project-ref joloqygeooyntwxjpxwv
    Write-Host "✅ Successfully linked to project" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not link to project. You may need to check your project access." -ForegroundColor Yellow
}

# Check migration status
Write-Host "📊 Checking migration status..." -ForegroundColor Yellow
try {
    npx supabase migration list
} catch {
    Write-Host "⚠️  Could not check migration status" -ForegroundColor Yellow
}

# Apply migrations
Write-Host "🔄 Applying migrations..." -ForegroundColor Yellow
try {
    npx supabase db push
    Write-Host "✅ Migrations applied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply migrations" -ForegroundColor Red
    Write-Host "You may need to run migrations manually in the Supabase dashboard" -ForegroundColor Yellow
}

# Check database status
Write-Host "📈 Checking database status..." -ForegroundColor Yellow
try {
    npx supabase status
} catch {
    Write-Host "⚠️  Could not check database status" -ForegroundColor Yellow
}

Write-Host "🎉 Database restoration process completed!" -ForegroundColor Green
Write-Host "If you encounter issues, you can also restore manually through the Supabase dashboard:" -ForegroundColor Cyan
Write-Host "1. Go to https://supabase.com/dashboard/project/joloqygeooyntwxjpxwv" -ForegroundColor Cyan
Write-Host "2. Navigate to SQL Editor" -ForegroundColor Cyan
Write-Host "3. Run the migration files in order (000-010)" -ForegroundColor Cyan
