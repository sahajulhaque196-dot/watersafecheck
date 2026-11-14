// src/components/ui/index.tsx
import Link from 'next/link'
import { ChevronRight, Check, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// ─── Grade Badge (Apple Health Superellipse / Squircle) ──────────────────────────

interface GradeBadgeProps {
  grade: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const colorMap: Record<string, { bg: string; text: string; ring: string; shadow: string }> = {
    A: {
      bg: 'bg-gradient-to-b from-emerald-400 to-emerald-600',
      text: 'text-white',
      ring: 'ring-1 ring-emerald-300/40',
      shadow: 'shadow-[0_4px_16px_rgba(52,199,89,0.35)]',
    },
    B: {
      bg: 'bg-gradient-to-b from-blue-400 to-blue-600',
      text: 'text-white',
      ring: 'ring-1 ring-blue-300/40',
      shadow: 'shadow-[0_4px_16px_rgba(0,113,227,0.35)]',
    },
    C: {
      bg: 'bg-gradient-to-b from-amber-400 to-amber-600',
      text: 'text-white',
      ring: 'ring-1 ring-amber-300/40',
      shadow: 'shadow-[0_4px_16px_rgba(255,149,0,0.35)]',
    },
    D: {
      bg: 'bg-gradient-to-b from-orange-400 to-orange-600',
      text: 'text-white',
      ring: 'ring-1 ring-orange-300/40',
      shadow: 'shadow-[0_4px_16px_rgba(249,115,22,0.35)]',
    },
    F: {
      bg: 'bg-gradient-to-b from-rose-500 to-rose-700',
      text: 'text-white',
      ring: 'ring-1 ring-rose-400/40',
      shadow: 'shadow-[0_4px_16px_rgba(255,59,48,0.4)]',
    },
  }

  const sizeMap = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-11 h-11 text-xl rounded-xl',
    lg: 'w-16 h-16 text-3xl rounded-2xl',
    xl: 'w-20 h-20 text-4xl rounded-3xl',
  }

  const conf = colorMap[grade] || {
    bg: 'bg-gradient-to-b from-slate-400 to-slate-600',
    text: 'text-white',
    ring: 'ring-1 ring-slate-300/30',
    shadow: 'shadow-sm',
  }

  return (
    <div
      className={`inline-flex items-center justify-center font-extrabold select-none transition-transform active:scale-95 relative overflow-hidden ${conf.bg} ${conf.text} ${conf.ring} ${conf.shadow} ${sizeMap[size]}`}
      aria-label={`Water safety grade: ${grade}`}
    >
      {/* Apple specular top sheen */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-[inherit] pointer-events-none" />
      <span className="relative z-10 drop-shadow-sm">{grade || '?'}</span>
    </div>
  )
}

// ─── Score Ring (Apple Watch Activity Ring Style) ───────────────────────────

export function ScoreRing({ score, grade }: { score: number | null; grade: string }) {
  const colorMap: Record<string, { stroke: string; glow: string; text: string }> = {
    A: { stroke: '#34c759', glow: 'rgba(52, 199, 89, 0.4)', text: 'text-emerald-600' },
    B: { stroke: '#0071e3', glow: 'rgba(0, 113, 227, 0.4)', text: 'text-apple-blue' },
    C: { stroke: '#ff9500', glow: 'rgba(255, 149, 0, 0.4)', text: 'text-amber-600' },
    D: { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', text: 'text-orange-600' },
    F: { stroke: '#ff3b30', glow: 'rgba(255, 59, 48, 0.45)', text: 'text-rose-600' },
  }
  const theme = colorMap[grade] || { stroke: '#8e8e93', glow: 'transparent', text: 'text-slate-600' }
  const radius = 42
  const strokeWidth = 9
  const circumference = 2 * Math.PI * radius
  const pct = score !== null ? Math.max(0, Math.min(score, 100)) / 100 : 0
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[116px] h-[116px] flex items-center justify-center">
        <svg width="116" height="116" viewBox="0 0 116 116" className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx="58"
            cy="58"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100/90"
          />
          {/* Progress ring */}
          <circle
            cx="58"
            cy="58"
            r={radius}
            fill="none"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
              filter: `drop-shadow(0 2px 6px ${theme.glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-black tracking-tight ${theme.text}`}>
            {score !== null ? score : '—'}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-0.5">
            out of 100
          </span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
        EPA Safety Score
      </span>
    </div>
  )
}

// ─── Risk Badge (iOS Status Pill) ───────────────────────────────────────────

export function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, { bg: string; dot: string; text: string; border: string }> = {
    Low: {
      bg: 'bg-emerald-500/10',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      border: 'border-emerald-500/20',
    },
    Moderate: {
      bg: 'bg-amber-500/10',
      dot: 'bg-amber-500',
      text: 'text-amber-800',
      border: 'border-amber-500/20',
    },
    High: {
      bg: 'bg-orange-500/10',
      dot: 'bg-orange-500',
      text: 'text-orange-800',
      border: 'border-orange-500/20',
    },
    'Very High': {
      bg: 'bg-rose-500/10',
      dot: 'bg-rose-500',
      text: 'text-rose-800',
      border: 'border-rose-500/20',
    },
    Critical: {
      bg: 'bg-rose-600/15',
      dot: 'bg-rose-600 animate-pulse',
      text: 'text-rose-900 font-bold',
      border: 'border-rose-600/30',
    },
  }

  const conf = map[risk] || {
    bg: 'bg-slate-500/10',
    dot: 'bg-slate-400',
    text: 'text-slate-700',
    border: 'border-slate-500/20',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {risk}
    </span>
  )
}

// ─── Data Row (Apple Settings List Style) ─────────────────────────────────────

export function DataRow({
  label, value, subtext, highlight,
}: {
  label: string
  value: React.ReactNode
  subtext?: string
  highlight?: 'safe' | 'warning' | 'danger' | 'neutral'
}) {
  const hlMap = {
    safe: 'text-emerald-600 font-semibold',
    warning: 'text-amber-600 font-semibold',
    danger: 'text-rose-600 font-semibold',
    neutral: 'text-slate-700',
  }
  return (
    <div className="data-row">
      <div className="flex-1 min-w-0 pr-3">
        <span className="data-label">{label}</span>
        {subtext && <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{subtext}</p>}
      </div>
      <div className={highlight ? hlMap[highlight] : 'data-value'}>
        {value}
      </div>
    </div>
  )
}

// ─── Section Header (Apple Medallion) ─────────────────────────────────────────

export function SectionHeader({
  icon, title, subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3.5 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shadow-xs border border-apple-blue/15">
        {icon}
      </div>
      <div>
        <h2 className="section-title !mb-0.5">{title}</h2>
        {subtitle && <p className="section-subtitle !mb-0">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Alert Box (Apple Glass Callout) ──────────────────────────────────────────

export function AlertBox({
  type, title, children,
}: {
  type: 'safe' | 'warning' | 'danger' | 'info'
  title?: string
  children: React.ReactNode
}) {
  const map = {
    safe: {
      cls: 'alert-safe',
      icon: <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
    },
    warning: {
      cls: 'alert-warning',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />,
    },
    danger: {
      cls: 'alert-danger',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />,
    },
    info: {
      cls: 'alert-info',
      icon: <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />,
    },
  }
  const { cls, icon } = map[type]
  return (
    <div className={`${cls} flex items-start gap-3.5`} role="alert">
      {icon}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-slate-900 mb-1">{title}</p>}
        <div className="prose-custom text-sm">{children}</div>
      </div>
    </div>
  )
}

// ─── Breadcrumb (Apple Clean Chevron Trail) ───────────────────────────────────

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ─── Stat Card (Apple Health Metric Card) ────────────────────────────────────

export function StatCard({
  label, value, subtext, color = 'blue',
}: {
  label: string
  value: string | number
  subtext?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}) {
  const accentColor = {
    blue: 'text-apple-blue',
    green: 'text-emerald-600',
    yellow: 'text-amber-600',
    red: 'text-rose-600',
    gray: 'text-slate-800',
  }

  const bgBorderMap = {
    blue: 'border-2 border-sky-300/80 hover:border-sky-500 shadow-[0_8px_30px_-6px_rgba(14,165,233,0.14)] hover:shadow-[0_16px_36px_-4px_rgba(14,165,233,0.26)]',
    green: 'border-2 border-emerald-300/80 hover:border-emerald-500 shadow-[0_8px_30px_-6px_rgba(16,185,129,0.14)] hover:shadow-[0_16px_36px_-4px_rgba(16,185,129,0.26)]',
    yellow: 'border-2 border-amber-300/80 hover:border-amber-500 shadow-[0_8px_30px_-6px_rgba(245,158,11,0.14)] hover:shadow-[0_16px_36px_-4px_rgba(245,158,11,0.26)]',
    red: 'border-2 border-rose-300/80 hover:border-rose-500 shadow-[0_8px_30px_-6px_rgba(244,63,94,0.14)] hover:shadow-[0_16px_36px_-4px_rgba(244,63,94,0.26)]',
    gray: 'border-2 border-slate-200/90 hover:border-slate-400 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)]',
  }

  const topBarMap = {
    blue: 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400',
    green: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500',
    yellow: 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500',
    red: 'bg-gradient-to-r from-rose-400 via-red-500 to-rose-600',
    gray: 'bg-gradient-to-r from-slate-300 to-slate-400',
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl p-4 sm:p-6 transition-all duration-300 active:scale-[0.98] ${bgBorderMap[color]}`}>
      <div className={`absolute top-0 inset-x-0 h-1.5 ${topBarMap[color]}`} />
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2 truncate">
        {label}
      </p>
      <p className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${accentColor[color]}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2 font-medium leading-relaxed truncate">
          {subtext}
        </p>
      )}
    </div>
  )
}

// ─── ZIP Card (Apple Interactive Card) ───────────────────────────────────────

export function ZipCard({ zip, city, state, score, grade, violations }: {
  zip: string
  city: string
  state: string
  score: number | null
  grade: string
  violations: number
}) {
  return (
    <Link
      href={`/zip/${zip}`}
      className="group relative card p-4 sm:p-5 hover:border-apple-blue/40 shadow-xs hover:shadow-apple-card transition-all duration-200 active:scale-[0.98] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono font-bold text-lg text-slate-900 group-hover:text-apple-blue transition-colors">
            {zip}
          </span>
          <GradeBadge grade={grade} size="sm" />
        </div>
        <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-slate-900">
          {city}, {state}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span>Score <strong className="text-slate-900 font-bold">{score ?? '—'}</strong>/100</span>
        <span className={`font-semibold ${violations > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          {violations > 0 ? `${violations} violations` : '✓ Safe'}
        </span>
      </div>
    </Link>
  )
}

// ─── FAQ Item (Apple Support Smooth Accordion) ───────────────────────────────

export function FaqItem({ q, a, open = false }: { q: string; a: string; open?: boolean }) {
  return (
    <details
      className="group border border-slate-200/80 rounded-2xl bg-white/80 overflow-hidden shadow-xs transition-all open:bg-white open:border-apple-blue/30 open:shadow-apple-card"
      open={open}
    >
      <summary className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 cursor-pointer hover:bg-slate-50/50 transition-colors list-none select-none">
        <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4 leading-snug group-open:text-apple-blue transition-colors">
          {q}
        </span>
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm transition-transform duration-200 group-open:rotate-45 group-open:bg-apple-blue/10 group-open:text-apple-blue">
          +
        </span>
      </summary>
      <div
        className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-4 prose-custom"
        dangerouslySetInnerHTML={{ __html: a }}
      />
    </details>
  )
}

export { WaterFilterQuiz } from './WaterFilterQuiz'
export { CosmicParallaxBg } from './parallax-cosmic-background'
