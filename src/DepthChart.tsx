import type { Market, MarketDepth, PriceLevel } from "./types";
import { marketFormat } from "./format";
import { priceOf } from "./slippage";
const quantity = (level: PriceLevel) => Number(level.quantity ?? level.volume ?? level.size ?? 0);

export function DepthChart({ depth, market }: { depth: MarketDepth; market?: Market }) {
  const format = marketFormat(market);
  const max = Math.max(...[...depth.buys, ...depth.sells].map(quantity), 1);
  return <div className="book"><div><h3>Bids</h3>{depth.buys.slice(0, 10).map((level) => <div className="level bid" key={priceOf(level)}><span style={{ width: `${quantity(level) / max * 100}%` }} /><b>{format.price.format(priceOf(level))}</b><em>{format.quantity.format(quantity(level))}</em></div>)}</div><div><h3>Asks</h3>{depth.sells.slice(0, 10).map((level) => <div className="level ask" key={priceOf(level)}><span style={{ width: `${quantity(level) / max * 100}%` }} /><b>{format.price.format(priceOf(level))}</b><em>{format.quantity.format(quantity(level))}</em></div>)}</div></div>;
}
