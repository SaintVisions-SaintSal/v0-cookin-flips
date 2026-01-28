import { NextResponse } from "next/server"

export async function GET() {
  try {
    const publicKeyPem = process.env.UNIT_PUBLIC_KEY

    if (!publicKeyPem) {
      return NextResponse.json(
        { error: "Public key not configured" },
        { status: 500 }
      )
    }

    // Convert PEM to JWK format
    const keyData = publicKeyPem
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s/g, "")

    const jwk = {
      kty: "RSA",
      use: "sig",
      kid: process.env.UNIT_KEY_ID || "cookinflips-unit-key-1",
      n: keyData,
      alg: "RS256",
    }

    const jwks = {
      keys: [jwk],
    }

    console.log("[v0] JWKS endpoint called, returning public key")

    return NextResponse.json(jwks, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Error generating JWKS:", error)
    return NextResponse.json(
      { error: "Failed to generate JWKS" },
      { status: 500 }
    )
  }
}
