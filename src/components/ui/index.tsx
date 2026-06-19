// src/components/ui/index.tsx
import Link from 'next/link'

// ─── Grade Badge ──────────────────────────────────────────────────────────

interface GradeBadgeProps {
  grade: string
  size?: 'sm' | 'md' | 'lg'
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const colorMap: Record<string, string> = {
    A: 'bg-green-600 text-white border-green-700',
    B: 'bg-blue-600 text-white border-blue-700',
    C: 'bg-yellow-500 text-white border-yellow-600',
    D: 'bg-orange-500 text-white border-orange-600',
    F: 'bg-red-600 text-white border-red-700',
  }
  const sizeMap = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  }
  const color = colorMap[grade] || 'bg-gray-400 text-white border-gray-500'
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl font-black border-2 ${color} ${sizeMap[size]}`}
      aria-label={`Water quality grade: ${grade}`}
    >
      {grade || '?'}
    </div>
  )
}

// ─── Score Ring ───────────────────────────────────────────────────────────

export function ScoreRing({ score, grade }: { score: number | null; grade: string }) {
  const colorMap: Record<string, string> = {
    A: '#16a34a', B: '#2563eb', C: '#d97706', D: '#ea580c', F: '#dc2626',
  }
  const color = colorMap[grade] || '#9ca3af'
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const pct = score !== null ? score / 100 : 0
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center">
      <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="50" textAnchor="middle" fontSize="22" fontWeight="800" fill={color} dy="0.35em">
          {score !== null ? score : '—'}
        </text>
        <text x="55" y="70" textAnchor="middle" fontSize="10" fill="#6b7280">/ 100</text>
      </svg>
      <span className="text-xs text-gray-500 mt-1 font-medium">Safety Score</span>
    </div>
  )
}

// ─── Risk Badge ───────────────────────────────────────────────────────────

export function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low: 'bg-green-50 text-green-700 border-green-200',
    Moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    'Very High': 'bg-red-50 text-red-700 border-red-200',
    Critical: 'bg-red-100 text-red-800 border-red-300',
  }
  return (
    <span className={`badge ${map[risk] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {risk}
    </span>
  )
}

// ─── Data Row ─────────────────────────────────────────────────────────────

export function DataRow({
  label, value, subtext, highlight,
}: {
  label: string
  value: React.ReactNode
  subtext?: string
  highlight?: 'safe' | 'warning' | 'danger' | 'neutral'
}) {
  const hlMap = {
    safe: 'text-green-700 font-semibold',
    warning: 'text-yellow-700 font-semibold',
    danger: 'text-red-700 font-semibold',
    neutral: 'text-gray-700',
  }
  return (
    <div className="data-row">
      <div>
        <span className="data-label">{label}</span>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
      <span className={highlight ? hlMap[highlight] : 'data-value'}>
        {value}
      </span>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────

export function SectionHeader({
  icon, title, subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700">
        {icon}
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Alert Box ────────────────────────────────────────────────────────────

export function AlertBox({
  type, title, children,
}: {
  type: 'safe' | 'warning' | 'danger' | 'info'
  title?: string
  children: React.ReactNode
}) {
  const map = {
    safe: { cls: 'alert-safe', icon: '✓' },
    warning: { cls: 'alert-warning', icon: '⚠' },
    danger: { cls: 'alert-danger', icon: '✕' },
    info: { cls: 'alert-info', icon: 'ℹ' },
  }
  const { cls, icon } = map[type]
  return (
    <div className={`${cls} flex gap-3`} role="alert">
      <span className="flex-shrink-0 font-bold">{icon}</span>
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="prose-custom text-sm">{children}</div>
      </div>
    </div>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-gray-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-gray-800 font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────

export function StatCard({
  label, value, subtext, color = 'blue',
}: {
  label: string
  value: string | number
  subtext?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}) {
  const colorMap = {
    blue: 'text-blue-700 bg-blue-50',
    green: 'text-green-700 bg-green-50',
    yellow: 'text-yellow-700 bg-yellow-50',
    red: 'text-red-700 bg-red-50',
    gray: 'text-gray-700 bg-gray-50',
  }
  return (
    <div className={`rounded-xl p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-75 mb-1">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      {subtext && <p className="text-xs opacity-75 mt-1">{subtext}</p>}
    </div>
  )
}

// ─── ZIP Card (for listings) ──────────────────────────────────────────────

export function ZipCard({ zip, city, state, score, grade, violations }: {
  zip: string
  city: string
  state: string
  score: number | null
  grade: string
  violations: number
}) {
  return (
    <Link href={`/zip/${zip}`} className="card-hover block group">
      <div className="flex items-center justify-between mb-2">
        <GradeBadge grade={grade} size="sm" />
        <span className="text-xs text-gray-400 font-mono">{zip}</span>
      </div>
      <p className="font-semibold text-gray-800 text-sm group-hover:text-brand-700 transition-colors">
        {city}, {state}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">Score: <strong>{score ?? 'N/A'}</strong>/100</span>
        <span className={`text-xs ${violations > 0 ? 'text-orange-600' : 'text-green-600'}`}>
          {violations > 0 ? `${violations} violation${violations > 1 ? 's' : ''}` : '✓ No violations'}
        </span>
      </div>
    </Link>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────

export function FaqItem({ q, a, open = false }: { q: string; a: string; open?: boolean }) {
  return (
    <details className="border border-gray-100 rounded-lg overflow-hidden" open={open}>
      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
        <span className="font-semibold text-gray-800 text-sm pr-4">{q}</span>
        <span className="flex-shrink-0 text-brand-600 text-lg">+</span>
      </summary>
      <div
        className="px-5 pb-4 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-50"
        dangerouslySetInnerHTML={{ __html: a }}
      />
    </details>
  )
}
