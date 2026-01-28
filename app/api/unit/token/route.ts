import { NextResponse } from "next/server"
import { SignJWT, importPKCS8 } from "jose"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Get the authenticated user from Supabase
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] No authenticated user for Unit.co token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Generating Unit.co token for user:", user.id)

    const privateKeyPem = process.env.UNIT_PRIVATE_KEY
    const keyId = process.env.UNIT_KEY_ID || "cookinflips-unit-key-1"

    if (!privateKeyPem) {
      return NextResponse.json(
        { error: "Unit.co private key not configured" },
        { status: 500 }
      )
    }

    // Import the private key
    const privateKey = await importPKCS8(privateKeyPem, "RS256")

    // Create JWT token for the user
    const token = await new SignJWT({
      sub: user.email,
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "RS256", kid: keyId })
      .setIssuer("https://cookinflips.com")
      .setAudience("https://api.s.unit.sh")
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(privateKey)

    console.log("[v0] Unit.co token generated successfully")

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[v0] Error generating Unit.co token:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}
