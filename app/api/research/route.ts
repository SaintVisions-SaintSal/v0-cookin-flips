import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

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
  change?: number
  changePercent?: number
}

interface ResearchResponse {
  webResults: WebResult[]
  marketData: MarketData | null
  detectedType: string
  answer?: string
  query: string
  timestamp: string
  provider: string
}

export async function POST(req: NextRequest) {
  try {
    const { query, type } = await req.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Detect intent from query
    const detectedType = type || detectQueryIntent(query)

    // Fetch web results
    let webResults: WebResult[] = []
    let tavilyAnswer: string | null = null
    let provider = "fallback"

    // Try Tavily first (primary)
    if (process.env.TAVILY_API_KEY) {
      try {
        const tavilyData = await fetchTavilyResults(query)
        webResults = tavilyData.results
        tavilyAnswer = tavilyData.answer
        provider = "tavily"
      } catch (tavilyError) {
        console.error("[Research API] Tavily failed:", tavilyError)
      }
    }

    // Fallback to Perplexity if Tavily fails or returns no results
    if (webResults.length === 0 && process.env.PERPLEXITY_API_KEY) {
      try {
        const perplexityData = await fetchPerplexityResults(query)
        webResults = perplexityData.results
        tavilyAnswer = perplexityData.answer
        provider = "perplexity"
      } catch (perplexityError) {
        console.error("[Research API] Perplexity failed:", perplexityError)
      }
    }

    // If still no results, use intelligent fallback based on query type
    if (webResults.length === 0) {
      webResults = getIntelligentFallback(query, detectedType)
      provider = "fallback"
    }

    // Fetch market data if stock-related query
    let marketData: MarketData | null = null
    if (detectedType === "stocks" && process.env.ALPACA_API_KEY) {
      marketData = await fetchMarketData(query)
    }

    const response: ResearchResponse = {
      webResults: webResults.slice(0, 9),
      marketData,
      detectedType,
      answer: tavilyAnswer || undefined,
      query,
      timestamp: new Date().toISOString(),
      provider,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Research API] Error:", error)
    return NextResponse.json(
      {
        error: "Research request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

function detectQueryIntent(query: string): string {
  const lower = query.toLowerCase()

  // Property Analysis patterns
  if (
    lower.match(/\b(analyze|analysis|arv|mao|flip|rehab|deal|property.*value|repair.*cost)\b/)
  ) {
    return "property-analysis"
  }

  // Lending patterns (most specific first)
  if (lower.match(/\b(need|want|apply|get|find).*(loan|financing|capital|funding|dscr|lend)\b/)) {
    return "lending"
  }
  if (
    lower.match(
      /\b(loan|financing|lend|dscr|capital|fund|mortgage|bridge|construction|commercial.*loan)\b/
    )
  ) {
    return "lending"
  }

  // Real estate patterns
  if (lower.match(/\b(invest|buy|purchase|acquire).*(property|real estate|house|building)\b/)) {
    return "real-estate"
  }
  if (lower.match(/\b(flip|rehab|fix|renovate).*(property|house)\b/)) {
    return "real-estate"
  }
  if (
    lower.match(
      /\b(property|real estate|house|flip|rent|apartment|commercial.*building|cap rate)\b/
    )
  ) {
    return "real-estate"
  }

  // Stock/investment patterns
  if (lower.match(/\b(invest|portfolio|stock|trade|buy|sell).*(stock|shares|equity)\b/)) {
    return "stocks"
  }
  if (lower.match(/\b(syndication|syndicate|passive|returns|dividend|market|nasdaq|nyse|s&p)\b/)) {
    return "stocks"
  }
  if (lower.match(/\b[A-Z]{2,5}\b/) && lower.match(/\b(price|quote|stock|buy|sell)\b/)) {
    return "stocks"
  }

  return "general"
}

async function fetchTavilyResults(
  query: string
): Promise<{ results: WebResult[]; answer: string | null }> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: true,
      include_raw_content: false,
      max_results: 9,
      include_domains: [],
      exclude_domains: [],
    }),
  })

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`)
  }

  const data = await response.json()

  const results: WebResult[] = (data.results || []).map((r: any) => ({
    title: r.title || "Untitled",
    url: r.url,
    snippet: r.content || r.snippet || "",
    score: r.score,
  }))

  return {
    results,
    answer: data.answer || null,
  }
}

async function fetchPerplexityResults(
  query: string
): Promise<{ results: WebResult[]; answer: string | null }> {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: "You are a research assistant. Provide factual information with sources.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      return_citations: true,
      return_related_questions: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`)
  }

  const data = await response.json()

  // Extract citations as web results
  const results: WebResult[] = (data.citations || []).map((url: string, i: number) => ({
    title: `Source ${i + 1}`,
    url,
    snippet: "",
    score: 1 - i * 0.1,
  }))

  return {
    results,
    answer: data.choices?.[0]?.message?.content || null,
  }
}

async function fetchMarketData(query: string): Promise<MarketData | null> {
  // Extract stock symbol from query
  const symbolMatch = query.toUpperCase().match(/\b[A-Z]{2,5}\b/)
  if (!symbolMatch) return null

  const symbol = symbolMatch[0]

  // Skip common words that look like symbols
  const skipWords = [
    "THE",
    "AND",
    "FOR",
    "ARE",
    "BUT",
    "NOT",
    "YOU",
    "ALL",
    "CAN",
    "HAD",
    "HER",
    "WAS",
    "ONE",
    "OUR",
    "OUT",
  ]
  if (skipWords.includes(symbol)) return null

  try {
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`, {
      headers: {
        "APCA-API-KEY-ID": process.env.ALPACA_API_KEY!,
        "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET_KEY!,
      },
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      symbol,
      bid: data.quote?.bp || 0,
      ask: data.quote?.ap || 0,
      price: (data.quote?.bp + data.quote?.ap) / 2 || 0,
    }
  } catch {
    return null
  }
}

function getIntelligentFallback(query: string, detectedType: string): WebResult[] {
  const baseFallback: WebResult[] = [
    {
      title: "Cookin' Capital - Premier Lending Solutions",
      url: "/lending/products",
      snippet:
        "Explore our comprehensive lending programs including DSCR loans, fix-and-flip financing, bridge loans, and commercial real estate capital. Fast approvals, competitive rates.",
      score: 1,
    },
    {
      title: "CookinFlips - Real Estate Investment Platform",
      url: "/analysis",
      snippet:
        "Analyze investment properties, calculate ROI and profit potential, and find your next profitable flip or rental. AI-powered property analysis.",
      score: 0.95,
    },
    {
      title: "SaintSal™ AI - Your Investment Co-Pilot",
      url: "/research",
      snippet:
        "Ask anything about real estate, lending, or investments. SaintSal guides you through the entire capital stack with actionable intelligence.",
      score: 0.9,
    },
  ]

  // Add type-specific results
  if (detectedType === "lending") {
    baseFallback.unshift({
      title: "DSCR Loans - No Income Verification Required",
      url: "/lending/apply?type=dscr",
      snippet:
        "Qualify based on property cash flow, not personal income. Perfect for real estate investors with multiple properties. Up to 80% LTV, competitive rates.",
      score: 1,
    })
  } else if (detectedType === "real-estate" || detectedType === "property-analysis") {
    baseFallback.unshift({
      title: "Property Analysis Calculator",
      url: "/analysis",
      snippet:
        "Comprehensive deal analysis with MAO calculator, ROI projections, and SaintSal™ AI verdict. Know if a deal is worth pursuing before you commit.",
      score: 1,
    })
  } else if (detectedType === "stocks") {
    baseFallback.unshift({
      title: "Real Estate Syndication Opportunities",
      url: "/portal",
      snippet:
        "Passive real estate investing with projected returns of 15-25%. Join vetted syndication deals with professional sponsors and quarterly distributions.",
      score: 1,
    })
  }

  return baseFallback.slice(0, 7)
}
