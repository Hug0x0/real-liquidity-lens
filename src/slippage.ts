import type { Estimate, PriceLevel, Side } from "./types";

const sizeOf = (level: PriceLevel) => Number(level.quantity ?? level.volume ?? level.size ?? 0);

export function estimateFill(levels: PriceLevel[], requestedNotional: number, side: Side): Estimate {
  let remaining = requestedNotional;
  let baseQuantity = 0;
  let filledNotional = 0;
  for (const level of levels) {
    const price = Number(level.price);
    const availableNotional = price * sizeOf(level);
    const used = Math.min(remaining, availableNotional);
    baseQuantity += used / price;
    filledNotional += used;
    remaining -= used;
    if (remaining <= 0.000001) break;
  }
  const averagePrice = baseQuantity ? filledNotional / baseQuantity : 0;
  const best = Number(levels[0]?.price || 0);
  const rawBps = best ? ((averagePrice - best) / best) * 10_000 : 0;
  return { requestedNotional, filledNotional, baseQuantity, averagePrice, slippageBps: side === "sell" ? -rawBps : rawBps, utilization: requestedNotional ? filledNotional / requestedNotional : 0, complete: remaining <= 0.000001 };
}

export function spreadBps(depth: { buys: PriceLevel[]; sells: PriceLevel[] }): number {
  const bid = Number(depth.buys[0]?.price || 0);
  const ask = Number(depth.sells[0]?.price || 0);
  const mid = (bid + ask) / 2;
  return mid ? ((ask - bid) / mid) * 10_000 : 0;
}
