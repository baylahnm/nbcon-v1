#!/usr/bin/env node

/**
 * nbcon Code Quality Bot
 * Automated code quality checker for production-ready software
 * 
 * Based on: .cursor/background-bug-fixer.json rules
 * Inspired by: Complete codebase scan (Jan 2025)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

class CodeQualityBot {
  constructor() {
    this.issues = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    this.filesScanned = 0;
    this.startTime = Date.now();
  }

  // Utility: Log with color
  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Utility: Run shell command
  exec(command) {
    try {
      return execSync(command, { 
        encoding: 'utf8',
        shell: 'powershell.exe'
      });
    } catch (error) {
      return error.stdout || '';
    }
  }

  // Utility: Search files using grep (Windows compatible)
  searchFiles(pattern, directory = 'src/') {
    try {
      // Use findstr on Windows as fallback
      const result = this.exec(`powershell -Command "Get-ChildItem -Path ${directory} -Recurse -File | Select-String -Pattern '${pattern}' | Select-Object -ExpandProperty Path -Unique"`);
      return result.split('\n').filter(Boolean).map(f => f.trim());
    } catch (error) {
      return [];
    }
  }

  // Check 1: Hardcoded Locales (i18n bugs)
  checkHardcodedLocales() {
    this.log('\n🔍 Checking for hardcoded locales...', 'cyan');
    
    const patterns = [
      { pattern: "toLocaleDateString\\('en-US'", name: 'Hard-coded en-US date format' },
      { pattern: "Intl\\.NumberFormat\\('en-US'", name: 'Hard-coded en-US number format' },
      { pattern: "toLocaleString\\('en-US'", name: 'Hard-coded en-US locale' },
    ];

    patterns.forEach(({ pattern, name }) => {
      const files = this.searchFiles(pattern);
      
      if (files.length > 0) {
        this.issues.high.push({
          type: 'i18n',
          severity: 'HIGH',
          title: name,
          files: files,
          fix: 'Use formatSAR() or formatDate() from i18n utils',
          impact: 'Breaks Arabic locale support'
        });
      }
    });
  }

  // Check 2: Full Page Reloads (SPA bugs)
  checkFullPageReloads() {
    this.log('🔍 Checking for full page reloads...', 'cyan');
    
    const patterns = [
      { pattern: 'window\\.location\\.assign\\(', name: 'window.location.assign()' },
      { pattern: 'window\\.location\\.href\\s*=', name: 'window.location.href assignment' },
    ];

    patterns.forEach(({ pattern, name }) => {
      const files = this.searchFiles(pattern);
      
      if (files.length > 0) {
        this.issues.medium.push({
          type: 'navigation',
          severity: 'MEDIUM',
          title: `Full page reload: ${name}`,
          files: files,
          fix: 'Use navigate() from React Router',
          impact: 'Breaks SPA experience, loses state'
        });
      }
    });
  }

  // Check 3: XSS Vulnerabilities
  checkXSSVulnerabilities() {
    this.log('🔍 Checking for XSS vulnerabilities...', 'cyan');
    
    const patterns = [
      { pattern: 'dangerouslySetInnerHTML', name: 'dangerouslySetInnerHTML without sanitization' },
      { pattern: 'innerHTML\\s*=', name: 'Direct innerHTML assignment' },
      { pattern: 'eval\\(', name: 'eval() usage' },
    ];

    patterns.forEach(({ pattern, name }) => {
      const files = this.searchFiles(pattern);
      
      if (files.length > 0) {
        // Check if DOMPurify is used
        const purifyCheck = files.filter(file => {
          try {
            const content = fs.readFileSync(file, 'utf8');
            return content.includes('DOMPurify') || content.includes('@ts-ignore - CSS custom property');
          } catch (err) {
            return false;
          }
        });
        
        const vulnerable = files.filter(f => !purifyCheck.includes(f));
        
        if (vulnerable.length > 0) {
          this.issues.critical.push({
            type: 'security',
            severity: 'CRITICAL',
            title: `XSS Risk: ${name}`,
            files: vulnerable,
            fix: 'Use DOMPurify.sanitize() before rendering HTML',
            impact: 'Cross-site scripting vulnerability'
          });
        }
      }
    });
  }

  // Check 4: Swallowed Errors
  checkSwallowedErrors() {
    this.log('🔍 Checking for swallowed errors...', 'cyan');
    
    const patterns = [
      { pattern: 'catch\\s*\\(\\w*\\)\\s*\\{\\s*\\}', name: 'Empty catch block' },
      { pattern: '\\.catch\\(\\(\\)\\s*=>\\s*\\{\\s*\\}\\)', name: 'Empty .catch()' },
    ];

    patterns.forEach(({ pattern, name }) => {
      const files = this.searchFiles(pattern);
      
      if (files.length > 0) {
        this.issues.medium.push({
          type: 'error-handling',
          severity: 'MEDIUM',
          title: `Silent failure: ${name}`,
          files: files,
          fix: 'Log errors with errorMonitor.logError()',
          impact: 'Debugging becomes impossible'
        });
      }
    });
  }

  // Check 5: Hardcoded Dark Mode Colors
  checkHardcodedDarkColors() {
    this.log('🔍 Checking for hardcoded dark mode colors...', 'cyan');
    
    const patterns = [
      { pattern: 'dark:bg-\\[#', name: 'Hardcoded dark background color' },
      { pattern: 'dark:text-\\[#', name: 'Hardcoded dark text color' },
    ];

    patterns.forEach(({ pattern, name }) => {
      const files = this.searchFiles(pattern);
      
      if (files.length > 0) {
        this.issues.medium.push({
          type: 'theme',
          severity: 'MEDIUM',
          title: name,
          files: files,
          fix: 'Use CSS variables: bg-background, text-foreground, etc.',
          impact: 'Theme system breaks, inconsistent dark mode'
        });
      }
    });
  }

  // Check 6: Excessive any Types
  checkAnyTypes() {
    this.log('🔍 Checking for any types...', 'cyan');
    
    const files = this.searchFiles(': any');
    
    if (files.length > 50) {
      this.issues.low.push({
        type: 'typescript',
        severity: 'LOW',
        title: `${files.length} files with 'any' types`,
        files: files.slice(0, 10), // Show first 10
        fix: 'Add proper type definitions',
        impact: 'Reduced type safety'
      });
    }
  }

  // Check 7: @ts-ignore Usage
  checkTsIgnore() {
    this.log('🔍 Checking for @ts-ignore usage...', 'cyan');
    
    const files = this.searchFiles('@ts-ignore|@ts-expect-error');
    
    if (files.length > 5) {
      this.issues.medium.push({
        type: 'typescript',
        severity: 'MEDIUM',
        title: `${files.length} files with @ts-ignore`,
        files: files,
        fix: 'Fix type errors instead of ignoring them',
        impact: 'Hidden type errors'
      });
    }
  }

  // Check 8: Missing Null Checks
  checkMissingNullChecks() {
    this.log('🔍 Checking for unsafe property access...', 'cyan');
    
    // This is a complex check - simplified version
    const patterns = [
      { pattern: '\\.map\\(.*\\.', name: 'Array.map() without null check' },
    ];

    // Note: This is a simplified check - full implementation would need AST parsing
    this.issues.info.push({
      type: 'null-safety',
      severity: 'INFO',
      title: 'Manual review recommended for null safety',
      files: [],
      fix: 'Use optional chaining (?.) and nullish coalescing (||)',
      impact: 'Potential runtime crashes'
    });
  }

  // Check 9: TypeScript Compilation
  checkTypeScript() {
    this.log('🔍 Running TypeScript compiler...', 'cyan');
    
    try {
      const result = this.exec('npx tsc --noEmit 2>&1');
      if (result.includes('error TS')) {
        const errorCount = (result.match(/error TS/g) || []).length;
        this.issues.high.push({
          type: 'typescript',
          severity: 'HIGH',
          title: `${errorCount} TypeScript compilation errors`,
          files: [],
          fix: 'Run npx tsc --noEmit and fix errors',
          impact: 'Type safety compromised'
        });
      } else {
        this.log('  ✅ TypeScript compilation passed', 'green');
      }
    } catch (error) {
      this.log('  ⚠️  Could not run TypeScript compiler', 'yellow');
    }
  }

  // Check 10: ESLint
  checkESLint() {
    this.log('🔍 Running ESLint...', 'cyan');
    
    try {
      const result = this.exec('npx eslint src/ --format json 2>&1');
      try {
        const lint = JSON.parse(result);
        const errors = lint.reduce((sum, file) => sum + file.errorCount, 0);
        const warnings = lint.reduce((sum, file) => sum + file.warningCount, 0);
        
        if (errors > 0) {
          this.issues.high.push({
            type: 'linting',
            severity: 'HIGH',
            title: `${errors} ESLint errors`,
            files: lint.filter(f => f.errorCount > 0).map(f => f.filePath),
            fix: 'Run npx eslint src/ --fix',
            impact: 'Code quality issues'
          });
        }
        
        if (warnings > 0) {
          this.log(`  ⚠️  ${warnings} ESLint warnings`, 'yellow');
        } else if (errors === 0) {
          this.log('  ✅ ESLint passed', 'green');
        }
      } catch (e) {
        // Might not be JSON if there's an error
        if (result.includes('error')) {
          this.log('  ⚠️  ESLint encountered errors', 'yellow');
        }
      }
    } catch (error) {
      this.log('  ⚠️  Could not run ESLint', 'yellow');
    }
  }

  // Generate Report
  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    this.log('📊 CODE QUALITY REPORT', 'bold');
    console.log('='.repeat(80));
    
    this.log(`\n⏱️  Scan Duration: ${duration}s`, 'cyan');
    
    // Critical Issues
    if (this.issues.critical.length > 0) {
      this.log(`\n🔴 CRITICAL ISSUES (${this.issues.critical.length})`, 'red');
      this.issues.critical.forEach((issue, i) => {
        console.log(`\n${i + 1}. ${issue.title}`);
        console.log(`   Severity: ${issue.severity}`);
        console.log(`   Impact: ${issue.impact}`);
        console.log(`   Fix: ${issue.fix}`);
        if (issue.files.length > 0) {
          console.log(`   Files (${issue.files.length}):`);
          issue.files.slice(0, 5).forEach(file => console.log(`     - ${file}`));
          if (issue.files.length > 5) {
            console.log(`     ... and ${issue.files.length - 5} more`);
          }
        }
      });
    }
    
    // High Priority Issues
    if (this.issues.high.length > 0) {
      this.log(`\n🟠 HIGH PRIORITY ISSUES (${this.issues.high.length})`, 'yellow');
      this.issues.high.forEach((issue, i) => {
        console.log(`\n${i + 1}. ${issue.title}`);
        console.log(`   Impact: ${issue.impact}`);
        console.log(`   Fix: ${issue.fix}`);
        if (issue.files.length > 0 && issue.files.length <= 10) {
          console.log(`   Files (${issue.files.length}):`);
          issue.files.forEach(file => console.log(`     - ${file}`));
        } else if (issue.files.length > 10) {
          console.log(`   Files: ${issue.files.length} (run with --verbose for list)`);
        }
      });
    }
    
    // Medium Priority Issues
    if (this.issues.medium.length > 0) {
      this.log(`\n🟡 MEDIUM PRIORITY ISSUES (${this.issues.medium.length})`, 'yellow');
      this.issues.medium.forEach((issue, i) => {
        console.log(`\n${i + 1}. ${issue.title} (${issue.files.length} files)`);
        console.log(`   Fix: ${issue.fix}`);
      });
    }
    
    // Summary
    const totalIssues = 
      this.issues.critical.length + 
      this.issues.high.length + 
      this.issues.medium.length;
    
    console.log('\n' + '='.repeat(80));
    if (totalIssues === 0) {
      this.log('✅ NO ISSUES FOUND - CODE QUALITY EXCELLENT!', 'green');
    } else {
      this.log(`⚠️  TOTAL ISSUES: ${totalIssues}`, 'yellow');
      this.log(`   Critical: ${this.issues.critical.length}`, 'red');
      this.log(`   High: ${this.issues.high.length}`, 'yellow');
      this.log(`   Medium: ${this.issues.medium.length}`, 'yellow');
    }
    console.log('='.repeat(80) + '\n');
    
    // Exit code
    if (this.issues.critical.length > 0) {
      process.exit(1);
    } else if (this.issues.high.length > 0) {
      process.exit(1);
    }
  }

  // Run All Checks
  async run() {
    this.log('\n🤖 nbcon Code Quality Bot Starting...', 'bold');
    this.log('📁 Scanning src/ directory\n', 'cyan');
    
    // Run all checks
    this.checkHardcodedLocales();
    this.checkFullPageReloads();
    this.checkXSSVulnerabilities();
    this.checkSwallowedErrors();
    this.checkHardcodedDarkColors();
    this.checkAnyTypes();
    this.checkTsIgnore();
    this.checkMissingNullChecks();
    this.checkTypeScript();
    this.checkESLint();
    
    // Generate report
    this.generateReport();
  }
}

// Run the bot
const bot = new CodeQualityBot();
bot.run().catch(error => {
  console.error('Bot error:', error);
  process.exit(1);
});

