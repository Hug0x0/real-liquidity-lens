import { describe, expect, it } from "vitest";
import { estimateFill, spreadBps } from "./slippage";
const levels = [{ price: "100", quantity: "1" }, { price: "101", quantity: "2" }];
describe("execution estimator", () => {
  it("walks multiple levels", () => expect(estimateFill(levels, 201, "buy").baseQuantity).toBe(2));
  it("marks insufficient liquidity", () => expect(estimateFill(levels, 1000, "buy").complete).toBe(false));
  it("measures top of book spread", () => expect(spreadBps({ buys: [{ price: "99" }], sells: [{ price: "101" }] })).toBe(200));
});
