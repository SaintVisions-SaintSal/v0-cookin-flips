import { NextResponse } from "next/server"

export async function GET() {
  try {
    const token = process.env.UNIT_CO_JWT_TOKEN

    if (!token) {
      return NextResponse.json({ error: "Unit.co token not configured" }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[v0] Error fetching Unit.co token:", error)
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 })
  }
}
