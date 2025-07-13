import Link from 'next/link'

interface SecurityTool {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
}

const securityTools: SecurityTool[] = [
  {
    id: 'security-assessor',
    title: 'Security Assessor',
    description: 'Comprehensive security assessment and vulnerability scanning tool',
    icon: '🛡️',
    color: 'from-blue-500 to-blue-600',
    href: '/tools/security-assessor'
  },
  {
    id: 'password-game',
    title: 'Password Game',
    description: 'Interactive password strength game inspired by neal.fun',
    icon: '🎮',
    color: 'from-purple-500 to-purple-600',
    href: '/tools/password-game'
  },
  {
    id: 'phishing-assessor',
    title: 'Phishing Email Assessor',
    description: 'Analyze and detect phishing attempts in emails',
    icon: '📧',
    color: 'from-red-500 to-red-600',
    href: '/tools/phishing-assessor'
  },
  {
    id: 'website-assessor',
    title: 'Secure Website Assessor',
    description: 'Evaluate website security and identify vulnerabilities',
    icon: '🌐',
    color: 'from-green-500 to-green-600',
    href: '/tools/website-assessor'
  }
]

const SecurityToolCard = ({ tool }: { tool: SecurityTool }) => {
  const handleClick = () => {
    // For now, just show an alert. Later this will navigate to the actual tool
    alert(`${tool.title} - Coming Soon!`)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        '--tw-gradient-from': tool.color.split(' ')[0],
        '--tw-gradient-to': tool.color.split(' ')[1],
      } as React.CSSProperties}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${tool.title}`}
    >
      <div className="relative z-10">
        <div className="mb-4 text-4xl">{tool.icon}</div>
        <h3 className="mb-2 text-2xl font-bold text-white">{tool.title}</h3>
        <p className="text-white/90">{tool.description}</p>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-white/5"></div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10"></div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Security Tools Hub
          </h1>
          <p className="text-xl text-gray-300">
            Comprehensive cybersecurity tools for assessment and education
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-white">
            Available Tools
          </h2>
          <p className="text-gray-400">
            Click on any tool to access its features
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {securityTools.map((tool) => (
            <SecurityToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 rounded-2xl bg-white/5 p-8 text-center">
          <h3 className="mb-4 text-2xl font-semibold text-white">
            More Tools Coming Soon
          </h3>
          <p className="text-gray-400">
            We're constantly adding new security assessment tools. Stay tuned for updates!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Security Tools Hub. Built with Next.js and TailwindCSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
