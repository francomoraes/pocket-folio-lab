# Investment Tracker Frontend

Frontend application for portfolio tracking and allocation monitoring.

## Live URLs

- Frontend: https://investment-tracker-manager.vercel.app/
- Backend repo: https://github.com/francomoraes/asset_breakdown
- Backend API Health check: https://assetbreakdown-production.up.railway.app/health

## Demo account

- Email: user@test.com
- Password: User123!

This account is provided for demo and portfolio review purposes.

## Frontend highlights

- Authentication flows (login, register, auto-logout on token expiration) with JWT stored in localStorage
- Protected routes via `ProtectedRoute` component and `AuthContext`
- Portfolio dashboard with allocation breakdown (PieChart) and multi-currency BarChart
- Wealth evolution chart (ComposedChart) comparing portfolio growth against market indices (CDI, IPCA, S&P 500) with granularity controls (monthly, quarterly, semi-annual, annual)
- Positions management for variable income (stocks, ETFs, REITs, crypto) and fixed income assets
- Asset creation, editing, and transaction forms with React Hook Form + Zod validation
- Bulk asset import via CSV upload
- Settings screens for managing asset classes, asset types, and institutions
- User profile screen with profile picture upload
- Market price refresh flow with user feedback via toast notifications
- Pagination on listing screens
- Drag-and-drop reordering on dashboard panels (dnd-kit)
- Internationalization in Portuguese (pt-BR) and English (en-US) via i18next
- Dark mode support via next-themes
- Fully responsive layout with mobile breakpoint detection
- Global error boundary with fallback UI
- Centralized Axios instance and API endpoint config
- React Query for server state with query key factory

## Tech stack

- React 18 + TypeScript
- Vite (SWC)
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- TanStack Query (React Query v5)
- Axios with centralized instance and endpoint config
- React Router DOM v6
- React Hook Form + Zod (form validation)
- Recharts (charts: Pie, Bar, Line, ComposedChart)
- i18next + react-i18next (pt-BR / en-US)
- next-themes (dark mode)
- dnd-kit (drag-and-drop)
- Sonner (toast notifications)
- date-fns
- Vercel deployment

## Local setup

```sh
npm install
npm run dev
```

## Build preview

```sh
npm run build
npm run preview
```

## Environment variable

Set the API endpoint before build/deploy:

```dotenv
VITE_API_URL=https://assetbreakdown-production.up.railway.app/api
```

## Next steps (portfolio roadmap)

Aligned with the manager feature being built on the backend:

1. **Role-aware navigation** — show/hide nav items and routes based on user role (investor, manager, admin).
2. **Manager dashboard** — consolidated view of all linked investors' portfolios with summary metrics.
3. **Link management screens** — investor flow to request a manager link; manager flow to accept, reject, or revoke.
4. **Read-only investor view for managers** — managers can browse any linked investor's positions and dashboard.
5. **Target allocation editing** — managers can update asset type target percentages for linked investors.
6. **Link history screen** — display past manager–investor relationships with dates and wealth snapshots per cycle.
