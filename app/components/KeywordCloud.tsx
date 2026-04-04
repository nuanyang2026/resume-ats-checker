'use client'

interface KeywordCloudProps {
  found: string[]
  missing: string[]
}

export default function KeywordCloud({ found, missing }: KeywordCloudProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <h3 className="text-white font-semibold mb-4">🔑 Keyword Analysis</h3>

      {found.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Found in your resume</p>
          <div className="flex flex-wrap gap-2">
            {found.map((kw, i) => (
              <span key={i} className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-sm px-3 py-1 rounded-full">
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Missing / recommended keywords</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 text-sm px-3 py-1 rounded-full">
                ✕ {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
