import type { MarketDepth, PriceLevel } from "./types";
const quantity = (level: PriceLevel) => Number(level.quantity ?? level.volume ?? level.size ?? 0);

export function DepthChart({ depth }: { depth: MarketDepth }) {
  const max = Math.max(...[...depth.buys, ...depth.sells].map(quantity), 1);
  return <div className="book"><div><h3>Bids</h3>{depth.buys.slice(0, 10).map((level) => <div className="level bid" key={level.price}><span style={{ width: `${quantity(level) / max * 100}%` }} /><b>{level.price}</b><em>{quantity(level).toFixed(3)}</em></div>)}</div><div><h3>Asks</h3>{depth.sells.slice(0, 10).map((level) => <div className="level ask" key={level.price}><span style={{ width: `${quantity(level) / max * 100}%` }} /><b>{level.price}</b><em>{quantity(level).toFixed(3)}</em></div>)}</div></div>;
}
