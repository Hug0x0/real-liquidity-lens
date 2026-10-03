# Methodology

The estimator walks the visible opposite side of the order book until the requested quote notional is filled. It reports volume-weighted average execution price, distance from the best visible price in basis points, and whether sufficient displayed liquidity exists.

Results are snapshots. Orders can move, cancel, or fill before execution, so estimates are informational rather than execution guarantees.
