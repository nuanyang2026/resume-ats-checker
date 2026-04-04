/**
 * Parse resume file to plain text entirely in the browser.
 * No file is sent to any server at this stage.
 *
 * Supports:
 *  - PDF  → pdfjs-dist
 *  - DOCX → mammoth
 */
export async function parseResume(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    return parsePDF(file)
  } else if (ext === 'docx' || ext === 'doc') {
    return parseWord(file)
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or Word (.docx) document.')
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')

  // Use CDN worker to avoid bundling the large worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
  const pdf = await loadingTask.promise

  const pages: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    // Reconstruct readable text, preserving line breaks where possible
    const pageText = textContent.items
      .map((item: any) => {
        if ('str' in item) return item.str
        return ''
      })
      .join(' ')

    pages.push(pageText)
  }

  return pages.join('\n\n')
}

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  // Dynamic import — mammoth is large, lazy-load it
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer })

  if (result.messages.length > 0) {
    console.warn('Mammoth warnings:', result.messages)
  }

  return result.value
}
