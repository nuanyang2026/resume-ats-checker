'use client'

import { useEffect, useRef } from 'react'

interface ScoreCardProps {
  score: number
  level: 'Excellent' | 'Good' | 'Needs Improvement'
  summary: string
}

const levelConfig = {
  Excellent: {
    color: 'text-emerald-400',
    ringColor: '#34d399',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-300',
    emoji: '🎉',
  },
  Good: {
    color: 'text-blue-400',
    ringColor: '#60a5fa',
    bg: 'bg-blue-500/10 border-blue-500/20',
    badge: 'bg-blue-500/20 text-blue-300',
    emoji: '👍',
  },
  'Needs Improvement': {
    color: 'text-amber-400',
    ringColor: '#fbbf24',
    bg: 'bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-300',
    emoji: '⚠️',
  },
}

export default function ScoreCard({ score, level, summary }: ScoreCardProps) {
  const config = levelConfig[level]
  const circleRef = useRef<SVGCircleElement>(null)

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (score / 100) * circumference

  // Animate the ring on mount
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    circle.style.strokeDashoffset = String(circumference)
    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
      circle.style.strokeDashoffset = String(targetOffset)
    })
  }, [circumference, targetOffset])

  return (
    <div className={`border rounded-2xl p-6 ${config.bg}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width="136" height="136" viewBox="0 0 136 136">
            {/* Background ring */}
            <circle
              cx="68" cy="68" r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
            />
            {/* Progress ring */}
            <circle
              ref={circleRef}
              cx="68" cy="68" r={radius}
              fill="none"
              stroke={config.ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              transform="rotate(-90 68 68)"
            />
            {/* Score text */}
            <text
              x="68" y="62"
              textAnchor="middle"
              fill="white"
              fontSize="32"
              fontWeight="700"
              fontFamily="system-ui"
            >
              {score}
            </text>
            <text
              x="68" y="80"
              textAnchor="middle"
              fill="#64748b"
              fontSize="13"
              fontFamily="system-ui"
            >
              / 100
            </text>
          </svg>
        </div>

        {/* Text content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className={`text-xl font-bold ${config.color}`}>
              {config.emoji} {level}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
              ATS Score
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  )
}
