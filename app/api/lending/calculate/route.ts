import { type NextRequest, NextResponse } from "next/server"
import {
  LOAN_PRODUCTS,
  calculateMonthlyPayment,
  calculateTotalInterest,
  getRateForCredit,
  calculateDSCR,
  calculateLTV,
  calculateLTC,
  calculateFlipProfit,
} from "@/lib/lending-config"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      loanType,
      loanAmount,
      propertyValue,
      creditScore,
      term,
      monthlyRent,
      purchasePrice,
      rehabBudget,
      arv,
      monthlyExpenses = 0,
      sellingCostsPercent = 8,
    } = body

    // Validate loan type
    const product = LOAN_PRODUCTS[loanType]
    if (!product) {
      return NextResponse.json(
        { error: "Invalid loan type" },
        { status: 400 }
      )
    }

    // Calculate rate based on credit score
    const rate = getRateForCredit(product, creditScore || 700)

    // Calculate term in years
    const termYears = product.termUnit === "months" ? (term || 12) / 12 : (term || 30)

    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rate, termYears)

    // Calculate total interest
    const totalInterest = calculateTotalInterest(loanAmount, monthlyPayment, termYears)

    // Calculate total payments
    const totalPayments = monthlyPayment * termYears * 12

    // Calculate LTV if property value provided
    const ltv = propertyValue > 0 ? calculateLTV(loanAmount, propertyValue) : 0

    // Calculate DSCR if monthly rent provided
    const dscr = monthlyRent > 0 ? calculateDSCR(monthlyRent, monthlyPayment, monthlyExpenses) : 0

    // Calculate LTC if applicable
    let ltc = 0
    if (purchasePrice && rehabBudget) {
      ltc = calculateLTC(loanAmount, purchasePrice + rehabBudget)
    }

    // Calculate flip profit if fix & flip loan
    let flipAnalysis = null
    if (loanType === "fix_flip" && purchasePrice && rehabBudget && arv) {
      const holdingCosts = monthlyPayment * termYears * 12
      flipAnalysis = calculateFlipProfit(
        purchasePrice,
        rehabBudget,
        holdingCosts,
        arv,
        sellingCostsPercent
      )
    }

    // Build warnings array
    const warnings: string[] = []
    if (product.maxLTV && ltv > product.maxLTV) {
      warnings.push(`LTV of ${ltv.toFixed(1)}% exceeds max of ${product.maxLTV}%`)
    }
    if (product.minCredit && creditScore < product.minCredit) {
      warnings.push(`Credit score ${creditScore} below minimum of ${product.minCredit}`)
    }
    if (product.minDSCR && dscr > 0 && dscr < product.minDSCR) {
      warnings.push(`DSCR of ${dscr.toFixed(2)} below minimum of ${product.minDSCR}`)
    }
    if (loanAmount < product.minAmount) {
      warnings.push(`Loan amount below minimum of $${product.minAmount.toLocaleString()}`)
    }
    if (loanAmount > product.maxAmount) {
      warnings.push(`Loan amount exceeds maximum of $${product.maxAmount.toLocaleString()}`)
    }

    // Build response
    const results = {
      success: true,
      loanType: product.name,
      inputs: {
        loanAmount,
        propertyValue,
        creditScore,
        term,
        termUnit: product.termUnit || "years",
      },
      calculations: {
        rate: parseFloat(rate.toFixed(3)),
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalPayments: parseFloat(totalPayments.toFixed(2)),
        ltv: parseFloat(ltv.toFixed(2)),
        dscr: parseFloat(dscr.toFixed(2)),
        ltc: parseFloat(ltc.toFixed(2)),
      },
      loanLimits: {
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        maxLTV: product.maxLTV,
        maxLTC: product.maxLTC,
        minCredit: product.minCredit,
        minDSCR: product.minDSCR,
      },
      flipAnalysis: flipAnalysis ? {
        profit: parseFloat(flipAnalysis.profit.toFixed(2)),
        roi: parseFloat(flipAnalysis.roi.toFixed(2)),
      } : null,
      warnings,
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Loan calculation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to calculate loan" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve loan product info
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const loanType = searchParams.get("type")

  if (loanType) {
    const product = LOAN_PRODUCTS[loanType]
    if (!product) {
      return NextResponse.json(
        { error: "Invalid loan type" },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: true, product })
  }

  // Return all products grouped by category
  const products = Object.entries(LOAN_PRODUCTS).reduce((acc, [key, product]) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push({ productId: key, ...product })
    return acc
  }, {} as Record<string, any[]>)

  return NextResponse.json({
    success: true,
    products,
    totalProducts: Object.keys(LOAN_PRODUCTS).length,
  })
}
