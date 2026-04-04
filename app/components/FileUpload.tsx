'use client'

import { useCallback, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

const MAX_SIZE_MB = 5

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      setFileError(null)
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
        setFileError('Only PDF and Word (.docx) files are supported.')
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`File size must be under ${MAX_SIZE_MB}MB.`)
        return
      }
      setFileName(file.name)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [disabled, handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // reset so same file can be re-uploaded
      e.target.value = ''
    },
    [handleFile]
  )

  return (
    <div>
      <label
        className={[
          'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer select-none',
          isDragging
            ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-600 hover:border-slate-400 bg-slate-900/40',
          disabled ? 'opacity-50 pointer-events-none' : '',
        ].join(' ')}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-5xl">{fileName ? '✅' : '📄'}</div>
        <div className="text-center">
          {fileName ? (
            <>
              <p className="text-blue-400 font-semibold">{fileName}</p>
              <p className="text-slate-500 text-sm mt-1">Click or drop to replace</p>
            </>
          ) : (
            <>
              <p className="text-slate-200 font-semibold">Drop your resume here</p>
              <p className="text-slate-500 text-sm mt-1">
                or <span className="text-blue-400 underline underline-offset-2">browse files</span>
              </p>
              <p className="text-slate-600 text-xs mt-2">PDF or DOCX · max 5 MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.docx,.doc"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
      {fileError && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
          <span>⚠️</span> {fileError}
        </p>
      )}
    </div>
  )
}
