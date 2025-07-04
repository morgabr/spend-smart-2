# GitHub Project Board Setup

This document provides instructions for setting up the GitHub Project board for SpendSmart
development.

## Project Board Configuration

### Board Type

- **Template**: Team Planning
- **Visibility**: Public (for open source contributions)
- **Access**: Repository maintainers have admin access

### Board Structure

#### Columns (Status)

1. **📋 Backlog** - Features and tasks planned for future development
2. **🔍 Ready** - Tasks that are well-defined and ready to start
3. **🚧 In Progress** - Currently being worked on
4. **👀 In Review** - Pull requests under review
5. **🧪 Testing** - Features being tested in staging
6. **✅ Done** - Completed items

#### Custom Fields

- **Priority**: High, Medium, Low
- **Effort**: 1-5 (story points)
- **Area**: Frontend, Backend, Database, DevOps, Documentation
- **Assignee**: Team member responsible
- **Sprint**: Current sprint number

### Labels Setup

#### Type Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

#### Priority Labels

- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

#### Area Labels

- `area: frontend` - Frontend React app
- `area: backend` - Backend API
- `area: database` - Database schema/queries
- `area: devops` - CI/CD, deployment
- `area: security` - Security-related
- `area: performance` - Performance improvements

#### Status Labels

- `status: needs-triage` - Needs initial review
- `status: blocked` - Blocked by dependencies
- `status: in-progress` - Currently being worked on
- `status: needs-review` - Ready for code review

### Automation Rules

#### Auto-add to Project

- All new issues and PRs are automatically added to the project
- New items default to "Backlog" column

#### Status Transitions

- **Backlog → Ready**: When issue is assigned and has acceptance criteria
- **Ready → In Progress**: When PR is opened referencing the issue
- **In Progress → In Review**: When PR is marked ready for review
- **In Review → Testing**: When PR is merged to develop branch
- **Testing → Done**: When feature is deployed to production

### Milestone Integration

#### Sprint Milestones

- **Sprint 1**: Core Infrastructure (Items 9-15)
- **Sprint 2**: Authentication & Account Integration (Items 16-18)
- **Sprint 3**: Transaction Management (Items 19-22)
- **Sprint 4**: Budgeting & Forecasting (Items 23-28)
- **Sprint 5**: Frontend Core Features (Items 43-50)

### GitHub Project Queries

#### Useful Filters

```
# High priority items in backlog
is:issue label:"priority: high" project:spendmart/1 status:Backlog

# Items ready for work
is:issue assignee:@me project:spendmart/1 status:Ready

# Backend items in progress
is:issue label:"area: backend" project:spendmart/1 status:"In Progress"

# Items needing review
is:pr project:spendmart/1 status:"In Review"
```

## Setup Instructions

### 1. Create the Project Board

1. Go to your GitHub repository
2. Click on "Projects" tab
3. Click "New project"
4. Select "Team planning" template
5. Name it "SpendSmart Development"
6. Set description: "Main project board for SpendSmart development"

### 2. Configure Columns

Add the columns listed above in the Board Structure section.

### 3. Set Up Labels

Go to repository Settings → Labels and create all the labels listed above.

### 4. Configure Automation

Set up the automation rules as described above using GitHub's built-in automation features.

### 5. Import Issues from TODO.md

Create GitHub issues for major TODO items and link them to the project board.

### 6. Team Access

- Add team members with appropriate permissions
- Set up notifications for project updates

## Best Practices

### Issue Management

- Use issue templates for consistent formatting
- Link issues to project board items
- Close issues when work is complete
- Use milestones for sprint planning

### PR Management

- Link PRs to related issues
- Use draft PRs for work in progress
- Require reviews before merging
- Auto-close issues when PRs are merged

### Project Tracking

- Update project status regularly
- Review sprint progress weekly
- Archive completed items monthly
- Track velocity and burndown

## Integration with TODO.md

The project board should sync with our TODO.md file:

- Major TODO items become GitHub issues
- Issues are organized by sprint/milestone
- Progress is tracked in both places
- Project board shows current sprint focus

## Reporting and Metrics

### Sprint Reports

- Velocity tracking
- Burndown charts
- Completion rates
- Blocked item analysis

### Team Metrics

- Individual contribution tracking
- Review cycle times
- Bug resolution rates
- Feature delivery timelines

---

**Note**: This setup requires repository admin access to implement fully. The project board will be
created manually following these guidelines.
