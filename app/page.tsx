"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  LucidePieChart,
  BarChart3,
  Clock,
  AlertCircle,
  TrendingDown,
  Zap,
  Sparkles,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts"

// Enhanced threat data with more detailed information
const threatData = [
  {
    month: "Jan",
    threats: 1240,
    malware: 450,
    phishing: 380,
    ddos: 220,
    other: 190,
    date: "2024-01",
  },
  {
    month: "Feb",
    threats: 1890,
    malware: 680,
    phishing: 590,
    ddos: 340,
    other: 280,
    date: "2024-02",
  },
  {
    month: "Mar",
    threats: 2340,
    malware: 890,
    phishing: 720,
    ddos: 420,
    other: 310,
    date: "2024-03",
  },
  {
    month: "Apr",
    threats: 1980,
    malware: 720,
    phishing: 610,
    ddos: 350,
    other: 300,
    date: "2024-04",
  },
  {
    month: "May",
    threats: 2890,
    malware: 1100,
    phishing: 890,
    ddos: 520,
    other: 380,
    date: "2024-05",
  },
  {
    month: "Jun",
    threats: 3240,
    malware: 1250,
    phishing: 980,
    ddos: 580,
    other: 430,
    date: "2024-06",
  },
  {
    month: "Jul",
    threats: 2950,
    malware: 1150,
    phishing: 890,
    ddos: 520,
    other: 390,
    date: "2024-07",
  },
  {
    month: "Aug",
    threats: 3450,
    malware: 1340,
    phishing: 1050,
    ddos: 620,
    other: 440,
    date: "2024-08",
  },
]

const vulnerabilityData = [
  { name: "XSS", value: 35, color: "#ef4444" },
  { name: "SQL Injection", value: 25, color: "#f97316" },
  { name: "CSRF", value: 20, color: "#eab308" },
  { name: "Auth Issues", value: 12, color: "#22c55e" },
  { name: "Other", value: 8, color: "#6366f1" },
]

const securityFacts = [
  "95% of successful cyber attacks are due to human error",
  "A data breach costs an average of $4.45 million globally",
  "Ransomware attacks occur every 11 seconds worldwide",
  "Only 5% of company folders are properly protected",
  "Phishing accounts for 90% of all breaches",
  "The average time to identify a breach is 287 days",
  "Cybercrime damages will cost the world $10.5 trillion by 2025",
  "60% of small companies go out of business within 6 months of a cyber attack",
]

const securityNews = [
  { title: "New Zero-Day Vulnerability Discovered in Popular Framework", severity: "Critical", time: "2 hours ago" },
  { title: "Major Data Breach Affects 50M Users Worldwide", severity: "High", time: "4 hours ago" },
  { title: "AI-Powered Phishing Attacks on the Rise", severity: "Medium", time: "6 hours ago" },
  { title: "Security Update Released for Critical Infrastructure", severity: "High", time: "8 hours ago" },
  { title: "New Ransomware Variant Targets Healthcare Sector", severity: "Critical", time: "12 hours ago" },
]

// Custom tooltip for the enhanced chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border border-border rounded-lg p-4 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{`${label} 2024`}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium text-primary">Total Threats:</span> {data.threats.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-red-500">Malware:</span> {data.malware.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-500">Phishing:</span> {data.phishing.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-yellow-500">DDoS:</span> {data.ddos.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-blue-500">Other:</span> {data.other.toLocaleString()}
          </p>
        </div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const router = useRouter()
  const [currentFact, setCurrentFact] = useState(0)
  const [riskLevel, setRiskLevel] = useState(67)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % securityFacts.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskLevelColor = (level: number) => {
    if (level >= 80) return "bg-red-500"
    if (level >= 60) return "bg-orange-500"
    if (level >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRiskLevelText = (level: number) => {
    if (level >= 80) return "Critical"
    if (level >= 60) return "High"
    if (level >= 40) return "Medium"
    return "Low"
  }

  // Calculate trend
  const currentMonth = threatData[threatData.length - 1]?.threats || 0
  const previousMonth = threatData[threatData.length - 2]?.threats || 0
  const trendPercentage = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0
  const isIncreasing = trendPercentage > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

        {/* Floating orbs with enhanced animations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/4 rounded-full blur-2xl animate-pulse-slow" />

        {/* Enhanced floating data points */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
      </div>

      <main className="relative z-10">
        <section className="pt-20 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className={`flex justify-center mb-8 ${isLoaded ? "animate-scale-in" : "opacity-0"}`}>
              <div className="relative">
                <Shield className="h-20 w-20 text-primary animate-glow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-bounce-gentle">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-1.5" />
                </div>
              </div>
            </div>

            <h1
              className={`text-6xl md:text-7xl font-bold mb-6 text-shimmer ${isLoaded ? "animate-slide-up stagger-1" : "opacity-0"}`}
            >
              BreachIndex
            </h1>

            <p
              className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto ${isLoaded ? "animate-slide-up stagger-2" : "opacity-0"}`}
            >
              Advanced cybersecurity platform powered by AI. Detect threats, assess vulnerabilities, and protect your
              digital assets with cutting-edge technology.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${isLoaded ? "animate-slide-up stagger-3" : "opacity-0"}`}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg button-magnetic hover-glow"
                onClick={() => router.push("/tools/phishing-quiz")}
              >
                Start Phishing Quiz
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 button-magnetic bg-transparent"
                onClick={() => router.push("/breach-explorer")}
              >
                Explore Breaches
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card
              className={`relative overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 hover-lift ${isLoaded ? "animate-fade-in stagger-4" : "opacity-0"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
              <CardContent className="relative z-10 p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Rocket className="h-16 w-16 text-primary animate-float" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-ping">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Exciting New Tools Coming Soon!
                </h2>

                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're actively working on some incredible new cybersecurity tools that will revolutionize how you
                  protect your digital assets. Stay tuned for advanced AI-powered security features, enhanced threat
                  detection, and much more!
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover-lift"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    AI Security Assessor
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-orange-500/10 text-orange-600 border-orange-500/20 hover-lift"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Advanced Threat Hunter
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-green-500/10 text-green-600 border-green-500/20 hover-lift"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Real-time Monitoring
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 border-primary/30 hover:bg-primary/10 hover:border-primary/50 button-magnetic bg-transparent"
                    disabled
                  >
                    <Clock className="mr-2 h-5 w-5" />
                    Notify Me When Ready
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="px-6 py-3 hover:bg-muted/50 button-magnetic"
                    onClick={() => router.push("/tools/phishing-quiz")}
                  >
                    Try Current Tools
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Threat Detection Chart */}
              <Card
                className={`interactive-card hover-glow ${isLoaded ? "animate-slide-in-left stagger-5" : "opacity-0"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary animate-pulse-slow" />
                        Threat Detection Analytics
                      </CardTitle>
                      <CardDescription>Comprehensive threat landscape over 8 months</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {isIncreasing ? (
                          <TrendingUp className="h-4 w-4 text-red-500 animate-bounce-gentle" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500 animate-bounce-gentle" />
                        )}
                        <span className={`text-sm font-medium ${isIncreasing ? "text-red-500" : "text-green-500"}`}>
                          {Math.abs(trendPercentage).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">vs last month</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={threatData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="malwareGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Average line */}
                        <ReferenceLine
                          y={threatData.reduce((acc, curr) => acc + curr.threats, 0) / threatData.length}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="5 5"
                          opacity={0.5}
                        />

                        {/* Area for total threats */}
                        <Area
                          type="monotone"
                          dataKey="threats"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          fill="url(#threatGradient)"
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                          activeDot={{
                            r: 7,
                            stroke: "hsl(var(--primary))",
                            strokeWidth: 2,
                            fill: "hsl(var(--background))",
                          }}
                        />

                        {/* Line for malware specifically */}
                        <Line
                          type="monotone"
                          dataKey="malware"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend and Stats */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full animate-pulse-slow"></div>
                          <span>Total Threats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-red-500 rounded-full animate-pulse-slow"></div>
                          <span>Malware</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg:{" "}
                        {Math.round(
                          threatData.reduce((acc, curr) => acc + curr.threats, 0) / threatData.length,
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Peak</p>
                        <p className="font-semibold text-sm">
                          {Math.max(...threatData.map((d) => d.threats)).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Low</p>
                        <p className="font-semibold text-sm">
                          {Math.min(...threatData.map((d) => d.threats)).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Latest</p>
                        <p className="font-semibold text-sm">
                          {threatData[threatData.length - 1]?.threats.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold text-sm">
                          {threatData.reduce((acc, curr) => acc + curr.threats, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`interactive-card hover-glow ${isLoaded ? "animate-slide-in-right stagger-6" : "opacity-0"}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucidePieChart className="h-5 w-5 text-primary animate-pulse-slow" />
                    Vulnerability Types
                  </CardTitle>
                  <CardDescription>Breakdown of detected vulnerabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={vulnerabilityData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {vulnerabilityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {vulnerabilityData.map((item, index) => (
                      <div
                        key={item.name}
                        className={`flex items-center gap-2 hover-lift ${isLoaded ? `animate-fade-in stagger-${index + 1}` : "opacity-0"}`}
                      >
                        <div
                          className="w-3 h-3 rounded-full animate-pulse-slow"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Risk Level & Fun Facts */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Global Risk Level */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Global Cyber Risk Level
                  </CardTitle>
                  <CardDescription>Current threat landscape assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{getRiskLevelText(riskLevel)}</span>
                      <Badge variant="secondary" className={`${getRiskLevelColor(riskLevel)} text-white`}>
                        {riskLevel}%
                      </Badge>
                    </div>
                    <Progress value={riskLevel} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Based on aggregated threat intelligence and recent security incidents worldwide.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cybersecurity Fun Facts */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Security Insight
                  </CardTitle>
                  <CardDescription>Did you know?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[100px] flex items-center">
                    <p className="text-lg font-medium leading-relaxed animate-fade-in">{securityFacts[currentFact]}</p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      {securityFacts.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentFact ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className={`interactive-card hover-glow ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary animate-pulse-slow" />
                  Latest Security News
                </CardTitle>
                <CardDescription>Stay updated with the latest cybersecurity developments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityNews.map((news, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 interactive-card group ${isLoaded ? `animate-slide-up stagger-${index + 1}` : "opacity-0"}`}
                    >
                      <div className="flex items-center gap-4">
                        <Badge className={`${getSeverityColor(news.severity)} text-white animate-pulse-slow`}>
                          {news.severity}
                        </Badge>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors duration-300">
                            {news.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{news.time}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
