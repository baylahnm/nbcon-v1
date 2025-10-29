/**
 * Portal Audit Diagnostic Script
 * 
 * Validates portal structure after cleanup and unified dashboard migration
 * Checks for removed components, feature gates, and subscription routes
 * 
 * Usage: npx tsx scripts/diagnostics/runPortalAudit.ts --verify-all --output diagnostics/report.json
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// ============================================================================
// TYPES
// ============================================================================

interface AuditResult {
  timestamp: string;
  status: 'pass' | 'fail' | 'warning';
  checks: {
    dashboardPlaceholders: CheckResult;
    featureGates: CheckResult;
    subscriptionRoutes: CheckResult;
    removedComponents: CheckResult;
    portalRegistry: CheckResult;
  };
  issues: AuditIssue[];
  recommendations: string[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

interface CheckResult {
  pass: boolean;
  count: number;
  details: any;
  issues?: string[];
}

interface AuditIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  file?: string;
  line?: number;
}

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

/**
 * Check if dashboard files use UnifiedDashboard component
 */
async function checkDashboardPlaceholders(): Promise<CheckResult> {
  const dashboardFiles = [
    'src/pages/4-free/1-DashboardPage.tsx',
    'src/pages/5-engineer/1-DashboardPage.tsx',
    'src/pages/6-enterprise/1-DashboardPage.tsx'
  ];

  const details: any[] = [];
  let passCount = 0;
  const issues: string[] = [];

  for (const filePath of dashboardFiles) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      issues.push(`Missing dashboard file: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    const usesUnifiedDashboard = content.includes('UnifiedDashboard');
    const hasConfig = content.includes('DashboardConfig') || content.includes('config');
    const hasGradientIcon = content.includes('bg-primary-gradient') || content.includes('pageIcon');
    
    const result = {
      path: filePath,
      usesUnifiedDashboard,
      hasConfig,
      hasGradientIcon,
      lineCount: content.split('\n').length
    };

    details.push(result);

    if (usesUnifiedDashboard && hasConfig) {
      passCount++;
    } else {
      issues.push(`${filePath} does not fully implement UnifiedDashboard`);
    }
  }

  return {
    pass: passCount === dashboardFiles.length,
    count: passCount,
    details,
    issues
  };
}

/**
 * Check for FeatureGate component usage
 */
async function checkFeatureGates(): Promise<CheckResult> {
  const featureGatePattern = 'src/**/*FeatureGate*.tsx';
  const files = await glob(featureGatePattern, { cwd: process.cwd() });

  const usagePattern = 'src/**/*.tsx';
  const allFiles = await glob(usagePattern, { cwd: process.cwd() });

  let usageCount = 0;
  const usageDetails: string[] = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
    if (content.includes('FeatureGate') || content.includes('requiredTier')) {
      usageCount++;
      usageDetails.push(file);
    }
  }

  return {
    pass: files.length > 0,
    count: files.length,
    details: {
      featureGateComponents: files,
      usageLocations: usageDetails,
      totalUsages: usageCount
    }
  };
}

/**
 * Check subscription route configuration
 */
async function checkSubscriptionRoutes(): Promise<CheckResult> {
  const routeFiles = [
    'src/routes/RoleRouter.tsx',
    'src/pages/2-auth/others/features/auth/components/NewRoleRouter.tsx'
  ];

  const details: any[] = [];
  let configuredCount = 0;
  const issues: string[] = [];

  for (const filePath of routeFiles) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      issues.push(`Missing route file: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    const hasSubscriptionRoute = content.includes('subscription');
    const hasSubscriptionManagement = content.includes('SubscriptionManagement');
    const hasTemporaryRedirect = content.includes('TEMPORARY') && content.includes('subscription');

    details.push({
      path: filePath,
      hasSubscriptionRoute,
      hasSubscriptionManagement,
      hasTemporaryRedirect
    });

    if (hasSubscriptionRoute) {
      configuredCount++;
    }
  }

  return {
    pass: configuredCount > 0,
    count: configuredCount,
    details,
    issues
  };
}

/**
 * Check for references to removed components
 */
async function checkRemovedComponents(): Promise<CheckResult> {
  const removedPatterns = [
    '14-SubscriptionPage',
    '15-SubscriptionPage',
    '16-SubscriptionPage',
    'DashboardContent.tsx',
    'inlineDashboardEdit'
  ];

  const searchPattern = 'src/**/*.{ts,tsx}';
  const files = await glob(searchPattern, { cwd: process.cwd() });

  const danglingReferences: any[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
    
    for (const pattern of removedPatterns) {
      if (content.includes(pattern) && !content.includes('// REMOVED')) {
        danglingReferences.push({
          file,
          pattern,
          context: content.split('\n').find(line => line.includes(pattern))
        });
      }
    }
  }

  return {
    pass: danglingReferences.length === 0,
    count: danglingReferences.length,
    details: {
      danglingReferences,
      removedPatterns
    }
  };
}

/**
 * Check portal registry configuration
 */
async function checkPortalRegistry(): Promise<CheckResult> {
  const registryPath = path.join(process.cwd(), 'src/config/portalRegistry.ts');
  
  if (!fs.existsSync(registryPath)) {
    return {
      pass: false,
      count: 0,
      details: { error: 'Portal registry file not found' }
    };
  }

  const content = fs.readFileSync(registryPath, 'utf-8');
  
  const hasPageDefinitions = content.includes('PageDefinition');
  const hasPermissions = content.includes('permissions');
  const hasRequiredSubscription = content.includes('requiredSubscription');
  const hasTierMeetsRequirement = content.includes('tierMeetsRequirement');

  // Count pages
  const pageMatches = content.match(/id:\s*['"][\w-]+['"]/g);
  const pageCount = pageMatches ? pageMatches.length : 0;

  // Count gated pages
  const gatedMatches = content.match(/requiredSubscription:\s*['"][\w]+['"]/g);
  const gatedCount = gatedMatches ? gatedMatches.length : 0;

  return {
    pass: hasPageDefinitions && hasPermissions && hasTierMeetsRequirement,
    count: pageCount,
    details: {
      totalPages: pageCount,
      gatedPages: gatedCount,
      hasPageDefinitions,
      hasPermissions,
      hasRequiredSubscription,
      hasTierMeetsRequirement
    }
  };
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

async function runPortalAudit(options: {
  verifyDashboardPlaceholders?: boolean;
  verifyFeatureGates?: boolean;
  verifyAll?: boolean;
  output?: string;
}): Promise<AuditResult> {
  console.log('🔍 Running Portal Audit...\n');

  const checks = {
    dashboardPlaceholders: await checkDashboardPlaceholders(),
    featureGates: await checkFeatureGates(),
    subscriptionRoutes: await checkSubscriptionRoutes(),
    removedComponents: await checkRemovedComponents(),
    portalRegistry: await checkPortalRegistry()
  };

  // Collect all issues
  const issues: AuditIssue[] = [];

  Object.entries(checks).forEach(([key, check]) => {
    if (!check.pass && check.issues) {
      check.issues.forEach(issue => {
        issues.push({
          severity: 'error',
          category: key,
          message: issue
        });
      });
    }
  });

  // Generate recommendations
  const recommendations: string[] = [];

  if (!checks.dashboardPlaceholders.pass) {
    recommendations.push('Complete UnifiedDashboard migration for all portal dashboards');
  }

  if (checks.removedComponents.count > 0) {
    recommendations.push(`Remove ${checks.removedComponents.count} dangling references to deleted components`);
  }

  if (checks.featureGates.count === 0) {
    recommendations.push('Consider implementing FeatureGate components for premium features');
  }

  // Calculate summary
  const totalChecks = Object.keys(checks).length;
  const passed = Object.values(checks).filter(c => c.pass).length;
  const failed = totalChecks - passed;

  const result: AuditResult = {
    timestamp: new Date().toISOString(),
    status: failed === 0 ? 'pass' : (failed > 2 ? 'fail' : 'warning'),
    checks,
    issues,
    recommendations,
    summary: {
      totalChecks,
      passed,
      failed,
      warnings: issues.filter(i => i.severity === 'warning').length
    }
  };

  // Print results
  console.log('✅ Dashboard Placeholders:', checks.dashboardPlaceholders.pass ? 'PASS' : 'FAIL', `(${checks.dashboardPlaceholders.count}/3)`);
  console.log('✅ Feature Gates:', checks.featureGates.pass ? 'PASS' : 'FAIL', `(${checks.featureGates.count} components)`);
  console.log('✅ Subscription Routes:', checks.subscriptionRoutes.pass ? 'PASS' : 'FAIL', `(${checks.subscriptionRoutes.count} configured)`);
  console.log('✅ Removed Components:', checks.removedComponents.pass ? 'PASS' : 'FAIL', `(${checks.removedComponents.count} dangling refs)`);
  console.log('✅ Portal Registry:', checks.portalRegistry.pass ? 'PASS' : 'FAIL', `(${checks.portalRegistry.count} pages)`);

  console.log(`\n📊 Summary: ${passed}/${totalChecks} checks passed`);

  if (issues.length > 0) {
    console.log(`\n⚠️  Found ${issues.length} issues:`);
    issues.slice(0, 5).forEach(issue => {
      console.log(`   - [${issue.severity.toUpperCase()}] ${issue.message}`);
    });
  }

  if (recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    recommendations.forEach(rec => {
      console.log(`   - ${rec}`);
    });
  }

  // Save output if requested
  if (options.output) {
    const outputDir = path.dirname(options.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
    console.log(`\n📄 Report saved to: ${options.output}`);
  }

  return result;
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

const args = process.argv.slice(2);
const options = {
  verifyDashboardPlaceholders: args.includes('--verify-dashboard-placeholders'),
  verifyFeatureGates: args.includes('--verify-feature-gates'),
  verifyAll: args.includes('--verify-all'),
  output: args.find(arg => arg.startsWith('--output='))?.split('=')[1]
};

runPortalAudit(options)
  .then(result => {
    process.exit(result.status === 'pass' ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });

export { runPortalAudit, type AuditResult };

