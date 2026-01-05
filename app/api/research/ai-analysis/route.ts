import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const SAINTSAL_SYSTEM_PROMPT = `You are SaintSal™ — the AI intelligence engine for CookinFlips, a real estate investment platform.

## CORE MISSION
Help users find deals, get financing, and make smart investment decisions. Always guide them to the specific CookinFlips tool or service that solves their problem.

## YOUR PLATFORMS (ALWAYS RECOMMEND WHEN RELEVANT)
1. **Deal Analyzer** (/analysis) → ROI calculator, MAO formula, profit projections, AI deal verdict
2. **Lending** (/lending) → DSCR, Bridge, Fix-Flip, Construction, Commercial, Cannabis loans — all 51 states
3. **Portal** (/portal) → Browse wholesale properties, syndication opportunities, investment deals
4. **Contact Team** → Darren Brown (CEO), JR Taber (Lending), Omar Gutierrez (Operations)

## RESPONSE RULES
1. Keep responses under 4 sentences unless deep analysis is requested
2. ALWAYS end with a specific action: "Head to /analysis to run the numbers" or "Check /lending for current rates"
3. Be direct and confident — you're a Goldman-level advisor, not a generic chatbot
4. When users ask about deals/properties → Recommend Portal AND Deal Analyzer
5. When users ask about financing/loans → Recommend Lending AND give quick rate ranges
6. When users ask about analysis/ROI/MAO → Send them to Deal Analyzer
7. Reference specific CookinFlips capabilities, not generic advice

## FOR PROPERTY SEARCHES (e.g., "find me a flip in Orange County")
- Acknowledge we have wholesale inventory and off-market deals
- Mention our Deal Analyzer for running numbers
- Point them to Portal to browse current properties
- Offer to connect them with the team for specific requirements

## QUICK FACTS TO USE
- $3B+ distressed assets resolved
- 51 states coverage
- 24-48hr pre-approval on loans
- Fix & Flip: 9.50% from, 90% LTC
- DSCR: 7.25% from, 80% LTV
- Bridge: 8.50% from, 75% LTV
- 40,000+ property valuations by our team

## TONE
Professional but conversational. Like a smart friend who happens to run a real estate empire. No fluff, just actionable intelligence.`

export async function POST(req: NextRequest) {
  try {
    const { query, results, conversationHistory } = await req.json()

    const detectedType = results?.detectedType || "general"
    const webResults = results?.webResults || []
    const marketData = results?.marketData

    // Build context
    let context = ""
    if (webResults.length > 0) {
      context += `\n\nSearch found ${webResults.length} sources. Key insights:\n`
      webResults.slice(0, 4).forEach((r: any, i: number) => {
        context += `- ${r.title}: ${r.snippet?.substring(0, 100)}...\n`
      })
    }

    if (marketData) {
      context += `\n\nMarket data: ${marketData.symbol} - Bid: $${marketData.bid?.toFixed(2)}, Ask: $${marketData.ask?.toFixed(2)}`
    }

    // Previous context
    if (conversationHistory?.length > 0) {
      context += "\n\nPrevious queries: " + conversationHistory.slice(-2).map((h: any) => h.query).join(", ")
    }

    const userMessage = `User: "${query}"
Intent: ${detectedType}
${context}

Give a focused, actionable response. End with a specific CookinFlips platform recommendation.`

    let analysis = ""

    // Try Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: SAINTSAL_SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          analysis = data.content?.[0]?.text || ""
        }
      } catch (err) {
        console.error("[SaintSal] Anthropic error:", err)
      }
    }

    // Fallback to OpenAI
    if (!analysis && process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 600,
            messages: [
              { role: "system", content: SAINTSAL_SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          analysis = data.choices?.[0]?.message?.content || ""
        }
      } catch (err) {
        console.error("[SaintSal] OpenAI error:", err)
      }
    }

    // Smart fallback based on intent
    if (!analysis) {
      analysis = getSmartFallback(query, detectedType)
    }

    // Determine platforms and actions
    const { recommendedPlatforms, suggestedActions } = getRecommendations(query, detectedType)

    return NextResponse.json({
      analysis,
      recommendedPlatforms,
      suggestedActions,
      detectedType,
      sourcesUsed: webResults.length,
      hasMarketData: !!marketData,
    })
  } catch (error) {
    console.error("[SaintSal] Error:", error)

    return NextResponse.json({
      analysis: "Let me help you navigate. Are you looking to analyze a property deal, find financing, or browse investment opportunities? Each has a dedicated tool on CookinFlips.",
      recommendedPlatforms: ["property-analysis", "lending", "real-estate"],
      suggestedActions: [
        { label: "Analyze a Deal", route: "/analysis", type: "property-analysis" },
        { label: "Get Financing", route: "/lending", type: "lending" },
        { label: "Browse Properties", route: "/portal", type: "real-estate" },
      ],
      detectedType: "general",
      sourcesUsed: 0,
      hasMarketData: false,
    })
  }
}

function getSmartFallback(query: string, detectedType: string): string {
  const q = query.toLowerCase()

  // Location-specific queries
  if (q.match(/orange county|oc |irvine|newport|huntington|costa mesa|anaheim/)) {
    return "Orange County is our home turf — we've valued over 40,000 properties in SoCal. Our Portal has current wholesale inventory, and the Deal Analyzer will help you run numbers on any property. Head to /portal to see what's available, or /analysis if you already have an address."
  }

  // Flip/deal queries
  if (q.match(/flip|deal|wholesale|off.?market|distressed/)) {
    return "We specialize in wholesale and off-market deals — $3B+ in distressed assets resolved. Browse current inventory in the Portal, then run any property through our Deal Analyzer for MAO, ROI, and an AI verdict on whether it's worth pursuing. Check /portal first."
  }

  // Financing queries
  if (q.match(/loan|financ|capital|fund|dscr|bridge|rate|lend/)) {
    return "Full-service lending across all 51 states: Fix & Flip from 9.50% (90% LTC), DSCR from 7.25% (80% LTV), Bridge from 8.50%. 24-48hr pre-approval. Head to /lending to see all products and apply."
  }

  // Analysis queries
  if (q.match(/analyz|roi|mao|profit|arv|repair|calculate/)) {
    return "Our Deal Analyzer calculates MAO using the 70% rule, projects ROI, cash-on-cash returns, and gives you an AI verdict on the deal. Enter your numbers at /analysis and I'll tell you if it's worth pursuing."
  }

  // Investment queries
  if (q.match(/invest|syndication|passive|return|portfolio/)) {
    return "We offer both direct investment opportunities and passive syndications with 15-25% target IRR. Browse current offerings in the Portal at /portal, or use the Deal Analyzer at /analysis to evaluate specific properties."
  }

  // Default
  const defaults: Record<string, string> = {
    lending: "We offer DSCR, Bridge, Fix-Flip, Construction, and Commercial loans across all 51 states. Current Fix & Flip rates start at 9.50% with 90% LTC. Check /lending for full details and to apply.",
    "property-analysis": "Our Deal Analyzer calculates your Maximum Allowable Offer, ROI projections, and gives an AI verdict on whether to pursue the deal. Run your numbers at /analysis.",
    "real-estate": "Browse our wholesale inventory and investment opportunities in the Portal. We have off-market deals with verified equity across multiple markets. Start at /portal.",
    stocks: "For passive real estate exposure, check our syndication offerings in the Portal — 15-25% target IRR on curated deals. Visit /portal to see current opportunities.",
    general: "I can help you analyze deals, find financing, or browse investment properties. What's your priority right now? Head to /analysis for deal math, /lending for loans, or /portal for properties."
  }

  return defaults[detectedType] || defaults.general
}

function getRecommendations(query: string, detectedType: string) {
  const q = query.toLowerCase()
  const recommendedPlatforms: string[] = []
  const suggestedActions: Array<{ label: string; route: string; type: string }> = []

  // Always recommend based on detected intent
  if (detectedType === "lending" || q.match(/loan|financ|capital|fund|dscr|bridge|mortgage|rate/)) {
    recommendedPlatforms.push("lending")
    suggestedActions.push({ label: "View Loan Products", route: "/lending", type: "lending" })
  }

  if (detectedType === "property-analysis" || q.match(/analyz|arv|mao|flip|rehab|deal|roi|profit|calculate/)) {
    recommendedPlatforms.push("property-analysis")
    suggestedActions.push({ label: "Analyze Deal", route: "/analysis", type: "property-analysis" })
  }

  if (detectedType === "real-estate" || q.match(/property|wholesale|house|invest|buy|rent|off.?market/)) {
    recommendedPlatforms.push("real-estate")
    suggestedActions.push({ label: "Browse Properties", route: "/portal", type: "real-estate" })
  }

  // If nothing specific, offer all main tools
  if (suggestedActions.length === 0) {
    recommendedPlatforms.push("property-analysis", "lending")
    suggestedActions.push(
      { label: "Analyze a Deal", route: "/analysis", type: "property-analysis" },
      { label: "Get Financing", route: "/lending", type: "lending" }
    )
  }

  return { recommendedPlatforms, suggestedActions }
}
