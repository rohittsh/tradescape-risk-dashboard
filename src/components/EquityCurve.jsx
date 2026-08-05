import { formatCurrency } from '../utils/calculations'

const WIDTH = 600
const HEIGHT = 160
const PADDING = 24

export default function EquityCurve({ curve, account }) {
  const balances = curve.map((p) => p.balance)
  const min = Math.min(...balances, account.startingBalance)
  const max = Math.max(...balances, account.startingBalance)
  const range = max - min || 1
  const denom = curve.length - 1 || 1 // avoid divide-by-zero when there are no trades yet

  const points = curve.map((p, i) => {
    const x = PADDING + (i / denom) * (WIDTH - PADDING * 2)
    const y = HEIGHT - PADDING - ((p.balance - min) / range) * (HEIGHT - PADDING * 2)
    return { ...p, x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${HEIGHT - PADDING} L ${points[0].x} ${HEIGHT - PADDING} Z`

  const startY =
    HEIGHT - PADDING - ((account.startingBalance - min) / range) * (HEIGHT - PADDING * 2)

  const finalBalance = curve[curve.length - 1].balance
  const isUp = finalBalance >= account.startingBalance

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm font-semibold text-ink tracking-wide uppercase">
          Equity Curve
        </h2>
        <span className={`font-mono text-xs tabular ${isUp ? 'text-safe' : 'text-risk'}`}>
          {formatCurrency(finalBalance - account.startingBalance)} since start
        </span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#3DD68C' : '#FF5C5C'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isUp ? '#3DD68C' : '#FF5C5C'} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* starting balance reference line */}
        <line
          x1={PADDING}
          x2={WIDTH - PADDING}
          y1={startY}
          y2={startY}
          stroke="#252C39"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <path d={areaPath} fill="url(#equityFill)" />
        <path d={linePath} fill="none" stroke={isUp ? '#3DD68C' : '#FF5C5C'} strokeWidth="2" />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4 : 3}
            fill={isUp ? '#3DD68C' : '#FF5C5C'}
            stroke="#0B0E14"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="flex justify-between mt-2">
        {curve.map((p, i) => (
          <span key={i} className="text-[10px] font-mono text-muted">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}
