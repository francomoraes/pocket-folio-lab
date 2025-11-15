# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Vite, React, TypeScript, and Tailwind CSS
- Authentication system with Google Login integration
- Protected routes implementation
- Layout components (Navbar, UserMenu)
- Dashboard page with allocation visualizations
  - Pie chart for allocation by asset class
  - Bar chart for allocation by ticker
  - Line chart for patrimony evolution
- Positions page with asset listing
  - Display of current holdings with quantity, average price, current price, and returns
  - Support for multi-currency assets (BRL and USD)
- Transaction dialog for adding buy/sell operations
- Asset service integration with backend API
- Custom hooks for authentication and positions management
- UI components library using shadcn/ui and Radix UI
- Currency formatters and percentage formatters
- Investment storage utilities

### Technical Stack

- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- React Router DOM 6.30.1
- TanStack Query 5.83.0
- Axios 1.12.2
- Recharts 2.15.4
- Zod 3.25.76
- React Hook Form 7.61.1
- Tailwind CSS 3.4.17
- shadcn/ui components

---

## [0.0.0] - 2025-11-15

### Added

- Project initialization
- Repository setup
- Basic file structure
