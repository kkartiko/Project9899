import { Shield, Lock, Key, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "HTTPS Everywhere",
    description: "Ensure all communications are encrypted with SSL/TLS certificates.",
  },
  {
    icon: Lock,
    title: "Content Security Policy",
    description: "Prevent XSS attacks with proper CSP headers and directives.",
  },
  {
    icon: Key,
    title: "Strong Authentication",
    description: "Implement multi-factor authentication and secure password policies.",
  },
  {
    icon: RefreshCw,
    title: "Regular Updates",
    description: "Keep dependencies and frameworks updated with latest security patches.",
  },
  {
    icon: CheckCircle,
    title: "Input Validation",
    description: "Validate and sanitize all user inputs to prevent injection attacks.",
  },
  {
    icon: AlertTriangle,
    title: "Security Headers",
    description: "Configure proper security headers like HSTS, X-Frame-Options, etc.",
  },
]

export function SecurityFeatures() {
  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Security Best Practices</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Essential security measures every web application should implement to protect against common
            vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
