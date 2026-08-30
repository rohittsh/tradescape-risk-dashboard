# Tradescape — Trader Risk Dashboard

A dashboard that lets an evaluation trader answer one question at a glance:
**"Am I in danger of violating my account rules?"**

## How to run it

```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production / deployment:

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

Stack: React + Vite + Tailwind CSS. No backend, no auth, no database —
mock data lives in `src/data/trades.js`.

## What I built

- **Account summary** — starting balance, current balance, total P&L, and
  the account's rules (max drawdown, daily loss limit).
- **Trading performance** — win rate, winning/losing trade counts, largest
  win, largest loss. All calculated in `src/utils/calculations.js`, never
  hardcoded — swap the trade list and every number updates.
- **Risk status panel** — the main feature. Two bars show how much of the
  drawdown allowance and daily loss allowance have been used, plus a single
  **Safe / Approaching Limit / At Risk** badge. The badge is driven by
  whichever rule the trader is closest to breaching, not an average of the
  two — a trader shouldn't feel safe because one number looks fine while
  the other is nearly blown.
- **Trades table** — the raw trade log for reference.

### Project structure

```
src/
  data/trades.js          mock account + trade data (the only hardcoded numbers)
  utils/calculations.js   all derived math: P&L, drawdown, daily loss, risk status
  components/              AccountSummary, RiskGauge, StatsGrid, TradesTable, EquityCurve
  App.jsx                  wires data -> calculations -> components
```

### A note on "daily" loss

The brief didn't include trade timestamps, so there's no way to know which
trades happened on which day. I treated all five trades as happening in the
current trading day (documented in `src/data/trades.js`) and calculated
daily loss as the net P&L for the day, when negative. In a real system with
timestamps, this would filter trades to `today` before summing.

Drawdown is calculated from the account's **peak balance** (the
high-water mark across the equity curve), not just starting balance minus
current balance — that's how prop-firm-style drawdown rules actually work,
and it matters once a trader has been up and then pulled back.

## My additional feature: Equity Curve

I added an **equity curve** — a chart of account balance after each trade,
starting from the starting balance.

Why this one: the risk panel tells a trader *how close* they are to a
limit, but not *how they got there*. A trader who's down $2,000 after five
choppy trades and a trader who's down $2,000 after one bad trade are in
very different situations, even though their current numbers match. The
equity curve makes the shape of that visible — is the account trending
up with one setback, or grinding down? — which is exactly the kind of
context a trader needs before deciding whether to keep trading today. It
also happens to be the same data structure the drawdown calculation needs
(the peak balance), so it reinforces rather than duplicates the risk logic.

## Product questions

**1. What is drawdown in trading?**

Drawdown is the drop from an account's highest balance it has reached (its
peak, or "high-water mark") down to its current balance. It's usually
expressed in dollars or as a percentage. It's a measure of how far the
account has pulled back from its best point — not just whether the trader
is up or down from where they started.

**2. Why would a trader care about remaining drawdown rather than just their current P&L?**

P&L tells you whether you're up or down overall, but it doesn't tell you
how much room you have left before you breach a rule and fail the
evaluation. A trader could be up on P&L for the account but still be
sitting close to their drawdown limit if they were up much more at some
point and have since given a lot of it back. Remaining drawdown answers
the actually urgent question — "how much more can I lose before I'm out"
— which is what should drive position sizing and risk-taking decisions in
the moment, not the P&L number by itself.

**3. If I had another day, what would I improve?**

- Add real dates/timestamps to trades so "daily" loss is computed by
  actually grouping trades by calendar day, instead of assuming a single
  day.
- Let the trader filter the trade log and equity curve by symbol or date
  range.
- Add a "performance by asset" breakdown (BTC vs ETH vs SOL), since the
  current data already has enough trades to make that useful.
- Persist state (e.g. localStorage or a small backend) so the dashboard
  reflects live trades instead of a static mock array.
- Add basic tests around the calculation functions, since those are the
  part most worth protecting from regressions.
- Accessibility pass: keyboard focus states, ARIA labels on the risk
  status badge, and making sure the equity curve has a text alternative
  for screen readers.

## Contact

Built for the Tradescape Full Stack Developer Assignment.
