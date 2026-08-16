This file documents legacy files and configurations that were removed during the migration from Vite/React Router to Next.js App Router.

Removed legacy files:
- src/App.tsx
- src/main.tsx
- index.html
- vite.config.ts
- package-lock.json
- src/components/layout/Layout.tsx

Removed legacy dependencies from package.json:
- react-router-dom
- @types/react-router-dom
- @vitejs/plugin-react
- vite

Updated configs:
- eslint.config.js: removed react-refresh/vite-specific config and peer Vite-specific plugin
- tailwind.config.js: removed ./index.html from content paths
- vercel.json: switched framework to next

Notes:
- Legacy React Router page components under src/pages/* remain in use by App Router wrapper pages in src/app/(public).
- API service still uses `import.meta.env.VITE_API_URL`; this should be migrated to Next.js runtime env vars if used in a production build.
