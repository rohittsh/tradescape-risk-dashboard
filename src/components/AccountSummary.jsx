import { formatCurrency } from '../utils/calculations'

function Row({ label, value, valueClass = 'text-ink' }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0">
      <span className="text-sm text-muted font-body">{label}</span>
      <span className={`font-mono text-sm tabular ${valueClass}`}>{value}</span>
    </div>
  )
}

export default function AccountSummary({ account, currentBalance, totalPnl }) {
  const pnlPositive = totalPnl >= 0

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-sm font-semibold text-ink tracking-wide uppercase">
          Account
        </h2>
        <span className="text-xs font-mono text-muted">{account.accountId}</span>
      </div>
      <p className="text-xs text-muted font-body mb-4">{account.traderName}</p>

      <Row label="Starting balance" value={formatCurrency(account.startingBalance)} />
      <Row
        label="Current balance"
        value={formatCurrency(currentBalance)}
        valueClass="text-ink font-semibold"
      />
      <Row
        label="Total P&L"
        value={formatCurrency(totalPnl)}
        valueClass={pnlPositive ? 'text-safe' : 'text-risk'}
      />
      <Row label="Max drawdown allowed" value={formatCurrency(account.maxDrawdown)} />
      <Row label="Daily loss limit" value={formatCurrency(account.dailyLossLimit)} />
    </div>
  )
}
