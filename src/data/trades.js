// Mock data for the evaluation account.
// Every other number in the dashboard is DERIVED from this data —
// nothing downstream is hardcoded.

export const account = {
  traderName: 'Alex Rivera',
  accountId: 'EVAL-10428',
  startingBalance: 100000,
  maxDrawdown: 10000, // max allowed drawdown from peak balance
  dailyLossLimit: 5000, // max allowed loss within a single trading day
}

// No timestamps were provided in the brief, so all five trades are
// treated as having happened during the current trading day. This
// assumption is called out explicitly in the README.
export const trades = [
  { id: 1, symbol: 'BTC', direction: 'Long', pnl: 1200 },
  { id: 2, symbol: 'ETH', direction: 'Short', pnl: -450 },
  { id: 3, symbol: 'BTC', direction: 'Short', pnl: 800 },
  { id: 4, symbol: 'SOL', direction: 'Long', pnl: -300 },
  { id: 5, symbol: 'ETH', direction: 'Long', pnl: 2000 },
]
