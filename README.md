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

- Authentication flows (register/login/session)
- Portfolio dashboard with allocation and summary views
- Asset management screens with market refresh feedback
- Profile management with image upload
- API integration via Axios + centralized endpoints
- React Query data fetching and cache behavior

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios

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

1. Add manager role views and navigation controls.
2. Build manager screens to review assets across 10-20 users.
3. Add UI controls for target allocation updates by manager role.
4. Improve role-aware UX states and access restrictions.
5. Expand end-to-end tests for manager user journeys.
