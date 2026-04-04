# Resume ATS Checker

> AI-powered resume ATS score checker built with Next.js 14 + Cloudflare Workers + Claude API

## 🚀 Features

- 📄 Upload PDF resume (drag & drop or click)
- 🤖 AI analysis powered by Claude API
- 📊 ATS score (0–100) with detailed breakdown
- 🔑 Keyword matching and gap analysis
- ✅ Actionable improvement suggestions
- 🔒 Privacy-first: no data stored, all processing in memory

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Deployment | Cloudflare Pages |
| Backend | Cloudflare Workers |
| AI | Claude API (Anthropic) |
| Styling | Tailwind CSS |
| Payment (later) | Stripe |

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API Key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## 🌐 Deploy to Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variable: `ANTHROPIC_API_KEY`

## 📁 Project Structure

```
resume-ats-checker/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # API route → Cloudflare Worker
│   ├── components/
│   │   ├── FileUpload.tsx      # Drag & drop upload
│   │   ├── ScoreCard.tsx       # ATS score display
│   │   ├── KeywordCloud.tsx    # Keyword hit/miss
│   │   └── Suggestions.tsx     # Improvement list
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main page
├── lib/
│   ├── parseResume.ts          # PDF/Word parser
│   └── prompt.ts               # Claude prompt builder
└── public/
```

## 🔒 Privacy

- Resume content is **never stored**
- All processing happens in Cloudflare Workers memory
- Memory is released immediately after each request
- Only sent to Anthropic API for analysis

## 📄 License

MIT
