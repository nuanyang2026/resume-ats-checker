import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resume ATS Checker | Know Your ATS Score Instantly',
  description: 'AI-powered resume ATS score checker. Upload your resume and get instant feedback on how well it performs against Applicant Tracking Systems.',
  keywords: ['resume', 'ATS', 'applicant tracking system', 'resume checker', 'job application'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
