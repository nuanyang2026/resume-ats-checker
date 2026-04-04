'use client'

import { useState } from 'react'

interface SuggestionsProps {
  suggestions: string[]
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const [copied, setCopied] = useState(false)

  if (suggestions.length === 0) return null

  const copyAll = () => {
    const text = suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">💡 Improvement Suggestions</h3>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors px-2 py-1 rounded-lg hover:bg-slate-700"
        >
          {copied ? (
            <><span>✓</span> Copied!</>
          ) : (
            <><span>📋</span> Copy all</>
          )}
        </button>
      </div>

      <ol className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-semibold mt-0.5">
              {i + 1}
            </span>
            <span className="text-slate-300 text-sm leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
