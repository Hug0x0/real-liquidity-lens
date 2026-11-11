import type { Market, MarketDepth } from "./types";

// Illustrative prices only; these fixtures are not live market quotes.
export const demoMarkets: Market[] = [
  { id: "btc", symbol: "BTC-USDT", price: "68120", quote_unit: "USDT", order_rules: { price_decimal_places: "1", size_decimal_places: "4" } },
  { id: "eth", symbol: "ETH-USDT", price: "3545", quote_unit: "USDT", order_rules: { price_decimal_places: "2", size_decimal_places: "3" } },
  { id: "hype", symbol: "HYPE-USDT", price: "75", quote_unit: "USDT", order_rules: { price_decimal_places: "3", size_decimal_places: "2" } },
  { id: "sol", symbol: "SOL-USDT", price: "100", quote_unit: "USDT", order_rules: { price_decimal_places: "3", size_decimal_places: "2" } },
  { id: "xrp", symbol: "XRP-USDT", price: "1.25", quote_unit: "USDT", order_rules: { price_decimal_places: "5", size_decimal_places: "0" } },
  { id: "xaut", symbol: "XAUT-USDT", price: "3900", quote_unit: "USDT", order_rules: { price_decimal_places: "2", size_decimal_places: "3" } },
];
const levels = (start: number, direction: number, priceDecimals: number, sizeDecimals: number) => Array.from({ length: 12 }, (_, index) => ({ price: (start + direction * index * start * .00025).toFixed(priceDecimals), quantity: Math.max(10 ** -sizeDecimals, 0.3 + index * .11).toFixed(sizeDecimals) }));
export const demoDepth = (marketId: string, price = 68120, priceDecimals = 2, sizeDecimals = 3): MarketDepth => ({ market_id: marketId, buys: levels(price * .9999, -1, priceDecimals, sizeDecimals), sells: levels(price * 1.0001, 1, priceDecimals, sizeDecimals), updated_at_ms: Date.now() });
