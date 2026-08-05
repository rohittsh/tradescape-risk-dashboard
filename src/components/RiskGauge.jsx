import { formatCurrency, formatPercent } from '../utils/calculations'

const STATUS_STYLES = {
  safe: {
    ring: 'border-safe/40',
    dot: 'bg-safe',
    text: 'text-safe',
    glow: 'shadow-[0_0_24px_-4px_rgba(61,214,140,0.5)]',
  },
  approaching: {
    ring: 'border-warn/40',
    dot: 'bg-warn',
    text: 'text-warn',
    glow: 'shadow-[0_0_24px_-4px_rgba(245,166,35,0.5)]',
  },
  'at-risk': {
    ring: 'border-risk/40',
    dot: 'bg-risk',
    text: 'text-risk',
    glow: 'shadow-[0_0_24px_-4px_rgba(255,92,92,0.5)]',
  },
}

function LimitBar({ label, usedLabel, remainingLabel, pct, barColor }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-muted font-body uppercase tracking-wide">{label}</span>
        <span className="text-xs font-mono text-muted tabular">{formatPercent(clamped)} used</span>
      </div>
      <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-line">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs font-mono text-ink tabular">{usedLabel}</span>
        <span className="text-xs font-mono text-muted tabular">{remainingLabel} left</span>
      </div>
    </div>
  )
}

export default function RiskGauge({ drawdown, dailyLoss, status }) {
  const s = STATUS_STYLES[status.level]

  const drawdownBarColor =
    drawdown.drawdownPct >= 80 ? 'bg-risk' : drawdown.drawdownPct >= 50 ? 'bg-warn' : 'bg-safe'
  const dailyLossBarColor =
    dailyLoss.dailyLossPct >= 80 ? 'bg-risk' : dailyLoss.dailyLossPct >= 50 ? 'bg-warn' : 'bg-safe'

  return (
    <div className={`bg-surface border ${s.ring} rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-sm font-semibold text-ink tracking-wide uppercase">
          Risk Status
        </h2>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 bg-surface-alt ${s.glow}`}>
          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
          <span className={`text-xs font-mono font-semibold ${s.text}`}>{status.label}</span>
        </div>
      </div>

      <LimitBar
        label="Drawdown"
        usedLabel={formatCurrency(drawdown.currentDrawdown) + ' used'}
        remainingLabel={formatCurrency(drawdown.remainingDrawdown)}
        pct={drawdown.drawdownPct}
        barColor={drawdownBarColor}
      />

      <LimitBar
        label="Today's loss"
        usedLabel={formatCurrency(dailyLoss.currentDayLoss) + ' used'}
        remainingLabel={formatCurrency(dailyLoss.remainingDailyLoss)}
        pct={dailyLoss.dailyLossPct}
        barColor={dailyLossBarColor}
      />

      <p className="text-xs text-muted font-body mt-4 pt-4 border-t border-line leading-relaxed">
        Status reflects whichever rule you're closest to breaching — drawdown or daily loss —
        not just your overall P&L.
      </p>
    </div>
  )
}
