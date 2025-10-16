# 🤖 nbcon Code Quality Bot

Automated code quality checker for production-ready software.

## 🎯 What It Does

The Code Quality Bot automatically scans your codebase for common issues and anti-patterns:

### 13 Automated Checks:

1. **Hardcoded Locales** - Finds hard-coded `'en-US'` breaking i18n
2. **Full Page Reloads** - Detects `window.location` breaking SPA
3. **XSS Vulnerabilities** - Finds unsafe HTML rendering
4. **Swallowed Errors** - Detects empty catch blocks
5. **Hardcoded Dark Colors** - Finds `dark:bg-[#...]` breaking themes
6. **Excessive `any` Types** - Warns about type safety issues
7. **@ts-ignore Usage** - Detects type checking bypasses
8. **Missing Null Checks** - Suggests optional chaining
9. **TypeScript Compilation** - Runs `tsc --noEmit`
10. **ESLint** - Runs linter checks
11. **ThreadList Text Truncation** - Checks for proper 10-char truncation with ellipsis (v2.1)
12. **Form Component Theme** - Validates theme consistency (SelectTrigger, Switch, Textarea) (v2.1)
13. **Card Width Issues** - Checks for w-full in ThreadList contexts (v2.1)

## 🚀 Usage

### Local Development

```bash
# Run the bot
npm run quality-check

# Or directly
node scripts/code-quality-bot.cjs
```

### CI/CD Integration

The bot runs automatically:
- ✅ On every push to `main` or `develop`
- ✅ On every pull request
- ✅ Daily at 2 AM UTC (scheduled)

See: `.github/workflows/code-quality.yml`

### Pre-commit Hook (Recommended)

```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky init
echo "npm run quality-check" > .husky/pre-commit
```

## 📊 Sample Output

```
🤖 nbcon Code Quality Bot Starting...
📁 Scanning src/ directory

🔍 Checking for hardcoded locales...
🔍 Checking for full page reloads...
🔍 Checking for XSS vulnerabilities...
🔍 Checking for swallowed errors...
🔍 Checking for hardcoded dark mode colors...
🔍 Checking for any types...
🔍 Checking for @ts-ignore usage...
🔍 Checking for unsafe property access...
🔍 Running TypeScript compiler...
  ✅ TypeScript compilation passed
🔍 Running ESLint...
  ✅ ESLint passed

================================================================================
📊 CODE QUALITY REPORT
================================================================================

⏱️  Scan Duration: 12.45s

================================================================================
✅ NO ISSUES FOUND - CODE QUALITY EXCELLENT!
================================================================================
```

## 🔴 Priority Levels

| Level | Severity | Exit Code | Examples |
|-------|----------|-----------|----------|
| 🔴 **CRITICAL** | Blocks deploy | 1 | XSS vulnerabilities, SQL injection |
| 🟠 **HIGH** | Must fix | 1 | Type errors, broken i18n |
| 🟡 **MEDIUM** | Should fix | 0 | Code quality, @ts-ignore |
| 🟢 **LOW** | Nice to fix | 0 | Style issues, excessive any |
| ℹ️ **INFO** | FYI | 0 | Recommendations |

## 🛠️ Configuration

### Add Custom Checks

Edit `scripts/code-quality-bot.cjs`:

```javascript
class CodeQualityBot {
  // Add your custom check
  checkMyCustomRule() {
    this.log('🔍 Checking my custom rule...', 'cyan');
    
    const result = this.exec(`npx rg "pattern" src/`);
    const files = result.split('\n').filter(Boolean);
    
    if (files.length > 0) {
      this.issues.high.push({
        type: 'custom',
        severity: 'HIGH',
        title: 'My custom rule violation',
        files: files,
        fix: 'How to fix it',
        impact: 'What breaks if not fixed'
      });
    }
  }

  async run() {
    // ... existing checks
    this.checkMyCustomRule(); // Add here
    this.generateReport();
  }
}
```

### Adjust Severity Thresholds

```javascript
// Change the threshold for any types warning
if (files.length > 50) { // Change this number
  this.issues.low.push({ /* ... */ });
}
```

### Ignore Specific Files

Add patterns to `.gitignore` or modify the bot to exclude paths:

```javascript
const result = this.exec(`npx rg "${pattern}" src/ --glob "!**/test/**" 2>/dev/null`);
```

## 📚 Based On

This bot implements checks from:
- `.cursor/background-bug-fixer.json` - Bug fixing workflow
- Complete codebase scan (January 2025)
- Production guide bug radar queries

## 🎯 Integration Points

### GitHub Actions

```yaml
- name: Run Code Quality Bot
  run: npm run quality-check
```

### Pre-commit

```bash
#!/bin/sh
npm run quality-check
```

### Pre-push

```bash
#!/bin/sh
npm run quality-check:ci
```

### VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "label": "Code Quality Check",
  "type": "shell",
  "command": "npm run quality-check",
  "problemMatcher": []
}
```

## 🔍 What It Doesn't Check (Yet)

Manual review still needed for:
- Complex business logic correctness
- Security vulnerabilities beyond basic XSS
- Performance bottlenecks
- Accessibility issues
- UX/design consistency

## 📈 Success Metrics

After implementing the bot:
- ✅ Zero hardcoded dark mode colors
- ✅ All critical systems type-safe
- ✅ No XSS vulnerabilities
- ✅ 95%+ TypeScript compilation success
- ✅ Consistent code quality across team

## 🆘 Troubleshooting

### "npx: command not found"

Install Node.js 18+ and ensure it's in your PATH.

### "ripgrep not found"

The bot uses `npx rg` which auto-installs ripgrep. If issues persist:

```bash
npm install -g @vscode/ripgrep
```

### Bot runs too slow

Limit the scope:

```javascript
// Only check specific directories
const result = this.exec(`npx rg "${pattern}" src/pages/critical/ 2>/dev/null`);
```

### False positives

Update the pattern or add exceptions:

```javascript
// Filter out acceptable cases
const vulnerable = files.filter(file => {
  const content = fs.readFileSync(file, 'utf8');
  return !content.includes('DOMPurify'); // Skip if sanitized
});
```

## 🎉 Quick Start

```bash
# 1. Ensure you have the bot script
ls scripts/code-quality-bot.cjs

# 2. Run it
npm run quality-check

# 3. Fix any issues reported

# 4. Add to CI/CD (already configured in .github/workflows/)

# 5. Enjoy automated code quality! 🚀
```

---

**Made with ❤️ for the nbcon team**  
**Version:** 2.1.0  
**Last Updated:** December 19, 2024

## 🆕 What's New in v2.1

- ✅ **ThreadList Text Truncation Check** - Ensures conversation names don't break layouts
- ✅ **Form Component Theme Validation** - Verifies SelectTrigger, Switch, Textarea use proper theme colors
- ✅ **Card Width Issue Detection** - Catches missing w-full classes in ThreadList contexts
- ✅ **Enhanced CI/CD** - TypeScript and ESLint checks integrated into GitHub Actions
- ✅ **PR Comments** - Automatic quality feedback on pull requests

