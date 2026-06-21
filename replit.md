# 168 Hours — Weekly Life Tracker

A production-ready personal web app to understand where every hour of your week goes.

## Running the App

The app runs inside the `168hours/` directory using Next.js 15.

- Dev command: `cd 168hours && npm run dev` (port 5000)
- Password: `RAJA`

## User Preferences

- UI Style: Slate — dark navy, structured, data-dense
- Auth: Single fixed password (`RAJA`), stored in `lib/auth.ts`
- Data: Stored in `localStorage` (no external DB required)

## Project Structure

```
168hours/
├── app/
│   ├── login/       — Login page
│   ├── grid/        — 168-block weekly grid
│   └── analytics/   — Analytics dashboard
├── components/
│   ├── WeeklyGrid   — Main 7×24 grid with drag-to-fill
│   ├── EditPanel    — Side panel / bottom drawer editor
│   ├── QuickFill    — Templates & sleep quick-fill
│   ├── CategoryLegend — Legend + custom category creator
│   └── Navbar       — Top navigation
└── lib/
    ├── types.ts     — TypeScript interfaces
    ├── categories.ts — Default categories & colors
    ├── storage.ts   — localStorage CRUD + week helpers
    ├── auth.ts      — Session auth
    └── utils.ts     — Stats, formatting helpers
```

## Features

- 168-block weekly grid (7 days × 24 hours)
- Click to edit a single hour (side panel / bottom drawer)
- **Drag to fill** multiple hours at once
- Quick Fill: sleep templates + professional/student templates
- Analytics: pie chart, stacked bar chart, heatmap, productivity score, insights
- Export to CSV or JSON
- Copy previous week
- Custom categories with auto-colors
- Week navigation (prev/next/today)
- Fully responsive — mobile & desktop
