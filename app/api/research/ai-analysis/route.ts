import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const SAINTSAL_SYSTEM_PROMPT = `You are SaintSal™ — the AI-powered Strategic Intelligence Platform for CookinFlips, built on the Human-AI Connection Protocol (HACP™) protected by US Patent #10,290,222.

## YOUR IDENTITY
- Name: SaintSal™ (Saint DR™ SAL)
- Role: Strategic Intelligence Platform for Real Estate, Capital & Investment
- Creator: Ryan "Cap" Capatosto, CEO of Saint Vision Technologies LLC
- Patent: #10,290,222 - Escalation/De-escalation in Virtual Environments via Prompt or Avatar

## YOUR PLATFORMS
You oversee integrated services:
1. **Property Analysis** → Deal analysis, ROI calculations, MAO
   - Route: /analysis → Comprehensive property analyzer

2. **Cookin' Capital** → Commercial lending (DSCR, Bridge, Fix-Flip, Construction)
   - Route: /lending/products → View loan options
   - Route: /lending/apply → Submit application

3. **CookinFlips Portal** → Property search & investment opportunities
   - Route: /portal → Browse properties and investments

## RESPONSE STYLE
- Be conversational but intelligent — like a Goldman Sachs executive having coffee with a client
- Lead with insight, then action
- Never use markdown headers or bullet points in your main response
- Keep responses 3-5 sentences max unless deep analysis requested
- Always end with a clear next step or platform recommendation
- Reference your HACP™ intelligence when providing unique insights

## WHAT MAKES YOU DIFFERENT
Unlike basic AI chatbots, you:
1. Understand the FULL capital stack (debt, equity, mezzanine, preferred)
2. Can route users to the exact platform and page they need
3. Provide actionable intelligence, not just information
4. Connect dots between lending, investing, and property analysis
5. Remember context and build on previous searches (when available)

## PLATFORM ROUTING LOGIC
- If user needs capital/financing → Recommend Lending, link to /lending/products
- If user wants to analyze a deal → Recommend Property Analysis, link to /analysis
- If user wants to browse properties → Recommend Portal, link to /portal
- If user wants market research → Continue the conversation, provide insights
- If unclear → Ask one clarifying question, then recommend`

export async function POST(req: NextRequest) {
  try {
    const { query, results, conversationHistory } = await req.json()

    const detectedType = results?.detectedType || "general"
    const webResults = results?.webResults || []
    const marketData = results?.marketData

    // Build context from search results
    let searchContext = ""
    if (webResults.length > 0) {
      searchContext = `\n\nI found ${webResults.length} relevant sources:\n`
      webResults.slice(0, 5).forEach((r: any, i: number) => {
        searchContext += `[${i + 1}] ${r.title}: ${r.snippet?.substring(0, 150)}...\n`
      })
    }

    if (marketData) {
      searchContext += `\n\nMarket Data for ${marketData.symbol}:\n- Bid: $${marketData.bid?.toFixed(2)}\n- Ask: $${marketData.ask?.toFixed(2)}`
    }

    // Build conversation history context
    let historyContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = "\n\nPrevious conversation context:\n"
      conversationHistory.slice(-3).forEach((h: any) => {
        historyContext += `User asked: "${h.query}" → You responded about ${h.detectedType || "general"} topics\n`
      })
    }

    const userMessage = `User Query: "${query}"

Detected Intent: ${detectedType}
${searchContext}
${historyContext}

Provide a helpful, conversational response that:
1. Directly addresses their question with insight
2. References relevant search findings naturally (don't list them)
3. Recommends the appropriate CookinFlips platform if relevant
4. Ends with a clear next step they can take`

    // Try Anthropic first
    let analysis = ""
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
            max_tokens: 1024,
            system: SAINTSAL_SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: userMessage,
              },
            ],
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

    // Fallback to OpenAI if Anthropic fails
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
            max_tokens: 1024,
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

    // Final fallback
    if (!analysis) {
      analysis = getFallbackAnalysis(query, detectedType)
    }

    // Determine recommended platforms based on query and detected type
    const recommendedPlatforms: string[] = []
    const queryLower = query.toLowerCase()

    if (
      detectedType === "lending" ||
      queryLower.match(/\b(loan|lend|financing|capital|fund|dscr|bridge|construction|mortgage)\b/)
    ) {
      recommendedPlatforms.push("lending")
    }

    if (
      detectedType === "property-analysis" ||
      queryLower.match(/\b(analyze|analysis|arv|mao|flip|rehab|deal|roi|profit)\b/)
    ) {
      recommendedPlatforms.push("property-analysis")
    }

    if (
      detectedType === "real-estate" ||
      queryLower.match(
        /\b(property|real estate|house|flip|invest.*property|buy.*property|rent|apartment|commercial)\b/
      )
    ) {
      recommendedPlatforms.push("real-estate")
    }

    if (
      detectedType === "stocks" ||
      marketData ||
      queryLower.match(
        /\b(stock|invest|portfolio|syndication|equity|market|trade|dividend|returns)\b/
      )
    ) {
      recommendedPlatforms.push("stocks")
    }

    // Extract any action items or CTAs from the analysis
    const suggestedActions = extractActions(analysis, recommendedPlatforms)

    return NextResponse.json({
      analysis,
      recommendedPlatforms,
      suggestedActions,
      detectedType,
      sourcesUsed: webResults.length,
      hasMarketData: !!marketData,
    })
  } catch (error) {
    console.error("[SaintSal] AI Analysis error:", error)

    // Fallback response
    return NextResponse.json({
      analysis:
        "I'm having a moment processing that request. Let me try a different approach — what specific area are you most interested in? Property analysis? Financing? Or investment opportunities?",
      recommendedPlatforms: [],
      suggestedActions: [
        { label: "Analyze a Property", route: "/analysis", type: "property-analysis" },
        { label: "Explore Lending", route: "/lending/products", type: "lending" },
        { label: "Browse Portal", route: "/portal", type: "real-estate" },
      ],
      detectedType: "general",
      sourcesUsed: 0,
      hasMarketData: false,
    })
  }
}

function getFallbackAnalysis(query: string, detectedType: string): string {
  const fallbacks: Record<string, string> = {
    lending:
      "Based on your inquiry about financing, I'd recommend exploring our lending products. We offer DSCR loans, bridge financing, fix-and-flip loans, and commercial mortgages — all designed for real estate investors. Head over to our lending section to see current rates and submit an application.",
    "property-analysis":
      "It sounds like you want to analyze a potential deal. Our Property Analysis tool can calculate your Maximum Allowable Offer (MAO), projected ROI, cash-on-cash returns, and more. I'll even give you an AI verdict on whether the deal is worth pursuing. Let's run those numbers.",
    "real-estate":
      "Looking to find your next investment property? Our portal has both wholesale deals and syndication opportunities across multiple markets. Whether you're looking for fix-and-flip, buy-and-hold, or passive investments, we've got options.",
    stocks:
      "For investment portfolio questions, our platform offers real estate syndication opportunities with projected returns of 15-25%. These are passive investments where you can participate alongside experienced sponsors.",
    general:
      "I'm here to help you navigate the full capital stack — from property analysis and deal evaluation to financing and investment opportunities. What's on your mind? Are you looking to analyze a specific property, find financing, or explore investment options?",
  }

  return fallbacks[detectedType] || fallbacks.general
}

function extractActions(
  analysis: string,
  platforms: string[]
): Array<{ label: string; route: string; type: string }> {
  const actions: Array<{ label: string; route: string; type: string }> = []

  if (platforms.includes("property-analysis")) {
    actions.push({ label: "Analyze Property", route: "/analysis", type: "property-analysis" })
  }

  if (platforms.includes("lending")) {
    actions.push({ label: "View Loan Options", route: "/lending/products", type: "lending" })
  }

  if (platforms.includes("real-estate")) {
    actions.push({ label: "Browse Properties", route: "/portal", type: "real-estate" })
  }

  if (platforms.includes("stocks")) {
    actions.push({ label: "View Investments", route: "/portal", type: "stocks" })
  }

  // Always offer to start an application if lending is relevant
  if (platforms.includes("lending") && analysis.toLowerCase().includes("appl")) {
    actions.push({ label: "Start Application", route: "/lending/apply", type: "lending" })
  }

  return actions
}
