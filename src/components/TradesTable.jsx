import { formatCurrency } from '../utils/calculations'

export default function TradesTable({ trades }) {
  if (trades.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-xl p-8 text-center">
        <p className="text-sm text-muted font-body">No trades yet. They'll show up here.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-alt/50">
            <th className="text-left font-body font-medium text-muted uppercase text-xs tracking-wide px-4 py-3">
              Trade
            </th>
            <th className="text-left font-body font-medium text-muted uppercase text-xs tracking-wide px-4 py-3">
              Direction
            </th>
            <th className="text-right font-body font-medium text-muted uppercase text-xs tracking-wide px-4 py-3">
              P&amp;L
            </th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.id} className="border-b border-line last:border-b-0">
              <td className="px-4 py-3 font-mono text-ink">{t.symbol}</td>
              <td className="px-4 py-3 font-body text-muted">{t.direction}</td>
              <td
                className={`px-4 py-3 font-mono text-right tabular ${
                  t.pnl >= 0 ? 'text-safe' : 'text-risk'
                }`}
              >
                {formatCurrency(t.pnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
