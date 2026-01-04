"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  DollarSign,
  Calculator,
  Landmark,
  Calendar,
  FileText,
  TrendingUp,
  Home,
  Percent,
  CreditCard,
  ShoppingCart,
  Tag,
  PiggyBank,
  BarChart3,
  Edit3,
  Save,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  MapPin,
  Ruler,
  Brain,
  Sparkles,
  CheckCircle2,
  Loader2,
  Send,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

// Type definitions for form data
interface PropertyAnalysisData {
  // Header Section
  propertyAddress: string
  totalSquareFootage: number
  evaluatorName: string
  propertyDescription: string

  // Property Values / Pricing
  afterRepairValue: number
  currentValueAsIs: number
  estimatedRepairCosts: number
  maximumAllowableOffer: number
  purchasePrice: number
  estimatedHoldTime: number
  miscPropertyCosts: number
  miscPropertyCostsLabel: string

  // Financing Costs
  firstMortgageAmount: number
  firstMortgagePoints: number
  firstMortgageInterestRate: number
  secondMortgageAmount: number
  secondMortgagePoints: number
  secondMortgageInterestRate: number
  repairCostsAmountBorrowed: number
  miscMortgagePoints: number
  miscFinancingRate: number
  financingOriginationCosts: number
  miscFinancingCosts: number
  miscFinancingCostsLabel: string

  // Holding Costs
  propertyTaxes: number
  hoaCondoFees: number
  insuranceCostsVacant: number
  insuranceCostsOccupied: number
  utilityCosts: number
  miscHoldingCosts: number
  miscHoldingCostsLabel: string

  // Buying Transaction Costs
  buyingEscrowFees: number
  titleInsuranceCosts: number
  miscBuyingCosts: number
  miscBuyingCostsLabel: string

  // Selling Transaction Costs
  sellingEscrowFees: number
  sellingRecordingFees: number
  realtorFees: number
  conveyanceTransferFees: number
  homeWarranty: number
  stagingCosts: number
  marketingCosts: number
  miscSellingCosts: number
  miscSellingCostsLabel: string
}

// Tooltip component for field definitions
function FieldTooltip({ definition }: { definition: string }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gold/60 hover:text-gold transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-[#111] border border-gold/40 rounded-xl shadow-gold text-xs text-white/90 leading-relaxed"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>{definition}</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#111]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Section Header component with premium styling
function SectionHeader({
  icon: Icon,
  title,
  description,
  isCollapsed,
  onToggle,
}: {
  icon: React.ElementType
  title: string
  description: string
  isCollapsed: boolean
  onToggle: () => void
}) {
  return (
    <CardHeader
      className="cursor-pointer border-b border-gold/20 hover:bg-white/[0.02] transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl border border-gold/30 shadow-gold"
          >
            <Icon className="w-6 h-6 text-gold" />
          </motion.div>
          <div>
            <CardTitle className="text-xl font-bold text-gold">{title}</CardTitle>
            <CardDescription className="text-white/50 text-sm mt-1">{description}</CardDescription>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gold/10 rounded-lg transition-colors border border-transparent hover:border-gold/30"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gold" />
          </motion.div>
        </motion.button>
      </div>
    </CardHeader>
  )
}

// Form Field component with premium styling
function FormField({
  label,
  definition,
  value,
  onChange,
  type = "number",
  prefix,
  suffix,
  placeholder,
  disabled = false,
  isTextarea = false,
  rows = 3,
}: {
  label: string
  definition: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  prefix?: string
  suffix?: string
  placeholder?: string
  disabled?: boolean
  isTextarea?: boolean
  rows?: number
}) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <Label className="text-white/90 text-sm font-medium">{label}</Label>
        <FieldTooltip definition={definition} />
      </div>
      <div className="relative group">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70 text-sm font-medium">
            {prefix}
          </span>
        )}
        {isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold/50"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full h-12 bg-black/60 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold/50 ${prefix ? "pl-10 pr-4" : "px-4"} ${suffix ? "pr-16" : ""}`}
          />
        )}
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
            {suffix}
          </span>
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  )
}

// Custom label input for miscellaneous fields
function EditableLabelField({
  label,
  value,
  onLabelChange,
  onValueChange,
  definition,
}: {
  label: string
  value: number
  onLabelChange: (value: string) => void
  onValueChange: (value: string) => void
  definition: string
}) {
  const [isEditingLabel, setIsEditingLabel] = useState(false)

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        {isEditingLabel ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            onBlur={() => setIsEditingLabel(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingLabel(false)}
            autoFocus
            className="bg-black/60 border border-gold rounded-lg text-white text-sm h-8 px-3 w-56 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        ) : (
          <Label className="text-white/90 text-sm font-medium">{label}</Label>
        )}
        <motion.button
          type="button"
          onClick={() => setIsEditingLabel(!isEditingLabel)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 hover:bg-gold/20 rounded-lg transition-colors border border-gold/30"
          title="Edit label"
        >
          <Edit3 className="w-3.5 h-3.5 text-gold" />
        </motion.button>
        <FieldTooltip definition={definition} />
      </div>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70 text-sm font-medium">
          $
        </span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full h-12 bg-black/60 border border-white/20 rounded-xl text-white pl-10 pr-4 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all hover:border-gold/50"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  )
}

// Summary Row component for Deal Summary section
function SummaryRow({
  label,
  value,
  isTotal = false,
  isProfit = false,
}: {
  label: string
  value: number
  isTotal?: boolean
  isProfit?: boolean
}) {
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex justify-between items-center py-4 ${isTotal ? "border-t-2 border-gold/50 mt-4 pt-6" : "border-b border-white/10"}`}
    >
      <span className={`${isTotal ? "text-gold font-bold text-lg" : "text-white/80"}`}>
        {label}
      </span>
      <motion.span
        className={`font-mono text-lg ${isTotal ? "text-gold font-bold text-2xl" : ""} ${isProfit && value >= 0 ? "text-green-400" : ""} ${isProfit && value < 0 ? "text-red-400" : "text-white"}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        key={value}
      >
        {formatCurrency(value)}
      </motion.span>
    </motion.div>
  )
}

// Analysis Metric component for Returns section with premium styling
function AnalysisMetric({
  label,
  value,
  definition,
  isCurrency = false,
  isPercent = false,
}: {
  label: string
  value: number
  definition: string
  isCurrency?: boolean
  isPercent?: boolean
}) {
  const formatValue = () => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    }
    if (isPercent) {
      return `${value.toFixed(2)}%`
    }
    return value.toFixed(2)
  }

  const isPositive = value >= 0

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-5 bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-xl hover:border-gold/40 transition-all shadow-lg hover:shadow-gold/10"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-sm font-medium">{label}</span>
        <FieldTooltip definition={definition} />
      </div>
      <motion.div
        className={`text-3xl font-bold ${isPercent ? (isPositive ? "text-green-400" : "text-red-400") : "text-gold"}`}
        key={value}
        initial={{ scale: 0.9, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {formatValue()}
      </motion.div>
      {isPercent && (
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${isPositive ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(value), 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  )
}

// SaintSal AI Analysis Component
function SaintSalAnalysis({
  calculations,
  formData,
}: {
  calculations: {
    estimatedNetProfit: number
    purchaseRehabROI: number
    totalCostsROI: number
    myAnnualizedCashOnCash: number
  }
  formData: PropertyAnalysisData
}) {
  const getAnalysisVerdict = () => {
    const roi = calculations.purchaseRehabROI
    const profit = calculations.estimatedNetProfit

    if (roi >= 25 && profit > 50000) {
      return {
        verdict: "EXCELLENT DEAL",
        color: "text-green-400",
        bgColor: "from-green-500/20 to-green-500/5",
        borderColor: "border-green-500/40",
        description:
          "This property shows strong profit potential with excellent ROI metrics. SaintSal™ recommends pursuing this opportunity.",
      }
    } else if (roi >= 15 && profit > 25000) {
      return {
        verdict: "GOOD OPPORTUNITY",
        color: "text-gold",
        bgColor: "from-gold/20 to-gold/5",
        borderColor: "border-gold/40",
        description:
          "Solid deal with favorable returns. Consider this property if it aligns with your investment strategy.",
      }
    } else if (roi >= 5 && profit > 0) {
      return {
        verdict: "PROCEED WITH CAUTION",
        color: "text-yellow-400",
        bgColor: "from-yellow-500/20 to-yellow-500/5",
        borderColor: "border-yellow-500/40",
        description:
          "Marginal returns detected. Review all cost assumptions carefully before proceeding.",
      }
    } else {
      return {
        verdict: "NOT RECOMMENDED",
        color: "text-red-400",
        bgColor: "from-red-500/20 to-red-500/5",
        borderColor: "border-red-500/40",
        description:
          "This deal does not meet minimum profitability thresholds. Negotiate better terms or pass on this opportunity.",
      }
    }
  }

  const analysis = getAnalysisVerdict()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-gradient-to-br ${analysis.bgColor} border ${analysis.borderColor} rounded-2xl`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gold/20 rounded-xl border border-gold/40">
          <Brain className="w-8 h-8 text-gold" />
        </div>
        <div>
          <div className="text-sm text-gold/80 font-medium">SaintSal™ AI Analysis</div>
          <div className={`text-2xl font-bold ${analysis.color}`}>{analysis.verdict}</div>
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">{analysis.description}</p>
      {formData.propertyAddress && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/40">
            Analysis for: <span className="text-white/70">{formData.propertyAddress}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function PropertyAnalysisForm() {
  // Collapsed state for sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    header: false,
    propertyValues: false,
    financing: true,
    holding: true,
    buying: true,
    selling: true,
    summary: false,
    returns: false,
  })

  // Form state
  const [formData, setFormData] = useState<PropertyAnalysisData>({
    // Header
    propertyAddress: "",
    totalSquareFootage: 0,
    evaluatorName: "",
    propertyDescription: "",

    // Property Values
    afterRepairValue: 0,
    currentValueAsIs: 0,
    estimatedRepairCosts: 0,
    maximumAllowableOffer: 0,
    purchasePrice: 0,
    estimatedHoldTime: 6,
    miscPropertyCosts: 0,
    miscPropertyCostsLabel: "Miscellaneous Property Costs",

    // Financing
    firstMortgageAmount: 0,
    firstMortgagePoints: 0,
    firstMortgageInterestRate: 0,
    secondMortgageAmount: 0,
    secondMortgagePoints: 0,
    secondMortgageInterestRate: 0,
    repairCostsAmountBorrowed: 0,
    miscMortgagePoints: 0,
    miscFinancingRate: 0,
    financingOriginationCosts: 0,
    miscFinancingCosts: 0,
    miscFinancingCostsLabel: "Miscellaneous Financing Costs",

    // Holding
    propertyTaxes: 0,
    hoaCondoFees: 0,
    insuranceCostsVacant: 0,
    insuranceCostsOccupied: 0,
    utilityCosts: 0,
    miscHoldingCosts: 0,
    miscHoldingCostsLabel: "Miscellaneous Holding Costs",

    // Buying
    buyingEscrowFees: 0,
    titleInsuranceCosts: 0,
    miscBuyingCosts: 0,
    miscBuyingCostsLabel: "Miscellaneous Buying Costs",

    // Selling
    sellingEscrowFees: 0,
    sellingRecordingFees: 0,
    realtorFees: 0,
    conveyanceTransferFees: 0,
    homeWarranty: 0,
    stagingCosts: 0,
    marketingCosts: 0,
    miscSellingCosts: 0,
    miscSellingCostsLabel: "Miscellaneous Selling Costs",
  })

  // Submission states
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  // Toggle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Update form field
  const updateField = (field: keyof PropertyAnalysisData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof prev[field] === "number" ? parseFloat(value as string) || 0 : value,
    }))
  }

  // Calculate MAO automatically (70% rule: ARV * 0.70 - Repairs)
  useEffect(() => {
    const mao = formData.afterRepairValue * 0.7 - formData.estimatedRepairCosts
    setFormData((prev) => ({ ...prev, maximumAllowableOffer: Math.max(0, mao) }))
  }, [formData.afterRepairValue, formData.estimatedRepairCosts])

  // Calculated values using useMemo
  const calculations = useMemo(() => {
    const holdMonths = formData.estimatedHoldTime || 1

    // Financing Costs Calculations
    const firstMortgagePointsCost =
      (formData.firstMortgageAmount * formData.firstMortgagePoints) / 100
    const firstMortgageInterestCost =
      ((formData.firstMortgageAmount * (formData.firstMortgageInterestRate / 100)) / 12) *
      holdMonths
    const secondMortgagePointsCost =
      (formData.secondMortgageAmount * formData.secondMortgagePoints) / 100
    const secondMortgageInterestCost =
      ((formData.secondMortgageAmount * (formData.secondMortgageInterestRate / 100)) / 12) *
      holdMonths
    const miscMortgagePointsCost =
      (formData.repairCostsAmountBorrowed * formData.miscMortgagePoints) / 100
    const miscFinancingInterestCost =
      ((formData.repairCostsAmountBorrowed * (formData.miscFinancingRate / 100)) / 12) * holdMonths

    const totalFinancingCosts =
      firstMortgagePointsCost +
      firstMortgageInterestCost +
      secondMortgagePointsCost +
      secondMortgageInterestCost +
      miscMortgagePointsCost +
      miscFinancingInterestCost +
      formData.financingOriginationCosts +
      formData.miscFinancingCosts

    // Holding Costs Calculations (monthly * hold time)
    const monthlyPropertyTax = formData.propertyTaxes / 12
    const totalHoldingCosts =
      (monthlyPropertyTax +
        formData.hoaCondoFees +
        formData.insuranceCostsVacant +
        formData.utilityCosts +
        formData.miscHoldingCosts) *
      holdMonths

    // Buying Transaction Costs
    const totalBuyingCosts =
      formData.buyingEscrowFees + formData.titleInsuranceCosts + formData.miscBuyingCosts

    // Selling Transaction Costs
    const totalSellingCosts =
      formData.sellingEscrowFees +
      formData.sellingRecordingFees +
      formData.realtorFees +
      formData.conveyanceTransferFees +
      formData.homeWarranty +
      formData.stagingCosts +
      formData.marketingCosts +
      formData.miscSellingCosts

    // Miscellaneous Costs
    const totalMiscCosts = formData.miscPropertyCosts

    // Total Costs
    const totalCosts =
      formData.purchasePrice +
      formData.estimatedRepairCosts +
      totalFinancingCosts +
      totalHoldingCosts +
      totalBuyingCosts +
      totalSellingCosts +
      totalMiscCosts

    // Net Profit
    const estimatedNetProfit = formData.afterRepairValue - totalCosts

    // ROI Calculations
    const purchaseRehabCost = formData.purchasePrice + formData.estimatedRepairCosts
    const purchaseRehabROI =
      purchaseRehabCost > 0 ? (estimatedNetProfit / purchaseRehabCost) * 100 : 0
    const totalCostsROI = totalCosts > 0 ? (estimatedNetProfit / totalCosts) * 100 : 0

    // Cash on Cash Calculations
    const totalAmountBorrowed =
      formData.firstMortgageAmount +
      formData.secondMortgageAmount +
      formData.repairCostsAmountBorrowed
    const myCommittedCapital = Math.max(
      0,
      formData.purchasePrice +
        formData.estimatedRepairCosts +
        totalBuyingCosts -
        totalAmountBorrowed
    )
    const downPaymentRequired = Math.max(
      0,
      formData.purchasePrice + totalBuyingCosts - formData.firstMortgageAmount
    )
    const myAnnualizedCashOnCash =
      myCommittedCapital > 0
        ? ((estimatedNetProfit / myCommittedCapital) * (12 / holdMonths)) * 100
        : 0
    const totalAnnualizedCashOnCash =
      totalCosts > 0 ? ((estimatedNetProfit / totalCosts) * (12 / holdMonths)) * 100 : 0

    // Repair cost per sq ft
    const repairCostPerSqFt =
      formData.totalSquareFootage > 0
        ? formData.estimatedRepairCosts / formData.totalSquareFootage
        : 0

    return {
      totalFinancingCosts,
      totalHoldingCosts,
      totalBuyingCosts,
      totalSellingCosts,
      totalMiscCosts,
      totalCosts,
      estimatedNetProfit,
      purchaseRehabROI,
      totalCostsROI,
      myCommittedCapital,
      downPaymentRequired,
      myAnnualizedCashOnCash,
      totalAnnualizedCashOnCash,
      repairCostPerSqFt,
    }
  }, [formData])

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)

  // Save analysis to database and submit to GHL/email
  const handleSaveAnalysis = async () => {
    if (!userName || !userEmail) {
      setSaveError("Please enter your name and email to save the analysis.")
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const supabase = createClient()

      // Prepare analysis data
      const analysisData = {
        property_address: formData.propertyAddress,
        total_sqft: formData.totalSquareFootage,
        evaluator_name: formData.evaluatorName || userName,
        property_description: formData.propertyDescription,
        user_name: userName,
        user_email: userEmail,
        form_data: formData,
        calculations: calculations,
        created_at: new Date().toISOString(),
      }

      // Insert into Supabase (will create lead if table exists)
      const { error: leadError } = await supabase.from("leads").insert({
        name: userName,
        email: userEmail,
        lead_type: "property_analysis",
        message: `Property Analysis for: ${formData.propertyAddress}\nARV: ${formatCurrency(formData.afterRepairValue)}\nPurchase Price: ${formatCurrency(formData.purchasePrice)}\nEstimated Profit: ${formatCurrency(calculations.estimatedNetProfit)}\nROI: ${calculations.purchaseRehabROI.toFixed(2)}%`,
        source: "property_analysis_form",
      })

      if (leadError) console.error("Lead insert error:", leadError)

      // Also insert into contact_submissions for visibility
      const { error: contactError } = await supabase.from("contact_submissions").insert({
        name: userName,
        email: userEmail,
        subject: `Property Analysis - ${formData.propertyAddress}`,
        message: JSON.stringify(analysisData, null, 2),
        source_page: "/analysis",
      })

      if (contactError) console.error("Contact insert error:", contactError)

      // Submit to API for GHL and email notification
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail,
          formData,
          calculations,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit analysis")
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 5000)
    } catch (err) {
      console.error("Save error:", err)
      setSaveError("Failed to save analysis. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      propertyAddress: "",
      totalSquareFootage: 0,
      evaluatorName: "",
      propertyDescription: "",
      afterRepairValue: 0,
      currentValueAsIs: 0,
      estimatedRepairCosts: 0,
      maximumAllowableOffer: 0,
      purchasePrice: 0,
      estimatedHoldTime: 6,
      miscPropertyCosts: 0,
      miscPropertyCostsLabel: "Miscellaneous Property Costs",
      firstMortgageAmount: 0,
      firstMortgagePoints: 0,
      firstMortgageInterestRate: 0,
      secondMortgageAmount: 0,
      secondMortgagePoints: 0,
      secondMortgageInterestRate: 0,
      repairCostsAmountBorrowed: 0,
      miscMortgagePoints: 0,
      miscFinancingRate: 0,
      financingOriginationCosts: 0,
      miscFinancingCosts: 0,
      miscFinancingCostsLabel: "Miscellaneous Financing Costs",
      propertyTaxes: 0,
      hoaCondoFees: 0,
      insuranceCostsVacant: 0,
      insuranceCostsOccupied: 0,
      utilityCosts: 0,
      miscHoldingCosts: 0,
      miscHoldingCostsLabel: "Miscellaneous Holding Costs",
      buyingEscrowFees: 0,
      titleInsuranceCosts: 0,
      miscBuyingCosts: 0,
      miscBuyingCostsLabel: "Miscellaneous Buying Costs",
      sellingEscrowFees: 0,
      sellingRecordingFees: 0,
      realtorFees: 0,
      conveyanceTransferFees: 0,
      homeWarranty: 0,
      stagingCosts: 0,
      marketingCosts: 0,
      miscSellingCosts: 0,
      miscSellingCostsLabel: "Miscellaneous Selling Costs",
    })
    setUserName("")
    setUserEmail("")
    setSaveSuccess(false)
    setSaveError(null)
  }

  return (
    <div className="space-y-8">
      {/* SaintSal AI Analysis Banner */}
      <SaintSalAnalysis calculations={calculations} formData={formData} />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={Building2}
            title="Header"
            description="Property identification and basic details"
            isCollapsed={collapsedSections.header}
            onToggle={() => toggleSection("header")}
          />
          <AnimatePresence>
            {!collapsedSections.header && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Property Address"
                      definition="The address of the property you want to analyze"
                      value={formData.propertyAddress}
                      onChange={(v) => updateField("propertyAddress", v)}
                      type="text"
                      placeholder="123 Main Street, City, ST 12345"
                    />
                    <FormField
                      label="Total Square Footage"
                      definition="The total square footage of the entire interior of the property"
                      value={formData.totalSquareFootage || ""}
                      onChange={(v) => updateField("totalSquareFootage", v)}
                      suffix="sq ft"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Evaluator Name"
                      definition="Name of the evaluator from the drop downs, or enter a new evaluator. You have the option of saving the evaluators name for future drop down selection"
                      value={formData.evaluatorName}
                      onChange={(v) => updateField("evaluatorName", v)}
                      type="text"
                      placeholder="John Smith"
                    />
                    <div className="md:col-span-1" />
                  </div>
                  <FormField
                    label="Property Description"
                    definition="Key details and attributes about the property including differentiators, # of garage spaces, levels, layout, property type, etc."
                    value={formData.propertyDescription}
                    onChange={(v) => updateField("propertyDescription", v)}
                    type="text"
                    placeholder="3BR/2BA single family home with attached 2-car garage, single story, open floor plan..."
                    isTextarea
                    rows={3}
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Property Values / Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={DollarSign}
            title="Property Values / Pricing"
            description="Section to enter property value and purchase figures for helping calculate profit"
            isCollapsed={collapsedSections.propertyValues}
            onToggle={() => toggleSection("propertyValues")}
          />
          <AnimatePresence>
            {!collapsedSections.propertyValues && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="After Repair Value (ARV)"
                      definition='Value of the property after all repairs have been made regardless of purchase price. Also known as "Fair Market Value"'
                      value={formData.afterRepairValue || ""}
                      onChange={(v) => updateField("afterRepairValue", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label='Current Value "As Is"'
                      definition='Value of the property in current "as is" condition. Not factoring repairs needed'
                      value={formData.currentValueAsIs || ""}
                      onChange={(v) => updateField("currentValueAsIs", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Estimated Repair Costs"
                      definition='The dollar amount of estimated repairs based on your analysis, or select "Load from Hammerpoint Estimate"'
                      value={formData.estimatedRepairCosts || ""}
                      onChange={(v) => updateField("estimatedRepairCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Maximum Allowable Offer (MAO)"
                      definition="Maximum Allowable Offer (MAO) is the maximum offer a rehab buyer can offer to a seller to ensure maximum profit and minimal risk."
                      value={formData.maximumAllowableOffer || ""}
                      onChange={(v) => updateField("maximumAllowableOffer", v)}
                      prefix="$"
                      placeholder="Auto-calculated"
                      disabled
                    />
                    <FormField
                      label="Purchase Price"
                      definition="The dollar amount you plan to purchase the property for"
                      value={formData.purchasePrice || ""}
                      onChange={(v) => updateField("purchasePrice", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Estimated Hold Time"
                      definition="Estimated number of months you plan to own the property from purchase date to close of escrow sale date"
                      value={formData.estimatedHoldTime || ""}
                      onChange={(v) => updateField("estimatedHoldTime", v)}
                      suffix="months"
                      placeholder="6"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditableLabelField
                      label={formData.miscPropertyCostsLabel}
                      value={formData.miscPropertyCosts}
                      onLabelChange={(v) => updateField("miscPropertyCostsLabel", v)}
                      onValueChange={(v) => updateField("miscPropertyCosts", v)}
                      definition="Any custom values for tracking related to Property. This is a custom naming field which you can modify by clicking the EDIT button to the right"
                    />
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Financing Costs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={Landmark}
            title="Financing Costs"
            description="Section to enter the different amounts you will borrow to purchase the property"
            isCollapsed={collapsedSections.financing}
            onToggle={() => toggleSection("financing")}
          />
          <AnimatePresence>
            {!collapsedSections.financing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  {/* First Mortgage */}
                  <div className="space-y-4">
                    <h4 className="text-white/90 font-semibold border-b border-gold/20 pb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gold" />
                      First Mortgage / Lien
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        label="First Mortgage / Lien Amount"
                        definition="The 1st position loan amount borrowed to purchase the property and / or fund the rehab"
                        value={formData.firstMortgageAmount || ""}
                        onChange={(v) => updateField("firstMortgageAmount", v)}
                        prefix="$"
                        placeholder="0"
                      />
                      <FormField
                        label="First Mortgage Points"
                        definition="The 1st position points charged as a % of Mortgage Lien Amount. 1 Point = 1% in calculation."
                        value={formData.firstMortgagePoints || ""}
                        onChange={(v) => updateField("firstMortgagePoints", v)}
                        suffix="%"
                        placeholder="0"
                      />
                      <FormField
                        label="First Mortgage Interest Rate"
                        definition="The 1st position Interest rate amount borrowed to purchase the property and / or fund the rehab"
                        value={formData.firstMortgageInterestRate || ""}
                        onChange={(v) => updateField("firstMortgageInterestRate", v)}
                        suffix="%"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Second Mortgage */}
                  <div className="space-y-4">
                    <h4 className="text-white/90 font-semibold border-b border-gold/20 pb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gold" />
                      Second Mortgage / Lien
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        label="Second Mortgage / Lien Amount"
                        definition="The 2nd position loan amount borrowed to purchase the property and / or fund the rehab"
                        value={formData.secondMortgageAmount || ""}
                        onChange={(v) => updateField("secondMortgageAmount", v)}
                        prefix="$"
                        placeholder="0"
                      />
                      <FormField
                        label="Second Mortgage Points"
                        definition="The 2nd position points charged as a % of Mortgage Lien Amount. 1 Point = 1% in calculation."
                        value={formData.secondMortgagePoints || ""}
                        onChange={(v) => updateField("secondMortgagePoints", v)}
                        suffix="%"
                        placeholder="0"
                      />
                      <FormField
                        label="Second Mortgage Interest Rate"
                        definition="The 2nd position Interest rate amount borrowed to purchase the property and / or fund the rehab"
                        value={formData.secondMortgageInterestRate || ""}
                        onChange={(v) => updateField("secondMortgageInterestRate", v)}
                        suffix="%"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Repair Financing */}
                  <div className="space-y-4">
                    <h4 className="text-white/90 font-semibold border-b border-gold/20 pb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gold" />
                      Repair Costs Financing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        label="Repair Costs Amount Borrowed"
                        definition="The amount borrowed to fund the rehab repair costs for the property"
                        value={formData.repairCostsAmountBorrowed || ""}
                        onChange={(v) => updateField("repairCostsAmountBorrowed", v)}
                        prefix="$"
                        placeholder="0"
                      />
                      <FormField
                        label="Misc. Mortgage Points"
                        definition="The Misc. position points charged as a % of Mortgage Lien Amount. 1 Point = 1% in calculation."
                        value={formData.miscMortgagePoints || ""}
                        onChange={(v) => updateField("miscMortgagePoints", v)}
                        suffix="%"
                        placeholder="0"
                      />
                      <FormField
                        label="Misc. Financing Interest Rate"
                        definition="The amount borrowed to fund the rehab repair costs for the property"
                        value={formData.miscFinancingRate || ""}
                        onChange={(v) => updateField("miscFinancingRate", v)}
                        suffix="%"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Other Financing Costs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Financing Origination Costs"
                      definition="Financing Origination Costs - for a mortgage approximately 1% of purchase price plus $1,000"
                      value={formData.financingOriginationCosts || ""}
                      onChange={(v) => updateField("financingOriginationCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <EditableLabelField
                      label={formData.miscFinancingCostsLabel}
                      value={formData.miscFinancingCosts}
                      onLabelChange={(v) => updateField("miscFinancingCostsLabel", v)}
                      onValueChange={(v) => updateField("miscFinancingCosts", v)}
                      definition="Any custom costs related to Financing. This is a custom naming field which you can modify by clicking the EDIT button to the right."
                    />
                  </div>

                  {/* Financing Summary */}
                  <motion.div
                    className="mt-6 p-5 bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gold font-semibold text-lg">Total Financing Costs</span>
                      <span className="text-gold font-bold text-2xl">
                        {formatCurrency(calculations.totalFinancingCosts)}
                      </span>
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Holding Costs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={Calendar}
            title="Holding Costs"
            description="Section to enter costs related to time property is held. Costs are typically tracked and calculated on a monthly basis"
            isCollapsed={collapsedSections.holding}
            onToggle={() => toggleSection("holding")}
          />
          <AnimatePresence>
            {!collapsedSections.holding && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Property Taxes (Annual)"
                      definition="Use default or enter the actual annual property taxes as reported on the county tax assessors website or enter an estimate, or use the default values stored"
                      value={formData.propertyTaxes || ""}
                      onChange={(v) => updateField("propertyTaxes", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="HOA / Condo Fees (Monthly)"
                      definition="Use default or enter the Home Owner Association fees typically charged monthly here. If paid quarterly, divide the amount by 3"
                      value={formData.hoaCondoFees || ""}
                      onChange={(v) => updateField("hoaCondoFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Insurance Costs - Vacant (Monthly)"
                      definition="Use default or enter the Vacant property insurance premium here typically billed monthly. Typically more expensive than Occupied insurance."
                      value={formData.insuranceCostsVacant || ""}
                      onChange={(v) => updateField("insuranceCostsVacant", v)}
                      prefix="$"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Insurance Costs - Occupied (Monthly)"
                      definition="Use default or enter the Occupied property insurance premium here typically billed monthly. Typically less expensive than Vacant insurance."
                      value={formData.insuranceCostsOccupied || ""}
                      onChange={(v) => updateField("insuranceCostsOccupied", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Utility Costs (Monthly)"
                      definition="Combined value for gas, electricity, water utilities. Click on Down arrow to right to change or add more utility line items."
                      value={formData.utilityCosts || ""}
                      onChange={(v) => updateField("utilityCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <EditableLabelField
                      label={formData.miscHoldingCostsLabel}
                      value={formData.miscHoldingCosts}
                      onLabelChange={(v) => updateField("miscHoldingCostsLabel", v)}
                      onValueChange={(v) => updateField("miscHoldingCosts", v)}
                      definition="Enter any custom costs related to Financing. This is a custom naming field which you can modify by clicking the EDIT button to the right"
                    />
                  </div>

                  {/* Holding Costs Summary */}
                  <motion.div
                    className="mt-6 p-5 bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gold font-semibold text-lg">
                        Total Holding Costs ({formData.estimatedHoldTime} months)
                      </span>
                      <span className="text-gold font-bold text-2xl">
                        {formatCurrency(calculations.totalHoldingCosts)}
                      </span>
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Buying Transaction Costs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={ShoppingCart}
            title="Buying Transaction Costs"
            description="Section for entering and tracking buying transaction costs"
            isCollapsed={collapsedSections.buying}
            onToggle={() => toggleSection("buying")}
          />
          <AnimatePresence>
            {!collapsedSections.buying && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Escrow / Attorney Fees"
                      definition="Fees charged by attorney or escrow company at closing. Typically a % of sales price. Make sure you use appropriate formula based on if our an Attorney or Escrow state."
                      value={formData.buyingEscrowFees || ""}
                      onChange={(v) => updateField("buyingEscrowFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Title Insurance / Title Search Costs"
                      definition="Policy to insure clear and marketable title. Changes based on area, type of policy, underwriter"
                      value={formData.titleInsuranceCosts || ""}
                      onChange={(v) => updateField("titleInsuranceCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <EditableLabelField
                      label={formData.miscBuyingCostsLabel}
                      value={formData.miscBuyingCosts}
                      onLabelChange={(v) => updateField("miscBuyingCostsLabel", v)}
                      onValueChange={(v) => updateField("miscBuyingCosts", v)}
                      definition="Enter any custom costs related to Buying transactions. This is a custom naming field which you can modify by clicking the EDIT button to the right"
                    />
                  </div>

                  {/* Buying Costs Summary */}
                  <motion.div
                    className="mt-6 p-5 bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gold font-semibold text-lg">
                        Total Buying Transaction Costs
                      </span>
                      <span className="text-gold font-bold text-2xl">
                        {formatCurrency(calculations.totalBuyingCosts)}
                      </span>
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Selling Transaction Costs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={Tag}
            title="Selling Transaction Costs"
            description="Section for entering and tracking selling transaction costs"
            isCollapsed={collapsedSections.selling}
            onToggle={() => toggleSection("selling")}
          />
          <AnimatePresence>
            {!collapsedSections.selling && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Escrow / Attorney Fees"
                      definition="Fees charged by attorney or escrow company at closing. Typically a % of sales price. Make sure you use appropriate formula based on if our an Attorney or Escrow state."
                      value={formData.sellingEscrowFees || ""}
                      onChange={(v) => updateField("sellingEscrowFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Selling Recording Fees"
                      definition="Fees taken from the HUD-1 County recorders fees charged by escrow company"
                      value={formData.sellingRecordingFees || ""}
                      onChange={(v) => updateField("sellingRecordingFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Realtor Fees"
                      definition="Commissions paid to realtors involved as part of the transaction"
                      value={formData.realtorFees || ""}
                      onChange={(v) => updateField("realtorFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      label="Conveyance / Transfer Fees"
                      definition="For the transfer of land charged by County from seller to buyer. Typically a % of the land value based on county assessor valuation"
                      value={formData.conveyanceTransferFees || ""}
                      onChange={(v) => updateField("conveyanceTransferFees", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Home Warranty"
                      definition="Offers protection for mechanical systems and attached appliances against unexpected repairs not covered by homeowner's insurance; overage extends over a specific time period and does not cover the home's structure"
                      value={formData.homeWarranty || ""}
                      onChange={(v) => updateField("homeWarranty", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <FormField
                      label="Staging Costs"
                      definition="Cost for getting property ready to sell by bringing in furnishings so the property will show as if someone lived there"
                      value={formData.stagingCosts || ""}
                      onChange={(v) => updateField("stagingCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Marketing Costs"
                      definition="Costs related to offline and online advertising, printing, and promotion to help sell the property."
                      value={formData.marketingCosts || ""}
                      onChange={(v) => updateField("marketingCosts", v)}
                      prefix="$"
                      placeholder="0"
                    />
                    <EditableLabelField
                      label={formData.miscSellingCostsLabel}
                      value={formData.miscSellingCosts}
                      onLabelChange={(v) => updateField("miscSellingCostsLabel", v)}
                      onValueChange={(v) => updateField("miscSellingCosts", v)}
                      definition="Enter any custom costs related to Selling transactions. This is a custom naming field which you can modify by clicking the EDIT button to the right"
                    />
                  </div>

                  {/* Selling Costs Summary */}
                  <motion.div
                    className="mt-6 p-5 bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gold font-semibold text-lg">
                        Total Selling Transaction Costs
                      </span>
                      <span className="text-gold font-bold text-2xl">
                        {formatCurrency(calculations.totalSellingCosts)}
                      </span>
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Deal Summary & Potential Profit Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={Calculator}
            title="Deal Summary & Potential Profit"
            description="Section breaks down the revenue and expenses of the entire project"
            isCollapsed={collapsedSections.summary}
            onToggle={() => toggleSection("summary")}
          />
          <AnimatePresence>
            {!collapsedSections.summary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6">
                  <div className="space-y-1">
                    <SummaryRow label="After Repair Value" value={formData.afterRepairValue} />
                    <SummaryRow label="Purchase Price" value={-formData.purchasePrice} />
                    <SummaryRow
                      label="Estimated Repair Costs"
                      value={-formData.estimatedRepairCosts}
                    />
                    <SummaryRow
                      label="Total Financing Costs"
                      value={-calculations.totalFinancingCosts}
                    />
                    <SummaryRow
                      label="Total Holding Costs"
                      value={-calculations.totalHoldingCosts}
                    />
                    <SummaryRow
                      label="Total Buying Transaction Costs"
                      value={-calculations.totalBuyingCosts}
                    />
                    <SummaryRow
                      label="Total Selling Transaction Costs"
                      value={-calculations.totalSellingCosts}
                    />
                    <SummaryRow label="Miscellaneous Costs" value={-calculations.totalMiscCosts} />
                    <SummaryRow
                      label="Estimated NET PROFIT"
                      value={calculations.estimatedNetProfit}
                      isTotal
                      isProfit
                    />
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Potential Return & Profit Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <SectionHeader
            icon={TrendingUp}
            title="Potential Return & Profit Analysis"
            description="Section Summary of key profit and deal value measurements"
            isCollapsed={collapsedSections.returns}
            onToggle={() => toggleSection("returns")}
          />
          <AnimatePresence>
            {!collapsedSections.returns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnalysisMetric
                      label="My Committed Capital"
                      value={calculations.myCommittedCapital}
                      definition="Amount of your own money out of pocket that you put in the deal as the purchaser"
                      isCurrency
                    />
                    <AnalysisMetric
                      label="Repair Estimate Cost Per Sq. Ft"
                      value={calculations.repairCostPerSqFt}
                      definition="Total Purchase+Rehab Estimate costs divided by total square feet of the property used as a measurement market indicator"
                      isCurrency
                    />
                    <AnalysisMetric
                      label="Down Payment Required at Closing"
                      value={calculations.downPaymentRequired}
                      definition="The amount of cash required at closing after financing"
                      isCurrency
                    />
                    <AnalysisMetric
                      label="Purchase + Rehab ROI"
                      value={calculations.purchaseRehabROI}
                      definition="% of interest earned based on purchase + rehab costs irregardless of how long the property was held."
                      isPercent
                    />
                    <AnalysisMetric
                      label="Total Costs ROI"
                      value={calculations.totalCostsROI}
                      definition="% of interest earned based on purchase +ALL costs irregardless of how long the property was held"
                      isPercent
                    />
                    <AnalysisMetric
                      label="My Annualized Cash on Cash Return"
                      value={calculations.myAnnualizedCashOnCash}
                      definition="% of interest estimated that you would earn over a year period based on your out of pocket funds that you put into the deal as a purchaser."
                      isPercent
                    />
                    <AnalysisMetric
                      label="Total Annualized Cash on Cash Return"
                      value={calculations.totalAnnualizedCashOnCash}
                      definition="% of interest earned based on purchase price + all other costs over a 12 month annualized period"
                      isPercent
                    />
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Save Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-gold/30 overflow-hidden shadow-xl">
          <CardHeader className="border-b border-gold/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl border border-gold/30 shadow-gold">
                <Save className="w-6 h-6 text-gold" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gold">
                  Save & Submit Analysis
                </CardTitle>
                <CardDescription className="text-white/50 text-sm mt-1">
                  Save your analysis to your dashboard and receive a copy via email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/90 text-sm font-medium">Your Name *</Label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full h-12 bg-black/60 border border-white/20 rounded-xl text-white px-4 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all hover:border-gold/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/90 text-sm font-medium">Your Email *</Label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full h-12 bg-black/60 border border-white/20 rounded-xl text-white px-4 placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all hover:border-gold/50"
                />
              </div>
            </div>

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm"
              >
                {saveError}
              </motion.div>
            )}

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  Analysis saved successfully! Check your email for a copy of this analysis.
                </span>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 py-4 px-6 border-2 border-white/20 text-white/80 font-semibold rounded-xl hover:bg-white/5 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Form
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-gold to-gold-light text-black font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-gold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Save & Submit Analysis
                  </>
                )}
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-white/40 text-sm pt-4"
      >
        <p>
          Calculations are estimates only. Consult with qualified professionals before making
          investment decisions.
        </p>
        <p className="mt-2 flex items-center justify-center gap-2">
          <Brain className="w-4 h-4 text-gold" />
          <span>
            Powered by <span className="text-gold font-semibold">SaintSal™ AI</span> | FlipEffective
            Analysis Tools
          </span>
        </p>
      </motion.div>
    </div>
  )
}
