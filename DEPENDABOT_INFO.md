# Dependabot Configuration

**File:** `.github/dependabot.yml`
**Status:** ✅ Configured
**Purpose:** Automatically check for dependency updates and create pull requests

## What is Dependabot?

Dependabot is GitHub's built-in tool that:
- 🔍 **Scans** your dependencies regularly
- 🔔 **Alerts** you when updates are available
- 🤖 **Creates PRs** automatically with version bumps
- 🛡️ **Security** alerts for vulnerable packages

**No cost, no setup required** - GitHub runs it automatically!

## Configuration for DIGIPIN-Py

### 1. Python Dependencies (pip)

**What it checks:**
- `pyproject.toml` dependencies
- Optional dependencies: `[pandas]`, `[django]`, `[fastapi]`, `[geo]`
- Dev dependencies: `[dev]`, `[test]`

**Schedule:**
- ✅ **Every Monday at 9:00 AM IST**
- ✅ **Max 5 PRs at once** (to avoid spam)
- ✅ **Auto-assigns to:** DEADSERPENT
- ✅ **Labels:** `dependencies`, `python`

**Example PR Title:**
```
chore(deps): bump pytest from 7.0.0 to 7.4.3
```

### 2. GitHub Actions

**What it checks:**
- `.github/workflows/*.yml` files
- Action versions (e.g., `actions/checkout@v4`)

**Schedule:**
- ✅ **First Monday of each month at 9:00 AM IST**
- ✅ **Max 3 PRs at once**
- ✅ **Auto-assigns to:** DEADSERPENT
- ✅ **Labels:** `dependencies`, `github-actions`

**Example PR Title:**
```
ci(deps): bump actions/checkout from 3 to 4
```

## How Dependabot PRs Look

When Dependabot finds an update, it creates a PR like this:

```markdown
# Bump pytest from 7.0.0 to 7.4.3

Bumps [pytest](https://github.com/pytest-dev/pytest) from 7.0.0 to 7.4.3.

## Release notes
[Link to release notes]

## Changelog
[Link to changelog]

## Commits
- abc1234 Fix bug in test collection
- def5678 Add new assertion helpers
- ...

---
**Dependabot commands:**
- `@dependabot rebase` - Rebase this PR
- `@dependabot recreate` - Recreate this PR
- `@dependabot merge` - Merge when CI passes
- `@dependabot ignore` - Close and ignore this update
```

## What You Need to Do

### When a Dependabot PR is Created:

1. **Review the changes**
   - Check the release notes
   - Look for breaking changes

2. **Wait for CI tests**
   - GitHub Actions will automatically run tests
   - Check if all 163 tests pass

3. **Merge or close**
   - ✅ If tests pass → Merge the PR
   - ✅ If breaking changes → Read migration guide, update code
   - ✅ If not needed → Comment `@dependabot ignore this major version`

### Common Dependabot Commands

Comment these on the PR:

```bash
# Merge when CI passes
@dependabot merge

# Rebase the PR (if conflicts)
@dependabot rebase

# Ignore this specific version
@dependabot ignore this major version
@dependabot ignore this minor version
@dependabot ignore this patch version

# Close and stop updates for this dependency
@dependabot ignore this dependency

# Recreate the PR
@dependabot recreate
```

## Security Alerts

Dependabot also creates **security alerts** for vulnerable dependencies:

**Example:**
```
⚠️ CRITICAL: Shapely has a vulnerability (CVE-2024-XXXXX)

Shapely < 2.0.2 is vulnerable to arbitrary code execution.

Affected version: 2.0.0
Patched version: 2.0.2

[View advisory] [View PR #123]
```

**Action:** Merge the security PR immediately!

## Configuration Details

### Python Dependencies Config

```yaml
- package-ecosystem: "pip"              # Check Python packages
  directory: "/"                        # Look in root for pyproject.toml
  schedule:
    interval: "weekly"                  # Check every week
    day: "monday"                       # On Mondays
    time: "09:00"                       # At 9 AM
    timezone: "Asia/Kolkata"            # IST
  open-pull-requests-limit: 5           # Max 5 PRs at once
  reviewers: ["DEADSERPENT"]            # Request review from you
  assignees: ["DEADSERPENT"]            # Assign to you
  labels: ["dependencies", "python"]    # Add these labels
  commit-message:
    prefix: "chore"                     # Commit: chore(deps): ...
```

### GitHub Actions Config

```yaml
- package-ecosystem: "github-actions"   # Check Actions
  directory: "/"                        # Look in .github/workflows/
  schedule:
    interval: "monthly"                 # Check monthly (less frequent)
    day: "monday"                       # First Monday
    time: "09:00"                       # At 9 AM
    timezone: "Asia/Kolkata"            # IST
  open-pull-requests-limit: 3           # Max 3 PRs
  commit-message:
    prefix: "ci"                        # Commit: ci(deps): ...
```

## Typical Update Cycle

### Week 1: Pytest Update Available

1. **Monday 9:00 AM IST** - Dependabot scans dependencies
2. **Monday 9:05 AM** - Creates PR: `chore(deps): bump pytest from 7.0.0 to 7.4.3`
3. **Monday 9:10 AM** - GitHub Actions runs tests
4. **You review** - Check release notes
5. **You merge** - Click "Merge pull request"

### Week 2: Security Alert

1. **Anytime** - GitHub detects vulnerability in shapely
2. **Immediately** - Dependabot creates PR: `chore(deps): bump shapely from 2.0.0 to 2.0.2`
3. **Alert badge** - Red "CRITICAL" badge on repo
4. **You merge ASAP** - Security fix

### Month 1: GitHub Actions Update

1. **First Monday** - Dependabot checks GitHub Actions
2. **Creates PR** - `ci(deps): bump actions/checkout from 3 to 4`
3. **You review** - Check if any workflow changes needed
4. **You merge** - Update to latest Action version

## Benefits for DIGIPIN-Py

1. ✅ **Always up-to-date** - Never miss important updates
2. ✅ **Security** - Immediate alerts for vulnerabilities
3. ✅ **Automation** - No manual checking needed
4. ✅ **Professional** - Shows active maintenance
5. ✅ **Testing** - CI automatically tests updates

## Customization Options

Want to change the config? Edit `.github/dependabot.yml`:

### Check More Frequently
```yaml
schedule:
  interval: "daily"  # Check every day
```

### Check Less Frequently
```yaml
schedule:
  interval: "monthly"  # Once a month
```

### Allow More PRs
```yaml
open-pull-requests-limit: 10  # Up to 10 PRs
```

### Add More Reviewers
```yaml
reviewers:
  - "DEADSERPENT"
  - "hmrshivu"  # Add maintainer
```

### Group Updates
```yaml
groups:
  dev-dependencies:
    patterns:
      - "pytest*"
      - "black*"
      - "mypy*"
```

This groups all dev tool updates into one PR instead of separate PRs.

## Disabling Dependabot

If you ever want to disable it:

1. **Delete the file:** `.github/dependabot.yml`
2. **Or go to:** Settings → Code security → Dependabot → Disable

But I **don't recommend** disabling it - it's incredibly useful!

## Dependabot vs Manual Updates

| Method | Frequency | Effort | Security Alerts |
|--------|-----------|--------|-----------------|
| **Manual** | When you remember | High | You check CVEs manually |
| **Dependabot** | Automatic schedule | Low | Immediate alerts |

**Recommendation:** Keep Dependabot enabled and review PRs weekly.

## Next Steps

1. ✅ **File created:** `.github/dependabot.yml`
2. ⏳ **Commit to GitHub:** `git add .github/dependabot.yml && git commit -m "ci: add dependabot configuration"`
3. ⏳ **Push:** `git push origin main`
4. ⏳ **Wait for first scan:** Dependabot will run automatically

After pushing, Dependabot will:
- Scan your dependencies
- Create PRs if updates are available
- Send you notifications

## Support

- **Documentation:** https://docs.github.com/code-security/dependabot
- **Status:** https://github.com/DEADSERPENT/digipinpy/security/dependabot

---

**Status:** ✅ Ready to use (commit and push to activate)
