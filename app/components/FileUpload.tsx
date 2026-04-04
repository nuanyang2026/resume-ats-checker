'use client'

import { useCallback, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE_MB = 5

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    setFileError(null)
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      setFileError('Only PDF and Word (.docx) files are supported.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File size must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    setFileName(file.name)
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [disabled, handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div>
      <label
        className={`
          flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all
          ${isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 bg-slate-900/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-5xl">📄</div>
        <div className="text-center">
          {fileName ? (
            <p className="text-blue-400 font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-slate-300 font-medium">Drop your resume here</p>
              <p className="text-slate-500 text-sm mt-1">or click to browse · PDF or DOCX · max 5MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
      {fileError && <p className="text-red-400 text-sm mt-2">⚠️ {fileError}</p>}
    </div>
  )
}
