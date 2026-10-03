import type { Market, MarketDepth } from "./types";
export const demoMarkets: Market[] = [{ id: "btc", symbol: "BTC-PERP", price: "68120" }, { id: "eth", symbol: "ETH-PERP", price: "3545" }];
const levels = (start: number, direction: number) => Array.from({ length: 12 }, (_, index) => ({ price: (start + direction * index * start * .00025).toFixed(2), quantity: (0.3 + index * .11).toFixed(3) }));
export const demoDepth = (marketId: string, price = 68120): MarketDepth => ({ market_id: marketId, buys: levels(price * .9999, -1), sells: levels(price * 1.0001, 1), updated_at_ms: Date.now() });
