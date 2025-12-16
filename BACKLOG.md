# Backlog

This document contains the list of features, improvements, and tasks to be implemented in the project.

## High Priority

### Backend

- [x] Implement sorting and pagination (and frontend too)
- [x] Implement institutions CRUD

### Features

- [ ] **Asset Details Page**

  - View detailed information about a specific asset
  - Transaction history for the asset
  - Performance metrics and charts
  - Edit/delete individual transactions

- [ ] **Transaction Management**

  - Edit existing transactions
  - Delete transactions
  - Transaction filtering and search
  - Bulk transaction import (CSV/Excel)

- [ ] **Quote Update System**

  - [x] Implement the "Atualizar Cotações" button functionality
  - Auto-refresh quotes at regular intervals
  - Show last update timestamp
  - Handle API rate limits

- [ ] **Dashboard Enhancements**

  - Add date range selector for patrimony evolution
  - Show profit/loss metrics
  - Add comparison with benchmarks (IBOV, CDI, etc.)
  - Export charts as images

- [ ] **User profile**
  - User details page
  - Change password
  - Recover password

### Bug Fixes

- [ ] Review error handling in API calls
- [ ] Add loading states for all async operations
- [ ] Validate form inputs more thoroughly
- [ ] Handle network errors gracefully

## Medium Priority

### Features

- [ ] **User Profile & Settings**

  - Edit user profile information
  - Change preferences (currency, language)
  - Notification settings
  - Theme customization (dark/light mode toggle)

- [ ] **Portfolio Analytics**

  - Monthly/yearly performance reports
  - Dividend tracking and projections
  - Cost basis calculations
  - Tax report generation (IR)

- [ ] **Asset Search & Discovery**

  - Search for assets by ticker or name
  - Asset information lookup
  - Popular assets recommendations
  - Watchlist functionality

- [ ] **Multi-Portfolio Support**
  - Create and manage multiple portfolios
  - Switch between portfolios
  - Compare portfolio performance

### Improvements

- [ ] **Performance Optimization**

  - Implement pagination for large asset lists
  - Add virtualization for tables with many rows
  - Optimize chart rendering
  - Lazy load components

- [ ] **UX Improvements**

  - Add tooltips with explanations
  - Improve mobile responsiveness
  - Add keyboard shortcuts
  - Improve accessibility (WCAG compliance)
  - Add empty states with helpful CTAs

- [ ] **Data Validation**
  - Add more comprehensive Zod schemas
  - Client-side validation for all forms
  - Better error messages

## Low Priority

### Features

- [ ] **Notifications System**

  - Price alerts
  - Portfolio milestone notifications
  - Dividend payment reminders

- [ ] **Social Features**

  - Share portfolio performance (optional)
  - Community benchmarks
  - Educational content

- [ ] **Advanced Analytics**

  - Risk metrics (Sharpe ratio, Beta, etc.)
  - Correlation analysis
  - Asset allocation suggestions
  - Rebalancing recommendations

- [ ] **Export & Reporting**

  - PDF reports generation
  - Excel export with detailed data
  - Email reports scheduling

- [ ] **Integration Features**
  - Integration with broker APIs
  - Automatic transaction sync
  - Bank account connections

### Technical Debt

- [ ] Add comprehensive unit tests
- [ ] Add integration tests
- [ ] Add E2E tests with Playwright or Cypress
- [ ] Improve TypeScript strict mode compliance
- [ ] Add API documentation
- [ ] Set up CI/CD pipeline
- [ ] Add code coverage reporting
- [ ] Implement proper logging system
- [ ] Add performance monitoring (Sentry, etc.)

### Documentation

- [ ] Add JSDoc comments to complex functions
- [ ] Create component documentation
- [ ] Add API integration guide
- [ ] Create deployment guide
- [ ] Add contributing guidelines
- [ ] Create architecture documentation

## Future Ideas (Icebox)

- [ ] Mobile app (React Native)
- [ ] Browser extension for quick portfolio check
- [ ] AI-powered investment suggestions
- [ ] News feed integration
- [ ] Portfolio simulation/backtesting
- [ ] Cryptocurrency support
- [ ] International stocks support (multiple exchanges)
- [ ] Real-time quotes (WebSocket integration)
- [ ] Voice commands integration
- [ ] Gamification features (achievements, badges)

---

## Notes

- Items marked with ✅ are completed
- Items marked with 🚧 are in progress
- Priorities may change based on user feedback
- Review and update this backlog regularly
