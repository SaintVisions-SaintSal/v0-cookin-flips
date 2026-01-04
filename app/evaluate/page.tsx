'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, DollarSign, Home, TrendingUp, Percent, Building2, FileText, Download } from 'lucide-react'

interface PropertyData {
  // Property Information
  propertyAddress: string
  totalSquareFootage: number
  numberOfUnits: number
  occupied: boolean
  evaluatorName: string
  evaluationDate: string
  propertyDescription: string
  notes: string

  // Property Values & Pricing
  afterRepairValue: number
  currentAsIsValue: number
  estimatedRepairCosts: number
  purchasePrice: number
  estimatedHoldTime: number

  // Holding Costs (Monthly)
  propertyTaxesAnnual: number
  hoaCondoFees: number
  insuranceCostsAnnual: number
  gasUtility: number
  waterUtility: number
  electricityUtility: number
  otherUtility: number
  miscHoldingCosts: number

  // First Mortgage
  firstMortgagePercent: number
  firstMortgagePoints: number
  firstMortgageInterest: number

  // Second Mortgage
  secondMortgagePercent: number
  secondMortgagePoints: number
  secondMortgageInterest: number

  // Misc Mortgage
  miscMortgageAmount: number
  miscMortgagePoints: number
  miscMortgageInterest: number
  miscFinancingCosts: number

  // Buying Transaction Costs
  escrowAttorneyFeesBuy: number
  titleInsurancePercent: number
  miscBuyingCosts: number

  // Selling Transaction Costs
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
  propertyDescription: '',
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

export default function PropertyEvaluationPage() {
  const [data, setData] = useState<PropertyData>(defaultData)
  const [showExport, setShowExport] = useState(false)

  const updateField = <K extends keyof PropertyData>(field: K, value: PropertyData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // All calculations as memoized values
  const calculations = useMemo(() => {
    // Purchase + Repair Costs
    const purchaseRepairCosts = data.purchasePrice + data.estimatedRepairCosts

    // Holding Costs
    const propertyTaxesMonthly = data.propertyTaxesAnnual / 12
    const insuranceMonthly = data.insuranceCostsAnnual / 12
    const totalUtilities = data.gasUtility + data.waterUtility + data.electricityUtility + data.otherUtility
    const totalMonthlyHoldingCosts = propertyTaxesMonthly + data.hoaCondoFees + insuranceMonthly + totalUtilities + data.miscHoldingCosts
    const totalHoldingCosts = totalMonthlyHoldingCosts * data.estimatedHoldTime

    // First Mortgage Calculations
    const firstMortgageAmount = (data.firstMortgagePercent / 100) * purchaseRepairCosts
    const firstMortgagePointsCost = (data.firstMortgagePoints / 100) * firstMortgageAmount
    const firstMortgageInterestCost = (data.firstMortgageInterest / 100) * firstMortgageAmount * (data.estimatedHoldTime / 12)
    const firstMortgageMonthlyPayment = (data.firstMortgageInterest / 100 / 12) * firstMortgageAmount

    // Second Mortgage Calculations
    const secondMortgageAmount = (data.secondMortgagePercent / 100) * purchaseRepairCosts
    const secondMortgagePointsCost = (data.secondMortgagePoints / 100) * secondMortgageAmount
    const secondMortgageInterestCost = (data.secondMortgageInterest / 100) * secondMortgageAmount * (data.estimatedHoldTime / 12)
    const secondMortgageMonthlyPayment = (data.secondMortgageInterest / 100 / 12) * secondMortgageAmount

    // Misc Mortgage Calculations
    const miscMortgagePointsCost = (data.miscMortgagePoints / 100) * data.miscMortgageAmount
    const miscMortgageInterestCost = (data.miscMortgageInterest / 100) * data.miscMortgageAmount * (data.estimatedHoldTime / 12)
    const miscMortgageMonthlyPayment = (data.miscMortgageInterest / 100 / 12) * data.miscMortgageAmount

    // Total Financing Costs
    const totalFinancingCosts =
      firstMortgagePointsCost + firstMortgageInterestCost +
      secondMortgagePointsCost + secondMortgageInterestCost +
      miscMortgagePointsCost + miscMortgageInterestCost +
      data.miscFinancingCosts

    // Buying Transaction Costs
    const titleInsuranceCost = (data.titleInsurancePercent / 100) * data.purchasePrice
    const totalBuyingTransactionCosts = data.escrowAttorneyFeesBuy + titleInsuranceCost + data.miscBuyingCosts

    // Selling Transaction Costs
    const realtorFees = (data.realtorFeesPercent / 100) * data.afterRepairValue
    const transferConveyanceFees = (data.transferConveyancePercent / 100) * data.afterRepairValue
    const totalSellingTransactionCosts =
      data.escrowAttorneyFeesSell + data.sellingRecordingFees + realtorFees +
      transferConveyanceFees + data.homeWarranty + data.stagingCosts +
      data.marketingCosts + data.miscSellingCosts

    // Total All Costs
    const totalAllCosts =
      data.purchasePrice + data.estimatedRepairCosts +
      totalFinancingCosts + totalHoldingCosts +
      totalBuyingTransactionCosts + totalSellingTransactionCosts

    // Net Profit
    const estimatedNetProfit = data.afterRepairValue - totalAllCosts

    // ROI Calculations
    const totalCostsROI = totalAllCosts > 0 ? (estimatedNetProfit / totalAllCosts) * 100 : 0
    const purchaseRehabROI = purchaseRepairCosts > 0 ? (estimatedNetProfit / purchaseRepairCosts) * 100 : 0

    // Down Payment & Committed Capital
    const totalLoanAmount = firstMortgageAmount + secondMortgageAmount + data.miscMortgageAmount
    const downPaymentRequired = purchaseRepairCosts - totalLoanAmount + totalBuyingTransactionCosts
    const totalMonthlyInterestPayments = firstMortgageMonthlyPayment + secondMortgageMonthlyPayment + miscMortgageMonthlyPayment
    const totalInterestPayments = totalMonthlyInterestPayments * data.estimatedHoldTime
    const committedCapital = downPaymentRequired + totalHoldingCosts + totalInterestPayments +
      firstMortgagePointsCost + secondMortgagePointsCost + miscMortgagePointsCost

    // Cash on Cash Return (Annualized)
    const annualizedCashOnCashReturn = committedCapital > 0 ? (estimatedNetProfit / committedCapital) * (12 / data.estimatedHoldTime) * 100 : 0

    // Cost Per Square Foot
    const costPerSqFt = data.totalSquareFootage > 0 ? purchaseRepairCosts / data.totalSquareFootage : 0

    // Estimated Sale Date
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
      ['Property Evaluation Report'],
      [''],
      ['Property Information'],
      ['Property Address', data.propertyAddress],
      ['Total Square Footage', data.totalSquareFootage],
      ['Number of Units', data.numberOfUnits],
      ['Occupied', data.occupied ? 'Yes' : 'No'],
      ['Evaluator Name', data.evaluatorName],
      ['Evaluation Date', data.evaluationDate],
      [''],
      ['Property Values & Pricing'],
      ['After Repair Value (ARV)', formatCurrency(data.afterRepairValue)],
      ['Current As-Is Value', formatCurrency(data.currentAsIsValue)],
      ['Estimated Repair Costs', formatCurrency(data.estimatedRepairCosts)],
      ['Purchase Price', formatCurrency(data.purchasePrice)],
      ['Estimated Hold Time (months)', data.estimatedHoldTime],
      ['Purchase & Repair Costs', formatCurrency(calculations.purchaseRepairCosts)],
      [''],
      ['Financing Summary'],
      ['Total Financing Costs', formatCurrency(calculations.totalFinancingCosts)],
      ['Total Holding Costs', formatCurrency(calculations.totalHoldingCosts)],
      ['Total Buying Transaction Costs', formatCurrency(calculations.totalBuyingTransactionCosts)],
      ['Total Selling Transaction Costs', formatCurrency(calculations.totalSellingTransactionCosts)],
      [''],
      ['Analysis Results'],
      ['Estimated Net Profit', formatCurrency(calculations.estimatedNetProfit)],
      ['Total Costs ROI', formatPercent(calculations.totalCostsROI)],
      ['Purchase + Rehab ROI', formatPercent(calculations.purchaseRehabROI)],
      ['Down Payment Required', formatCurrency(calculations.downPaymentRequired)],
      ['Committed Capital', formatCurrency(calculations.committedCapital)],
      ['Annualized Cash on Cash Return', formatPercent(calculations.annualizedCashOnCashReturn)],
      ['Cost Per Sq Ft', formatCurrency(calculations.costPerSqFt)],
    ]

    const csvContent = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `property-evaluation-${data.propertyAddress || 'report'}.csv`
    link.click()
  }

  const isProfitable = calculations.estimatedNetProfit > 0

  return (
    <div className="min-h-screen bg-void">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-serif text-gold">Property Evaluation Calculator</h1>
          <button
            onClick={exportToCSV}
            className="btn-gold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Summary Banner */}
        <div className={`rounded-xl p-6 mb-8 border ${isProfitable ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Estimated Net Profit</p>
              <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(calculations.estimatedNetProfit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Total ROI</p>
              <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(calculations.totalCostsROI)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Cash on Cash Return</p>
              <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(calculations.annualizedCashOnCashReturn)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Capital Required</p>
              <p className="text-2xl font-bold text-gold">
                {formatCurrency(calculations.committedCapital)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            {/* Property Information */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Property Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Property Address</label>
                  <input
                    type="text"
                    className="input-dark w-full"
                    value={data.propertyAddress}
                    onChange={(e) => updateField('propertyAddress', e.target.value)}
                    placeholder="Enter property address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Total Sq. Ft.</label>
                    <input
                      type="number"
                      className="input-dark w-full"
                      value={data.totalSquareFootage || ''}
                      onChange={(e) => updateField('totalSquareFootage', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1"># of Units</label>
                    <input
                      type="number"
                      className="input-dark w-full"
                      value={data.numberOfUnits || ''}
                      onChange={(e) => updateField('numberOfUnits', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Evaluator Name</label>
                    <input
                      type="text"
                      className="input-dark w-full"
                      value={data.evaluatorName}
                      onChange={(e) => updateField('evaluatorName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      className="input-dark w-full"
                      value={data.evaluationDate}
                      onChange={(e) => updateField('evaluationDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="occupied"
                    checked={data.occupied}
                    onChange={(e) => updateField('occupied', e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="occupied" className="text-sm text-gray-400">Property Occupied</label>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    className="input-dark w-full h-20 resize-none"
                    value={data.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </section>

            {/* Property Values & Pricing */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Property Values & Pricing
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">After Repair Value (ARV)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.afterRepairValue || ''}
                      onChange={(e) => updateField('afterRepairValue', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Current &quot;As Is&quot; Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.currentAsIsValue || ''}
                      onChange={(e) => updateField('currentAsIsValue', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estimated Repair Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.estimatedRepairCosts || ''}
                      onChange={(e) => updateField('estimatedRepairCosts', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.purchasePrice || ''}
                      onChange={(e) => updateField('purchasePrice', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estimated Hold Time (months)</label>
                  <input
                    type="number"
                    className="input-dark w-full"
                    value={data.estimatedHoldTime || ''}
                    onChange={(e) => updateField('estimatedHoldTime', Number(e.target.value))}
                  />
                </div>
                <div className="pt-2 border-t border-gold/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Purchase & Repair Costs:</span>
                    <span className="text-gold font-semibold">{formatCurrency(calculations.purchaseRepairCosts)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Holding Costs */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Holding Costs (Monthly)
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Property Taxes (Annual)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.propertyTaxesAnnual || ''}
                        onChange={(e) => updateField('propertyTaxesAnnual', Number(e.target.value))}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Monthly: {formatCurrency(calculations.propertyTaxesMonthly)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">HOA / Condo Fees</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.hoaCondoFees || ''}
                        onChange={(e) => updateField('hoaCondoFees', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Insurance Costs (Annual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.insuranceCostsAnnual || ''}
                      onChange={(e) => updateField('insuranceCostsAnnual', Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Monthly: {formatCurrency(calculations.insuranceMonthly)}</p>
                </div>

                <div className="border-t border-gold/10 pt-4">
                  <p className="text-sm text-gray-400 mb-3">Utility Costs (Monthly)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Gas</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          className="input-dark w-full pl-7"
                          value={data.gasUtility || ''}
                          onChange={(e) => updateField('gasUtility', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Water</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          className="input-dark w-full pl-7"
                          value={data.waterUtility || ''}
                          onChange={(e) => updateField('waterUtility', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Electricity</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          className="input-dark w-full pl-7"
                          value={data.electricityUtility || ''}
                          onChange={(e) => updateField('electricityUtility', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Other</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          className="input-dark w-full pl-7"
                          value={data.otherUtility || ''}
                          onChange={(e) => updateField('otherUtility', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Miscellaneous Holding Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.miscHoldingCosts || ''}
                      onChange={(e) => updateField('miscHoldingCosts', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gold/20 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Monthly Holding:</span>
                    <span className="text-white">{formatCurrency(calculations.totalMonthlyHoldingCosts)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Holding Costs ({data.estimatedHoldTime} mo):</span>
                    <span className="text-gold font-semibold">{formatCurrency(calculations.totalHoldingCosts)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Financing Costs */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Financing Costs
              </h2>

              {/* First Mortgage */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">First Mortgage / Lien</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LTV %</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="input-dark w-full pr-6"
                        value={data.firstMortgagePercent || ''}
                        onChange={(e) => updateField('firstMortgagePercent', Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      className="input-dark w-full"
                      value={data.firstMortgagePoints || ''}
                      onChange={(e) => updateField('firstMortgagePoints', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Interest %</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="input-dark w-full pr-6"
                        value={data.firstMortgageInterest || ''}
                        onChange={(e) => updateField('firstMortgageInterest', Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>Loan Amount: {formatCurrency(calculations.firstMortgageAmount)}</p>
                  <p>Points Cost: {formatCurrency(calculations.firstMortgagePointsCost)}</p>
                  <p>Interest Cost: {formatCurrency(calculations.firstMortgageInterestCost)}</p>
                  <p>Monthly Payment: {formatCurrency(calculations.firstMortgageMonthlyPayment)}</p>
                </div>
              </div>

              {/* Second Mortgage */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Second Mortgage / Lien</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">LTV %</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="input-dark w-full pr-6"
                        value={data.secondMortgagePercent || ''}
                        onChange={(e) => updateField('secondMortgagePercent', Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      className="input-dark w-full"
                      value={data.secondMortgagePoints || ''}
                      onChange={(e) => updateField('secondMortgagePoints', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Interest %</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        className="input-dark w-full pr-6"
                        value={data.secondMortgageInterest || ''}
                        onChange={(e) => updateField('secondMortgageInterest', Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>Loan Amount: {formatCurrency(calculations.secondMortgageAmount)}</p>
                  <p>Points Cost: {formatCurrency(calculations.secondMortgagePointsCost)}</p>
                  <p>Interest Cost: {formatCurrency(calculations.secondMortgageInterestCost)}</p>
                </div>
              </div>

              {/* Misc Mortgage */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Miscellaneous Mortgage / Lien</h3>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.miscMortgageAmount || ''}
                        onChange={(e) => updateField('miscMortgageAmount', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Points</label>
                    <input
                      type="number"
                      className="input-dark w-full"
                      value={data.miscMortgagePoints || ''}
                      onChange={(e) => updateField('miscMortgagePoints', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Interest %</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="input-dark w-full pr-6"
                      value={data.miscMortgageInterest || ''}
                      onChange={(e) => updateField('miscMortgageInterest', Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Miscellaneous Financing Costs</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    className="input-dark w-full pl-7"
                    value={data.miscFinancingCosts || ''}
                    onChange={(e) => updateField('miscFinancingCosts', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gold/20 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Financing Costs:</span>
                  <span className="text-gold font-semibold">{formatCurrency(calculations.totalFinancingCosts)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Transaction Costs & Results */}
          <div className="space-y-6">
            {/* Buying Transaction Costs */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Buying Transaction Costs
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Escrow / Attorney Fees</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.escrowAttorneyFeesBuy || ''}
                      onChange={(e) => updateField('escrowAttorneyFeesBuy', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title Insurance / Search (% of Purchase)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="input-dark w-full pr-6"
                      value={data.titleInsurancePercent || ''}
                      onChange={(e) => updateField('titleInsurancePercent', Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cost: {formatCurrency(calculations.titleInsuranceCost)}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Miscellaneous Buying Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input-dark w-full pl-7"
                      value={data.miscBuyingCosts || ''}
                      onChange={(e) => updateField('miscBuyingCosts', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gold/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Buying Transaction Costs:</span>
                    <span className="text-gold font-semibold">{formatCurrency(calculations.totalBuyingTransactionCosts)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Selling Transaction Costs */}
            <section className="card-elevated p-6">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Selling Transaction Costs
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Escrow / Attorney Fees</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.escrowAttorneyFeesSell || ''}
                        onChange={(e) => updateField('escrowAttorneyFeesSell', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Recording Fees</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.sellingRecordingFees || ''}
                        onChange={(e) => updateField('sellingRecordingFees', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Realtor Fees (% of ARV)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="input-dark w-full pr-6"
                      value={data.realtorFeesPercent || ''}
                      onChange={(e) => updateField('realtorFeesPercent', Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cost: {formatCurrency(calculations.realtorFees)}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Transfer & Conveyance Fees (% of ARV)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="input-dark w-full pr-6"
                      value={data.transferConveyancePercent || ''}
                      onChange={(e) => updateField('transferConveyancePercent', Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cost: {formatCurrency(calculations.transferConveyanceFees)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Home Warranty</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.homeWarranty || ''}
                        onChange={(e) => updateField('homeWarranty', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Staging Costs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.stagingCosts || ''}
                        onChange={(e) => updateField('stagingCosts', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Marketing Costs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.marketingCosts || ''}
                        onChange={(e) => updateField('marketingCosts', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Misc. Selling Costs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input-dark w-full pl-7"
                        value={data.miscSellingCosts || ''}
                        onChange={(e) => updateField('miscSellingCosts', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gold/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Selling Transaction Costs:</span>
                    <span className="text-gold font-semibold">{formatCurrency(calculations.totalSellingTransactionCosts)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis Results */}
            <section className="card-elevated p-6 border-2 border-gold/30">
              <h2 className="text-lg font-serif text-gold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Deal Analysis Summary
              </h2>

              <div className="space-y-6">
                {/* Purchase & Deal Analysis */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 border-b border-gold/20 pb-2">Purchase & Deal Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">After Repair Value:</span>
                      <span className="text-white">{formatCurrency(data.afterRepairValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purchase Price:</span>
                      <span className="text-white">{formatCurrency(data.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Repair Costs:</span>
                      <span className="text-white">{formatCurrency(data.estimatedRepairCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Financing Costs:</span>
                      <span className="text-white">{formatCurrency(calculations.totalFinancingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Holding Costs:</span>
                      <span className="text-white">{formatCurrency(calculations.totalHoldingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Buying Transaction Costs:</span>
                      <span className="text-white">{formatCurrency(calculations.totalBuyingTransactionCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Selling Transaction Costs:</span>
                      <span className="text-white">{formatCurrency(calculations.totalSellingTransactionCosts)}</span>
                    </div>
                  </div>
                </div>

                {/* Potential Return & Profit */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 border-b border-gold/20 pb-2">Potential Return & Profit Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Sale Date:</span>
                      <span className="text-white">{calculations.saleDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost Per Sq. Ft:</span>
                      <span className="text-white">{formatCurrency(calculations.costPerSqFt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Down Payment Required:</span>
                      <span className="text-white">{formatCurrency(calculations.downPaymentRequired)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">My Committed Capital:</span>
                      <span className="text-white">{formatCurrency(calculations.committedCapital)}</span>
                    </div>
                  </div>
                </div>

                {/* Final Results */}
                <div className={`rounded-lg p-4 ${isProfitable ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                  <h3 className="text-sm font-semibold text-white mb-3">Net Profit & ROI</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Estimated NET PROFIT:</span>
                      <span className={`text-xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(calculations.estimatedNetProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Costs ROI:</span>
                      <span className={`text-lg font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(calculations.totalCostsROI)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Purchase + Rehab ROI:</span>
                      <span className={`text-lg font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(calculations.purchaseRehabROI)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Annualized Cash on Cash:</span>
                      <span className={`text-lg font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercent(calculations.annualizedCashOnCashReturn)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deal Verdict */}
                <div className={`rounded-lg p-4 text-center ${isProfitable ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
                  <p className={`text-lg font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                    {isProfitable ? 'POTENTIALLY PROFITABLE DEAL' : 'NOT A PROFITABLE DEAL'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isProfitable
                      ? 'Based on the numbers, this deal shows potential profit.'
                      : 'Review the purchase price or costs to improve profitability.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/20 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Property Evaluation Calculator by CookinFlips &amp; FlipEffective
          </p>
        </div>
      </footer>
    </div>
  )
}
