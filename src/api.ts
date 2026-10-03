import type { ApiList, Market, MarketDepth } from "./types";

export class RealIndexer {
  constructor(private readonly baseUrl = import.meta.env.VITE_REAL_API_URL || "https://indexer.api.real.xyz") {}
  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) throw new Error(`REAL API returned ${response.status}`);
    const body = await response.json();
    return (body.data && !Array.isArray(body.data) ? body.data : body) as T;
  }
  async markets(): Promise<Market[]> {
    const response = await this.get<ApiList<Market> | Market[]>("/api/v1/markets?limit=100");
    return Array.isArray(response) ? response : response.data;
  }
  depth(marketId: string): Promise<MarketDepth> {
    return this.get(`/api/v1/markets/${encodeURIComponent(marketId)}/depth`);
  }
}
