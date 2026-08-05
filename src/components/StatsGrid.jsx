import { formatCurrency, formatPercent } from '../utils/calculations'

function StatCard({ label, value, valueClass = 'text-ink' }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4">
      <p className="text-xs text-muted font-body uppercase tracking-wide mb-2">{label}</p>
      <p className={`font-mono text-xl tabular font-semibold ${valueClass}`}>{value}</p>
    </div>
  )
}

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total P&L"
        value={formatCurrency(stats.totalPnl)}
        valueClass={stats.totalPnl >= 0 ? 'text-safe' : 'text-risk'}
      />
      <StatCard label="Win rate" value={formatPercent(stats.winRate)} />
      <StatCard label="Winning trades" value={stats.winningTrades} valueClass="text-safe" />
      <StatCard label="Losing trades" value={stats.losingTrades} valueClass="text-risk" />
      <StatCard
        label="Largest win"
        value={stats.winningTrades > 0 ? formatCurrency(stats.largestWin) : '—'}
        valueClass="text-safe"
      />
      <StatCard
        label="Largest loss"
        value={stats.losingTrades > 0 ? formatCurrency(stats.largestLoss) : '—'}
        valueClass="text-risk"
      />
    </div>
  )
}
