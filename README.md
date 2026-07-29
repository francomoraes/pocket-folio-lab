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

- Authentication flows (login, register, auto-logout on token expiration) with the access token kept in memory and the refresh token in an HttpOnly cookie
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

The manager–investor relationship system (RBAC) described in earlier roadmaps has been fully implemented — role-aware navigation, manager dashboard, bidirectional link management screens (investor-initiated and manager-initiated, with approval flow), read-only investor view for managers, target allocation editing, and link history screen. See `docs/done/rbac-feature-frontend.md` and `docs/done/bugs-16-07-fixes.md`.

Remaining work:

1. **Crypto account linking UI** — connect/manage Ethereum wallets and Mercado Bitcoin accounts, view sync status. Not started — see `docs/crypto-tracking-price-refresh.md`.
2. **CI/CD automation** — automated lint/test/build and preview deploys via GitHub Actions.
3. **Item 6 follow-up** — reassess in production whether the "Visualizando carteira de: #id" banner ever falls back to showing the raw ID instead of the client's name (no code defect found so far, see `docs/done/bugs-16-07-fixes.md`).
