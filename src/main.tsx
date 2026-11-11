import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { RealIndexer } from "./api";
import { marketFormat } from "./format";
import { DepthChart } from "./DepthChart";
import { demoDepth, demoMarkets } from "./mock";
import { estimateFill, spreadBps } from "./slippage";
import type { Market, MarketDepth, Side } from "./types";
import "./styles.css";

const REFRESH_MS = 15_000;
const clock = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

function App() {
  const api = useMemo(() => new RealIndexer(), []);
  const [markets, setMarkets] = useState<Market[]>([]); const [marketId, setMarketId] = useState("");
  const [depth, setDepth] = useState<MarketDepth>(); const [notional, setNotional] = useState(10_000); const [side, setSide] = useState<Side>("buy"); const [demo, setDemo] = useState(false); const [depthLive, setDepthLive] = useState(false); const [updatedAt, setUpdatedAt] = useState<number>();
  const selectedMarket = markets.find((market) => market.id === marketId);
  const format = marketFormat(selectedMarket);
  useEffect(() => { api.markets().then((data) => { setMarkets(data); setMarketId(data[0]?.id || ""); }).catch(() => { setMarkets(demoMarkets); setMarketId("btc"); setDemo(true); }); }, [api]);
  useEffect(() => {
    if (!marketId) return;
    let active = true;
    const market = markets.find((item) => item.id === marketId);
    const { priceDecimals, sizeDecimals } = marketFormat(market);
    const load = () => api.depth(marketId)
      .then((snapshot) => { if (active) { setDepth(snapshot); setDepthLive(true); setUpdatedAt(Date.now()); } })
      .catch(() => { if (active) { setDepth(demoDepth(marketId, Number(market?.price || 68120), priceDecimals, sizeDecimals)); setDepthLive(false); setUpdatedAt(Date.now()); } });
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => { active = false; window.clearInterval(timer); };
  }, [api, marketId, markets]);
  const levels = side === "buy" ? depth?.sells : depth?.buys; const estimate = levels ? estimateFill(levels, notional, side) : undefined;
  return <><a className="skip-link" href="#main-content">Skip to content</a><main id="main-content"><header><div><span className="eyebrow">REAL EXECUTION INTELLIGENCE</span><h1>Liquidity<br/>Lens</h1></div><p>Inspect the book. Price the trade.<br/><b aria-live="polite">{!updatedAt ? "Connecting…" : demo || !depthLive ? "Demo data" : "Live indexer"}</b>{updatedAt && <><br/><span className="updated">Updated {clock.format(updatedAt)} · refreshes every {REFRESH_MS / 1000}s</span></>}</p></header>
    <section className="panel controls"><label>Market<select value={marketId} onChange={(e) => setMarketId(e.target.value)}>{markets.map((market) => <option key={market.id} value={market.id}>{market.symbol}</option>)}</select></label><label>Direction<select value={side} onChange={(e) => setSide(e.target.value as Side)}><option value="buy">Buy</option><option value="sell">Sell</option></select></label><label>Order notional ({format.quote})<input type="number" value={notional} min="0" step="100" onChange={(e) => setNotional(Number(e.target.value))}/></label></section>
    {depth && estimate && <><section className="metrics"><article><small>Spread</small><strong>{spreadBps(depth).toFixed(2)} bps</strong></article><article><small>Average fill</small><strong>{format.price.format(estimate.averagePrice)} {format.quote}</strong></article><article><small>Slippage</small><strong>{estimate.slippageBps.toFixed(2)} bps</strong></article><article><small>Fill</small><strong>{estimate.complete ? "100%" : `${(estimate.utilization * 100).toFixed(1)}%`}</strong></article></section><section className="panel"><DepthChart depth={depth} market={selectedMarket}/></section></>}
  </main></>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
