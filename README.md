<div align="center">

# REAL Liquidity Lens

**Inspect the book. Price the trade.**

A lightweight, read-only dashboard for exploring REAL perpetual order books and estimating execution slippage.

[![CI](https://github.com/Hug0x0/real-liquidity-lens/actions/workflows/ci.yml/badge.svg)](https://github.com/Hug0x0/real-liquidity-lens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-dev%20%26%20build-646CFF?logo=vite&logoColor=white)

[Quick start](#quick-start) · [How it works](#how-it-works) · [Documentation](#documentation) · [Contributing](CONTRIBUTING.md)

</div>

---

## Overview

The best quoted price only tells part of the story. Larger orders may consume liquidity across several price levels, changing the average execution price.

Liquidity Lens lets you select a market, choose **Buy** or **Sell**, and enter an order notional to explore that effect against the visible order book. It does not connect a wallet, sign transactions, or submit trades.

## Features

| Feature | What you see |
| --- | --- |
| Market selection | Markets returned by the configured REAL indexer |
| Order-book depth | The first ten bid and ask levels, with price, quantity, and relative size bars |
| Spread | The gap between the best bid and ask, in basis points |
| Average fill | The quantity-weighted average price of a simulated execution |
| Slippage | The difference between the simulated average price and the best available price on the execution side |
| Fill coverage | The percentage of the requested notional covered by returned liquidity |
| Demo fallback | Synthetic depth when a request fails; BTC-USDT, ETH-USDT, HYPE-USDT, SOL-USDT, XRP-USDT, and XAUT-USDT when market discovery fails |

## Quick start

Use **Node.js 24** (pinned in `.nvmrc` and used by CI) and npm.

```bash
git clone https://github.com/Hug0x0/real-liquidity-lens.git
cd real-liquidity-lens
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. If that port is occupied, Vite selects another one.

### Configuration

By default, the app requests data from `https://indexer.api.real.xyz`. To use another compatible indexer:

```bash
cp .env.example .env
```

Set the URL in `.env`, then restart the development server:

```dotenv
VITE_REAL_API_URL=https://indexer.api.real.xyz
```

Use a base URL without a trailing slash. All `VITE_` variables are included in the browser application: do not put secrets in them. Requests go directly from the browser to the indexer, which must allow the application's origin through CORS.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Vitest test suite once |
| `npm run build` | Type-check application code and create a production build in `dist/` |
| `npx vite preview` | Preview an existing production build locally |

## How it works

1. Load the market list and select its first market.
2. Fetch a depth snapshot for the selected market.
3. For a buy, walk the asks; for a sell, walk the bids.
4. Consume each returned price level until the requested notional is covered or liquidity runs out.
5. Display the estimated average price, slippage, fill coverage, and spread.

**Example:** buying $201 against asks of 1 unit at $100 and 2 units at $101 consumes 1 unit at each price. The estimated average is **$100.50**, with **50 bps (0.50%)** of slippage relative to the $100 best ask and **100%** fill coverage.

The estimate uses all returned levels, even though the visual book shows only the first ten on each side. See the [calculation methodology](docs/METHODOLOGY.md) for formulas and assumptions.

## Current limitations

This is an early prototype. Treat estimates as a view of displayed liquidity, not a promise of execution.

- **Polling, not streaming:** the selected market's depth is refreshed every 15 seconds; there is no WebSocket subscription. The header shows the time of the last snapshot.
- **Fallback labeling:** failed requests use synthetic data. The header shows “Live indexer” only when both market discovery and the latest depth request succeeded; otherwise it shows “Demo data.”
- **Incomplete execution costs:** estimates exclude fees, funding, latency, and changes to the book before execution.
- **API assumptions:** levels are consumed in their returned order, with no sorting or runtime schema validation. The estimator expects valid, positive prices and nonnegative base-asset quantities.
- **Market coverage:** market discovery makes one request with a page size of 100; additional pages are not fetched.
- **Display conventions:** prices and sizes use the market's `order_rules` decimal places and `quote_unit`, falling back to two price decimals, three size decimals, and USD when metadata is absent.

## Documentation

- [Methodology](docs/METHODOLOGY.md) — calculations, units, and edge cases
- [Architecture](docs/ARCHITECTURE.md) — components, data flow, and API expectations
- [Development](docs/DEVELOPMENT.md) — setup, verification, deployment, and troubleshooting
- [Contributing](CONTRIBUTING.md) — focused changes and review expectations

## Project status and licensing

Licensed under the [MIT License](LICENSE). You may use, modify, and redistribute this software, including commercially, provided you retain the copyright and permission notices. The software is provided without warranty.

Third-party dependencies remain subject to their respective licenses.

Community-built. Not affiliated with or endorsed by Real Markets.
