# Backlog

This document contains the list of features, improvements, and tasks to be implemented in the project.

**Project Goal:** Create a portfolio allocation tracker similar to MyProfit, allowing users to track their current positions and compare with target allocation percentages. Based on Google Sheets template.

## High Priority

### Core Features

- [x] **Fixed Income (Renda Fixa) Management**
  - Create dedicated table/page for fixed income assets
  - Fields: initial value, maturity date, interest rate
  - Calculate projected returns
  - Show current value with accrued interest
  - Integration with portfolio allocation

- [ ] **Dashboard Enhancements**
  - Portfolio evolution chart over time (patrimony history)
  - Actual vs Target allocation comparison (visual)
  - Total portfolio value by currency (BRL/USD)
  - Profit/Loss summary cards
  - Asset class distribution pie charts
  - Rebalancing suggestions (what to buy/sell to reach target)

- [ ] **Position Management Improvements**
  - Quick edit position values (inline editing)
  - Bulk update positions
  - Show position age/last update
  - Mark positions as "inactive" instead of deleting

- [ ] **Portfolio Summary View**
  - Overview cards: Total invested, Current value, Total return
  - Monthly performance metrics
  - Currency breakdown
  - Asset class breakdown with progress bars (actual vs target)

### UX/UI Improvements

- [ ] **Better Data Visualization**
  - Interactive charts (click to drill down)
  - Color coding for over/under-allocated assets
  - Progress bars showing actual vs target allocation
  - Responsive charts for mobile

- [ ] **Quick Actions**
  - Floating action button for quick position update
  - Keyboard shortcuts for common actions
  - Search/filter positions by ticker or type
  - Sort by various metrics (value, allocation %, return %)

### Backend

- [x] Implement sorting and pagination
- [x] Implement institutions CRUD
- [x] Add fixed income endpoints
- [ ] Portfolio snapshot/history endpoint (for charts)
- [ ] Calculation endpoint for rebalancing suggestions

## Medium Priority

### Features

- [ ] **User profile**
  - [x] User details page
  - [x] Change password
  - [x] Profile picture upload
  - [ ] Recover password

- [ ] **Portfolio Analytics**
  - Monthly/yearly performance reports
  - Dividend tracking (for stocks that pay dividends)
  - Tax report helper (IR)
  - Export portfolio summary to PDF

- [ ] **Asset Information**
  - Asset details modal (show current price, daily change)
  - Asset class/type descriptions
  - Quick links to external sources (B3, Yahoo Finance)

- [ ] **Notifications & Alerts**
  - Alert when allocation is too far from target
  - Price movement notifications (optional)
  - Monthly summary email

### Improvements

- [ ] **Performance Optimization**
  - Cache calculations (allocation percentages)
  - Optimize chart rendering
  - Lazy load components

- [ ] **Data Import/Export**
  - [x] CSV import for positions
  - [x] CSV template download
  - [ ] Import from Google Sheets
  - [ ] Export portfolio to Excel
  - [ ] Import from broker statements

- [ ] **Mobile Experience**
  - Improve responsive design
  - Touch-friendly interactions
  - PWA capabilities (install as app)

## Low Priority

### Features

- [ ] **Multi-Portfolio Support**
  - Create separate portfolios (e.g., personal, retirement)
  - Switch between portfolios
  - Compare portfolio performance

- [ ] **Benchmark Comparison**
  - Compare returns with IBOV, CDI, S&P 500
  - Relative performance metrics
  - Correlation analysis

- [ ] **Goal Tracking**
  - Set financial goals
  - Track progress towards goals
  - Projections based on contributions

- [ ] **Advanced Features**
  - Currency conversion with real-time rates
  - Automatic price updates from APIs
  - Integration with broker APIs (future)

### Technical Improvements

- [ ] Add comprehensive unit tests
- [ ] Add E2E tests
- [ ] Improve error handling
- [ ] Add API documentation
- [ ] Set up CI/CD pipeline
- [ ] Performance monitoring

## Removed/Not Applicable

~~Transaction history~~ - Not needed, we only track current positions
~~Edit/delete transactions~~ - Positions are updated, not transaction-based
~~Transaction filtering~~ - No transaction history to filter

## Future Ideas (Icebox)

- [ ] Dark/light theme toggle
- [ ] Mobile app (React Native)
- [ ] AI-powered rebalancing suggestions
- [ ] News feed integration for assets
- [ ] Portfolio simulation/backtesting
- [ ] Cryptocurrency support
- [ ] International stocks support (multiple exchanges)
- [ ] Real-time quotes (WebSocket integration)
- [ ] Collaborative portfolios (family accounts)

---

## Notes

- ✅ Completed items
- 🚧 In progress items
- This is a **position tracker**, not a transaction tracker
- Focus on current portfolio state vs target allocation
- Based on Google Sheets portfolio template
- Review and update this backlog regularly
