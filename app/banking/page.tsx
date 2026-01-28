"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function BankingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if Unit.co script is loaded
    const checkUnitLoaded = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).customElements?.get("unit-elements-white-label-app")) {
        setIsLoading(false)
        clearInterval(checkUnitLoaded)
      }
    }, 100)

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false)
      clearInterval(checkUnitLoaded)
    }, 10000)

    return () => {
      clearInterval(checkUnitLoaded)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold">
                  <span className="text-gold">Cookin'</span>
                  <span className="text-white">Flips</span>
                </span>
                <span className="text-[9px] text-white/40">Banking Platform</span>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-gold transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading banking platform...</p>
            </div>
          </div>
        )}

        {/* Unit.co White Label App */}
        <unit-elements-white-label-app jwt-token={process.env.NEXT_PUBLIC_UNIT_CO_JWT_TOKEN || ""} />
      </div>
    </div>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "unit-elements-white-label-app": {
        "jwt-token": string
        children?: React.ReactNode
      }
    }
  }
}
