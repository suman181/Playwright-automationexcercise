# Automation Exercise – End-to-End UI Automation (Playwright + TypeScript)

Automated UI (and supporting API) tests for **https://automationexercise.com**, built module by module.

## Tech stack
- Playwright Test + TypeScript
- Page Object Model: locators / page actions / specs are separate layers
- `@faker-js/faker` factory: unique user per test (parallel-safe)
- Chromium, Firefox and WebKit

## Setup & run
```bash
npm install
npx playwright install --with-deps

npm test                # everything
npm run test:chromium  # one browser
npm run test:smoke     # @smoke only
npm run test:negative  # @negative only
npm run test:headed    # watch it run
npm run test:debug     # Playwright inspector
```

Override the target with env vars: `BASE_URL=... TEST_USER_PASSWORD=... npm test` (see `.env.example`).

## Scenario coverage (grows with each commit)
| Module | Positive | Negative |
|---|---|---|
| Registration | Register new account & verify logged-in header; delete account & verify via API that login no longer works | Duplicate e-mail; empty name / empty e-mail / malformed e-mail (native form validation) |
| Login | Login + logout | Wrong password; unregistered e-mail; empty credentials |
| Products | Catalogue lists items; details page equals listing (name, price) | – |
| Search | Data-driven search terms return relevant results | Unknown term → no results |
| Cart | Add one item (price/qty/total); add several; quantity from product page; remove item | Empty cart for new visitor; guest checkout prompts login |
| Checkout | Logged-in end-to-end order (address check, order review, comment, payment, confirmation + invoice link); guest → registers during checkout → pays | Payment with empty card details is blocked |
