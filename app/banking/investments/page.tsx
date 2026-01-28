"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, TrendingUp, Wallet, PieChart, DollarSign, Building2, Plus } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: string
  amount: number
  returns: number
  status: "active" | "pending" | "completed"
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      name: "Orange County Fix & Flip",
      type: "Fix & Flip",
      amount: 250000,
      returns: 18.5,
      status: "active",
    },
    {
      id: "2",
      name: "San Diego Multifamily",
      type: "Rental Portfolio",
      amount: 500000,
      returns: 12.3,
      status: "active",
    },
    {
      id: "3",
      name: "LA Commercial Bridge",
      type: "Bridge Loan",
      amount: 150000,
      returns: 22.1,
      status: "completed",
    },
  ])

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const avgReturn = investments.reduce((sum, inv) => sum + inv.returns, 0) / investments.length

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
                <span className="text-[9px] text-white/40">Investment Dashboard</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/banking"
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-gold transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Banking
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Investment Portfolio</h1>
            <p className="text-white/60">Track and manage your real estate investments</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-gold" />
                <span className="text-white/60 text-sm">Total Invested</span>
              </div>
              <div className="text-3xl font-bold text-white">
                ${totalInvested.toLocaleString()}
              </div>
            </div>

            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white/60 text-sm">Average Returns</span>
              </div>
              <div className="text-3xl font-bold text-green-400">{avgReturn.toFixed(1)}%</div>
            </div>

            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <span className="text-white/60 text-sm">Active Investments</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {investments.filter((i) => i.status === "active").length}
              </div>
            </div>
          </div>

          {/* Investments List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Your Investments</h2>
              <Link
                href="/portal"
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                New Investment
              </Link>
            </div>

            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="p-6 bg-[#111] border border-white/10 rounded-xl hover:border-gold/30 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{investment.name}</h3>
                        <p className="text-white/50 text-sm">{investment.type}</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        investment.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : investment.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {investment.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/50 text-xs mb-1">Amount Invested</div>
                      <div className="text-white font-semibold">
                        ${investment.amount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs mb-1">Returns</div>
                      <div className="text-green-400 font-semibold">+{investment.returns}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/banking"
              className="p-6 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-xl hover:border-gold/40 transition"
            >
              <DollarSign className="w-8 h-8 text-gold mb-3" />
              <h3 className="font-semibold text-white mb-1">View Banking</h3>
              <p className="text-sm text-white/50">Access your full banking platform</p>
            </Link>

            <Link
              href="/portal"
              className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition"
            >
              <Building2 className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">Browse Properties</h3>
              <p className="text-sm text-white/50">Find new investment opportunities</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
