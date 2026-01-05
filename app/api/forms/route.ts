import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      formType,
      name,
      email,
      phone,
      message,
      propertyAddress,
      propertyCity,
      propertyState,
      propertyType,
      purchasePrice,
      rehabBudget,
      arv,
      investmentAmount,
      loanAmount,
      loanType,
      referralCode,
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Build email content based on form type
    let subject = ""
    let htmlContent = ""

    switch (formType) {
      case "wholesale":
        subject = `🏠 New Wholesale Inquiry from ${name}`
        htmlContent = `
          <h2>New Wholesale Property Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          ${propertyAddress ? `<p><strong>Property:</strong> ${propertyAddress}, ${propertyCity}, ${propertyState}</p>` : ""}
          <p><strong>Message:</strong> ${message || "No message"}</p>
        `
        break

      case "investment":
        subject = `💰 New Investment Inquiry from ${name}`
        htmlContent = `
          <h2>New Investment Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Investment Amount:</strong> $${investmentAmount?.toLocaleString() || "Not specified"}</p>
          <p><strong>Message:</strong> ${message || "No message"}</p>
        `
        break

      case "lending":
        subject = `🏦 New Loan Inquiry from ${name}`
        htmlContent = `
          <h2>New Lending Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Loan Type:</strong> ${loanType || "Not specified"}</p>
          <p><strong>Loan Amount:</strong> $${loanAmount?.toLocaleString() || "Not specified"}</p>
          ${propertyAddress ? `<p><strong>Property:</strong> ${propertyAddress}, ${propertyCity}, ${propertyState}</p>` : ""}
          <p><strong>Message:</strong> ${message || "No message"}</p>
        `
        break

      case "affiliate":
        subject = `🚀 New Affiliate Inquiry from ${name}`
        htmlContent = `
          <h2>New Affiliate Program Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Message:</strong> ${message || "No message"}</p>
          ${referralCode ? `<p><strong>Referral Code:</strong> ${referralCode}</p>` : ""}
        `
        break

      case "contact":
      default:
        subject = `📬 New Contact from ${name} - CookinFlips + FlipEffective`
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Interest:</strong> ${formType || "General"}</p>
          <p><strong>Message:</strong> ${message || "No message"}</p>
          ${referralCode ? `<p><strong>Referral Code:</strong> ${referralCode}</p>` : ""}
        `
    }

    // Send notification email to team
    await resend.emails.send({
      from: "CookinFlips <notifications@saintsal.ai>",
      to: ["info@saintsal.ai", "ryan@saintsal.ai", "darren@flipeffective.com", "jr@saintsal.ai"],
      subject: subject,
      html: htmlContent,
    })

    // Send confirmation to user
    await resend.emails.send({
      from: "CookinFlips <hello@saintsal.ai>",
      to: [email],
      subject: "Thank you for contacting CookinFlips + FlipEffective!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0a0a; padding: 40px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0;">CookinFlips</h1>
            <p style="color: #888; margin-top: 5px; font-size: 12px;">POWERED BY SAINTSAL.AI</p>
            <p style="margin-top: 5px;">
              <span style="color: #fff; font-weight: bold;">Flip</span><span style="color: #00CED1; font-weight: bold;">Effective</span>
            </p>
          </div>
          <div style="padding: 40px; background: #1a1a1a; color: #fff;">
            <h2 style="color: #D4AF37;">Thank you, ${name}!</h2>
            <p style="color: #ccc; line-height: 1.6;">
              We've received your inquiry and a member of our team will be in touch within 24 hours.
            </p>
            <p style="color: #ccc; line-height: 1.6;">
              In the meantime, feel free to:
            </p>
            <ul style="color: #ccc; line-height: 1.8;">
              <li>Browse our <a href="https://cookinflips.com/portal" style="color: #D4AF37;">Investment Portal</a></li>
              <li>Call us at <a href="tel:9499972097" style="color: #D4AF37;">(949) 997-2097</a></li>
              <li>Try our AI assistant: <a href="https://saintsal.ai" style="color: #D4AF37;">SaintSal.ai</a></li>
              <li>Visit <a href="https://saintsal.ai" style="color: #D4AF37;">SaintSal.ai</a></li>
            </ul>
            <div style="margin-top: 30px; padding: 20px; background: #111; border-radius: 8px; border: 1px solid #333;">
              <p style="color: #D4AF37; font-weight: bold; margin: 0 0 10px 0;">Join Our Affiliate Program</p>
              <p style="color: #888; font-size: 14px; margin: 0;">
                Interested in earning with us? Contact our Presidents:<br>
                <strong style="color: #00CED1;">Darren Brown (CEO)</strong> - <a href="https://saintsal.ai/darren" style="color: #00CED1;">saintsal.ai/darren</a><br>
                <strong style="color: #D4AF37;">JR Taber (President)</strong> - <a href="https://saintsal.ai/jr" style="color: #D4AF37;">saintsal.ai/jr</a>
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                CookinFlips + FlipEffective | Powered by SaintSal.ai<br>
                438 Main St., Suite 220<br>
                Huntington Beach, CA 92648<br><br>
                <span style="color: #666;">© 2025 Saint Vision Technologies LLC. US Patent #10,290,222</span>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    })
  } catch (error: any) {
    console.error("Form submission error:", error)
    return NextResponse.json({ error: error.message || "Failed to submit form" }, { status: 500 })
  }
}
