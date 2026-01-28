"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Filter, Download, Search } from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer" | "payment"
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
}

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      description: "Investment Return - OC Fix & Flip",
      amount: 15000,
      date: "2026-01-27",
      status: "completed",
    },
    {
      id: "2",
      type: "withdrawal",
      description: "Property Purchase - LA Commercial",
      amount: 250000,
      date: "2026-01-25",
      status: "completed",
    },
    {
      id: "3",
      type: "transfer",
      description: "Transfer to Investment Account",
      amount: 50000,
      date: "2026-01-24",
      status: "completed",
    },
    {
      id: "4",
      type: "deposit",
      description: "Loan Funding - Bridge Loan",
      amount: 150000,
      date: "2026-01-22",
      status: "completed",
    },
    {
      id: "5",
      type: "payment",
      description: "Monthly Interest Payment",
      amount: 3500,
      date: "2026-01-20",
      status: "pending",
    },
  ])

  const totalIncome = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => (t.type === "withdrawal" || t.type === "payment") && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

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
                <span className="text-[9px] text-white/40">Transaction History</span>
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
            <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
            <p className="text-white/60">View and manage all your transactions</p>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white/60 text-sm">Total Income</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                ${totalIncome.toLocaleString()}
              </div>
            </div>

            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-white/60 text-sm">Total Expenses</span>
              </div>
              <div className="text-3xl font-bold text-red-400">
                ${totalExpenses.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-3 bg-[#111] border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-gold/30"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-[#111] border border-white/10 rounded-lg text-white hover:bg-white/5 transition">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-5 bg-[#111] border border-white/10 rounded-xl hover:border-gold/30 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "deposit"
                          ? "bg-green-500/10"
                          : transaction.type === "withdrawal"
                            ? "bg-red-500/10"
                            : "bg-cyan-500/10"
                      }`}
                    >
                      {transaction.type === "deposit" ? (
                        <ArrowDownRight className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{transaction.description}</div>
                      <div className="text-sm text-white/50">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        transaction.status === "completed"
                          ? "text-green-400"
                          : transaction.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
