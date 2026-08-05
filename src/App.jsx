import { account, trades } from './data/trades'
import {
  getTradeStats,
  getEquityCurve,
  getDrawdown,
  getDailyLoss,
  getRiskStatus,
} from './utils/calculations'

import AccountSummary from './components/AccountSummary'
import RiskGauge from './components/RiskGauge'
import StatsGrid from './components/StatsGrid'
import TradesTable from './components/TradesTable'
import EquityCurve from './components/EquityCurve'

export default function App() {
  const stats = getTradeStats(trades)
  const equityCurve = getEquityCurve(account, trades)
  const drawdown = getDrawdown(account, trades)
  const dailyLoss = getDailyLoss(account, trades)
  const riskStatus = getRiskStatus(drawdown.drawdownPct, dailyLoss.dailyLossPct)

  return (
    <div className="min-h-screen bg-base text-ink font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
              Tradescape
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Trader Risk Dashboard
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <AccountSummary
            account={account}
            currentBalance={drawdown.currentBalance}
            totalPnl={stats.totalPnl}
          />
          <div className="lg:col-span-2">
            <RiskGauge drawdown={drawdown} dailyLoss={dailyLoss} status={riskStatus} />
          </div>
        </div>

        <section className="mb-5">
          <h2 className="font-display text-sm font-semibold text-ink tracking-wide uppercase mb-3">
            Trading Performance
          </h2>
          <StatsGrid stats={stats} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <EquityCurve curve={equityCurve} account={account} />
          <TradesTable trades={trades} />
        </div>

        <footer className="mt-10 pt-5 border-t border-line">
          <p className="text-xs text-muted font-body">
            Mock data · Built for the Tradescape Full Stack Developer Assignment
          </p>
        </footer>
      </div>
    </div>
  )
}
