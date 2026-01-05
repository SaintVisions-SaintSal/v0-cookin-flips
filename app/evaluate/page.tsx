'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Home,
  TrendingUp,
  Percent,
  Building2,
  FileText,
  Download,
  Brain,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface PropertyData {
  propertyAddress: string
  totalSquareFootage: number
  numberOfUnits: number
  occupied: boolean
  evaluatorName: string
  evaluationDate: string
  notes: string
  afterRepairValue: number
  currentAsIsValue: number
  estimatedRepairCosts: number
  purchasePrice: number
  estimatedHoldTime: number
  propertyTaxesAnnual: number
  hoaCondoFees: number
  insuranceCostsAnnual: number
  gasUtility: number
  waterUtility: number
  electricityUtility: number
  otherUtility: number
  miscHoldingCosts: number
  firstMortgagePercent: number
  firstMortgagePoints: number
  firstMortgageInterest: number
  secondMortgagePercent: number
  secondMortgagePoints: number
  secondMortgageInterest: number
  miscMortgageAmount: number
  miscMortgagePoints: number
  miscMortgageInterest: number
  miscFinancingCosts: number
  escrowAttorneyFeesBuy: number
  titleInsurancePercent: number
  miscBuyingCosts: number
  escrowAttorneyFeesSell: number
  sellingRecordingFees: number
  realtorFeesPercent: number
  transferConveyancePercent: number
  homeWarranty: number
  stagingCosts: number
  marketingCosts: number
  miscSellingCosts: number
}

const defaultData: PropertyData = {
  propertyAddress: '',
  totalSquareFootage: 0,
  numberOfUnits: 1,
  occupied: false,
  evaluatorName: '',
  evaluationDate: new Date().toISOString().split('T')[0],
  notes: '',
  afterRepairValue: 0,
  currentAsIsValue: 0,
  estimatedRepairCosts: 0,
  purchasePrice: 0,
  estimatedHoldTime: 4,
  propertyTaxesAnnual: 0,
  hoaCondoFees: 0,
  insuranceCostsAnnual: 0,
  gasUtility: 0,
  waterUtility: 0,
  electricityUtility: 0,
  otherUtility: 0,
  miscHoldingCosts: 0,
  firstMortgagePercent: 75,
  firstMortgagePoints: 2,
  firstMortgageInterest: 12,
  secondMortgagePercent: 0,
  secondMortgagePoints: 2,
  secondMortgageInterest: 0,
  miscMortgageAmount: 0,
  miscMortgagePoints: 2,
  miscMortgageInterest: 12,
  miscFinancingCosts: 0,
  escrowAttorneyFeesBuy: 900,
  titleInsurancePercent: 0.25,
  miscBuyingCosts: 0,
  escrowAttorneyFeesSell: 900,
  sellingRecordingFees: 500,
  realtorFeesPercent: 5,
  transferConveyancePercent: 0.12,
  homeWarranty: 500,
  stagingCosts: 1500,
  marketingCosts: 500,
  miscSellingCosts: 0,
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

// Collapsible Section Component
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  accent = 'gold'
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: 'gold' | 'caribbean'
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const accentColor = accent === 'gold' ? 'text-gold' : 'text-[#00CED1]'
  const accentBorder = accent === 'gold' ? 'border-gold/30' : 'border-[#00CED1]/30'

  return (
    <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#111] border ${accentBorder} rounded-2xl overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${accent === 'gold' ? 'bg-gold/10' : 'bg-[#00CED1]/10'} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${accentColor}`} />
          </div>
          <h2 className={`text-lg font-bold ${accentColor}`}>{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
      </button>
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

// Input Component
function InputField({
  label,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  hint
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-white/40 mt-1">{hint}</p>}
    </div>
  )
}

export default function PropertyEvaluationPage() {
  const [data, setData] = useState<PropertyData>(defaultData)

  const updateField = <K extends keyof PropertyData>(field: K, value: PropertyData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const calculations = useMemo(() => {
    const purchaseRepairCosts = data.purchasePrice + data.estimatedRepairCosts
    const propertyTaxesMonthly = data.propertyTaxesAnnual / 12
    const insuranceMonthly = data.insuranceCostsAnnual / 12
    const totalUtilities = data.gasUtility + data.waterUtility + data.electricityUtility + data.otherUtility
    const totalMonthlyHoldingCosts = propertyTaxesMonthly + data.hoaCondoFees + insuranceMonthly + totalUtilities + data.miscHoldingCosts
    const totalHoldingCosts = totalMonthlyHoldingCosts * data.estimatedHoldTime
    const firstMortgageAmount = (data.firstMortgagePercent / 100) * purchaseRepairCosts
    const firstMortgagePointsCost = (data.firstMortgagePoints / 100) * firstMortgageAmount
    const firstMortgageInterestCost = (data.firstMortgageInterest / 100) * firstMortgageAmount * (data.estimatedHoldTime / 12)
    const firstMortgageMonthlyPayment = (data.firstMortgageInterest / 100 / 12) * firstMortgageAmount
    const secondMortgageAmount = (data.secondMortgagePercent / 100) * purchaseRepairCosts
    const secondMortgagePointsCost = (data.secondMortgagePoints / 100) * secondMortgageAmount
    const secondMortgageInterestCost = (data.secondMortgageInterest / 100) * secondMortgageAmount * (data.estimatedHoldTime / 12)
    const secondMortgageMonthlyPayment = (data.secondMortgageInterest / 100 / 12) * secondMortgageAmount
    const miscMortgagePointsCost = (data.miscMortgagePoints / 100) * data.miscMortgageAmount
    const miscMortgageInterestCost = (data.miscMortgageInterest / 100) * data.miscMortgageAmount * (data.estimatedHoldTime / 12)
    const miscMortgageMonthlyPayment = (data.miscMortgageInterest / 100 / 12) * data.miscMortgageAmount
    const totalFinancingCosts = firstMortgagePointsCost + firstMortgageInterestCost + secondMortgagePointsCost + secondMortgageInterestCost + miscMortgagePointsCost + miscMortgageInterestCost + data.miscFinancingCosts
    const titleInsuranceCost = (data.titleInsurancePercent / 100) * data.purchasePrice
    const totalBuyingTransactionCosts = data.escrowAttorneyFeesBuy + titleInsuranceCost + data.miscBuyingCosts
    const realtorFees = (data.realtorFeesPercent / 100) * data.afterRepairValue
    const transferConveyanceFees = (data.transferConveyancePercent / 100) * data.afterRepairValue
    const totalSellingTransactionCosts = data.escrowAttorneyFeesSell + data.sellingRecordingFees + realtorFees + transferConveyanceFees + data.homeWarranty + data.stagingCosts + data.marketingCosts + data.miscSellingCosts
    const totalAllCosts = data.purchasePrice + data.estimatedRepairCosts + totalFinancingCosts + totalHoldingCosts + totalBuyingTransactionCosts + totalSellingTransactionCosts
    const estimatedNetProfit = data.afterRepairValue - totalAllCosts
    const totalCostsROI = totalAllCosts > 0 ? (estimatedNetProfit / totalAllCosts) * 100 : 0
    const purchaseRehabROI = purchaseRepairCosts > 0 ? (estimatedNetProfit / purchaseRepairCosts) * 100 : 0
    const totalLoanAmount = firstMortgageAmount + secondMortgageAmount + data.miscMortgageAmount
    const downPaymentRequired = purchaseRepairCosts - totalLoanAmount + totalBuyingTransactionCosts
    const totalMonthlyInterestPayments = firstMortgageMonthlyPayment + secondMortgageMonthlyPayment + miscMortgageMonthlyPayment
    const totalInterestPayments = totalMonthlyInterestPayments * data.estimatedHoldTime
    const committedCapital = downPaymentRequired + totalHoldingCosts + totalInterestPayments + firstMortgagePointsCost + secondMortgagePointsCost + miscMortgagePointsCost
    const annualizedCashOnCashReturn = committedCapital > 0 ? (estimatedNetProfit / committedCapital) * (12 / data.estimatedHoldTime) * 100 : 0
    const costPerSqFt = data.totalSquareFootage > 0 ? purchaseRepairCosts / data.totalSquareFootage : 0
    const saleDate = new Date()
    saleDate.setMonth(saleDate.getMonth() + data.estimatedHoldTime)

    return {
      purchaseRepairCosts,
      propertyTaxesMonthly,
      insuranceMonthly,
      totalUtilities,
      totalMonthlyHoldingCosts,
      totalHoldingCosts,
      firstMortgageAmount,
      firstMortgagePointsCost,
      firstMortgageInterestCost,
      firstMortgageMonthlyPayment,
      secondMortgageAmount,
      secondMortgagePointsCost,
      secondMortgageInterestCost,
      secondMortgageMonthlyPayment,
      miscMortgagePointsCost,
      miscMortgageInterestCost,
      miscMortgageMonthlyPayment,
      totalFinancingCosts,
      titleInsuranceCost,
      totalBuyingTransactionCosts,
      realtorFees,
      transferConveyanceFees,
      totalSellingTransactionCosts,
      totalAllCosts,
      estimatedNetProfit,
      totalCostsROI,
      purchaseRehabROI,
      downPaymentRequired,
      committedCapital,
      annualizedCashOnCashReturn,
      costPerSqFt,
      saleDate,
      totalLoanAmount,
    }
  }, [data])

  const exportToCSV = () => {
    const rows = [
      ['Property Evaluation Report - CookinFlips x FlipEffective'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Property Information'],
      ['Property Address', data.propertyAddress],
      ['Total Square Footage', data.totalSquareFootage.toString()],
      ['Number of Units', data.numberOfUnits.toString()],
      [''],
      ['Property Values'],
      ['After Repair Value (ARV)', formatCurrency(data.afterRepairValue)],
      ['Purchase Price', formatCurrency(data.purchasePrice)],
      ['Estimated Repair Costs', formatCurrency(data.estimatedRepairCosts)],
      ['Hold Time (months)', data.estimatedHoldTime.toString()],
      [''],
      ['Cost Summary'],
      ['Total Financing Costs', formatCurrency(calculations.totalFinancingCosts)],
      ['Total Holding Costs', formatCurrency(calculations.totalHoldingCosts)],
      ['Total Buying Costs', formatCurrency(calculations.totalBuyingTransactionCosts)],
      ['Total Selling Costs', formatCurrency(calculations.totalSellingTransactionCosts)],
      [''],
      ['Investment Analysis'],
      ['Estimated Net Profit', formatCurrency(calculations.estimatedNetProfit)],
      ['Total ROI', formatPercent(calculations.totalCostsROI)],
      ['Cash on Cash Return (Annualized)', formatPercent(calculations.annualizedCashOnCashReturn)],
      ['Capital Required', formatCurrency(calculations.committedCapital)],
      ['Cost Per Sq Ft', formatCurrency(calculations.costPerSqFt)],
    ]
    const csvContent = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `deal-analysis-${data.propertyAddress || 'report'}.csv`
    link.click()
  }

  const isProfitable = calculations.estimatedNetProfit > 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Logo" width={40} height={40} className="object-contain" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gold">Cookin'</span>
              <span className="text-xl font-light text-white">Flips</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Deal Evaluator</span>
          </div>

          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Results Banner */}
        <div className={`rounded-2xl p-8 mb-8 border-2 ${isProfitable ? 'bg-gradient-to-r from-green-900/20 to-green-900/5 border-green-500/30' : 'bg-gradient-to-r from-red-900/20 to-red-900/5 border-red-500/30'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              {isProfitable ? (
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              )}
              <div>
                <h1 className={`text-3xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(calculations.estimatedNetProfit)}
                </h1>
                <p className="text-white/60">Estimated Net Profit</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(calculations.totalCostsROI)}
                </p>
                <p className="text-sm text-white/50">Total ROI</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(calculations.annualizedCashOnCashReturn)}
                </p>
                <p className="text-sm text-white/50">Cash on Cash</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(calculations.committedCapital)}
                </p>
                <p className="text-sm text-white/50">Capital Required</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Property Info */}
            <Section title="Property Information" icon={Home}>
              <div className="space-y-4">
                <InputField
                  label="Property Address"
                  value={data.propertyAddress}
                  onChange={(v) => updateField('propertyAddress', v)}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InputField
                    label="Sq. Footage"
                    type="number"
                    value={data.totalSquareFootage || ''}
                    onChange={(v) => updateField('totalSquareFootage', Number(v))}
                  />
                  <InputField
                    label="Units"
                    type="number"
                    value={data.numberOfUnits || ''}
                    onChange={(v) => updateField('numberOfUnits', Number(v))}
                  />
                  <InputField
                    label="Hold Time"
                    type="number"
                    value={data.estimatedHoldTime || ''}
                    onChange={(v) => updateField('estimatedHoldTime', Number(v))}
                    suffix="mo"
                  />
                  <InputField
                    label="Date"
                    type="date"
                    value={data.evaluationDate}
                    onChange={(v) => updateField('evaluationDate', v)}
                  />
                </div>
              </div>
            </Section>

            {/* Property Values */}
            <Section title="Property Values & Pricing" icon={DollarSign} accent="caribbean">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="After Repair Value (ARV)"
                  type="number"
                  prefix="$"
                  value={data.afterRepairValue || ''}
                  onChange={(v) => updateField('afterRepairValue', Number(v))}
                />
                <InputField
                  label="Purchase Price"
                  type="number"
                  prefix="$"
                  value={data.purchasePrice || ''}
                  onChange={(v) => updateField('purchasePrice', Number(v))}
                />
                <InputField
                  label="Estimated Repair Costs"
                  type="number"
                  prefix="$"
                  value={data.estimatedRepairCosts || ''}
                  onChange={(v) => updateField('estimatedRepairCosts', Number(v))}
                />
                <InputField
                  label="Current As-Is Value"
                  type="number"
                  prefix="$"
                  value={data.currentAsIsValue || ''}
                  onChange={(v) => updateField('currentAsIsValue', Number(v))}
                />
              </div>
              <div className="mt-4 p-4 bg-black/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Purchase + Repair Total</span>
                  <span className="text-xl font-bold text-[#00CED1]">{formatCurrency(calculations.purchaseRepairCosts)}</span>
                </div>
              </div>
            </Section>

            {/* Financing */}
            <Section title="Financing Costs" icon={Percent}>
              <div className="space-y-6">
                {/* First Mortgage */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">First Mortgage</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="LTV %" type="number" suffix="%" value={data.firstMortgagePercent || ''} onChange={(v) => updateField('firstMortgagePercent', Number(v))} />
                    <InputField label="Points" type="number" value={data.firstMortgagePoints || ''} onChange={(v) => updateField('firstMortgagePoints', Number(v))} />
                    <InputField label="Interest %" type="number" suffix="%" value={data.firstMortgageInterest || ''} onChange={(v) => updateField('firstMortgageInterest', Number(v))} />
                  </div>
                  <p className="text-xs text-white/40 mt-2">Loan: {formatCurrency(calculations.firstMortgageAmount)} | Monthly: {formatCurrency(calculations.firstMortgageMonthlyPayment)}</p>
                </div>

                {/* Second Mortgage */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Second Mortgage</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="LTV %" type="number" suffix="%" value={data.secondMortgagePercent || ''} onChange={(v) => updateField('secondMortgagePercent', Number(v))} />
                    <InputField label="Points" type="number" value={data.secondMortgagePoints || ''} onChange={(v) => updateField('secondMortgagePoints', Number(v))} />
                    <InputField label="Interest %" type="number" suffix="%" value={data.secondMortgageInterest || ''} onChange={(v) => updateField('secondMortgageInterest', Number(v))} />
                  </div>
                </div>

                <div className="p-4 bg-black/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Total Financing Costs</span>
                    <span className="text-xl font-bold text-gold">{formatCurrency(calculations.totalFinancingCosts)}</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* Holding Costs */}
            <Section title="Holding Costs" icon={Building2} defaultOpen={false}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Property Taxes (Annual)" type="number" prefix="$" value={data.propertyTaxesAnnual || ''} onChange={(v) => updateField('propertyTaxesAnnual', Number(v))} hint={`Monthly: ${formatCurrency(calculations.propertyTaxesMonthly)}`} />
                  <InputField label="Insurance (Annual)" type="number" prefix="$" value={data.insuranceCostsAnnual || ''} onChange={(v) => updateField('insuranceCostsAnnual', Number(v))} hint={`Monthly: ${formatCurrency(calculations.insuranceMonthly)}`} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InputField label="Gas" type="number" prefix="$" value={data.gasUtility || ''} onChange={(v) => updateField('gasUtility', Number(v))} />
                  <InputField label="Water" type="number" prefix="$" value={data.waterUtility || ''} onChange={(v) => updateField('waterUtility', Number(v))} />
                  <InputField label="Electric" type="number" prefix="$" value={data.electricityUtility || ''} onChange={(v) => updateField('electricityUtility', Number(v))} />
                  <InputField label="HOA" type="number" prefix="$" value={data.hoaCondoFees || ''} onChange={(v) => updateField('hoaCondoFees', Number(v))} />
                </div>
                <div className="p-4 bg-black/30 rounded-xl space-y-2">
                  <div className="flex justify-between"><span className="text-white/50">Monthly Total</span><span className="text-white">{formatCurrency(calculations.totalMonthlyHoldingCosts)}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Total Holding ({data.estimatedHoldTime} mo)</span><span className="text-xl font-bold text-gold">{formatCurrency(calculations.totalHoldingCosts)}</span></div>
                </div>
              </div>
            </Section>

            {/* Transaction Costs */}
            <Section title="Transaction Costs" icon={FileText} defaultOpen={false} accent="caribbean">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Buying Costs</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Escrow/Attorney" type="number" prefix="$" value={data.escrowAttorneyFeesBuy || ''} onChange={(v) => updateField('escrowAttorneyFeesBuy', Number(v))} />
                    <InputField label="Title Insurance %" type="number" suffix="%" value={data.titleInsurancePercent || ''} onChange={(v) => updateField('titleInsurancePercent', Number(v))} />
                    <InputField label="Other" type="number" prefix="$" value={data.miscBuyingCosts || ''} onChange={(v) => updateField('miscBuyingCosts', Number(v))} />
                  </div>
                  <p className="text-xs text-white/40 mt-2">Total: {formatCurrency(calculations.totalBuyingTransactionCosts)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Selling Costs</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <InputField label="Realtor %" type="number" suffix="%" value={data.realtorFeesPercent || ''} onChange={(v) => updateField('realtorFeesPercent', Number(v))} />
                    <InputField label="Transfer %" type="number" suffix="%" value={data.transferConveyancePercent || ''} onChange={(v) => updateField('transferConveyancePercent', Number(v))} />
                    <InputField label="Staging" type="number" prefix="$" value={data.stagingCosts || ''} onChange={(v) => updateField('stagingCosts', Number(v))} />
                    <InputField label="Marketing" type="number" prefix="$" value={data.marketingCosts || ''} onChange={(v) => updateField('marketingCosts', Number(v))} />
                  </div>
                  <p className="text-xs text-white/40 mt-2">Realtor: {formatCurrency(calculations.realtorFees)} | Total: {formatCurrency(calculations.totalSellingTransactionCosts)}</p>
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/30 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-gold">Deal Analysis</h3>
                  <p className="text-xs text-white/50">Powered by SaintSal™</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-xl">
                  <div className="text-sm text-white/50 mb-1">After Repair Value</div>
                  <div className="text-2xl font-bold text-white">{formatCurrency(data.afterRepairValue)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black/40 rounded-xl">
                    <div className="text-xs text-white/50">Purchase</div>
                    <div className="font-bold text-white">{formatCurrency(data.purchasePrice)}</div>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl">
                    <div className="text-xs text-white/50">Repairs</div>
                    <div className="font-bold text-white">{formatCurrency(data.estimatedRepairCosts)}</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Financing Costs</span>
                    <span className="text-white">{formatCurrency(calculations.totalFinancingCosts)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Holding Costs</span>
                    <span className="text-white">{formatCurrency(calculations.totalHoldingCosts)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Buying Costs</span>
                    <span className="text-white">{formatCurrency(calculations.totalBuyingTransactionCosts)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Selling Costs</span>
                    <span className="text-white">{formatCurrency(calculations.totalSellingTransactionCosts)}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/50">Total Investment</span>
                    <span className="font-bold text-white">{formatCurrency(calculations.totalAllCosts)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/50">Down Payment</span>
                    <span className="font-bold text-gold">{formatCurrency(calculations.downPaymentRequired)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Cost/Sq Ft</span>
                    <span className="text-white">{formatCurrency(calculations.costPerSqFt)}</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isProfitable ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>Net Profit</span>
                    <span className={`text-xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(calculations.estimatedNetProfit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">ROI</span>
                    <span className={isProfitable ? 'text-green-400' : 'text-red-400'}>{formatPercent(calculations.totalCostsROI)}</span>
                  </div>
                </div>

                <div className={`text-center p-3 rounded-xl ${isProfitable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <span className={`font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                    {isProfitable ? 'DEAL LOOKS GOOD' : 'NEEDS WORK'}
                  </span>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <Link href="/" className="flex items-center justify-center gap-2 p-4 border border-gold/30 rounded-xl text-gold hover:bg-gold/10 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/20 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            Deal Evaluator by <span className="text-gold">Cookin'Flips</span> x <span className="text-[#00CED1]">FlipEffective</span> | Powered by SaintSal™ AI
          </p>
        </div>
      </footer>
    </div>
  )
}
