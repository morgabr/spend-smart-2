# SpendSmart Web App - Developer Specification

---

**Project Rule:**

- The agent must maintain and update the following files as changes are made:
  - [CHANGELOG.md](../CHANGELOG.md) for all notable changes
  - [DEVLOG.md](../DEVLOG.md) for session-by-session development notes and decisions
  - [project-plan/TODO.md](TODO.md) for project planning and progress
  - [docs/](../docs/) for supplementary documentation
  - Ensure pull requests and issues use their respective templates for consistency
- After every significant change is completed, agents must execute all unit tests and verify that
  they pass before considering the change complete.
- All commits must be made using the Commit feature in Cursor, to ensure that commit messages are
  AI-generated and thorough. Direct command-line commits are not permitted.

---

## 1. Overview

The goal is to develop a web app that helps users manage their personal finances by providing a
clear view of their financial future based on past transactions and user-defined future scenarios.
The app supports linking financial accounts, categorizing transactions, budgeting, and forecasting
net worth and cash flow. It includes simulation features that allow users to model financial
decisions (e.g., purchasing a car or receiving a raise) and view their impact on long-term finances.

## 2. Core Features

### 2.1 Account Integration

- Integrate with Tink for account aggregation (checking, savings, credit, loans, investments).
- Support file uploads for historical transaction imports.
- Enable account grouping and categorization by default with user customizability.

### 2.2 User Authentication

- Support Google and Apple login.
- Email/password login also supported.
- High-security model: end-to-end encryption, GDPR compliance.

### 2.3 Transactions

- Auto-categorization using merchant codes, descriptions, and pattern recognition.
- Users can override categories and apply overrides to future similar transactions.
- Searchable transaction history with tagging and custom categories.
- Support for notes and attachments (receipts, contracts) with tag-based filtering.

### 2.4 Recurring Transactions

- App detects recurring patterns automatically.
- Users can edit category, tags, and end date.
- Frequency edits flagged if they conflict with detected patterns.
- Discretionary vs. non-discretionary toggle for recurring transactions.

### 2.5 Forecasting & Simulation

- Forecast net worth, cash flow, income/expenses using historical trends and user inputs.
- Users can:
  - Add/edit future transactions (one-off or recurring).
  - Adjust amounts and frequencies.
  - Create and save multiple simulation scenarios.
  - See side-by-side scenario comparisons with tables and charts.
  - Include variable income (bonuses, dividends) and allow rate of increase.

### 2.6 Dashboard

- Primary metrics:
  - Net worth
  - Balance by account type (cash, investment, retirement, etc.)
  - Income vs. expenses
  - Savings rate
- Visuals:
  - Pie chart (spending by category)
  - Bar/line chart (monthly/quarterly/yearly cash flow)
  - Cumulative net impact over timeline (zoomable)

### 2.7 Budgeting

- Monthly recurring budgets and one-time budgets.
- Assign spending limits per category.
- Track progress against budgets in historical and future views.

### 2.8 Reporting

- In-app dashboard for historical insights.
- No export (PDF/CSV) required initially.

### 2.9 Notifications

- Email alerts for:
  - Upcoming bills
  - Low balances
  - Major forecast changes

### 2.10 Currency Support

- Multi-currency support.
- User selects a base currency.
- App converts account values using daily exchange rates (via external API).

### 2.11 Collaboration

- Users can link other users to their account via email invitation.
- Linked users receive full access (view/edit).
- No merging of separate accounts.

### 2.12 Financial Goals

- Users can define savings/debt goals.
- Tie goals to specific accounts.
- Track progress with visual indicators.
- Placeholder transactions can be assigned to goals.

## 3. Architecture

### 3.1 Frontend

- Framework: React.js with Tailwind CSS
- Charts: Recharts or Chart.js
- Interactive UI for scenario comparison, category drill-down, and in-place editing.

### 3.2 Backend

- Framework: Node.js with Express
- Database: PostgreSQL (relational, secure, scalable)
- Third-party services:
  - Tink API (account linking)
  - Exchange rate API (e.g., exchangeratesapi.io)
  - Email service (e.g., SendGrid)

### 3.3 Security & Compliance

- Use HTTPS and secure authentication tokens.
- Encrypt all user data at rest and in transit.
- GDPR-compliant data handling and user consent flow.

## 4. Data Handling

### 4.1 Import Handling

- OFX import parser for structured data.
- De-duplication checks.
- Tag and category mapping auto-suggestions.

### 4.2 Categorization Logic

- Use rule-based and ML-based categorization.
- Learning from manual overrides.
- Similarity metrics: merchant name, transaction amount, timing.

### 4.3 Forecast Logic

- Extrapolate past spending trends.
- Apply rules for user-added transactions.
- Simulate based on scenarios: multiple timelines possible.

## 5. Error Handling Strategy

- Retry mechanism for failed API requests.
- Clear user-facing error messages.
- Validation on all user input forms.
- Logging and monitoring for backend issues (via LogRocket, Sentry, or similar).

## 6. Testing Plan

6.1 Unit Testing

- Transaction parser
- Categorization logic
- Forecast calculations

  6.2 Integration Testing

- Tink API connection
- File upload and transaction ingestion
- Dashboard scenario view

  6.3 End-to-End Testing

- Onboarding flow
- Transaction categorization and override
- Scenario creation and comparison
- Budget tracking with historical + forecast data

## 7. Backlog Items (Future Enhancements)

- CSV import with manual field mapping
- Carryover for unused budget amounts
- Push notifications (mobile app phase)
- Role-based permissions for collaboration
- Export reports to PDF/CSV
- Mobile apps (iOS and Android)
