import { describe, expect, it } from "vitest";
import { decimalPlaces, marketFormat } from "./format";
import { demoDepth, demoMarkets } from "./mock";

describe("market formatting", () => {
  it.each(["HYPE-USDT", "SOL-USDT"])("preserves mill precision for %s", (symbol) => {
    const format = marketFormat(demoMarkets.find((market) => market.symbol === symbol));
    expect(format.price.format(76.712)).toBe("76.712");
    expect(format.price.format(76.710)).toBe("76.710");
    expect(format.quote).toBe("USDT");
  });
  it("preserves XRP price ticks and whole-unit quantities", () => {
    const market = demoMarkets.find((item) => item.symbol === "XRP-USDT")!;
    const format = marketFormat(market);
    expect(format.price.format(1.24751)).toBe("1.24751");
    expect(format.quantity.format(125)).toBe("125");
    const depth = demoDepth(market.id, Number(market.price), format.priceDecimals, format.sizeDecimals);
    for (const level of [...depth.buys, ...depth.sells]) {
      expect(Number(level.quantity)).toBeGreaterThan(0);
      expect(Number.isInteger(Number(level.quantity))).toBe(true);
    }
  });
  it("formats XAUT with two price decimals", () => {
    const format = marketFormat(demoMarkets.find((market) => market.symbol === "XAUT-USDT"));
    expect(format.price.format(3877.54)).toBe("3,877.54");
    expect(format.quantity.format(0.001)).toBe("0.001");
  });
  it("preserves BTC quantities smaller than 0.001", () => {
    expect(marketFormat(demoMarkets[0]).quantity.format(0.0001)).toBe("0.0001");
  });
  it.each([undefined, "", " ", "invalid", "-1", "2.5", "21"])("falls back for invalid precision %s", (value) => {
    expect(decimalPlaces(value, 2)).toBe(2);
  });
  it("supports metadata-free markets", () => {
    const format = marketFormat();
    expect(format.price.format(100.5)).toBe("100.50");
    expect(format.quote).toBe("USD");
  });
});
