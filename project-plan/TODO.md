# SpendSmart Web App – Master To-Do List

## 1. Project Setup

1. [x] Initialize monorepo structure (frontend, backend, shared)
2. [ ] Set up version control (Git) and repository (e.g., GitHub)
3. [ ] Configure code formatting and linting (Prettier, ESLint)
4. [ ] Set up commit hooks (Husky, lint-staged)
5. [ ] Configure environment variable management
6. [ ] Set up CI/CD pipeline (build, test, deploy)
7. [ ] Write initial README and contribution guidelines
8. [ ] Set up issue templates and project board

## 2. Backend Development

### 2.1 Core Infrastructure

9. [ ] Scaffold Node.js + Express backend
10. [ ] Set up PostgreSQL database and ORM (e.g., Prisma/Sequelize/TypeORM)
11. [ ] Implement secure authentication (JWT, OAuth for Google/Apple, email/password)
12. [ ] Set up user model and roles
13. [ ] Implement GDPR-compliant data handling and consent flow
14. [ ] Set up logging and monitoring (e.g., Sentry, LogRocket)
15. [ ] Configure HTTPS and secure token handling

### 2.2 Account Integration

16. [ ] Integrate Tink API for account aggregation
17. [ ] Implement file upload endpoint for transaction imports (OFX parser)
18. [ ] Implement account grouping and categorization logic

### 2.3 Transactions

19. [ ] Implement transaction model and CRUD endpoints
20. [ ] Develop auto-categorization logic (rule-based + ML-based)
21. [ ] Implement manual override and future override logic
22. [ ] Add support for notes, attachments, and tag-based filtering

### 2.4 Recurring Transactions

23. [ ] Implement recurring transaction detection logic
24. [ ] Add endpoints for editing recurring transaction properties
25. [ ] Implement discretionary vs. non-discretionary toggle

### 2.5 Forecasting & Simulation

26. [ ] Implement forecasting logic (net worth, cash flow, income/expenses)
27. [ ] Add endpoints for user-defined future transactions and scenarios
28. [ ] Support variable income and rate of increase

### 2.6 Budgeting

29. [ ] Implement budget model and endpoints (monthly, one-time)
30. [ ] Assign spending limits per category
31. [ ] Track progress against budgets (historical and future)

### 2.7 Reporting & Dashboard

32. [ ] Implement endpoints for dashboard metrics (net worth, balances, income/expenses, savings rate)
33. [ ] Add endpoints for chart data (pie, bar, line, cumulative)

### 2.8 Notifications

34. [ ] Integrate email service (e.g., SendGrid)
35. [ ] Implement notification logic for bills, low balances, forecast changes

### 2.9 Currency Support

36. [ ] Integrate exchange rate API
37. [ ] Implement multi-currency support and conversion logic

### 2.10 Collaboration

38. [ ] Implement user invitation and linking logic
39. [ ] Set up permissions for linked users

### 2.11 Financial Goals

40. [ ] Implement goal model and endpoints
41. [ ] Tie goals to accounts and track progress
42. [ ] Support placeholder transactions for goals

## 3. Frontend Development

### 3.1 Core Infrastructure

43. [ ] Scaffold React.js app with Tailwind CSS
44. [ ] Set up routing, state management, and API client
45. [ ] Implement authentication flows (Google, Apple, email/password)
46. [ ] Set up secure storage for tokens

### 3.2 Account Integration

47. [ ] Build UI for linking accounts via Tink
48. [ ] Implement file upload for transaction imports
49. [ ] UI for account grouping and categorization

### 3.3 Transactions

50. [ ] Transaction list and detail views
51. [ ] Category override UI and tagging
52. [ ] Notes and attachment upload UI
53. [ ] Search and filter functionality

### 3.4 Recurring Transactions

54. [ ] UI for recurring transaction detection and editing
55. [ ] Discretionary toggle in UI

### 3.5 Forecasting & Simulation

56. [ ] Scenario creation and management UI
57. [ ] Add/edit future transactions (one-off, recurring)
58. [ ] Side-by-side scenario comparison (tables, charts)
59. [ ] Variable income and rate of increase UI

### 3.6 Dashboard

60. [ ] Net worth, balances, income/expenses, savings rate widgets
61. [ ] Pie chart for spending by category
62. [ ] Bar/line chart for cash flow
63. [ ] Cumulative net impact chart (zoomable)
64. [ ] In-place editing and drill-downs

### 3.7 Budgeting

65. [ ] Budget creation and editing UI
66. [ ] Assign spending limits per category
67. [ ] Progress tracking (historical and future)

### 3.8 Reporting

68. [ ] In-app dashboard for historical insights

### 3.9 Notifications

69. [ ] Notification settings UI
70. [ ] Display upcoming bills, low balances, major forecast changes

### 3.10 Currency Support

71. [ ] Base currency selection UI
72. [ ] Display converted values throughout app

### 3.11 Collaboration

73. [ ] UI for inviting and managing linked users

### 3.12 Financial Goals

74. [ ] Goal creation and progress tracking UI
75. [ ] Assign placeholder transactions to goals

## 4. Testing

76. [ ] Unit tests for backend (parsers, categorization, forecasting, etc.)
77. [ ] Integration tests (API, Tink, file upload, dashboard)
78. [ ] End-to-end tests (onboarding, categorization, scenario, budgeting)
79. [ ] Frontend unit and integration tests (components, flows)
80. [ ] Security and compliance testing

## 5. Error Handling & Monitoring

81. [ ] Implement retry logic for failed API requests
82. [ ] User-facing error messages throughout app
83. [ ] Input validation on all forms
84. [ ] Logging and monitoring setup

## 6. Backlog / Future Enhancements

85. [ ] CSV import with manual field mapping
86. [ ] Carryover for unused budget amounts
87. [ ] Push notifications (mobile app phase)
88. [ ] Role-based permissions for collaboration
89. [ ] Export reports to PDF/CSV
90. [ ] Mobile apps (iOS and Android) 