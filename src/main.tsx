import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { RealIndexer } from "./api";
import { marketFormat } from "./format";
import { DepthChart } from "./DepthChart";
import { demoDepth, demoMarkets } from "./mock";
import { estimateFill, spreadBps } from "./slippage";
import type { Market, MarketDepth, Side } from "./types";
import "./styles.css";

function App() {
  const api = useMemo(() => new RealIndexer(), []);
  const [markets, setMarkets] = useState<Market[]>([]); const [marketId, setMarketId] = useState("");
  const [depth, setDepth] = useState<MarketDepth>(); const [notional, setNotional] = useState(10_000); const [side, setSide] = useState<Side>("buy"); const [demo, setDemo] = useState(false);
  const selectedMarket = markets.find((market) => market.id === marketId);
  const format = marketFormat(selectedMarket);
  useEffect(() => { api.markets().then((data) => { setMarkets(data); setMarketId(data[0]?.id || ""); }).catch(() => { setMarkets(demoMarkets); setMarketId("btc"); setDemo(true); }); }, [api]);
  useEffect(() => {
    if (!marketId) return;
    const market = markets.find((item) => item.id === marketId);
    const { priceDecimals, sizeDecimals } = marketFormat(market);
    api.depth(marketId).then(setDepth).catch(() => setDepth(demoDepth(marketId, Number(market?.price || 68120), priceDecimals, sizeDecimals)));
  }, [api, marketId, markets]);
  const levels = side === "buy" ? depth?.sells : depth?.buys; const estimate = levels ? estimateFill(levels, notional, side) : undefined;
  return <><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content"><header><div><span className="eyebrow">REAL EXECUTION INTELLIGENCE</span><h1>Liquidity<br/>Lens</h1></div><p>Inspect the book. Price the trade.<br/><b aria-live="polite">{demo ? "Demo data" : "Live indexer"}</b></p></header>
    <section className="panel controls"><label>Market<select value={marketId} onChange={(e) => setMarketId(e.target.value)}>{markets.map((market) => <option key={market.id} value={market.id}>{market.symbol}</option>)}</select></label><label>Direction<select value={side} onChange={(e) => setSide(e.target.value as Side)}><option value="buy">Buy</option><option value="sell">Sell</option></select></label><label>Order notional ({format.quote})<input type="number" value={notional} min="0" step="100" onChange={(e) => setNotional(Number(e.target.value))}/></label></section>
    {depth && estimate && <><section className="metrics"><article><small>Spread</small><strong>{spreadBps(depth).toFixed(2)} bps</strong></article><article><small>Average fill</small><strong>{format.price.format(estimate.averagePrice)} {format.quote}</strong></article><article><small>Slippage</small><strong>{estimate.slippageBps.toFixed(2)} bps</strong></article><article><small>Fill</small><strong>{estimate.complete ? "100%" : `${(estimate.utilization * 100).toFixed(1)}%`}</strong></article></section><section className="panel"><DepthChart depth={depth} market={selectedMarket}/></section></>}
  </main></>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
