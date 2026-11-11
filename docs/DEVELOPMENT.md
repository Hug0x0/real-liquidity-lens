# Development guide

## Local setup

Use Node.js 24 (pinned in `.nvmrc`) and npm. From the repository root:

```bash
npm ci
npm run dev
```

Follow the URL printed by Vite. To bind explicitly to the local machine:

```bash
npm run dev -- --host 127.0.0.1
```

Optional API configuration is documented in the [README](../README.md#configuration). Restart Vite after changing `.env`.

## Verification

```bash
npm test
npm run build
```

The existing Vitest suite checks walking multiple price levels, insufficient liquidity, and top-of-book spread. It does not currently cover browser interactions or integration with the external indexer. The build type-checks application source; test files are excluded from that TypeScript configuration.

GitHub Actions runs `npm ci`, `npm test`, and `npm run build` on pushes and pull requests using the Node.js version from `.nvmrc`. There is no dedicated lint script.

For a manual check, open the app, select a market, switch between Buy and Sell, and vary the notional. Check the metrics and both sides of the book at desktop and narrow viewport widths. Use the browser network panel to confirm whether the indexer requests succeeded; the current live/demo label alone is insufficient.

## Production build

```bash
npm run build
npx vite preview
```

The output in `dist/` can be served by a static host. Vite preview is for local inspection. Build with the intended `VITE_REAL_API_URL`; changing server environment variables after the build does not update the compiled client.

The repository does not currently configure automatic deployment or a public demo URL. Ensure the indexer accepts requests from the deployed origin and use HTTPS for its URL when serving the app over HTTPS.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Vite uses a different port | Another process occupies the default port; use the printed URL |
| “Demo data” appears | The market-list request failed; check connectivity, HTTP status, and CORS |
| Book appears despite a failed depth request | The app generated synthetic fallback levels |
| Metrics stop updating | Depth refreshes every 15 seconds; check the browser console for failed requests |
| Market selector is empty | An empty successful market response does not trigger demo fallback |
| Unexpected prices or quantities | Confirm schema, units, valid numeric fields, and best-first level ordering |

## Before public release

- Retain the MIT license file and any required third-party notices when distributing the project.
- Review tracked files and Git history for credentials or private material.
- Verify the indexer's current response schema and browser access from the intended deployment origin.
- Resolve the misleading live/demo label and define how data freshness is communicated.
- Run the test suite, production build, and a browser smoke check.

The current repository ignores `.env`; all `VITE_` values are still public once bundled. Never use them for credentials.
