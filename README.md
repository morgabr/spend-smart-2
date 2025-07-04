# SpendSmart 💰

A modern web application for personal financial management that helps users track spending, forecast
their financial future, and make informed financial decisions.

## ✨ Features

- **Account Integration**: Connect bank accounts via Tink API or upload transaction files
- **Smart Categorization**: Automatic transaction categorization with manual override capabilities
- **Financial Forecasting**: Predict net worth and cash flow based on historical data and future
  scenarios
- **Budget Management**: Create and track budgets with real-time progress monitoring
- **Scenario Planning**: Model financial decisions and compare different financial scenarios
- **Multi-Currency Support**: Handle multiple currencies with real-time exchange rates
- **Collaboration**: Share financial data with family members or financial advisors
- **Financial Goals**: Set and track progress toward savings and debt reduction goals

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, and Vite
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with OAuth support (Google, Apple)
- **Deployment**: Render.com with automated CI/CD via GitHub Actions

### Project Structure

```
spend-smart-2/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # React.js web application
├── packages/
│   └── shared/           # Shared types, utilities, and configurations
├── .github/workflows/    # CI/CD automation
├── docs/                 # Documentation
├── project-plan/         # Project planning and specifications
└── render.yaml          # Render.com deployment configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/spend-smart-2.git
   cd spend-smart-2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy example environment files
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. **Configure your environment** Edit the `.env` files with your specific configuration:
   - Database connection string
   - JWT secret
   - API keys (Tink, email service, etc.)

5. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate --schema=apps/backend/prisma/schema.prisma

   # Run database migrations
   npx prisma migrate dev --schema=apps/backend/prisma/schema.prisma
   ```

### Development

Start the development servers:

```bash
# Start all services in development mode
npm run dev

# Or start individually:
npm run dev:backend    # Backend on http://localhost:3001
npm run dev:frontend   # Frontend on http://localhost:3000
```

## 📋 Available Scripts

### Root Level

- `npm run dev` - Start all development servers
- `npm run build` - Build all packages and applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run type-check` - Run TypeScript type checking

### Backend (`apps/backend`)

- `npm run dev --workspace=apps/backend` - Start backend development server
- `npm run build --workspace=apps/backend` - Build backend for production
- `npm run test --workspace=apps/backend` - Run backend tests
- `npm run lint --workspace=apps/backend` - Lint backend code

### Frontend (`apps/frontend`)

- `npm run dev --workspace=apps/frontend` - Start frontend development server
- `npm run build --workspace=apps/frontend` - Build frontend for production
- `npm run test --workspace=apps/frontend` - Run frontend tests
- `npm run lint --workspace=apps/frontend` - Lint frontend code

## 🔧 Configuration

### Environment Variables

#### Backend

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `TINK_CLIENT_ID` - Tink API client ID
- `TINK_CLIENT_SECRET` - Tink API client secret
- `SENDGRID_API_KEY` - SendGrid API key for email notifications
- `EXCHANGE_RATE_API_KEY` - Exchange rate API key

#### Frontend

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics

### Database

The application uses PostgreSQL with Prisma ORM. The database schema is defined in
`apps/backend/prisma/schema.prisma`.

To reset the database:

```bash
npx prisma migrate reset --schema=apps/backend/prisma/schema.prisma
```

## 🚢 Deployment

### Staging Environment

- **Frontend**: https://spend-smart-frontend-staging.onrender.com
- **Backend**: https://spend-smart-backend-staging.onrender.com
- **Branch**: `develop`

### Production Environment

- **Frontend**: https://spend-smart-frontend-prod.onrender.com
- **Backend**: https://spend-smart-backend-prod.onrender.com
- **Branch**: `main`

### Deployment Process

1. **Staging**: Push to `develop` branch triggers automatic deployment to staging
2. **Production**: Push to `main` branch triggers automatic deployment to production

The deployment is configured in `render.yaml` and automated via GitHub Actions.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests**: Individual function and component testing
- **Integration Tests**: API endpoint and service integration testing
- **E2E Tests**: Full user journey testing (planned)

## 📚 API Documentation

API documentation is available at:

- **Development**: http://localhost:3001/api/docs
- **Staging**: https://spend-smart-backend-staging.onrender.com/api/docs
- **Production**: https://spend-smart-backend-prod.onrender.com/api/docs

## 🔒 Security

- All data is encrypted at rest and in transit
- JWT-based authentication with secure token handling
- GDPR-compliant data handling
- Regular security scanning via CodeQL and dependency review
- Environment-specific configurations for different security levels

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process
for submitting pull requests.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/your-username/spend-smart-2/issues)
3. Create a new [issue](https://github.com/your-username/spend-smart-2/issues/new)

## 🗺️ Roadmap

See [project-plan/TODO.md](project-plan/TODO.md) for detailed development roadmap and current
progress.

### Upcoming Features

- Mobile application (iOS/Android)
- Advanced reporting and analytics
- Investment portfolio tracking
- Tax optimization suggestions
- Financial advisor integration

## 👥 Team

- **Development**: [Your Name](https://github.com/your-username)
- **Design**: [Designer Name](https://github.com/designer-username)

## 📈 Status

![CI](https://github.com/your-username/spend-smart-2/workflows/CI/badge.svg)
![Security](https://github.com/your-username/spend-smart-2/workflows/Security/badge.svg)
![Deploy](https://github.com/your-username/spend-smart-2/workflows/Deploy/badge.svg)

---

Made with ❤️ for better financial management
