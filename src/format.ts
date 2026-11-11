import type { Market } from "./types";

export function decimalPlaces(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 20 ? parsed : fallback;
}

export function marketFormat(market?: Market) {
  const priceDecimals = decimalPlaces(market?.order_rules?.price_decimal_places, 2);
  const sizeDecimals = decimalPlaces(market?.order_rules?.size_decimal_places, 3);
  const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: priceDecimals, maximumFractionDigits: priceDecimals });
  const quantity = new Intl.NumberFormat("en-US", { minimumFractionDigits: sizeDecimals, maximumFractionDigits: sizeDecimals });
  const quote = market?.quote_unit || "USD";
  return { price, quantity, quote, priceDecimals, sizeDecimals };
}
