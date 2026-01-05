"use client"

import { PropertyAnalysisForm } from "./property-analysis-form"
import { Calculator, Phone, ArrowLeft, Brain, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function PropertyAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/TRANSPARENTSAINTSALLOGO.png"
                  alt="CookinFlips"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div>
                  <span className="text-xl md:text-2xl font-bold text-gold">Cookin&apos;</span>
                  <span className="text-xl md:text-2xl font-light text-white">Flips</span>
                </div>
                <div className="text-[9px] md:text-[10px] text-gold/70 tracking-wider">
                  POWERED BY SAINTSAL.AI
                </div>
              </div>
            </Link>

            {/* Right side nav */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-white/70 hover:text-gold transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <a
                href="tel:9499972097"
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-sm"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">(949) 997-2097</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#0a0a0a] border-b border-gold/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(212,175,55,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-6"
          >
            <div className="p-4 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl border border-gold/30 shadow-gold w-fit">
              <Calculator className="w-10 h-10 md:w-12 md:h-12 text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-xs font-medium">
                  Deal Analyzer
                </span>
                <span className="flex items-center gap-1 text-white/40 text-xs">
                  <Brain className="w-3 h-3" />
                  SaintSal™ AI Powered
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                Property <span className="text-gold">Analysis</span>
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-2xl">
                Comprehensive deal analysis for real estate investments. Calculate potential profit,
                ROI, and cash-on-cash returns instantly with our intelligent analysis tools.
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {[
              { label: "70% Rule", desc: "MAO Auto-Calc" },
              { label: "8 Sections", desc: "Comprehensive" },
              { label: "Live ROI", desc: "Real-time" },
              { label: "AI Analysis", desc: "Deal Verdict" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 bg-black/40 border border-white/10 rounded-xl hover:border-gold/30 transition"
              >
                <div className="text-gold font-bold text-lg">{stat.label}</div>
                <div className="text-white/50 text-sm">{stat.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="bg-gold/5 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-gold font-medium">
              <Building2 className="w-4 h-4" />
              How to use:
            </div>
            <p className="text-white/60">
              Enter your property details below. Each field includes a tooltip with detailed
              explanations. Sections can be collapsed or expanded. Save your analysis to receive a
              copy via email.
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <PropertyAnalysisForm />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/TRANSPARENTSAINTSALLOGO.png"
                    alt="CookinFlips"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-gold font-bold">Cookin&apos;Flips</span>
              </div>
              <p className="text-white/40 text-xs">
                438 Main St., Suite 220, Huntington Beach, CA 92648
              </p>
            </div>

            <div className="text-center text-white/40 text-xs">
              <p>Calculations are estimates only.</p>
              <p>Consult with qualified professionals before making investment decisions.</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
              <a
                href="tel:9499972097"
                className="text-gold hover:text-gold-light transition font-medium"
              >
                (949) 997-2097
              </a>
              <p className="text-white/40 text-xs">Powered by SaintSal™ AI</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
