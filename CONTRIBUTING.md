# Contributing to SpendSmart 🤝

Thank you for your interest in contributing to SpendSmart! This document provides guidelines and
information to help you contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Project Structure](#project-structure)
- [Commit Guidelines](#commit-guidelines)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow
our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/spend-smart-2.git
   cd spend-smart-2
   ```
3. **Set up the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/spend-smart-2.git
   ```
4. **Follow the setup instructions** in the [README.md](README.md)

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features and enhancements
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Workflow Steps

1. **Create a feature branch** from `develop`:

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes** using our commit guidelines

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** against the `develop` branch

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode (`"strict": true`)
- Provide explicit return types for functions
- Use interfaces over types for object shapes
- Export types and interfaces from index files

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### File Organization

```
apps/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── types/          # Type definitions
│   └── tests/              # Test files
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── hooks/          # Custom hooks
    │   ├── services/       # API services
    │   ├── utils/          # Utility functions
    │   └── types/          # Type definitions
    └── tests/              # Test files
```

### Naming Conventions

- **Files**: `kebab-case` for files and directories
- **Components**: `PascalCase` for React components
- **Functions**: `camelCase` for functions and variables
- **Constants**: `UPPER_SNAKE_CASE` for constants
- **Types/Interfaces**: `PascalCase` with descriptive names

### Code Quality

- Write self-documenting code with clear variable names
- Add comments for complex business logic
- Keep functions small and focused (single responsibility)
- Use early returns to reduce nesting
- Avoid deeply nested code structures

## Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows (planned)

### Writing Tests

```typescript
// Example unit test
describe('TransactionService', () => {
  describe('categorizeTransaction', () => {
    it('should categorize grocery transactions correctly', () => {
      // Test implementation
    });
  });
});
```

### Test Requirements

- All new features must include tests
- Maintain minimum 80% code coverage
- Test both success and error scenarios
- Use descriptive test names
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test TransactionService.test.ts
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest changes:

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Run the complete test suite**:

   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Update documentation** if needed

### PR Requirements

- [ ] Code follows our style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] Commit messages follow our guidelines
- [ ] No merge conflicts with `develop`
- [ ] Feature is working as expected

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing** on staging environment
4. **Approval** from project maintainers

## Issue Reporting

### Bug Reports

Use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment information

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Alternative solutions considered

## Project Structure

### Key Files

- `package.json` - Root package configuration
- `tsconfig.json` - TypeScript configuration
- `render.yaml` - Deployment configuration
- `.github/workflows/` - CI/CD workflows
- `project-plan/` - Project planning documents

### Environment Configuration

- `.env` - Root environment variables
- `apps/backend/.env` - Backend-specific variables
- `apps/frontend/.env` - Frontend-specific variables

## Commit Guidelines

### Commit Message Format

```
type(scope): description

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add Google OAuth integration

Implement Google OAuth login flow with proper token handling
and user profile synchronization.

Closes #123
```

```
fix(transactions): resolve categorization issue

Fix bug where transactions with special characters in merchant
name were not being categorized correctly.

Fixes #456
```

### Commit Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 50 characters
- Reference issues and PRs when applicable
- Keep commits atomic and focused

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex algorithms and business logic
- Include examples in documentation
- Keep documentation up to date with code changes

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Update OpenAPI/Swagger specs

## Getting Help

If you need help:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/your-username/spend-smart-2/issues)
3. Join our [Discord community](https://discord.gg/spendmart) (if available)
4. Create a new issue with the "question" label

## Recognition

Contributors are recognized in:

- [Contributors section](README.md#contributors) of README
- Release notes for significant contributions
- Hall of fame for major contributions

Thank you for contributing to SpendSmart! 🚀
