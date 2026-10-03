export type PriceLevel = { price_level?: string; price?: string; quantity?: string; volume?: string; size?: string };
export type MarketDepth = { market_id: string; buys: PriceLevel[]; sells: PriceLevel[]; updated_at_ms: number };
export type Market = { id: string; symbol: string; price: string };
export type ApiList<T> = { data: T[] };
export type Side = "buy" | "sell";
export type Estimate = { requestedNotional: number; filledNotional: number; baseQuantity: number; averagePrice: number; slippageBps: number; utilization: number; complete: boolean };
