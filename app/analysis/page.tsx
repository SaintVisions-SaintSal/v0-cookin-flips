"use client"

import { PropertyAnalysisForm } from "./property-analysis-form"
import { Calculator, Phone, ArrowLeft, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PropertyAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Compact Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Logo" width={32} height={32} className="object-contain" />
              <span className="text-lg font-bold"><span className="text-gold">Cookin&apos;</span><span className="text-white">Flips</span></span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-gold transition text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
              <Link href="/research" className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-gold transition text-sm">
                <Brain className="w-4 h-4" /> SaintSal™
              </Link>
              <a href="tel:9499972097" className="px-4 py-2 bg-gold text-black font-semibold rounded-lg text-sm hover:bg-gold/90 transition">
                (949) 997-2097
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Simple Header */}
      <div className="border-b border-white/10 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl border border-gold/20">
              <Calculator className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Deal Analyzer</h1>
              <p className="text-white/50 text-sm">Calculate MAO, ROI, and get an AI verdict on your deal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PropertyAnalysisForm />
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>Calculations are estimates. Consult professionals before investing.</span>
          <span>Powered by SaintSal™ AI • Patent #10,290,222</span>
        </div>
      </footer>
    </main>
  )
}
