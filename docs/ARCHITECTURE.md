# Architecture

## Overview

The application is a client-side React and TypeScript dashboard built with Vite. There is no application backend, database, authentication layer, wallet integration, or transaction submission path.

```text
Browser
  └─ App: market, direction, notional, depth, and demo state
       ├─ RealIndexer → configured HTTP indexer
       ├─ Synthetic fallback data on request failure
       ├─ estimateFill / spreadBps → metric cards
       └─ DepthChart → bid and ask price-level bars
```

## Source map

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | Application state, fetching effects, controls, and metric cards |
| `src/api.ts` | Indexer URL configuration, HTTP requests, and response unwrapping |
| `src/slippage.ts` | Price extraction, execution simulation, and spread calculation |
| `src/DepthChart.tsx` | The first ten levels per side with relative quantity bars |
| `src/types.ts` | Compile-time market, depth, and estimate types |
| `src/mock.ts` | BTC/ETH/HYPE/SOL/XRP/XAUT demo markets and synthetic depth generation |
| `src/styles.css` | Layout, responsive styles, focus states, and skip-link styling |
| `src/slippage.test.ts` | Unit tests for the estimator and spread |
| `index.html` | HTML shell, metadata, and Google Fonts requests |
| `.github/workflows/ci.yml` | Dependency installation, tests, and production build |

## API expectations

These are the expectations of the current client implementation, not a guarantee about any external API's availability or schema.

The base URL defaults to `https://indexer.api.real.xyz` and can be replaced through `VITE_REAL_API_URL`.

| Request | Purpose |
| --- | --- |
| `GET /api/v1/markets?p[s]=100` | Retrieve the first page of markets |
| `GET /api/v1/markets/{encodedMarketId}/depth` | Retrieve a market's depth snapshot |

Market discovery accepts either an array of markets or an object with a `data` array. The shared request helper unwraps a truthy, non-array `data` property, allowing a depth object to be returned directly or inside an object wrapper.

A market contains `id`, `symbol`, and `price`. A depth snapshot contains `market_id`, `buys`, `sells`, and `updated_at_ms`. Price-level fields are numeric strings; supported aliases are described in [Methodology](METHODOLOGY.md).

TypeScript types do not validate incoming JSON. The client checks HTTP success but does not enforce the payload schema.

## Data lifecycle

On mount, the application requests markets and selects the first returned entry. It requests depth when the selected market or market-list state changes. Changing direction or notional recalculates the estimate locally without requesting a fresh snapshot.

There is no polling, streaming, request cancellation, or protection against responses arriving out of order. The API timestamp is not displayed. An empty market list leaves no market selected and no metrics rendered.

## Fallback behavior

- If market discovery fails, the app selects synthetic BTC-USDT, ETH-USDT, HYPE-USDT, SOL-USDT, XRP-USDT, and XAUT-USDT markets and sets the header to “Demo data.”
- A depth request is still attempted for the selected market.
- If a depth request fails, the app generates twelve synthetic levels per side around the selected market's price, using $68,120 when that price is unavailable or falsy.
- A depth failure does not update the demo flag. Synthetic depth can therefore appear under “Live indexer.”

The flag describes the market-discovery fallback state, not independently verified provenance of every displayed depth snapshot. Correcting this is a useful follow-up before relying on the dashboard for live analysis.

## Rendering and build

The book is a pair of price-level lists with quantity bars, not a cumulative depth curve. Bar widths use the maximum quantity across all returned levels as their scale.

The development entry point renders React in Strict Mode. In development, its effect checks may cause duplicate initial requests.

`npm run build` runs TypeScript checks and Vite bundling into `dist/`. `VITE_` configuration is embedded at build time. Google Fonts are loaded externally by the HTML document.
