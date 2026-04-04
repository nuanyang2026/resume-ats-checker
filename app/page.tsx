'use client'

import { useState } from 'react'
import FileUpload from './components/FileUpload'
import ScoreCard from './components/ScoreCard'
import KeywordCloud from './components/KeywordCloud'
import Suggestions from './components/Suggestions'
import { parseResume } from '@/lib/parseResume'

export interface AnalysisResult {
  ats_score: number
  score_level: 'Excellent' | 'Good' | 'Needs Improvement'
  keywords_found: string[]
  keywords_missing: string[]
  format_issues: string[]
  improvement_suggestions: string[]
  summary: string
}

type Status = 'idle' | 'parsing' | 'analyzing' | 'done' | 'error'

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>('')
  const [jdText, setJdText] = useState('')

  const handleFileSelect = async (file: File) => {
    setStatus('parsing')
    setResult(null)
    setError('')

    try {
      // Parse resume in browser
      const resumeText = await parseResume(file)

      if (!resumeText.trim()) {
        throw new Error('Could not extract text from your resume. Please make sure it\'s a text-based PDF (not scanned).')
      }

      setStatus('analyzing')

      // Call API route → Cloudflare Worker → Claude API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jdText }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Analysis failed. Please try again.')
      }

      const data: AnalysisResult = await response.json()
      setResult(data)
      setStatus('done')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="pt-12 pb-8 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          AI-Powered · No Sign-up · Privacy-First
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Resume ATS Checker
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Know your ATS score instantly. Upload your resume and get AI-powered feedback to beat the bots.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        {/* Upload Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <FileUpload onFileSelect={handleFileSelect} disabled={status === 'parsing' || status === 'analyzing'} />

          {/* Optional JD input */}
          <div className="mt-4">
            <label className="block text-sm text-slate-400 mb-2">
              Job Description (optional — for keyword matching)
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-600 rounded-xl text-slate-300 text-sm p-3 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
              placeholder="Paste the job description here to get targeted keyword analysis..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={status === 'parsing' || status === 'analyzing'}
            />
          </div>
        </div>

        {/* Loading */}
        {(status === 'parsing' || status === 'analyzing') && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-lg">
                {status === 'parsing' ? 'Parsing your resume...' : 'AI is analyzing your resume...'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">This usually takes 5–15 seconds</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-400">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        {status === 'done' && result && (
          <div className="space-y-4">
            <ScoreCard score={result.ats_score} level={result.score_level} summary={result.summary} />
            <KeywordCloud found={result.keywords_found} missing={result.keywords_missing} />
            {result.format_issues.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-semibold mb-2">⚠️ Format Issues Detected</h3>
                <ul className="space-y-1">
                  {result.format_issues.map((issue, i) => (
                    <li key={i} className="text-slate-300 text-sm">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <Suggestions suggestions={result.improvement_suggestions} />
          </div>
        )}

        {/* Privacy note */}
        <p className="text-center text-slate-600 text-xs">
          🔒 Your resume is never stored. All processing happens in memory and is discarded immediately after analysis.
        </p>
      </div>
    </main>
  )
}
