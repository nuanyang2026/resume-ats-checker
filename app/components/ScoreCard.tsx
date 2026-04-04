'use client'

interface ScoreCardProps {
  score: number
  level: 'Excellent' | 'Good' | 'Needs Improvement'
  summary: string
}

const levelConfig = {
  Excellent: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', emoji: '🎉' },
  Good: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', emoji: '👍' },
  'Needs Improvement': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', emoji: '⚠️' },
}

export default function ScoreCard({ score, level, summary }: ScoreCardProps) {
  const config = levelConfig[level]

  // SVG circle progress
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={`border rounded-2xl p-6 ${config.bg}`}>
      <div className="flex items-center gap-6">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#334155" strokeWidth="10" />
            <circle
              cx="64" cy="64" r={radius} fill="none"
              stroke={score >= 85 ? '#34d399' : score >= 65 ? '#60a5fa' : '#fbbf24'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="64" y="60" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">{score}</text>
            <text x="64" y="78" textAnchor="middle" fill="#94a3b8" fontSize="12">/100</text>
          </svg>
        </div>

        <div className="flex-1">
          <div className={`text-2xl font-bold ${config.color} mb-1`}>
            {config.emoji} {level}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  )
}
