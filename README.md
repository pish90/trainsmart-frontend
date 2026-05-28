# TrainSmart Frontend

React 18 + Vite PWA for the TrainSmart cycling training app. AI-generated training plans with Strava integration.

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

Create `.env.local` for local overrides (not committed).

## Testing

```bash
npm run test
```

19 tests across utils, SetupPage, and DashboardPage.

## Build

```bash
npm run build
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Setup — create a training plan |
| `/dashboard/:id` | Owner dashboard with session logging |
| `/view/:shareCode` | Read-only shared view |
