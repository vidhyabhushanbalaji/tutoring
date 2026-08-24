import type { Metadata } from 'next'

export const metadata: Metadata={
    title: 'HelpMeTutor!',
    description: 'Less spreadsheets, more teaching'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="en" data-theme="light">
  <head>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HelpMeTutor!</title>
  </head>
  <body>
    <div id="root">{children}</div>
  </body>
</html>
)
}