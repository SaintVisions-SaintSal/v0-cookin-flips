"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  Calculator,
  Send,
  Loader2,
  Home,
  Briefcase,
  Star,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Shield,
  Award,
  Info,
  ChevronDown,
  Percent,
  Calendar,
  Target,
  Zap,
  Users,
  FileText,
} from "lucide-react"
import {
  LOAN_PRODUCTS,
  LOAN_CATEGORIES,
  getLoansByCategory,
  getHighlightedLoans,
  formatRate,
  formatAmount,
  calculateMonthlyPayment,
  calculateTotalInterest,
  getRateForCredit,
  calculateDSCR,
  calculateLTV,
  calculateFlipProfit,
  type LoanProduct,
} from "@/lib/lending-config"

// Category icons mapping
const categoryIcons: Record<string, any> = {
  residential: Home,
  commercial: Building2,
  business: Briefcase,
  specialty: Star,
}

// Credit score options
const creditScoreOptions = [
  { value: 760, label: "Excellent (760+)" },
  { value: 720, label: "Very Good (720-759)" },
  { value: 680, label: "Good (680-719)" },
  { value: 640, label: "Fair (640-679)" },
  { value: 600, label: "Below Average (600-639)" },
  { value: 550, label: "Poor (Below 600)" },
]

export default function LendingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("residential")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showApplication, setShowApplication] = useState(false)

  // Calculator state
  const [calcInputs, setCalcInputs] = useState({
    loanAmount: 250000,
    propertyValue: 350000,
    creditScore: 680,
    term: 30,
    monthlyRent: 2500,
    purchasePrice: 200000,
    rehabBudget: 50000,
    arv: 320000,
  })

  const [calcResults, setCalcResults] = useState<{
    monthlyPayment: number
    rate: number
    totalInterest: number
    ltv: number
    dscr: number
    flipProfit?: number
    flipROI?: number
  } | null>(null)

  // Application form state
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    loanAmount: "",
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Filter loans by category and search
  const filteredLoans = Object.values(LOAN_PRODUCTS).filter((loan) => {
    const matchesCategory = activeCategory === "all" || loan.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredLoans = getHighlightedLoans()

  // Calculate loan
  const handleCalculate = () => {
    if (!selectedLoan) return

    const rate = getRateForCredit(selectedLoan, calcInputs.creditScore)
    const termYears = selectedLoan.termUnit === "months" ? calcInputs.term / 12 : calcInputs.term
    const monthlyPayment = calculateMonthlyPayment(calcInputs.loanAmount, rate, termYears)
    const totalInterest = calculateTotalInterest(calcInputs.loanAmount, monthlyPayment, termYears)
    const ltv = calculateLTV(calcInputs.loanAmount, calcInputs.propertyValue)
    const dscr = calculateDSCR(calcInputs.monthlyRent, monthlyPayment)

    let flipResults = undefined
    if (selectedLoan.id === "fix_flip") {
      const holdingCosts = monthlyPayment * (calcInputs.term || 12)
      flipResults = calculateFlipProfit(
        calcInputs.purchasePrice,
        calcInputs.rehabBudget,
        holdingCosts,
        calcInputs.arv
      )
    }

    setCalcResults({
      monthlyPayment,
      rate,
      totalInterest,
      ltv,
      dscr,
      flipProfit: flipResults?.profit,
      flipROI: flipResults?.roi,
    })
  }

  // Open calculator for a loan
  const openCalculator = (loan: LoanProduct) => {
    setSelectedLoan(loan)
    setCalcInputs((prev) => ({
      ...prev,
      loanAmount: Math.round((loan.minAmount + loan.maxAmount) / 4),
      term: loan.termOptions?.[Math.floor((loan.termOptions?.length || 1) / 2)] || 30,
    }))
    setCalcResults(null)
    setShowCalculator(true)
  }

  // Open application
  const openApplication = (loan?: LoanProduct) => {
    if (loan) setSelectedLoan(loan)
    setShowApplication(true)
  }

  // Submit application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "lending",
          ...appForm,
          loanType: selectedLoan?.name,
          loanAmount: parseFloat(appForm.loanAmount.replace(/[^\d.]/g, "")) || 0,
          calculatedResults: calcResults,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setSubmitSuccess(true)
      setAppForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        loanAmount: "",
        propertyAddress: "",
        propertyCity: "",
        propertyState: "",
      })

      setTimeout(() => {
        setSubmitSuccess(false)
        setShowApplication(false)
      }, 3000)
    } catch (error) {
      setSubmitError("Failed to submit. Please try again or call (949) 630-1858")
    } finally {
      setSubmitting(false)
    }
  }

  // Format currency input
  const formatCurrencyInput = (value: string): string => {
    const num = parseFloat(value.replace(/[^\d.]/g, ""))
    if (isNaN(num)) return ""
    return "$" + num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="CookinFlips" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <div>
                  <span className="text-2xl font-bold text-gold">Cookin'</span>
                  <span className="text-2xl font-light text-white">Flips</span>
                </div>
                <div className="text-[10px] text-gold/70 tracking-wider">POWERED BY SAINTSAL.AI</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-white/80 hover:text-gold transition">
                Home
              </Link>
              <Link href="/#services" className="text-white/80 hover:text-gold transition">
                Services
              </Link>
              <Link href="/#invest" className="text-white/80 hover:text-gold transition">
                Invest
              </Link>
              <span className="text-gold font-semibold">Lending</span>
              <Link href="/#team" className="text-white/80 hover:text-gold transition">
                Leadership
              </Link>
              <Link href="/#contact" className="text-white/80 hover:text-gold transition">
                Contact
              </Link>
              <Link
                href="/portal"
                className="px-6 py-2.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
              >
                Investor Portal
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#111] border-t border-gold/20"
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="/" className="block py-2 text-white/80 hover:text-gold">
                  Home
                </Link>
                <Link href="/#services" className="block py-2 text-white/80 hover:text-gold">
                  Services
                </Link>
                <Link href="/#invest" className="block py-2 text-white/80 hover:text-gold">
                  Invest
                </Link>
                <span className="block py-2 text-gold font-semibold">Lending</span>
                <Link href="/#team" className="block py-2 text-white/80 hover:text-gold">
                  Leadership
                </Link>
                <Link href="/#contact" className="block py-2 text-white/80 hover:text-gold">
                  Contact
                </Link>
                <Link href="/portal" className="block w-full py-3 bg-gold text-black font-semibold rounded-lg text-center">
                  Investor Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-cyan-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
            >
              <DollarSign className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Saint Vision Group Lending Suite</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              <span className="text-gold">50+ Loan Products</span>
              <br />
              <span className="text-white">One Application</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 max-w-3xl mx-auto mb-8"
            >
              Full-service lending across all 51 states. Residential, commercial, business, and specialty financing.
              We fund everything - including cannabis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => openApplication()}
                className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center gap-2"
              >
                Get Pre-Qualified <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="tel:9496301858"
                className="px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition flex items-center gap-2"
              >
                <Phone className="w-5 h-5" /> (949) 630-1858
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, value: "51 States", label: "Coverage" },
              { icon: Clock, value: "24-48hrs", label: "Pre-Approval" },
              { icon: Target, value: "50+", label: "Loan Products" },
              { icon: TrendingUp, value: "$100M+", label: "Monthly Funding" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Loans */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold text-white">Featured Loan Programs</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoans.map((loan) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-2 border-gold/50 rounded-xl p-6 hover:border-gold transition cursor-pointer"
                onClick={() => openCalculator(loan)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{loan.icon}</span>
                  <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">FEATURED</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{loan.name}</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">{loan.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-white/50">Rate</div>
                    <div className="text-gold font-bold">{formatRate(loan)}</div>
                  </div>
                  <button className="p-2 bg-gold/20 rounded-lg hover:bg-gold/30 transition">
                    <Calculator className="w-5 h-5 text-gold" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search loan products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeCategory === "all"
                  ? "bg-gold text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              All Products
            </button>
            {Object.entries(LOAN_CATEGORIES).map(([key, cat]) => {
              const Icon = categoryIcons[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    activeCategory === key
                      ? "bg-gold text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Loan Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map((loan, i) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-xl p-6 hover:border-gold/50 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{loan.icon}</span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-gold transition">{loan.name}</h3>
                      <span className="text-xs text-white/50 capitalize">{loan.category}</span>
                    </div>
                  </div>
                  {loan.highlight && (
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">HOT</span>
                  )}
                </div>

                <p className="text-sm text-white/60 mb-4 line-clamp-2">{loan.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/50">Rate</div>
                    <div className="text-gold font-semibold">{formatRate(loan)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Amount</div>
                    <div className="text-white font-semibold">
                      {formatAmount(loan.minAmount)} - {formatAmount(loan.maxAmount)}
                    </div>
                  </div>
                </div>

                {loan.maxLTV && (
                  <div className="mb-4">
                    <div className="text-xs text-white/50">Max LTV</div>
                    <div className="text-white font-semibold">{loan.maxLTV}%</div>
                  </div>
                )}

                {loan.features && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {loan.features.slice(0, 3).map((feature, j) => (
                      <span key={j} className="px-2 py-1 bg-white/5 text-xs text-white/60 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openCalculator(loan)}
                    className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Calculator className="w-4 h-4" /> Calculate
                  </button>
                  <button
                    onClick={() => openApplication(loan)}
                    className="flex-1 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition font-semibold text-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No loan products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-gold">Why Choose</span> Saint Vision Lending?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We're not just another lender. We're your strategic financing partner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Fast Approvals",
                desc: "Pre-approval in 24-48 hours. Close in as fast as 5 days.",
              },
              {
                icon: Shield,
                title: "51 State Coverage",
                desc: "We lend everywhere. No geographic restrictions.",
              },
              {
                icon: Users,
                title: "Expert Team",
                desc: "Decades of combined experience in creative financing.",
              },
              {
                icon: Award,
                title: "Best Rates",
                desc: "Direct lender relationships for competitive pricing.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-gold/30 transition"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Funded?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Apply now and get pre-qualified in 24-48 hours. No obligation, no credit impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openApplication()}
              className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center gap-2"
            >
              Start Your Application <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:9496301858"
              className="px-8 py-4 bg-white/10 border border-gold text-gold font-bold rounded-lg hover:bg-white/20 transition flex items-center gap-2"
            >
              <Phone className="w-5 h-5" /> Speak to a Loan Officer
            </a>
          </div>
        </div>
      </section>

      {/* Calculator Modal */}
      <AnimatePresence>
        {showCalculator && selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a1a] border border-gold/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedLoan.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedLoan.name}</h3>
                      <p className="text-sm text-white/60">{selectedLoan.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCalculator(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Loan Amount */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Loan Amount</label>
                  <input
                    type="text"
                    value={`$${calcInputs.loanAmount.toLocaleString()}`}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                      setCalcInputs((prev) => ({ ...prev, loanAmount: val }))
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Range: {formatAmount(selectedLoan.minAmount)} - {formatAmount(selectedLoan.maxAmount)}
                  </p>
                </div>

                {/* Property Value */}
                {(selectedLoan.category === "residential" || selectedLoan.category === "commercial") && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Property Value</label>
                    <input
                      type="text"
                      value={`$${calcInputs.propertyValue.toLocaleString()}`}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                        setCalcInputs((prev) => ({ ...prev, propertyValue: val }))
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                {/* Credit Score */}
                {selectedLoan.minCredit && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Credit Score</label>
                    <select
                      value={calcInputs.creditScore}
                      onChange={(e) => setCalcInputs((prev) => ({ ...prev, creditScore: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                    >
                      {creditScoreOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-white/40 mt-1">Minimum: {selectedLoan.minCredit}</p>
                  </div>
                )}

                {/* Term */}
                {selectedLoan.termOptions && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Loan Term</label>
                    <select
                      value={calcInputs.term}
                      onChange={(e) => setCalcInputs((prev) => ({ ...prev, term: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                    >
                      {selectedLoan.termOptions.map((t) => (
                        <option key={t} value={t}>
                          {t} {selectedLoan.termUnit || "years"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* DSCR - Monthly Rent */}
                {(selectedLoan.id === "dscr" || selectedLoan.minDSCR) && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Monthly Rent / NOI</label>
                    <input
                      type="text"
                      value={`$${calcInputs.monthlyRent.toLocaleString()}`}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                        setCalcInputs((prev) => ({ ...prev, monthlyRent: val }))
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                {/* Fix & Flip specific fields */}
                {selectedLoan.id === "fix_flip" && (
                  <>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Purchase Price</label>
                      <input
                        type="text"
                        value={`$${calcInputs.purchasePrice.toLocaleString()}`}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                          setCalcInputs((prev) => ({ ...prev, purchasePrice: val }))
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Rehab Budget</label>
                      <input
                        type="text"
                        value={`$${calcInputs.rehabBudget.toLocaleString()}`}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                          setCalcInputs((prev) => ({ ...prev, rehabBudget: val }))
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">After Repair Value (ARV)</label>
                      <input
                        type="text"
                        value={`$${calcInputs.arv.toLocaleString()}`}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0
                          setCalcInputs((prev) => ({ ...prev, arv: val }))
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Rate Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-white/60">
                    Current Rate Range: <span className="text-gold font-semibold">{formatRate(selectedLoan)}</span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    *Rates vary based on credit, LTV, and loan terms
                  </p>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  className="w-full py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" /> Calculate Payment
                </button>

                {/* Results */}
                {calcResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 rounded-xl p-6"
                  >
                    <h4 className="text-lg font-bold text-gold mb-4">Estimated Results</h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 rounded-lg p-4 text-center">
                        <p className="text-sm text-white/60">Monthly Payment</p>
                        <p className="text-2xl font-bold text-gold">
                          ${calcResults.monthlyPayment.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4 text-center">
                        <p className="text-sm text-white/60">Interest Rate</p>
                        <p className="text-2xl font-bold text-white">{calcResults.rate.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Total Interest:</span>
                        <span className="text-white">
                          ${calcResults.totalInterest.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {calcResults.ltv > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Loan-to-Value (LTV):</span>
                          <span className="text-white">{calcResults.ltv.toFixed(1)}%</span>
                        </div>
                      )}
                      {calcResults.dscr > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">DSCR:</span>
                          <span className={calcResults.dscr >= 1 ? "text-green-400" : "text-red-400"}>
                            {calcResults.dscr.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {calcResults.flipProfit !== undefined && (
                        <>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Est. Profit:</span>
                              <span className={calcResults.flipProfit >= 0 ? "text-green-400" : "text-red-400"}>
                                ${calcResults.flipProfit.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">ROI:</span>
                              <span className={calcResults.flipROI && calcResults.flipROI >= 0 ? "text-green-400" : "text-red-400"}>
                                {calcResults.flipROI?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-white/40 mt-4">
                      *This is an estimate only. Actual rates and terms depend on credit, property, and lender approval.
                    </p>

                    <button
                      onClick={() => {
                        setShowCalculator(false)
                        setShowApplication(true)
                      }}
                      className="w-full mt-4 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
                    >
                      Apply for This Loan
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowApplication(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a1a1a] border border-gold/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Loan Application</h3>
                    {selectedLoan && (
                      <p className="text-sm text-gold">{selectedLoan.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowApplication(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Application Submitted!</h4>
                    <p className="text-white/60">We'll contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={appForm.name}
                          onChange={(e) => setAppForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={appForm.phone}
                          onChange={(e) => setAppForm((prev) => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={appForm.email}
                        onChange={(e) => setAppForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-1">Loan Amount Needed</label>
                      <input
                        type="text"
                        value={appForm.loanAmount}
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value)
                          setAppForm((prev) => ({ ...prev, loanAmount: formatted }))
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                        placeholder="$250,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-1">Property Address</label>
                      <input
                        type="text"
                        value={appForm.propertyAddress}
                        onChange={(e) => setAppForm((prev) => ({ ...prev, propertyAddress: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">City</label>
                        <input
                          type="text"
                          value={appForm.propertyCity}
                          onChange={(e) => setAppForm((prev) => ({ ...prev, propertyCity: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                          placeholder="Los Angeles"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">State</label>
                        <input
                          type="text"
                          value={appForm.propertyState}
                          onChange={(e) => setAppForm((prev) => ({ ...prev, propertyState: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none"
                          placeholder="CA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-1">Additional Details</label>
                      <textarea
                        value={appForm.message}
                        onChange={(e) => setAppForm((prev) => ({ ...prev, message: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none resize-none"
                        placeholder="Tell us more about your loan needs..."
                      />
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Submit Application
                        </>
                      )}
                    </button>

                    <p className="text-xs text-white/40 text-center">
                      By submitting, you agree to be contacted by our loan officers.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 bg-[#050505] border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="CookinFlips"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <span className="text-gold font-bold">Cookin'</span>
                <span className="text-white font-light">Flips</span>
                <span className="text-white/40 text-sm ml-2">Lending Suite</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="tel:9496301858" className="text-white/60 hover:text-gold transition">
                (949) 630-1858
              </a>
              <a href="mailto:lending@saintsal.ai" className="text-white/60 hover:text-gold transition">
                lending@saintsal.ai
              </a>
            </div>

            <div className="text-white/40 text-sm">
              © 2025 Saint Vision Technologies. NMLS #XXXXXX
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
