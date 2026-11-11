# Calculation methodology

Liquidity Lens simulates consuming the visible opposite side of an order-book snapshot. It does not submit orders or model future liquidity.

## Inputs and units

- **Requested notional:** the amount to execute in quote-currency units. The UI displays the market’s quote unit alongside average prices (USD when metadata is absent).
- **Price:** quote-currency units per base-asset unit.
- **Quantity:** available base-asset units at a price level.
- **Direction:** a buy consumes asks (`sells`); a sell consumes bids (`buys`).

The adapter reads price from `price_level`, falling back to `price`. Quantity is read from `quantity`, then `volume`, then `size`. These aliases are treated as equivalent base-asset quantities; an indexer with different units requires an adapter change.

Levels must already be ordered best-first: ascending asks and descending bids. The implementation does not sort them or validate the response at runtime.

## Walking the book

Start with the requested notional as the remaining amount. For each level with price `p` and quantity `q`:

```text
available notional = p × q
used notional      = min(remaining notional, available notional)
acquired or sold quantity += used notional / p
filled notional          += used notional
remaining notional       -= used notional
```

Stop when the remaining notional is at most `0.000001`, or when there are no more levels. The tolerance is expressed in quote-currency units. Calculations use JavaScript floating-point numbers.

All returned levels participate in this calculation. Only the first ten per side appear in the visual book.

## Metrics

### Average fill price

```text
average price = filled notional / filled base quantity
```

When liquidity is insufficient, this is the average price of the portion that could be filled, not the entire requested order. If no quantity is filled, the implementation returns zero.

### Slippage

The reference is the first level on the execution side, not the mid-price or last traded price.

```text
buy slippage (bps)  = (average price − best ask) / best ask × 10,000
sell slippage (bps) = (best bid − average price) / best bid × 10,000
```

One basis point is `0.01%`; 100 basis points equal `1%`. With a valid, ordered book, a worse execution price produces positive slippage.

### Spread

```text
mid-price    = (best bid + best ask) / 2
spread (bps) = (best ask − best bid) / mid-price × 10,000
```

### Fill coverage

```text
fill coverage = filled notional / requested notional
```

The UI displays `100%` when the remaining notional is within the completion tolerance. Otherwise, it displays coverage as a percentage with one decimal place. The internal field is called `utilization`; it measures requested-notional coverage, not the percentage of the entire book consumed.

## Worked example

Given asks of 1 unit at $100 and 2 units at $101, a $201 buy consumes:

| Level | Quantity consumed | Notional consumed |
| --- | ---: | ---: |
| $100 | 1 | $100 |
| $101 | 1 | $101 |
| Total | 2 | $201 |

The average is `$201 / 2 = $100.50`. Slippage is `($100.50 − $100) / $100 × 10,000 = 50 bps`. Coverage is `100%`.

A $1,000 request against the same book fills only $302, giving `30.2%` coverage and an average price of approximately $100.67 for the filled portion.

## Interpretation and edge cases

Fees, funding, latency, hidden liquidity, and subsequent order additions, cancellations, or fills are excluded.

The current implementation does not explicitly represent unavailable metrics. Empty or one-sided books can produce zeros or misleading spread values. A zero-notional request is marked complete but has zero average price; slippage is not meaningful for such a request. Invalid or non-finite prices and quantities are not filtered. Use positive notionals and valid, two-sided books for meaningful results.

Depth-fetch failures generate synthetic data and switch the header to “Demo data.” See [Architecture](ARCHITECTURE.md) for the fallback behavior.
