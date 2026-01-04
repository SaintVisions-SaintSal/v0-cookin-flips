"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  TrendingUp,
  Building2,
  DollarSign,
  Sparkles,
  ExternalLink,
  Globe,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  Plus,
  Calculator,
  Phone,
  Brain,
  Zap,
  Target,
  BarChart3,
  Home,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

// Types
interface WebResult {
  title: string
  url: string
  snippet: string
  score?: number
}

interface MarketData {
  symbol: string
  bid: number
  ask: number
  price?: number
}

interface SearchResult {
  webResults: WebResult[]
  marketData: MarketData | null
  detectedType: string
  answer?: string
  provider?: string
}

interface AIAnalysis {
  analysis: string
  recommendedPlatforms: string[]
  suggestedActions: Array<{ label: string; route: string; type: string }>
  detectedType: string
  sourcesUsed: number
}

interface SearchHistoryItem {
  id: string
  query: string
  timestamp: string
  results?: SearchResult
  analysis?: AIAnalysis
}

// Platform Configuration
const PLATFORMS = {
  "property-analysis": {
    name: "Property Analysis",
    subtitle: "Deal Analyzer",
    description: "MAO Calculator, ROI Projections & AI Verdict",
    route: "/analysis",
    icon: Calculator,
    color: "gold",
    gradient: "from-gold/20 to-gold/5",
    border: "border-gold/30",
  },
  lending: {
    name: "Cookin' Capital",
    subtitle: "Lending Platform",
    description: "DSCR, Bridge, Fix-Flip & Commercial Financing",
    route: "/lending/products",
    applyRoute: "/lending/apply",
    icon: DollarSign,
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30",
  },
  "real-estate": {
    name: "CookinFlips Portal",
    subtitle: "Investment Hub",
    description: "Properties, Syndications & Opportunities",
    route: "/portal",
    icon: Building2,
    color: "green",
    gradient: "from-green-500/20 to-green-500/5",
    border: "border-green-500/30",
  },
  stocks: {
    name: "Investments",
    subtitle: "Portfolio & Syndications",
    description: "Passive Income & Returns",
    route: "/portal",
    icon: TrendingUp,
    color: "purple",
    gradient: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/30",
  },
}

const QUICK_PROMPTS = [
  {
    icon: Calculator,
    label: "Analyze a Deal",
    query: "I want to analyze a property deal",
    color: "text-gold",
  },
  {
    icon: DollarSign,
    label: "Get Financing",
    query: "I need financing for a real estate investment",
    color: "text-cyan-400",
  },
  {
    icon: Building2,
    label: "Find Properties",
    query: "Show me investment properties in California",
    color: "text-green-400",
  },
  {
    icon: TrendingUp,
    label: "Market Trends",
    query: "What are the current real estate market trends",
    color: "text-purple-400",
  },
]

export default function ResearchPage() {
  // State
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [copied, setCopied] = useState(false)
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [user, setUser] = useState<any>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Check auth status (but don't require it)
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // Load history from session storage
    const storedHistory = sessionStorage.getItem("saintsal_history")
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Persist history to session storage
  useEffect(() => {
    if (searchHistory.length > 0) {
      sessionStorage.setItem("saintsal_history", JSON.stringify(searchHistory.slice(0, 10)))
    }
  }, [searchHistory])

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    setSearchResults(null)
    setAiAnalysis(null)

    try {
      // Step 1: Fetch search results
      const searchResponse = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!searchResponse.ok) throw new Error("Search failed")

      const searchData: SearchResult = await searchResponse.json()
      setSearchResults(searchData)

      // Step 2: Get AI analysis
      setIsAnalyzing(true)
      const analysisResponse = await fetch("/api/research/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          results: searchData,
          conversationHistory: searchHistory.slice(0, 5),
        }),
      })

      if (analysisResponse.ok) {
        const analysisData: AIAnalysis = await analysisResponse.json()
        setAiAnalysis(analysisData)

        // Save to history
        const historyItem: SearchHistoryItem = {
          id: Date.now().toString(),
          query,
          timestamp: new Date().toISOString(),
          results: searchData,
          analysis: analysisData,
        }
        setSearchHistory((prev) => [historyItem, ...prev])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
    }

    setQuery("")
  }

  const handleQuickPrompt = (promptQuery: string) => {
    setQuery(promptQuery)
    inputRef.current?.focus()
  }

  const startNewSearch = () => {
    setSearchResults(null)
    setAiAnalysis(null)
    setQuery("")
    inputRef.current?.focus()
  }

  const copyToClipboard = () => {
    if (aiAnalysis?.analysis) {
      navigator.clipboard.writeText(aiAnalysis.analysis)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = () => {
    if (!user) {
      setShowSavePrompt(true)
    } else {
      // Save to database
      saveToDatabase()
    }
  }

  const saveToDatabase = async () => {
    if (!user || !aiAnalysis) return

    try {
      await supabase.from("research_conversations").insert({
        user_id: user.id,
        query: searchHistory[0]?.query,
        results: searchResults,
        ai_analysis: aiAnalysis.analysis,
        title: searchHistory[0]?.query?.substring(0, 100),
      })
      // Show success toast or feedback
    } catch (err) {
      console.error("Save error:", err)
    }
  }

  const hasResults = searchResults || aiAnalysis

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/TRANSPARENTSAINTSALLOGO.png"
                  alt="SaintSal"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold text-gold">SaintSal</span>
                  <span className="text-gold text-xs">™</span>
                </div>
                <div className="text-[9px] text-white/50 tracking-wider">
                  POWERED BY HACP™ • PATENT #10,290,222
                </div>
              </div>
            </Link>

            {/* Right side nav */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/analysis"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white/70 hover:text-gold transition text-sm"
              >
                <Calculator className="w-4 h-4" />
                Analyze
              </Link>
              <Link
                href="/portal"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white/70 hover:text-gold transition text-sm"
              >
                <Building2 className="w-4 h-4" />
                Portal
              </Link>
              <a
                href="tel:9499972097"
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-sm"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">(949) 997-2097</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - Only show when no results */}
          {!hasResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                <Brain className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold">AI-Powered Intelligence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                Ask <span className="text-gold">SaintSal</span> Anything
              </h1>

              <p className="text-lg text-white/60 max-w-2xl mx-auto mb-2">
                Your AI co-pilot for real estate, lending, and investments. Get instant analysis,
                market insights, and actionable recommendations.
              </p>

              <p className="text-sm text-white/40">
                Real-time data • AI intelligence • One platform
              </p>
            </motion.div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about properties, financing, market trends, deal analysis..."
                className="w-full h-14 pl-12 pr-32 bg-black/60 border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/20 rounded-xl text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ask"}
              </Button>
            </div>

            {/* Quick Stats */}
            {!hasResults && (
              <div className="flex items-center justify-center mt-4 gap-6 text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-gold" />
                  Instant Analysis
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-gold" />
                  Deal Verdicts
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-gold" />
                  Live Data
                </span>
              </div>
            )}
          </form>

          {/* Quick Prompts - Show when no results */}
          {!hasResults && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt.query)}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/[0.08] transition-all text-left group"
                  >
                    <prompt.icon
                      className={`w-6 h-6 mb-2 ${prompt.color} group-hover:scale-110 transition-transform`}
                    />
                    <p className="text-sm font-medium text-white group-hover:text-gold transition-colors">
                      {prompt.label}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Access Platforms - Show when no results */}
          {!hasResults && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4 text-center">
                Quick Access
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/analysis"
                  className="p-5 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-xl hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Property Analysis</h4>
                      <p className="text-xs text-white/50">Calculate ROI, MAO & Profit</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/lending/products"
                  className="p-5 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-xl hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Get Financing</h4>
                      <p className="text-xs text-white/50">DSCR, Bridge, Fix-Flip</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/portal"
                  className="p-5 bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Investor Portal</h4>
                      <p className="text-xs text-white/50">Properties & Investments</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-4 bg-gold/10 border border-gold/30 rounded-full"
              >
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                <span className="text-white/80">
                  {isAnalyzing ? "SaintSal™ is analyzing..." : "Searching..."}
                </span>
              </motion.div>
            </div>
          )}

          {/* Results Section */}
          {hasResults && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* AI Analysis Card */}
              {aiAnalysis && (
                <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 rounded-2xl p-6 shadow-gold/10 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center border border-gold/30">
                        <Brain className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">SaintSal™ Analysis</h3>
                        <p className="text-xs text-white/40">
                          HACP™ Powered • Patent #10,290,222
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSave}
                        className="p-2 text-white/40 hover:text-gold transition-colors"
                        title="Save this analysis"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-white/40 hover:text-gold transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-white/90 leading-relaxed text-lg mb-6">
                    {aiAnalysis.analysis}
                  </p>

                  {/* Suggested Actions */}
                  {aiAnalysis.suggestedActions && aiAnalysis.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                      {aiAnalysis.suggestedActions.map((action, i) => (
                        <Link
                          key={i}
                          href={action.route}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-lg text-sm font-semibold text-gold transition-colors"
                        >
                          {action.label}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recommended Platforms */}
              {aiAnalysis?.recommendedPlatforms && aiAnalysis.recommendedPlatforms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                    Recommended for You
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aiAnalysis.recommendedPlatforms.map((platformKey) => {
                      const platform = PLATFORMS[platformKey as keyof typeof PLATFORMS]
                      if (!platform) return null
                      return (
                        <Link
                          key={platformKey}
                          href={platform.route}
                          className={`p-5 bg-gradient-to-br ${platform.gradient} border ${platform.border} rounded-xl hover:scale-[1.02] transition-all group`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 bg-${platform.color}/20 rounded-xl flex items-center justify-center`}
                              >
                                <platform.icon className={`w-6 h-6 text-${platform.color}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{platform.name}</h4>
                                <p className="text-sm text-white/50">{platform.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Market Data */}
              {searchResults?.marketData && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                    Market Data
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Symbol</p>
                      <p className="text-2xl font-bold text-gold">
                        {searchResults.marketData.symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Bid</p>
                      <p className="text-2xl font-semibold text-white">
                        ${searchResults.marketData.bid.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Ask</p>
                      <p className="text-2xl font-semibold text-white">
                        ${searchResults.marketData.ask.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults?.webResults && searchResults.webResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
                    Sources ({searchResults.webResults.length})
                  </h3>
                  <div className="space-y-3">
                    {searchResults.webResults.map((result, index) => {
                      let domain = ""
                      try {
                        if (result.url.startsWith("/")) {
                          domain = "cookincapital.com"
                        } else {
                          domain = new URL(result.url).hostname.replace("www.", "")
                        }
                      } catch {
                        domain = result.url
                      }

                      const isInternal = result.url.startsWith("/")

                      return isInternal ? (
                        <Link
                          key={index}
                          href={result.url}
                          className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/[0.08] transition-all group"
                        >
                          <div className="w-8 h-8 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gold">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white group-hover:text-gold transition-colors mb-1 line-clamp-1">
                              {result.title}
                            </h4>
                            <p className="text-sm text-white/50 line-clamp-2 mb-2">
                              {result.snippet}
                            </p>
                            <p className="text-xs text-white/30 flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {domain}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/[0.08] transition-all group"
                        >
                          <div className="w-8 h-8 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gold">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white group-hover:text-gold transition-colors mb-1 line-clamp-1">
                              {result.title}
                            </h4>
                            <p className="text-sm text-white/50 line-clamp-2 mb-2">
                              {result.snippet}
                            </p>
                            <p className="text-xs text-white/30 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {domain}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* New Search Button */}
              <div className="text-center pt-4">
                <button
                  onClick={startNewSearch}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white/60 hover:text-gold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Search
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Save Prompt Modal - Only shows when trying to save without auth */}
      <AnimatePresence>
        {showSavePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-gold/30 rounded-2xl p-8 max-w-md w-full shadow-gold"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                  <Bookmark className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Save Your Research</h3>
                <p className="text-white/60">
                  Create a free account to save your searches and access them from any device.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/auth/sign-up?redirect=/research"
                  className="block w-full py-3 text-center font-semibold text-black bg-gold hover:bg-gold-light rounded-xl transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/login?redirect=/research"
                  className="block w-full py-3 text-center font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="block w-full py-3 text-center text-sm text-white/40 hover:text-white transition-colors"
                >
                  Continue Without Saving
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-gold" />
            Powered by SaintSal™ AI
          </span>
          <span>•</span>
          <span>HACP™ Technology</span>
          <span>•</span>
          <span>Patent #10,290,222</span>
        </div>
      </footer>
    </div>
  )
}
