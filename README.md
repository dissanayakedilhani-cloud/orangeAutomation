# OrangeHRM – Critical Regression Automation

Playwright + TypeScript suite for https://opensource-demo.orangehrmlive.com/

## Roadmap
1. ✅ Identify critical regression test cases → [docs/test-cases/critical-regression-test-cases.md](docs/test-cases/critical-regression-test-cases.md)
2. ✅ Automate them (Page Object Model)
3. ✅ CI/CD integration (GitHub Actions) → [.github/workflows/regression.yml](.github/workflows/regression.yml)

## CI/CD
The **Critical Regression** workflow runs on:
- every push / pull request to `main`
- nightly at 01:00 UTC (detects changes on the demo site)
- manually (Actions tab → *Run workflow*), optionally filtered with a tag such as `@smoke`

Each run uploads the **HTML report** as an artifact. On failure it also uploads traces, screenshots and videos. Failed tests are annotated inline on the PR.

Optional repository settings (Settings → Secrets and variables → Actions). If none are set, the public demo defaults are used:

| Name | Type | Default |
|---|---|---|
| `ADMIN_USERNAME` | Secret | `Admin` |
| `ADMIN_PASSWORD` | Secret | `admin123` |
| `BASE_URL` | Variable | `https://opensource-demo.orangehrmlive.com` |

To block merging on failing tests, add **Playwright tests** as a required status check under Settings → Branches → branch protection rule for `main`.

## Structure
```
orangehrm-automation/
├── docs/test-cases/      # Manual test case specifications
├── pages/                # Page Objects (Login, Dashboard, AddEmployee, PersonalDetails, EmployeeList)
├── fixtures/             # Custom test fixture: page objects + `loggedIn` (fresh Admin session per test)
├── tests/
│   ├── auth/             # TC_001, TC_002, TC_005
│   └── pim/              # TC_003, TC_004
├── test-data/            # Static test data (users)
├── utils/                # Helpers (unique data generators)
├── .github/workflows/    # CI pipeline (Step 3)
├── playwright.config.ts
└── .env.example          # Copy to .env – credentials / base URL
```

## Setup
```bash
npm install
npx playwright install chromium
npm test                 # all tests
npm run test:critical    # only @critical
npm run report           # open HTML report
```
