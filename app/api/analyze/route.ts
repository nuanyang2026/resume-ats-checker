import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Cloudflare Workers edge runtime

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText } = await req.json()

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: 'Resume text is too short or empty.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    // Build prompt
    const prompt = buildPrompt(resumeText.slice(0, 8000), jdText || '')

    // Call Claude API
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text()
      console.error('Claude API error:', errBody)
      return NextResponse.json({ error: 'AI analysis failed. Please try again.' }, { status: 502 })
    }

    const anthropicData = await anthropicRes.json()
    const content = anthropicData.choices?.[0]?.message?.content || anthropicData.content?.[0]?.text

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI.' }, { status: 502 })
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse AI response.' }, { status: 502 })
    }

    const result = JSON.parse(jsonMatch[0])

    // Memory is automatically freed after this function returns (edge runtime)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 })
  }
}

function buildPrompt(resumeText: string, jdText: string): string {
  const jdSection = jdText.trim()
    ? `\n\nJob Description (for keyword matching):\n${jdText.slice(0, 3000)}`
    : ''

  return `You are a professional resume ATS (Applicant Tracking System) expert with 10+ years of experience.

Analyze the following resume and return ONLY a valid JSON object (no markdown, no explanation):

Resume:
${resumeText}${jdSection}

Return this exact JSON structure:
{
  "ats_score": <integer 0-100>,
  "score_level": "<Excellent|Good|Needs Improvement>",
  "keywords_found": ["<keyword1>", "<keyword2>"],
  "keywords_missing": ["<keyword1>", "<keyword2>"],
  "format_issues": ["<issue1>", "<issue2>"],
  "improvement_suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>"],
  "summary": "<One concise paragraph summarizing the resume's ATS performance>"
}

Scoring guide:
- 85-100: Excellent (well-optimized for ATS)
- 65-84: Good (some improvements needed)
- 0-64: Needs Improvement (significant issues)

Focus on: keyword density, format compatibility, section structure, quantifiable achievements, action verbs.`
}
