import { NextRequest, NextResponse } from 'next/server'

// Edge runtime required for Cloudflare Pages deployment
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json()

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short or empty. Please upload a valid resume.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set OPENROUTER_API_KEY in your environment.' },
        { status: 500 }
      )
    }

    const prompt = buildPrompt(resumeText.slice(0, 8000), jdText || '')

    // Call Claude via OpenRouter (OpenAI-compatible API)
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://resume-ats-checker.pages.dev',
        'X-Title': 'Resume ATS Checker',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('OpenRouter API error:', errBody)
      return NextResponse.json(
        { error: 'AI analysis failed. Please try again later.' },
        { status: 502 }
      )
    }

    const data = await res.json()

    // OpenAI-compatible response format: choices[0].message.content
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI.' }, { status: 502 })
    }

    // Extract JSON block from the response (handles markdown code fences too)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) ||
                      content.match(/(\{[\s\S]*\})/)

    if (!jsonMatch) {
      console.error('Could not find JSON in response:', content)
      return NextResponse.json({ error: 'Could not parse AI response.' }, { status: 502 })
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0]
    const result = JSON.parse(jsonStr)

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Analyze route error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500 }
    )
  }
}

function buildPrompt(resumeText: string, jdText: string): string {
  const jdSection = jdText.trim()
    ? `\n\nJob Description (use this for targeted keyword matching):\n${jdText.slice(0, 3000)}`
    : ''

  return `You are a professional resume ATS (Applicant Tracking System) expert with 10+ years of experience helping candidates optimize their resumes.

Analyze the resume below and return ONLY a valid JSON object. No markdown, no explanation, no preamble — just the raw JSON.

Resume:
${resumeText}${jdSection}

Return exactly this JSON structure:
{
  "ats_score": <integer between 0 and 100>,
  "score_level": "<one of: Excellent | Good | Needs Improvement>",
  "keywords_found": ["<keyword or skill found in the resume>"],
  "keywords_missing": ["<important keyword or skill NOT found but recommended>"],
  "format_issues": ["<specific formatting problem that hurts ATS parsing>"],
  "improvement_suggestions": ["<specific, actionable improvement>"],
  "summary": "<2-3 sentence summary of the resume's ATS performance and main areas to improve>"
}

Scoring rubric:
- 85–100 → Excellent: well-structured, keyword-rich, ATS-friendly format
- 65–84 → Good: solid resume with moderate improvements needed
- 0–64 → Needs Improvement: significant issues in format, keywords, or structure

Evaluate based on:
1. Keyword density and relevance (match to common job roles or the provided JD)
2. ATS-unfriendly elements (tables, images, headers/footers, multi-column layout, graphics)
3. Section completeness (Summary, Experience, Education, Skills)
4. Use of strong action verbs and quantifiable achievements
5. Consistent date formats and clear job titles

Return 5–10 keywords_found, 3–8 keywords_missing, 0–5 format_issues, 5–8 improvement_suggestions.`
}
