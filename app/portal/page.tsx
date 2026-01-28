"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Building2,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ArrowRight,
  Search,
  Bell,
  Bookmark,
  Filter,
  Eye,
  Heart,
  Download,
  Loader2,
  Wallet,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Property {
  id: string
  address: string
  city: string
  state: string
  price: number
  arv: number
  equity_percentage: number
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  sqft: number | null
  units: number | null
  status: string
  images: string[] | null
}

interface Offering {
  id: string
  name: string
  offering_type: string
  target_return: string
  minimum_investment: number
  term: string
  status: string
  raised_amount: number
  target_amount: number
}

export default function InvestorPortal() {
  const [activeTab, setActiveTab] = useState<"properties" | "investments" | "lending" | "banking">("properties")
  const [savedProperties, setSavedProperties] = useState<string[]>([])
  const [filterCity, setFilterCity] = useState("")
  const [filterType, setFilterType] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [offerings, setOfferings] = useState<Offering[]>([])
  const [loading, setLoading] = useState(true)
  const [inquirySubmitting, setInquirySubmitting] = useState<string | null>(null)
  const [inquirySuccess, setInquirySuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch properties
      const { data: propertiesData } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (propertiesData) {
        setProperties(propertiesData)
      }

      // Fetch offerings
      const { data: offeringsData } = await supabase
        .from("investment_offerings")
        .select("*")
        .in("status", ["open", "coming_soon"])
        .order("created_at", { ascending: false })

      if (offeringsData) {
        setOfferings(offeringsData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const toggleSave = (id: string) => {
    setSavedProperties((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  const handlePropertyInquiry = async (propertyId: string) => {
    setInquirySubmitting(propertyId)

    try {
      const supabase = createClient()
      const property = properties.find((p) => p.id === propertyId)

      // Create a lead for the inquiry
      await supabase.from("leads").insert({
        name: "Portal Visitor",
        email: "inquiry@portal.com",
        lead_type: "investor",
        message: `Interested in property: ${property?.address}, ${property?.city}, ${property?.state}`,
        source: "investor_portal",
      })

      setInquirySuccess(propertyId)
      setTimeout(() => setInquirySuccess(null), 3000)
    } catch (error) {
      console.error("Error submitting inquiry:", error)
    } finally {
      setInquirySubmitting(null)
    }
  }

  const filteredProperties = properties.filter((p) => {
    if (filterCity && !p.city.toLowerCase().includes(filterCity.toLowerCase())) return false
    if (filterType && p.property_type !== filterType) return false
    return true
  })

  // Fallback sample data if no DB data
  const displayProperties =
    filteredProperties.length > 0
      ? filteredProperties
      : [
          {
            id: "1",
            address: "1234 Pacific Coast Hwy",
            city: "Newport Beach",
            state: "CA",
            price: 1250000,
            arv: 1650000,
            equity_percentage: 32,
            property_type: "SFR",
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2850,
            units: null,
            status: "active",
            images: null,
          },
          {
            id: "2",
            address: "5678 Beach Blvd",
            city: "Huntington Beach",
            state: "CA",
            price: 3400000,
            arv: 4500000,
            equity_percentage: 28,
            property_type: "Multi-Family",
            bedrooms: null,
            bathrooms: null,
            sqft: 12000,
            units: 8,
            status: "active",
            images: null,
          },
          {
            id: "3",
            address: "9012 Westminster Ave",
            city: "Westminster",
            state: "CA",
            price: 890000,
            arv: 1200000,
            equity_percentage: 35,
            property_type: "SFR",
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1850,
            units: null,
            status: "active",
            images: null,
          },
          {
            id: "4",
            address: "3456 Main Street",
            city: "Orange",
            state: "CA",
            price: 5800000,
            arv: 7500000,
            equity_percentage: 29,
            property_type: "Commercial",
            bedrooms: null,
            bathrooms: null,
            sqft: 25000,
            units: null,
            status: "active",
            images: null,
          },
        ]

  const displayOfferings =
    offerings.length > 0
      ? offerings
      : [
          {
            id: "1",
            name: "OC Multifamily Fund I",
            offering_type: "Reg D 506(c)",
            target_return: "18-22% IRR",
            minimum_investment: 50000,
            term: "3-5 Years",
            status: "open",
            raised_amount: 2500000,
            target_amount: 5000000,
          },
          {
            id: "2",
            name: "SoCal Fix & Flip Fund",
            offering_type: "Reg D 506(b)",
            target_return: "15-20% IRR",
            minimum_investment: 25000,
            term: "2-3 Years",
            status: "open",
            raised_amount: 1800000,
            target_amount: 3000000,
          },
          {
            id: "3",
            name: "Note Investment Fund II",
            offering_type: "Reg D 506(c)",
            target_return: "12-15% Yield",
            minimum_investment: 25000,
            term: "1-2 Years",
            status: "coming_soon",
            raised_amount: 0,
            target_amount: 2000000,
          },
        ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="CookinFlips"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <div>
                  <span className="text-xl font-bold text-gold">Investor</span>
                  <span className="text-xl font-light text-white">Portal</span>
                </div>
                <div className="text-[9px] text-gold/70 tracking-wider">POWERED BY SAINTSAL.AI</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <Bell className="w-5 h-5 text-white/60" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition">
                <Bookmark className="w-5 h-5 text-white/60" />
              </button>
              <Link
                href="/#contact"
                className="px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-gold/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-gold transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold">Investor Portal</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gold">Exclusive</span> Investment Access
          </h1>
          <p className="text-white/60 max-w-2xl">
            Browse wholesale properties, invest in syndications, and access lending products. All powered by SaintSal™
            AI for instant analysis.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-[#0a0a0a] border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: "properties", label: "Wholesale Properties", icon: Building2 },
              { id: "investments", label: "Investment Offerings", icon: TrendingUp },
              { id: "lending", label: "Lending Products", icon: DollarSign },
              { id: "banking", label: "Banking", icon: Wallet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "properties" | "investments" | "lending" | "banking")}
                className={`flex items-center gap-2 py-4 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id ? "border-gold text-gold" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            {/* Properties Tab */}
            {activeTab === "properties" && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search by city..."
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold/50 focus:outline-none w-64"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-white/80 focus:border-gold/50 focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="SFR">SFR Flip</option>
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-white/80 hover:bg-white/10 transition">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>

                {/* Properties Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl overflow-hidden hover:border-gold/40 transition group"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gold/20 via-gold/10 to-transparent">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-gold/30">
                              {property.property_type === "Commercial" && "🏢"}
                              {property.property_type === "Multi-Family" && "🏘️"}
                              {property.property_type === "SFR" && "🏡"}
                              {!["Commercial", "Multi-Family", "SFR"].includes(property.property_type) && "🏠"}
                            </div>
                            <div className="text-xs text-gold/50 mt-2 font-semibold">{property.property_type}</div>
                          </div>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              property.status === "active" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                            }`}
                          >
                            {property.status === "active" ? "Active" : "Under Contract"}
                          </span>
                        </div>
                        {/* Save Button */}
                        <button
                          onClick={() => toggleSave(property.id)}
                          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedProperties.includes(property.id) ? "fill-gold text-gold" : "text-white"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-white">{property.address}</h3>
                            <p className="text-sm text-white/60">
                              {property.city}, {property.state}
                            </p>
                          </div>
                          <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded">
                            {property.property_type}
                          </span>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <div className="text-xs text-white/50">Price</div>
                            <div className="text-xl font-bold text-gold">{formatCurrency(property.price)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/50">Est. Equity</div>
                            <div className="text-lg font-bold text-green-400">{property.equity_percentage}%</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gold/10 text-sm text-white/60">
                          {property.bedrooms && <span>{property.bedrooms} bed</span>}
                          {property.bathrooms && <span>{property.bathrooms} bath</span>}
                          {property.sqft && <span>{property.sqft.toLocaleString()} sqft</span>}
                          {property.units && <span>{property.units} units</span>}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handlePropertyInquiry(property.id)}
                            disabled={inquirySubmitting === property.id}
                            className="flex-1 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-sm disabled:opacity-50"
                          >
                            {inquirySubmitting === property.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : inquirySuccess === property.id ? (
                              "Sent!"
                            ) : (
                              "Request Info"
                            )}
                          </button>
                          <button className="p-2 border border-gold/30 rounded-lg hover:bg-gold/10 transition">
                            <Eye className="w-5 h-5 text-gold" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === "investments" && (
              <div className="space-y-6">
                {displayOfferings.map((offering) => (
                  <motion.div
                    key={offering.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{offering.name}</h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              offering.status === "open"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {offering.status === "open" ? "Open" : "Coming Soon"}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">{offering.offering_type}</p>
                      </div>

                      <div className="flex flex-wrap gap-8">
                        <div>
                          <div className="text-xs text-white/50">Target Return</div>
                          <div className="text-lg font-bold text-green-400">{offering.target_return}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">Minimum</div>
                          <div className="text-lg font-bold text-gold">
                            {formatCurrency(offering.minimum_investment)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">Term</div>
                          <div className="text-lg font-bold text-white">{offering.term}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
                          View Details
                        </button>
                        <button className="p-2 border border-gold/30 rounded-lg hover:bg-gold/10 transition">
                          <Download className="w-5 h-5 text-gold" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {offering.status === "open" && (
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Raised: {formatCurrency(offering.raised_amount)}</span>
                          <span className="text-gold">Target: {formatCurrency(offering.target_amount)}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold to-gold/80 rounded-full transition-all duration-500"
                            style={{ width: `${(offering.raised_amount / offering.target_amount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Banking Tab */}
            {activeTab === "banking" && (
              <div className="text-center py-12">
                <div className="max-w-2xl mx-auto">
                  <Wallet className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Banking Platform</h3>
                  <p className="text-white/60 mb-6">
                    Access your full banking dashboard with accounts, transactions, cards, and payments.
                  </p>
                  <Link
                    href="/banking"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                  >
                    Open Banking Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Lending Tab */}
            {activeTab === "lending" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Fix & Flip", rate: "9.99%+", ltv: "90% LTC", term: "6-18 mo" },
                  { name: "DSCR Rental", rate: "7.49%+", ltv: "80% LTV", term: "30 yr" },
                  { name: "Bridge Loan", rate: "10.99%+", ltv: "75% LTV", term: "12-24 mo" },
                  { name: "Construction", rate: "11.99%+", ltv: "85% LTC", term: "12-24 mo" },
                  { name: "Commercial", rate: "6.99%+", ltv: "75% LTV", term: "5-25 yr" },
                  { name: "Cannabis", rate: "12.99%+", ltv: "65% LTV", term: "12-36 mo" },
                ].map((loan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">{loan.name}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-white/60">Rate</span>
                        <span className="text-gold font-bold">{loan.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Leverage</span>
                        <span className="text-white font-bold">{loan.ltv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Term</span>
                        <span className="text-white font-bold">{loan.term}</span>
                      </div>
                    </div>
                    <Link
                      href="/#contact"
                      className="block w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition text-center"
                    >
                      Get Pre-Qualified
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-gold/10 border-t border-gold/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gold">Ready to</span> Get Started?
          </h2>
          <p className="text-white/60 mb-8">
            Create your free investor account to save properties, receive alerts, and access exclusive investment
            opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center gap-2"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:9499972097"
              className="px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition"
            >
              Call (949) 997-2097
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="CookinFlips"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <span className="text-white/60 text-sm">© 2025 CookinFlips + </span>
                <span className="text-white font-semibold text-sm">Flip</span>
                <span className="text-[#00CED1] font-semibold text-sm">Effective</span>
              </div>
            </div>
            <div className="text-sm text-white/40">Powered by SaintSal™ AI</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
