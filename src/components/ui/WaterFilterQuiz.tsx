'use client'
// src/components/ui/WaterFilterQuiz.tsx
import { useState } from 'react'
import { CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react'

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

  // Determine smart personalized recommendation
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
    <div className="card bg-gradient-to-br from-white via-sky-50/30 to-blue-50/40 border-2 border-brand-200/80 shadow-md p-6 rounded-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-brand-100 text-brand-700">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
          </span>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Interactive Water Safety & Filter Matcher
            </h3>
            <p className="text-xs text-gray-500">
              Personalized for ZIP {zip} ({city}, {state})
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
          Free Tool
        </span>
      </div>

      {!showResult ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              1. When was your home or apartment building built?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'pre-1986', label: 'Before 1986', sub: 'High risk of lead solder/pipes' },
                { id: 'post-1986', label: '1986 or Newer', sub: 'Lead pipes banned by EPA' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHomeAge(opt.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    homeAge === opt.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                      : 'border-gray-200 hover:border-brand-300 bg-white text-gray-700'
                  }`}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              2. What is your primary drinking water priority?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'lead', label: 'Lead & Toxins', sub: 'Kids / Pregnancy' },
                { id: 'taste', label: 'Taste & Odor', sub: 'Chlorine taste' },
                { id: 'hardness', label: 'Hard Water & Scale', sub: 'White residue' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setConcern(opt.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    concern === opt.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                      : 'border-gray-200 hover:border-brand-300 bg-white text-gray-700'
                  }`}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!homeAge || !concern}
            onClick={handleCalculate}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              homeAge && concern
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            <span>See Personalized Filter Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-brand-100 rounded-xl p-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Optimal Match for ZIP {zip}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-brand-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Retake Check
            </button>
          </div>

          <h4 className="text-lg font-black text-brand-950 mb-1">
            Recommended: {filterType}
          </h4>
          <p className="text-xs font-semibold text-brand-700 mb-3">
            Target Removal: {bestFor}
          </p>

          <p className="text-sm text-gray-700 leading-relaxed mb-4 bg-sky-50/50 p-3 rounded-lg border border-sky-100">
            {reason}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-gray-500">Certified Standard</p>
              <p className="font-bold text-gray-900 mt-0.5">NSF/ANSI 53 or 58</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-gray-500">Tested EPA Status</p>
              <p className="font-bold text-gray-900 mt-0.5">Official SDWIS Match</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
