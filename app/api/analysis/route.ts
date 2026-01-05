import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// GHL (GoHighLevel) Webhook URL - configure in environment
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || ""

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userName, userEmail, formData, calculations } = body

    // Validate required fields
    if (!userName || !userEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Format currency helper
    const formatCurrency = (num: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num || 0)

    // Prepare analysis summary for notifications
    const analysisSummary = {
      propertyAddress: formData.propertyAddress || "Not provided",
      totalSqFt: formData.totalSquareFootage || 0,
      evaluator: formData.evaluatorName || userName,
      afterRepairValue: formatCurrency(formData.afterRepairValue),
      purchasePrice: formatCurrency(formData.purchasePrice),
      repairCosts: formatCurrency(formData.estimatedRepairCosts),
      mao: formatCurrency(formData.maximumAllowableOffer),
      holdTime: `${formData.estimatedHoldTime || 6} months`,
      totalFinancingCosts: formatCurrency(calculations.totalFinancingCosts),
      totalHoldingCosts: formatCurrency(calculations.totalHoldingCosts),
      totalBuyingCosts: formatCurrency(calculations.totalBuyingCosts),
      totalSellingCosts: formatCurrency(calculations.totalSellingCosts),
      totalCosts: formatCurrency(calculations.totalCosts),
      estimatedProfit: formatCurrency(calculations.estimatedNetProfit),
      purchaseRehabROI: `${calculations.purchaseRehabROI?.toFixed(2) || 0}%`,
      totalCostsROI: `${calculations.totalCostsROI?.toFixed(2) || 0}%`,
      myCommittedCapital: formatCurrency(calculations.myCommittedCapital),
      repairCostPerSqFt: formatCurrency(calculations.repairCostPerSqFt),
      myAnnualizedCashOnCash: `${calculations.myAnnualizedCashOnCash?.toFixed(2) || 0}%`,
    }

    // Determine deal quality
    const getDealVerdict = () => {
      const roi = calculations.purchaseRehabROI || 0
      const profit = calculations.estimatedNetProfit || 0
      if (roi >= 25 && profit > 50000) return { verdict: "EXCELLENT DEAL", color: "#22c55e" }
      if (roi >= 15 && profit > 25000) return { verdict: "GOOD OPPORTUNITY", color: "#D4AF37" }
      if (roi >= 5 && profit > 0) return { verdict: "PROCEED WITH CAUTION", color: "#eab308" }
      return { verdict: "NOT RECOMMENDED", color: "#ef4444" }
    }
    const dealVerdict = getDealVerdict()

    // Build email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #0a0a0a;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px; text-align: center; border-bottom: 2px solid #D4AF37;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">Property Analysis Report</h1>
          <p style="color: #888; margin-top: 8px; font-size: 12px; letter-spacing: 2px;">POWERED BY SAINTSAL.AI</p>
        </div>

        <!-- Deal Verdict Banner -->
        <div style="background: ${dealVerdict.color}20; border-left: 4px solid ${dealVerdict.color}; padding: 20px; margin: 20px;">
          <div style="font-size: 12px; color: #D4AF37; margin-bottom: 4px;">SaintSal™ AI Analysis</div>
          <div style="font-size: 24px; font-weight: bold; color: ${dealVerdict.color};">${dealVerdict.verdict}</div>
        </div>

        <!-- User Info -->
        <div style="padding: 20px 40px;">
          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px;">
            <h3 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 16px;">Submitted By</h3>
            <p style="color: #fff; margin: 5px 0;"><strong>Name:</strong> ${userName}</p>
            <p style="color: #fff; margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="color: #fff; margin: 5px 0;"><strong>Evaluator:</strong> ${analysisSummary.evaluator}</p>
          </div>
        </div>

        <!-- Property Details -->
        <div style="padding: 0 40px 20px;">
          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px;">
            <h3 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 16px;">Property Details</h3>
            <p style="color: #fff; margin: 5px 0;"><strong>Address:</strong> ${analysisSummary.propertyAddress}</p>
            <p style="color: #fff; margin: 5px 0;"><strong>Square Footage:</strong> ${analysisSummary.totalSqFt.toLocaleString()} sq ft</p>
            <p style="color: #fff; margin: 5px 0;"><strong>Hold Time:</strong> ${analysisSummary.holdTime}</p>
            ${formData.propertyDescription ? `<p style="color: #888; margin: 15px 0 5px 0; font-style: italic;">${formData.propertyDescription}</p>` : ""}
          </div>
        </div>

        <!-- Financial Summary -->
        <div style="padding: 0 40px 20px;">
          <div style="background: #111; border: 1px solid #D4AF37; border-radius: 8px; padding: 20px;">
            <h3 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 16px;">Financial Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">After Repair Value (ARV)</td>
                <td style="color: #fff; text-align: right; padding: 10px 0; font-weight: bold;">${analysisSummary.afterRepairValue}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Purchase Price</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.purchasePrice}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Estimated Repair Costs</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.repairCosts}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Maximum Allowable Offer (MAO)</td>
                <td style="color: #D4AF37; text-align: right; padding: 10px 0; font-weight: bold;">${analysisSummary.mao}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Total Financing Costs</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.totalFinancingCosts}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Total Holding Costs</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.totalHoldingCosts}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Total Buying Costs</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.totalBuyingCosts}</td>
              </tr>
              <tr style="border-bottom: 1px solid #333;">
                <td style="color: #888; padding: 10px 0;">Total Selling Costs</td>
                <td style="color: #fff; text-align: right; padding: 10px 0;">${analysisSummary.totalSellingCosts}</td>
              </tr>
              <tr style="background: #D4AF3710;">
                <td style="color: #D4AF37; padding: 15px 0; font-weight: bold; font-size: 16px;">Estimated NET PROFIT</td>
                <td style="color: ${calculations.estimatedNetProfit >= 0 ? "#22c55e" : "#ef4444"}; text-align: right; padding: 15px 0; font-weight: bold; font-size: 20px;">${analysisSummary.estimatedProfit}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- ROI Metrics -->
        <div style="padding: 0 40px 20px;">
          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 20px;">
            <h3 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 16px;">Return Analysis</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
              <div style="flex: 1; min-width: 150px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 15px;">
                <div style="color: #888; font-size: 12px;">Purchase + Rehab ROI</div>
                <div style="color: ${calculations.purchaseRehabROI >= 0 ? "#22c55e" : "#ef4444"}; font-size: 24px; font-weight: bold;">${analysisSummary.purchaseRehabROI}</div>
              </div>
              <div style="flex: 1; min-width: 150px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 15px;">
                <div style="color: #888; font-size: 12px;">Total Costs ROI</div>
                <div style="color: ${calculations.totalCostsROI >= 0 ? "#22c55e" : "#ef4444"}; font-size: 24px; font-weight: bold;">${analysisSummary.totalCostsROI}</div>
              </div>
              <div style="flex: 1; min-width: 150px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 15px;">
                <div style="color: #888; font-size: 12px;">Cash on Cash Return</div>
                <div style="color: ${calculations.myAnnualizedCashOnCash >= 0 ? "#22c55e" : "#ef4444"}; font-size: 24px; font-weight: bold;">${analysisSummary.myAnnualizedCashOnCash}</div>
              </div>
              <div style="flex: 1; min-width: 150px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; padding: 15px;">
                <div style="color: #888; font-size: 12px;">My Committed Capital</div>
                <div style="color: #D4AF37; font-size: 24px; font-weight: bold;">${analysisSummary.myCommittedCapital}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="padding: 20px 40px;">
          <div style="background: linear-gradient(135deg, #D4AF37 0%, #b8960e 100%); border-radius: 8px; padding: 25px; text-align: center;">
            <h3 style="color: #000; margin: 0 0 10px 0;">Need Financing for This Deal?</h3>
            <p style="color: #000; margin: 0 0 15px 0; opacity: 0.8;">Get funded in as little as 7 days with competitive rates</p>
            <a href="tel:9499972097" style="display: inline-block; background: #000; color: #D4AF37; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Call (949) 997-2097</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 30px 40px; border-top: 1px solid #333; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            CookinFlips | Powered by SaintSal.ai<br>
            438 Main St., Suite 220, Huntington Beach, CA 92648<br><br>
            <span style="color: #666;">Calculations are estimates only. Consult with qualified professionals before making investment decisions.</span>
          </p>
        </div>
      </div>
    `

    // Send notification email to team
    await resend.emails.send({
      from: "CookinFlips <notifications@saintsal.ai>",
      to: ["support@cookin.io", "info@saintsal.ai", "ryan@saintsal.ai"],
      subject: `Property Analysis: ${analysisSummary.propertyAddress} - ${dealVerdict.verdict}`,
      html: emailHtml,
    })

    // Send confirmation to user
    await resend.emails.send({
      from: "CookinFlips <analysis@saintsal.ai>",
      to: [userEmail],
      subject: `Your Property Analysis: ${analysisSummary.propertyAddress}`,
      html: emailHtml,
    })

    // Submit to GHL webhook if configured
    if (GHL_WEBHOOK_URL) {
      try {
        await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "property_analysis",
            contact: {
              name: userName,
              email: userEmail,
            },
            property: {
              address: formData.propertyAddress,
              sqft: formData.totalSquareFootage,
              arv: formData.afterRepairValue,
              purchasePrice: formData.purchasePrice,
              repairCosts: formData.estimatedRepairCosts,
            },
            analysis: {
              verdict: dealVerdict.verdict,
              estimatedProfit: calculations.estimatedNetProfit,
              roi: calculations.purchaseRehabROI,
              mao: formData.maximumAllowableOffer,
            },
            source: "property_analysis_form",
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (ghlError) {
        console.error("GHL webhook error:", ghlError)
        // Don't fail the request if GHL fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Analysis submitted successfully",
      verdict: dealVerdict.verdict,
    })
  } catch (error: any) {
    console.error("Analysis submission error:", error)
    return NextResponse.json({ error: error.message || "Failed to submit analysis" }, { status: 500 })
  }
}
