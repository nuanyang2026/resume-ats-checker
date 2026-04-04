/**
 * Parse resume file to plain text in the browser.
 * Supports PDF (via pdf.js) and Word (.docx via mammoth).
 * No file is uploaded to any server at this stage.
 */
export async function parseResume(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    return parsePDF(file)
  } else if (ext === 'docx' || ext === 'doc') {
    return parseWord(file)
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or Word document.')
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  // Dynamically import pdf.js to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const textParts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    textParts.push(pageText)
  }

  return textParts.join('\n')
}

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  // Dynamically import mammoth
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
