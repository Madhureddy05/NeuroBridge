import { Inter } from 'next/font/google'
import "./index.css"
import Navbar from "../components/navbar"
import { ThemeProvider } from "../components/ui/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Employee Wellness Platform",
  description: "Track and improve your mental wellbeing at work",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-64px)]">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}