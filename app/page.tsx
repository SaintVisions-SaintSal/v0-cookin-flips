"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Building2,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  CheckCircle2,
  Star,
  Menu,
  X,
  Home,
  Gavel,
  Brain,
  ExternalLink,
  Sparkles,
  Landmark,
  FileText,
  Bell,
  Calculator,
  PiggyBank,
  Key,
  Send,
  Crown,
  Award,
  Rocket,
  Users,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const leadership = [
  {
    name: "Ryan Capatosto",
    title: "Founder & Creator | SaintSal™ AI",
    email: "ryan@saintsal.ai",
    bio: "Visionary founder of Saint Vision Technologies and creator of SaintSal™ AI. Holder of US Patent #10,290,222 (HACP™). Former Goldman Sachs and JP Morgan. Built the revolutionary SaintSal™ AI platform powering the nation's premier real estate ecosystem. Over $1.4M personally invested in building cutting-edge real estate technology solutions that are transforming the industry.",
    image: "/images/TRANSPARENTSAINTSALLOGO.png",
    linkedin: "https://linkedin.com/in/ryancapatosto",
    website: "https://saintsal.ai",
    isFounder: true,
  },
  {
    name: "Darren Brown",
    title: "CEO | FlipEffective",
    secondTitle: "President | SaintSal™ Affiliate Program",
    email: "darren@flipeffective.com",
    bio: "Chief Executive Officer of FlipEffective and President of the SaintSal™ Trademarked Affiliate Program. Under Darren's leadership, the firm has managed and co-invested in multiple institutional investment funds, raising over $1 billion in debt and equity financing. His strategic vision has facilitated the acquisition and resolution of distressed residential assets exceeding $3 billion since 2007. Now leading FlipEffective's expansion and affiliate team recruitment nationwide.",
    image: "/images/DRIPLOGOSAINT_.png",
    linkedin: "https://linkedin.com/in/darrenbrown",
    affiliateLink: "/affiliate/darren",
    isCEO: true,
  },
  {
    name: "JR Taber",
    title: "President | SaintSal™ Affiliate Program",
    secondTitle: "VP Director of Lending",
    email: "jr@saintsal.ai",
    bio: "President of the SaintSal™ Trademarked Affiliate Program and VP Director of Lending with extensive experience in commercial lending operations. JR leads our lending division ensuring seamless deal execution across all 51 states. Expert in structuring complex financing solutions. Now actively recruiting and building his affiliate team nationwide.",
    image: "/images/TRANSPARENTSAINTSALLOGO.png",
    linkedin: "https://linkedin.com/in/jrtaber",
    affiliateLink: "/affiliate/jr",
    isPresident: true,
  },
  {
    name: "Omar Gutierrez",
    title: "Director of Operations",
    email: "omar@saintsal.ai",
    bio: "30+ years in real estate valuation, construction, and investment. USC graduate specializing in Public Administration & Planning. Directly involved in over 40,000 property valuations. Led renovation of 500+ homes and acquisition of 600+ properties across California.",
    image: "/images/TRANSPARENTSAINTSALLOGO.png",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Simon Polito",
    title: "Real Estate Agent & Auctioneer",
    email: "simon@reauctions.com",
    bio: "Powerhouse in global luxury real estate with $1B+ in closed transactions. Founder of RECA (ReAuctions.com) - redefining luxury live auctions. Host of 'Selling Southern California'. His expertise and innovative approach have positioned him at the forefront of the industry.",
    image: "/images/TRANSPARENTSAINTSALLOGO.png",
    linkedin: "https://linkedin.com",
    website: "https://reauctions.com",
  },
]

const services = [
  {
    icon: Building2,
    title: "Wholesale Properties",
    description:
      "Premium off-market deals with verified equity. Access exclusive wholesale inventory from our nationwide network.",
    features: ["Off-Market Deals", "Verified Title", "Quick Close", "Volume Discounts"],
    link: "/portal",
  },
  {
    icon: DollarSign,
    title: "Investment Syndicate",
    description:
      "Join our syndicate with LLC project numbers. Invest alongside institutional funds in curated opportunities.",
    features: ["LLC Structured", "Reg D Offerings", "Passive Income", "Tax Benefits"],
    link: "#invest",
  },
  {
    icon: Landmark,
    title: "Commercial Lending",
    description: "Full-service lending across all 51 states. From bridge loans to permanent financing, we do it ALL.",
    features: ["Bridge Loans", "DSCR Loans", "Construction", "Cannabis Lending"],
    link: "#lending",
  },
  {
    icon: Home,
    title: "Residential Brokerage",
    description: "Traditional real estate services with cutting-edge technology. Buy, sell, or invest with confidence.",
    features: ["Luxury Homes", "First-Time Buyers", "Investment Properties", "REO Assets"],
    link: "#contact",
  },
  {
    icon: Gavel,
    title: "ReAuctions Platform",
    description:
      "Luxury live non-distressed auctions powered by Simon Polito's RECA. Elite solutions for high-end properties.",
    features: ["Live Auctions", "Luxury Properties", "Global Reach", "Record Results"],
    link: "https://reauctions.com",
  },
  {
    icon: Brain,
    title: "SaintSal™ AI",
    description:
      "Our proprietary AI platform analyzing deals, underwriting loans, and providing instant market intelligence.",
    features: ["Deal Analysis", "Auto-Underwriting", "Market Intel", "24/7 Support"],
    link: "https://saintsal.ai",
  },
]

const stats = [
  { value: "$3B+", label: "Assets Managed" },
  { value: "$1B+", label: "Capital Raised" },
  { value: "51", label: "States Covered" },
  { value: "40,000+", label: "Properties Valued" },
]

const investmentAreas = [
  "Orange County",
  "Los Angeles",
  "San Diego",
  "Riverside",
  "San Francisco Bay Area",
  "Sacramento",
  "Phoenix",
  "Las Vegas",
  "Denver",
  "Dallas/Fort Worth",
  "Houston",
  "Atlanta",
  "Miami",
  "Tampa",
  "Nashville",
  "Charlotte",
]

const loanProducts = [
  { name: "Fix & Flip", rate: "From 9.99%", ltv: "Up to 90% LTC" },
  { name: "DSCR Rental", rate: "From 7.49%", ltv: "Up to 80% LTV" },
  { name: "Bridge Loans", rate: "From 10.99%", ltv: "Up to 75% LTV" },
  { name: "Construction", rate: "From 11.99%", ltv: "Up to 85% LTC" },
  { name: "Commercial", rate: "From 6.99%", ltv: "Up to 75% LTV" },
  { name: "Cannabis", rate: "From 12.99%", ltv: "Up to 65% LTV" },
]

export default function CookinFlipsHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    setFormError(null)

    try {
      const supabase = createClient()

      // Insert into leads table
      const { error: leadError } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_type: formData.type || "contact",
        message: formData.message,
        preferred_markets: selectedAreas.length > 0 ? selectedAreas : null,
        source: "homepage_contact",
      })

      if (leadError) throw leadError

      // Also insert into contact_submissions
      const { error: contactError } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `New ${formData.type || "Contact"} Inquiry`,
        message:
          formData.message + (selectedAreas.length > 0 ? `\n\nPreferred Markets: ${selectedAreas.join(", ")}` : ""),
        source_page: "/",
      })

      if (contactError) throw contactError

      setFormSuccess(true)
      setFormData({ name: "", email: "", phone: "", type: "", message: "" })
      setSelectedAreas([])
      setTimeout(() => setFormSuccess(false), 5000)
    } catch (err) {
      console.error("Form submission error:", err)
      setFormError("Something went wrong. Please try again or call us directly.")
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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
                <div className="text-[11px] tracking-wider font-bold">
                  <span className="text-white">Flip</span>
                  <span className="text-[#00CED1]">Effective</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#services" className="text-white/80 hover:text-gold transition">
                Services
              </Link>
              <Link href="#invest" className="text-white/80 hover:text-gold transition">
                Invest
              </Link>
              <Link href="#lending" className="text-white/80 hover:text-gold transition">
                Lending
              </Link>
              <Link href="#team" className="text-white/80 hover:text-gold transition">
                Leadership
              </Link>
              <Link href="#contact" className="text-white/80 hover:text-gold transition">
                Contact
              </Link>
              <Link href="/evaluate" className="text-white/80 hover:text-gold transition flex items-center gap-1">
                <Calculator className="w-4 h-4" />
                Evaluate
              </Link>
              <Link
                href="/portal"
                className="px-6 py-2.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
              >
                Investor Portal
              </Link>
            </div>

            {/* Mobile Menu Button */}
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
                <Link
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-white/80 hover:text-gold"
                >
                  Services
                </Link>
                <Link
                  href="#invest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-white/80 hover:text-gold"
                >
                  Invest
                </Link>
                <Link
                  href="#lending"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-white/80 hover:text-gold"
                >
                  Lending
                </Link>
                <Link
                  href="#team"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-white/80 hover:text-gold"
                >
                  Leadership
                </Link>
                <Link
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-white/80 hover:text-gold"
                >
                  Contact
                </Link>
                <Link
                  href="/evaluate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-white/80 hover:text-gold"
                >
                  <Calculator className="w-4 h-4" />
                  Evaluate Deal
                </Link>
                <Link
                  href="/portal"
                  className="block w-full py-3 bg-gold text-black font-semibold rounded-lg text-center"
                >
                  Investor Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/SAINTSALCOOKINKNOWELEDGENEON.png"
            alt="Background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6"
              >
                <Star className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">
                  <span className="text-white">Flip</span>
                  <span className="text-[#00CED1]">Effective</span>
                  <span className="text-gold"> + CookinFlips Merger</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold mb-6"
              >
                <span className="text-gold">Real Estate</span>
                <br />
                <span className="text-white">Reimagined</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/70 mb-8 max-w-lg"
              >
                $3B+ in distressed assets. $1B+ capital raised. 51 states. The nation's premier real estate investment
                firm powered by SaintSal™ AI technology.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link
                  href="#invest"
                  className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center gap-2"
                >
                  Start Investing <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#lending"
                  className="px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition"
                >
                  Get Financing
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="text-3xl lg:text-4xl font-bold text-gold">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/30 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold">Active Deals</div>
                      <div className="text-white/60">Nationwide Inventory</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { location: "Newport Beach, CA", type: "SFR Flip", price: "$1.2M", equity: "32%" },
                      { location: "Westminster, CA", type: "Multi-Family", price: "$3.4M", equity: "28%" },
                      { location: "Huntington Beach, CA", type: "Commercial", price: "$5.8M", equity: "35%" },
                    ].map((deal, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gold/10"
                      >
                        <div>
                          <div className="font-semibold text-white">{deal.location}</div>
                          <div className="text-sm text-gold">{deal.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{deal.price}</div>
                          <div className="text-sm text-green-400">{deal.equity} Equity</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/portal"
                    className="block w-full mt-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition text-center"
                  >
                    View All Properties
                  </Link>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Merger Announcement Banner */}
      <section className="py-12 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="CookinFlips"
                width={80}
                height={80}
                className="object-contain"
              />
              <div className="text-3xl text-gold">+</div>
              <div className="text-3xl font-bold">
                <span className="text-white">Flip</span>
                <span className="text-[#00CED1]">Effective</span>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gold">Two Powerhouses. One Vision.</h3>
              <p className="text-white/70">Combining decades of experience with cutting-edge AI technology</p>
            </div>
            <Link
              href="#team"
              className="px-8 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
            >
              Meet The Team
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gold">Full-Service</span> Real Estate
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              From wholesale deals to institutional syndications, we handle every aspect of real estate investment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition">
                  <service.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-white/60 mb-6">{service.description}</p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  href={service.link}
                  target={service.link.startsWith("http") ? "_blank" : undefined}
                  rel={service.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition font-medium"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Portal Section */}
      <section id="invest" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gold">Invest</span> With Confidence
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Join our syndicate and invest alongside institutional funds. Choose your preferred markets, property
                types, and investment minimums. Get alerts when deals match your criteria.
              </p>

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gold mb-4">Select Your Preferred Markets:</h4>
                <div className="flex flex-wrap gap-2">
                  {investmentAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedAreas.includes(area)
                          ? "bg-gold text-black"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, text: "SEC Compliant" },
                  { icon: FileText, text: "LLC Structured" },
                  { icon: Bell, text: "Deal Alerts" },
                  { icon: Calculator, text: "Tax Advantages" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                    <item.icon className="w-5 h-5 text-gold" />
                    <span className="text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/portal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
              >
                Create Investor Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Passive Syndications",
                  desc: "Invest alongside our fund in curated deals",
                  min: "$50,000",
                  returns: "15-25% IRR",
                  icon: PiggyBank,
                },
                {
                  title: "Direct Investments",
                  desc: "Purchase properties directly with financing",
                  min: "$100,000",
                  returns: "20-35% IRR",
                  icon: Key,
                },
                {
                  title: "Note Investments",
                  desc: "Invest in performing and non-performing notes",
                  min: "$25,000",
                  returns: "12-18% Yield",
                  icon: FileText,
                },
              ].map((type, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-gold/20 rounded-2xl p-6 hover:border-gold/40 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <type.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold text-white mb-1">{type.title}</h4>
                      <p className="text-white/60 text-sm mb-3">{type.desc}</p>
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-xs text-white/50">Minimum</div>
                          <div className="text-gold font-bold">{type.min}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/50">Target Returns</div>
                          <div className="text-green-400 font-bold">{type.returns}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lending Section */}
      <section id="lending" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gold">Lending</span> Solutions
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Full-service lending across all 51 states. We finance everything - including cannabis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanProducts.map((loan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition"
              >
                <h4 className="text-xl font-bold text-white mb-4">{loan.name}</h4>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-white/50">Rate</div>
                    <div className="text-gold font-bold text-lg">{loan.rate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/50">Leverage</div>
                    <div className="text-white font-bold text-lg">{loan.ltv}</div>
                  </div>
                </div>
                <Link
                  href="#contact"
                  className="block w-full py-2 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition text-sm font-medium text-center"
                >
                  Get Quote
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
            >
              Apply for Financing <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gold">Leadership</span> Team
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Decades of combined experience. Billions in transactions. Meet the people behind CookinFlips.
            </p>
          </div>

          {/* DARREN BROWN - CEO SHOWCASE */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#00CED1]/20 border border-[#00CED1]/50 rounded-full mb-4">
                <Crown className="w-5 h-5 text-[#00CED1]" />
                <span className="text-[#00CED1] font-bold">CHIEF EXECUTIVE OFFICER</span>
              </div>
            </div>

            {leadership
              .filter((p) => p.isCEO)
              .map((person, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="bg-gradient-to-br from-[#1a1a1a] via-[#00CED1]/10 to-[#111] border-2 border-[#00CED1] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,206,209,0.3)]">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative bg-gradient-to-br from-[#00CED1]/20 via-white/5 to-transparent p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute top-4 left-4">
                          <div className="px-4 py-2 bg-[#00CED1] text-black text-sm font-bold rounded-full flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            CEO
                          </div>
                        </div>
                        <Image
                          src={person.image || "/placeholder.svg"}
                          alt={person.name}
                          width={200}
                          height={200}
                          className="object-contain mb-6"
                        />
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">
                            <span className="text-white">Flip</span>
                            <span className="text-[#00CED1]">Effective</span>
                          </div>
                          <div className="text-white/60 text-sm">Leading the Future of Real Estate</div>
                        </div>
                      </div>

                      <div className="p-8 lg:p-10">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-[#00CED1] text-black text-xs font-bold rounded-full">
                            CEO - FLIPEFFECTIVE
                          </span>
                          <span className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
                            AFFILIATE PRESIDENT
                          </span>
                        </div>

                        <h3 className="text-4xl font-bold text-white mb-2">{person.name}</h3>
                        <div className="text-[#00CED1] font-semibold text-lg mb-2">{person.title}</div>
                        <div className="text-gold text-sm mb-6">{person.secondTitle}</div>

                        <p className="text-white/70 mb-8 leading-relaxed">{person.bio}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-black/30 rounded-xl p-4 border border-[#00CED1]/20">
                            <div className="text-2xl font-bold text-[#00CED1]">$3B+</div>
                            <div className="text-white/60 text-sm">Assets Resolved</div>
                          </div>
                          <div className="bg-black/30 rounded-xl p-4 border border-[#00CED1]/20">
                            <div className="text-2xl font-bold text-[#00CED1]">$1B+</div>
                            <div className="text-white/60 text-sm">Capital Raised</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={person.affiliateLink || "#"}
                            className="flex items-center gap-2 px-6 py-3 bg-[#00CED1] text-black font-bold rounded-lg hover:bg-[#00CED1]/90 transition"
                          >
                            <Rocket className="w-5 h-5" />
                            Join Darren's Team
                          </Link>
                          <a
                            href={`tel:${person.phone?.replace(/[^0-9]/g, "")}`}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-[#00CED1]/30 rounded-lg text-white hover:bg-white/20 transition"
                          >
                            <Phone className="w-5 h-5 text-[#00CED1]" />
                            {person.phone}
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-[#00CED1]/30 rounded-lg text-white hover:bg-white/20 transition"
                          >
                            <Mail className="w-5 h-5 text-[#00CED1]" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* RYAN CAPATOSTO - FOUNDER SHOWCASE */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gold/20 border border-gold/50 rounded-full mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <span className="text-gold font-bold">FOUNDER & CREATOR</span>
              </div>
            </div>

            {leadership
              .filter((p) => p.isFounder)
              .map((person, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="bg-gradient-to-br from-[#1a1a1a] via-gold/10 to-[#111] border-2 border-gold rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.3)]">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative bg-gradient-to-br from-gold/20 via-white/5 to-transparent p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute top-4 left-4">
                          <div className="px-4 py-2 bg-gold text-black text-sm font-bold rounded-full flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            FOUNDER
                          </div>
                        </div>
                        <Image
                          src={person.image || "/placeholder.svg"}
                          alt={person.name}
                          width={220}
                          height={220}
                          className="object-contain mb-6"
                        />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gold mb-1">SaintSal™ AI</div>
                          <div className="text-white/60 text-sm">US Patent #10,290,222</div>
                        </div>
                      </div>

                      <div className="p-8 lg:p-10">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
                            FOUNDER & CEO
                          </span>
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                            PATENT HOLDER
                          </span>
                        </div>

                        <h3 className="text-4xl font-bold text-white mb-2">{person.name}</h3>
                        <div className="text-gold font-semibold text-lg mb-6">{person.title}</div>

                        <p className="text-white/70 mb-8 leading-relaxed">{person.bio}</p>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                          <div className="bg-black/30 rounded-xl p-3 border border-gold/20 text-center">
                            <div className="text-lg font-bold text-gold">Goldman</div>
                            <div className="text-white/60 text-xs">Sachs</div>
                          </div>
                          <div className="bg-black/30 rounded-xl p-3 border border-gold/20 text-center">
                            <div className="text-lg font-bold text-gold">JP Morgan</div>
                            <div className="text-white/60 text-xs">Chase</div>
                          </div>
                          <div className="bg-black/30 rounded-xl p-3 border border-gold/20 text-center">
                            <div className="text-lg font-bold text-gold">$1.4M+</div>
                            <div className="text-white/60 text-xs">Invested</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <a
                            href={person.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
                          >
                            <ExternalLink className="w-5 h-5" />
                            SaintSal.ai
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-gold/30 rounded-lg text-white hover:bg-white/20 transition"
                          >
                            <Mail className="w-5 h-5 text-gold" />
                            {person.email}
                          </a>
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white hover:bg-white/20 transition"
                          >
                            <ExternalLink className="w-5 h-5 text-gold" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* JR TABER - PRESIDENT */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gold/20 border border-gold/50 rounded-full mb-4">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-gold font-bold">AFFILIATE PROGRAM PRESIDENT</span>
              </div>
            </div>

            {leadership
              .filter((p) => p.isPresident)
              .map((person, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-gradient-to-br from-[#1a1a1a] via-gold/5 to-[#111] border-2 border-gold/50 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="relative bg-gradient-to-br from-gold/20 to-transparent p-6 flex flex-col items-center justify-center">
                        <div className="absolute top-3 left-3">
                          <div className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">PRESIDENT</div>
                        </div>
                        <Image
                          src={person.image || "/placeholder.svg"}
                          alt={person.name}
                          width={120}
                          height={120}
                          className="object-contain mb-4"
                        />
                      </div>

                      <div className="md:col-span-2 p-6">
                        <h3 className="text-2xl font-bold text-white mb-1">{person.name}</h3>
                        <div className="text-gold font-medium mb-1">{person.title}</div>
                        <div className="text-white/60 text-sm mb-4">{person.secondTitle}</div>

                        <p className="text-white/70 text-sm mb-6 line-clamp-3">{person.bio}</p>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={person.affiliateLink || "#"}
                            className="flex items-center gap-2 px-5 py-2 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition text-sm"
                          >
                            <Rocket className="w-4 h-4" />
                            Join JR's Team
                          </Link>
                          <a
                            href={`mailto:${person.email}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-gold hover:bg-white/20 transition text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            {person.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* REST OF LEADERSHIP */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership
              .filter((p) => !p.isFounder && !p.isCEO && !p.isPresident)
              .map((person, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/40 transition group"
                >
                  <div className="relative h-48 bg-gold/10 flex items-center justify-center">
                    <Image
                      src={person.image || "/placeholder.svg"}
                      alt={person.name}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                    <div className="text-gold font-medium mb-3">{person.title}</div>
                    <p className="text-white/60 text-sm mb-4 line-clamp-3">{person.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`mailto:${person.email}`}
                        className="flex items-center gap-2 text-gold text-sm hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {person.email}
                      </a>
                      {person.website && (
                        <a
                          href={person.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gold text-sm hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* SaintSal AI Section */}
      <section className="py-24 bg-[#0a0a0a] border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal AI"
                width={500}
                height={500}
                className="object-contain mx-auto"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                <Brain className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Powered by SaintSal™ AI</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gold">AI-Powered</span> Real Estate Intelligence
              </h2>

              <p className="text-xl text-white/60 mb-8">
                Our proprietary SaintSal™ AI analyzes deals in seconds, underwrites loans instantly, and provides market
                intelligence 24/7. Available on iOS, Android, and web at saintsal.ai
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Deal Analysis",
                  "Auto-Underwriting",
                  "Market Research",
                  "Comp Analysis",
                  "Document Review",
                  "24/7 Support",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://saintsal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
              >
                Try SaintSal™ AI <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gold">Let's</span> Connect
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Ready to start investing, get financing, or join our team? Reach out and let's discuss how we can help
                you achieve your real estate goals.
              </p>

              <div className="space-y-6 mb-8">
                <a
                  href="tel:9499972097"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">Call Us</div>
                    <div className="text-xl font-bold text-white">(949) 997-2097</div>
                  </div>
                </a>

                <a
                  href="mailto:info@saintsal.ai"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">Email Us</div>
                    <div className="text-xl font-bold text-white">info@saintsal.ai</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50">Headquarters</div>
                    <div className="text-xl font-bold text-white">Orange County, California</div>
                  </div>
                </div>
              </div>

              {/* Affiliate Links */}
              <div className="p-6 bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-gold" />
                  <span className="text-gold font-bold">JOIN OUR AFFILIATE PROGRAM</span>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Partner with our Presidents and earn industry-leading commissions on referrals.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/affiliate/darren"
                    className="px-4 py-2 bg-[#00CED1] text-black font-bold rounded-lg hover:bg-[#00CED1]/90 transition text-sm"
                  >
                    Join Darren's Team
                  </Link>
                  <Link
                    href="/affiliate/jr"
                    className="px-4 py-2 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition text-sm"
                  >
                    Join JR's Team
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>

              {formSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-white/60">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">I'm interested in...</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:border-gold focus:outline-none transition"
                      >
                        <option value="">Select an option</option>
                        <option value="investor">Investing</option>
                        <option value="borrower">Financing/Lending</option>
                        <option value="wholesaler">Wholesale Properties</option>
                        <option value="affiliate">Affiliate Program</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition resize-none"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#050505] border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Image
                  src="/images/TRANSPARENTSAINTSALLOGO.png"
                  alt="CookinFlips"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <div>
                  <div>
                    <span className="text-2xl font-bold text-gold">Cookin'</span>
                    <span className="text-2xl font-light text-white">Flips</span>
                  </div>
                  <div className="text-[10px] text-gold/70 tracking-wider">POWERED BY SAINTSAL.AI</div>
                  <div className="text-[11px] tracking-wider font-bold">
                    <span className="text-white">Flip</span>
                    <span className="text-[#00CED1]">Effective</span>
                  </div>
                </div>
              </Link>
              <p className="text-white/60 mb-6 max-w-sm">
                The nation's premier real estate investment firm. $3B+ in distressed assets resolved. Powered by
                SaintSal™ AI technology.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://saintsal.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 transition"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-gold font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="#services" className="block text-white/60 hover:text-gold transition">
                  Services
                </Link>
                <Link href="#invest" className="block text-white/60 hover:text-gold transition">
                  Invest
                </Link>
                <Link href="#lending" className="block text-white/60 hover:text-gold transition">
                  Lending
                </Link>
                <Link href="/evaluate" className="block text-white/60 hover:text-gold transition">
                  Deal Evaluator
                </Link>
                <Link href="/portal" className="block text-white/60 hover:text-gold transition">
                  Investor Portal
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-gold font-bold mb-4">Contact</h4>
              <div className="space-y-2">
                <a href="tel:9499972097" className="block text-white/60 hover:text-gold transition">
                  (949) 997-2097
                </a>
                <a href="mailto:info@saintsal.ai" className="block text-white/60 hover:text-gold transition">
                  info@saintsal.ai
                </a>
                <p className="text-white/60">Orange County, CA</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/40 text-sm">© 2025 Saint Vision Technologies. All rights reserved.</div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span>SaintSal™ AI</span>
              <span>•</span>
              <span>US Patent #10,290,222</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
