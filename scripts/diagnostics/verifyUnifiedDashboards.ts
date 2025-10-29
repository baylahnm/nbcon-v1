/**
 * Unified Dashboard Validator Script
 * 
 * Ensures all dashboard implementations follow the UnifiedDashboard template
 * Validates configuration structure, styling consistency, and routing
 * 
 * Usage: npx tsx scripts/diagnostics/verifyUnifiedDashboards.ts --report=diagnostics/dashboard_validation.json
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardValidation {
  path: string;
  usesUnifiedDashboard: boolean;
  hasConfigObject: boolean;
  hasRequiredFields: {
    role: boolean;
    pageTitle: boolean;
    pageIcon: boolean;
    stats: boolean;
    quickActions: boolean;
    mainContent: boolean;
    widgets: boolean;
  };
  stylingConsistent: boolean;
  routingValid: boolean;
  issues: string[];
  score: number; // 0-100
}

interface ValidationReport {
  timestamp: string;
  status: 'pass' | 'fail';
  dashboards: DashboardValidation[];
  summary: {
    total: number;
    migrated: number;
    placeholders: number;
    issues: number;
    averageScore: number;
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a single dashboard file
 */
function validateDashboard(filePath: string): DashboardValidation {
  const fullPath = path.join(process.cwd(), filePath);
  const issues: string[] = [];

  if (!fs.existsSync(fullPath)) {
    return {
      path: filePath,
      usesUnifiedDashboard: false,
      hasConfigObject: false,
      hasRequiredFields: {
        role: false,
        pageTitle: false,
        pageIcon: false,
        stats: false,
        quickActions: false,
        mainContent: false,
        widgets: false
      },
      stylingConsistent: false,
      routingValid: false,
      issues: ['File does not exist'],
      score: 0
    };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  // Check for UnifiedDashboard usage
  const usesUnifiedDashboard = content.includes('UnifiedDashboard');
  if (!usesUnifiedDashboard) {
    issues.push('Does not import or use UnifiedDashboard component');
  }

  // Check for config object
  const hasConfigObject = content.includes('Config') && content.includes('role:');
  if (!hasConfigObject) {
    issues.push('Missing dashboard configuration object');
  }

  // Check required fields
  const hasRequiredFields = {
    role: content.includes('role:') && content.includes('as const'),
    pageTitle: content.includes('pageTitle:'),
    pageIcon: content.includes('pageIcon:'),
    stats: content.includes('stats:'),
    quickActions: content.includes('quickActions:'),
    mainContent: content.includes('mainContent:'),
    widgets: content.includes('widgets:')
  };

  Object.entries(hasRequiredFields).forEach(([field, present]) => {
    if (!present) {
      issues.push(`Missing required field: ${field}`);
    }
  });

  // Check styling consistency
  const stylingChecks = {
    hasBauhausGradient: content.includes('bg-primary-gradient'),
    hasProperPadding: content.includes('p-4') || content.includes('p-6'),
    usesCardComponents: content.includes('Card') && content.includes('CardContent'),
    hasBadges: content.includes('Badge')
  };

  const stylingConsistent = Object.values(stylingChecks).filter(Boolean).length >= 3;
  if (!stylingConsistent) {
    issues.push('Styling may not follow Bauhaus design system');
  }

  // Check routing
  const hasNavigateHooks = content.includes('useNavigate');
  const hasNavigationHandlers = content.includes('onClick') && content.includes('navigate');
  const routingValid = hasNavigateHooks && hasNavigationHandlers;

  if (!routingValid) {
    issues.push('Navigation handlers may be missing');
  }

  // Calculate score
  const requiredFieldsScore = Object.values(hasRequiredFields).filter(Boolean).length / 7 * 40;
  const componentScore = (usesUnifiedDashboard ? 20 : 0) + (hasConfigObject ? 20 : 0);
  const stylingScore = stylingConsistent ? 10 : 0;
  const routingScore = routingValid ? 10 : 0;
  const score = Math.round(requiredFieldsScore + componentScore + stylingScore + routingScore);

  return {
    path: filePath,
    usesUnifiedDashboard,
    hasConfigObject,
    hasRequiredFields,
    stylingConsistent,
    routingValid,
    issues,
    score
  };
}

/**
 * Validate all dashboards
 */
async function validateAllDashboards(): Promise<ValidationReport> {
  console.log('🔍 Validating Unified Dashboards...\n');

  const dashboardPaths = [
    'src/pages/4-free/1-DashboardPage.tsx',
    'src/pages/5-engineer/1-DashboardPage.tsx',
    'src/pages/6-enterprise/1-DashboardPage.tsx'
  ];

  const dashboards = dashboardPaths.map(validateDashboard);

  const summary = {
    total: dashboards.length,
    migrated: dashboards.filter(d => d.usesUnifiedDashboard && d.hasConfigObject).length,
    placeholders: dashboards.filter(d => !d.usesUnifiedDashboard).length,
    issues: dashboards.reduce((sum, d) => sum + d.issues.length, 0),
    averageScore: Math.round(dashboards.reduce((sum, d) => sum + d.score, 0) / dashboards.length)
  };

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    status: summary.migrated === summary.total && summary.issues === 0 ? 'pass' : 'fail',
    dashboards,
    summary
  };

  // Print results
  console.log('📊 Dashboard Validation Results:\n');
  
  dashboards.forEach(dashboard => {
    const status = dashboard.score >= 80 ? '✅' : (dashboard.score >= 50 ? '⚠️' : '❌');
    console.log(`${status} ${dashboard.path}`);
    console.log(`   Score: ${dashboard.score}/100`);
    console.log(`   Uses UnifiedDashboard: ${dashboard.usesUnifiedDashboard ? '✅' : '❌'}`);
    console.log(`   Has Config: ${dashboard.hasConfigObject ? '✅' : '❌'}`);
    console.log(`   Styling: ${dashboard.stylingConsistent ? '✅' : '❌'}`);
    
    if (dashboard.issues.length > 0) {
      console.log(`   Issues: ${dashboard.issues.length}`);
      dashboard.issues.slice(0, 3).forEach(issue => {
        console.log(`      - ${issue}`);
      });
    }
    console.log('');
  });

  console.log(`\n📈 Summary:`);
  console.log(`   Total Dashboards: ${summary.total}`);
  console.log(`   Migrated: ${summary.migrated}`);
  console.log(`   Placeholders: ${summary.placeholders}`);
  console.log(`   Average Score: ${summary.averageScore}/100`);
  console.log(`   Status: ${report.status === 'pass' ? '✅ PASS' : '❌ FAIL'}`);

  return report;
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

const args = process.argv.slice(2);
const reportPath = args.find(arg => arg.startsWith('--report='))?.split('=')[1];

validateAllDashboards()
  .then(report => {
    if (reportPath) {
      const dir = path.dirname(reportPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Report saved to: ${reportPath}`);
    }

    process.exit(report.status === 'pass' ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });

export { validateAllDashboards, type ValidationReport };

