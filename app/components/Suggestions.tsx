'use client'

import { useState } from 'react'

interface SuggestionsProps {
  suggestions: string[]
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const text = suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">💡 Improvement Suggestions</h3>
        <button
          onClick={copyAll}
          className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy all'}
        </button>
      </div>

      <ol className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <li key={i} className="flex gap-3 text-slate-300 text-sm">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <span className="leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
