# bank-test-playwright

This is a Playwright TypeScript project for end-to-end testing of a banking application.

## Structure

- `tests/` - Test specifications
- `page-objects/` - Page Object Model classes
- `fixtures/` - Custom Playwright fixtures
- `playwright.config.ts` - Playwright configuration
- `tsconfig.json` - TypeScript configuration

## Getting Started

1. Install dependencies:
   ```sh
   cd tests-playwright
   npm install
   ```
2. Run tests:
   ```sh
   npx playwright test
   ```

## Useful Commands

- Run all tests: `npx playwright test`
- Run tests with UI: `npx playwright test --ui`
- Show report: `npx playwright show-report`

---

For more information, see [Playwright documentation](https://playwright.dev/).
 
## Server Overview

- Base URL: The tests run against a local Express server configured in [tests-playwright/playwright.config.ts](tests-playwright/playwright.config.ts). It starts via the `webServer` setting using `npm run dev` and targets `http://localhost:3000`.
- Start command: The dev server is defined in [tests-playwright/server.js](tests-playwright/server.js) and is started with:
   ```sh
   cd tests-playwright
   npm run dev
   ```
- Port: Defaults to `3000` (overridable via `PORT`).
- Routes served:
   - `/login`: Renders a simple login form. Submitting the form client-side navigates to `/dashboard`.
   - `/dashboard`: Displays `h1.welcome` with the text “Welcome to Your Dashboard”.
   - `/transfer`: Renders a transfer form and updates `.success-message` to “Transfer successful” on submit.

The Playwright config uses `webServer.reuseExistingServer: true`, so if the server is already running, tests will connect to it; otherwise, Playwright starts it automatically when running tests.

## Tests: TypeScript and JavaScript

- TypeScript specs live under [tests-playwright/src/tests](tests-playwright/src/tests) and import TS page-objects (e.g., [tests-playwright/src/tests/login.spec.ts](tests-playwright/src/tests/login.spec.ts)).
- JavaScript specs are also provided to exercise the `.js` page-objects:
   - [tests-playwright/src/tests/login.spec.js](tests-playwright/src/tests/login.spec.js)
   - [tests-playwright/src/tests/dashboard.spec.js](tests-playwright/src/tests/dashboard.spec.js)
   - [tests-playwright/src/tests/transfer.spec.js](tests-playwright/src/tests/transfer.spec.js)
- Both TS and JS specs run with the same command:
   ```sh
   cd tests-playwright
   npx playwright test
   ```

## Typical Workflow

- Start server and run all tests:
   ```sh
   cd tests-playwright
   npm run dev &
   npx playwright test
   ```
- Explore tests in UI mode:
   ```sh
   cd tests-playwright
   npx playwright test --ui
   ```
- View the latest HTML report:
   ```sh
   cd tests-playwright
   npx playwright show-report
   ```

## - Project Planning and Progress Summary

- [x] Local Express server with login, dashboard, transfer pages – see [tests-playwright/server.js](tests-playwright/server.js).
- [x] Playwright + TypeScript project structure (tests, page objects, fixtures, config) – see [tests-playwright](tests-playwright).
- [x] Page Objects: [LoginPage.ts](tests-playwright/src/page-objects/LoginPage.ts), [DashboardPage.ts](tests-playwright/src/page-objects/DashboardPage.ts), [TransferPage.ts](tests-playwright/src/page-objects/TransferPage.ts) (+ JS equivalents).
- [x] E2E tests for login, dashboard, transfer – see [tests-playwright/src/tests](tests-playwright/src/tests).
- [x] Playwright config to auto-start the server during tests – see [tests-playwright/playwright.config.ts](tests-playwright/playwright.config.ts).
- [x] UI: Account detail page with transaction history and client-side filtering – see [tests-playwright/server.js](tests-playwright/server.js) (`/account` route).
- [x] Page Object: [AccountDetailPage.ts](tests-playwright/src/page-objects/AccountDetailPage.ts) for account detail interactions.
- [x] Test: [accounts.spec.ts](tests-playwright/src/tests/accounts.spec.ts) covering transaction filtering by type and amount.
- [x] Test: [transactions.spec.ts](tests-playwright/src/tests/transactions.spec.ts) with edge cases (empty results, min/max filters, type filters).
- [x] Fixtures: JSON test data for accounts and transactions – see [tests-playwright/fixtures/](tests-playwright/fixtures/).
- [ ] API (Node.js + Express option): add REST endpoints `GET /accounts`, `GET /accounts/{id}/transactions`, `POST /transfer` (current routes are HTML pages, not JSON APIs).
- [ ] API tests: Playwright `request` fixture or separate REST Assured project (Java/Kotlin).
- [ ] CI: GitHub Actions workflow to run Playwright tests (and optionally REST Assured).
- [ ] Test analysis: write manual test cases (login, accounts overview, transfer, filters, error cases).
- [ ] Unit tests: validation logic for amounts (0, negative, non-numeric).

