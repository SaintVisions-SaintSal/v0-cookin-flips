"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"

const UNIT_JWT_TOKEN = "v2.public.eyJyb2xlIjoiYWRtaW4iLCJyb2xlcyI6WyJhZG1pbiJdLCJ1c2VySWQiOiI0NzE3NSIsInN1YiI6InJ5YW5AY29va2luLmlvIiwiZXhwIjoiMjAyNy0wMS0yOFQyMDoxMzoyNC43MDlaIiwianRpIjoiNTc2NTI4Iiwib3JnSWQiOiI4OTYwIiwic2NvcGUiOiJhcHBsaWNhdGlvbnMgYXBwbGljYXRpb25zLXdyaXRlIGN1c3RvbWVycyBjdXN0b21lcnMtd3JpdGUgY3VzdG9tZXItdGFncy13cml0ZSBjdXN0b21lci10b2tlbi13cml0ZSBhY2NvdW50cyBhY2NvdW50cy13cml0ZSBhY2NvdW50LWhvbGRzIGFjY291bnQtaG9sZHMtd3JpdGUgY2FyZHMgY2FyZHMtd3JpdGUgY2FyZHMtc2Vuc2l0aXZlIGNhcmRzLXNlbnNpdGl2ZS13cml0ZSB0cmFuc2FjdGlvbnMgdHJhbnNhY3Rpb25zLXdyaXRlIGF1dGhvcml6YXRpb25zIHN0YXRlbWVudHMgcGF5bWVudHMgcGF5bWVudHMtd3JpdGUgcGF5bWVudHMtd3JpdGUtY291bnRlcnBhcnR5IHBheW1lbnRzLXdyaXRlLWxpbmtlZC1hY2NvdW50IGFjaC1wYXltZW50cy13cml0ZSB3aXJlLXBheW1lbnRzLXdyaXRlIHJlcGF5bWVudHMgcGF5bWVudHMtd3JpdGUtYWNoLWRlYml0IGNvdW50ZXJwYXJ0aWVzIGNvdW50ZXJwYXJ0aWVzLXdyaXRlIGJhdGNoLXJlbGVhc2VzIGJhdGNoLXJlbGVhc2VzLXdyaXRlIGxpbmtlZC1hY2NvdW50cyBsaW5rZWQtYWNjb3VudHMtd3JpdGUgd2ViaG9va3Mgd2ViaG9va3Mtd3JpdGUgZXZlbnRzIGV2ZW50cy13cml0ZSBhdXRob3JpemF0aW9uLXJlcXVlc3RzIGF1dGhvcml6YXRpb24tcmVxdWVzdHMtd3JpdGUgY2FzaC1kZXBvc2l0cyBjYXNoLWRlcG9zaXRzLXdyaXRlIGNoZWNrLWRlcG9zaXRzIGNoZWNrLWRlcG9zaXRzLXdyaXRlIHJlY2VpdmVkLXBheW1lbnRzIHJlY2VpdmVkLXBheW1lbnRzLXdyaXRlIGRpc3B1dGVzIGNoYXJnZWJhY2tzIGNoYXJnZWJhY2tzLXdyaXRlIHJld2FyZHMgcmV3YXJkcy13cml0ZSBjaGVjay1wYXltZW50cyBjaGVjay1wYXltZW50cy13cml0ZSBjcmVkaXQtZGVjaXNpb25zIGNyZWRpdC1kZWNpc2lvbnMtd3JpdGUgbGVuZGluZy1wcm9ncmFtcyBsZW5kaW5nLXByb2dyYW1zLXdyaXRlIGNhcmQtZnJhdWQtY2FzZXMgY2FyZC1mcmF1ZC1jYXNlcy13cml0ZSBjcmVkaXQtYXBwbGljYXRpb25zIGNyZWRpdC1hcHBsaWNhdGlvbnMtd3JpdGUgbWlncmF0aW9ucyBtaWdyYXRpb25zLXdyaXRlIHRheCB0YXgtd3JpdGUgZm9ybXMgZm9ybXMtd3JpdGUgZm9ybXMtc2Vuc2l0aXZlIHdpcmUtZHJhd2Rvd25zIHdpcmUtZHJhd2Rvd25zLXdyaXRlIiwib3JnIjoiU2FpbnQgVmlzaW9uIFRlY2hub2xvZ2llcyBMTEMiLCJzb3VyY2VJcCI6IiIsInVzZXJUeXBlIjoib3JnIiwiaXNVbml0UGlsb3QiOmZhbHNlLCJpc1BhcmVudE9yZyI6ZmFsc2V9O4-mDM-eG-Cg1jrf4OhT71DAjvD-OOI7-evIWLFkaT3oVYs9-Jd4q88tggnuADydGncOE12eG8AxUE4g7NPjBA"

export default function BankingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Banking page mounted, waiting for Unit.co components to load")
    
    // Check if Unit.co script is loaded
    const checkUnitLoaded = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).customElements?.get("unit-elements-white-label-app")) {
        setIsLoading(false)
        clearInterval(checkUnitLoaded)
        console.log("[v0] Unit.co web components loaded successfully")
      }
    }, 100)

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false)
      clearInterval(checkUnitLoaded)
      console.log("[v0] Timeout reached, showing banking interface")
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
      <div className="pt-16 min-h-screen">
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading banking platform...</p>
              <p className="text-white/40 text-sm mt-2">Initializing Unit.co components...</p>
            </div>
          </div>
        )}

        {/* Unit.co White Label App */}
        <div className={isLoading ? "hidden" : "block"}>
          <unit-elements-white-label-app jwt-token={UNIT_JWT_TOKEN} />
        </div>
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
