// All numbers shown in the UI flow through these functions.
// Nothing here is hardcoded against the specific sample data —
// swap in a different trade list and the whole dashboard updates.

/**
 * Core trading performance stats: P&L, win rate, biggest win/loss, etc.
 */
export function getTradeStats(trades) {
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)

  const winners = trades.filter((t) => t.pnl > 0)
  const losers = trades.filter((t) => t.pnl < 0)

  const winRate = trades.length > 0 ? (winners.length / trades.length) * 100 : 0

  const largestWin = winners.length > 0 ? Math.max(...winners.map((t) => t.pnl)) : 0
  const largestLoss = losers.length > 0 ? Math.min(...losers.map((t) => t.pnl)) : 0

  return {
    totalPnl,
    totalTrades: trades.length,
    winningTrades: winners.length,
    losingTrades: losers.length,
    winRate,
    largestWin,
    largestLoss,
  }
}

/**
 * Balance after each trade, starting from the account's starting balance.
 * Point 0 is the starting balance itself, so the curve always has
 * tradeCount + 1 points. This also powers the drawdown calculation below,
 * since drawdown is measured from the account's peak balance, not just
 * the starting balance.
 */
export function getEquityCurve(account, trades) {
  const curve = [{ label: 'Start', balance: account.startingBalance }]
  let running = account.startingBalance

  trades.forEach((t, i) => {
    running += t.pnl
    curve.push({ label: t.symbol + ' #' + (i + 1), balance: running, trade: t })
  })

  return curve
}

/**
 * Drawdown is measured from the account's highest-ever balance (the
 * "high-water mark"), which is how prop-firm style rules actually work —
 * not just starting balance minus current balance.
 */
export function getDrawdown(account, trades) {
  const curve = getEquityCurve(account, trades)
  const peakBalance = Math.max(...curve.map((p) => p.balance))
  const currentBalance = curve[curve.length - 1].balance

  const currentDrawdown = Math.max(0, peakBalance - currentBalance)
  const remainingDrawdown = Math.max(0, account.maxDrawdown - currentDrawdown)
  const drawdownPct = account.maxDrawdown > 0 ? (currentDrawdown / account.maxDrawdown) * 100 : 0

  return { peakBalance, currentBalance, currentDrawdown, remainingDrawdown, drawdownPct }
}

/**
 * Daily loss is tracked separately from overall drawdown: a trader could
 * be up overall for the account but still blow the daily limit in one
 * bad session. Since the sample data has no timestamps, every trade is
 * treated as happening "today" (documented in the README).
 */
export function getDailyLoss(account, trades) {
  const dailyPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
  const currentDayLoss = dailyPnl < 0 ? Math.abs(dailyPnl) : 0
  const remainingDailyLoss = Math.max(0, account.dailyLossLimit - currentDayLoss)
  const dailyLossPct = account.dailyLossLimit > 0 ? (currentDayLoss / account.dailyLossLimit) * 100 : 0

  return { currentDayLoss, remainingDailyLoss, dailyLossPct }
}

/**
 * Combines drawdown and daily-loss usage into a single, plain-language
 * risk status. Whichever rule the trader is closest to breaching decides
 * the overall status — a trader should never feel "safe" just because
 * one of the two numbers looks fine.
 */
export function getRiskStatus(drawdownPct, dailyLossPct) {
  const worst = Math.max(drawdownPct, dailyLossPct)

  if (worst >= 80) {
    return { level: 'at-risk', label: 'At Risk' }
  }
  if (worst >= 50) {
    return { level: 'approaching', label: 'Approaching Limit' }
  }
  return { level: 'safe', label: 'Safe' }
}

export function formatCurrency(value) {
  const sign = value < 0 ? '-' : ''
  return sign + '$' + Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function formatPercent(value) {
  return value.toFixed(1) + '%'
}
