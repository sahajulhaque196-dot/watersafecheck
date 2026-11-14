'use client'
// src/components/ui/WaterFilterQuiz.tsx
import { useState } from 'react'
import { CheckCircle2, ShieldCheck, Sparkles, RotateCcw, ArrowRight, Beaker } from 'lucide-react'

interface WaterFilterQuizProps {
  zip: string
  city?: string
  state?: string
  leadStatus: 'safe' | 'warning' | 'danger' | 'unknown'
  hardnessCategory: string
  hasViolations: boolean
}

export function WaterFilterQuiz({
  zip,
  city = 'your area',
  state = '',
  leadStatus,
  hardnessCategory,
  hasViolations,
}: WaterFilterQuizProps) {
  const [homeAge, setHomeAge] = useState<string | null>(null)
  const [concern, setConcern] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  function handleCalculate() {
    if (homeAge && concern) {
      setShowResult(true)
    }
  }

  function handleReset() {
    setHomeAge(null)
    setConcern(null)
    setShowResult(false)
  }

  const isPre1986 = homeAge === 'pre-1986'
  const isLeadConcern = concern === 'lead' || isPre1986 || leadStatus === 'warning' || leadStatus === 'danger'
  const isHardnessConcern = concern === 'hardness' || hardnessCategory === 'Hard' || hardnessCategory === 'Very Hard'

  let filterType = 'NSF 53 Solid Carbon Block Filter'
  let bestFor = 'Lead, Microplastics, Chlorine & Taste'
  let reason = `Based on EPA data for ${zip} and your home profile, certified lead reduction protects against potential plumbing leaching while keeping healthy minerals intact.`

  if (isLeadConcern && hasViolations) {
    filterType = 'Multi-Stage Reverse Osmosis (RO) System'
    bestFor = 'PFAS, Lead, Heavy Metals & Total Dissolved Solids'
    reason = `Because your area has past health violations and potential lead risk from older pipes, Reverse Osmosis provides medical-grade purification (up to 99% removal).`
  } else if (isHardnessConcern && !isLeadConcern) {
    filterType = 'Ion-Exchange Water Softener + Carbon Pitcher'
    bestFor = 'Limescale Prevention, Appliance Life & Pure Drinking Water'
    reason = `With ${hardnessCategory} water in this region, a softener prevents pipe scale and dry skin, while carbon filtration handles drinking taste.`
  }

  return (
    <div className="card border-slate-200/90 shadow-apple-card relative overflow-hidden bg-white/95 backdrop-blur-xl">
      {/* Apple specular top glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center font-bold">
            <Beaker className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base tracking-tight">
              Personalized Water Filter Finder
            </h3>
            <p className="text-xs text-slate-500">
              Tailored to {city ? `${city}, ` : ''}{zip} water chemistry
            </p>
          </div>
        </div>

        {showResult && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retake</span>
          </button>
        )}
      </div>

      {!showResult ? (
        <div className="space-y-5">
          {/* Question 1: Home Age */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. When was your home or building constructed?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'pre-1986', title: 'Before 1986', subtitle: 'Higher lead risk' },
                { id: '1986-2014', title: '1986 – 2014', subtitle: 'Moderate risk' },
                { id: 'post-2014', title: '2014 or Newer', subtitle: 'Lead-free standard' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHomeAge(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all active:scale-[0.98] ${
                    homeAge === opt.id
                      ? 'border-apple-blue bg-apple-blue/5 text-slate-900 ring-2 ring-apple-blue/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Primary Concern */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              2. What is your primary drinking water priority?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'lead', title: 'Lead & Heavy Metals', subtitle: 'Protect infants & kids' },
                { id: 'taste', title: 'Taste & Chlorine Odor', subtitle: 'Aesthetic purification' },
                { id: 'hardness', title: 'Hard Water & Scale', subtitle: 'Mineral buildup relief' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setConcern(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all active:scale-[0.98] ${
                    concern === opt.id
                      ? 'border-apple-blue bg-apple-blue/5 text-slate-900 ring-2 ring-apple-blue/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!homeAge || !concern}
            onClick={handleCalculate}
            className="w-full py-3.5 bg-apple-blue hover:bg-apple-blue-hover active:scale-[0.98] disabled:opacity-40 text-white rounded-full font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(0,113,227,0.3)] flex items-center justify-center gap-2"
          >
            <span>Analyze Filter Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-white border border-blue-200/60 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-apple-blue text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                Recommended System
              </span>
              <span className="text-xs text-slate-400 font-medium">&bull;</span>
              <span className="text-xs font-semibold text-slate-600">Verified NSF Standard</span>
            </div>

            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1">
              {filterType}
            </h4>
            <p className="text-xs font-semibold text-apple-blue mb-3">
              Key Targets: {bestFor}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {reason}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Look for NSF/ANSI 53 or 58 certification seal
            </span>
            <span className="text-slate-400">Independent laboratory tested</span>
          </div>
        </div>
      )}
    </div>
  )
}
