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
  Phone,
  Mail,
  Menu,
  X,
  Brain,
  Calculator,
  Loader2,
  Send,
  MapPin,
  Users,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const loanProducts = [
  { name: "Fix & Flip", rate: "9.50%", ltv: "90% LTC" },
  { name: "DSCR", rate: "7.25%", ltv: "80% LTV" },
  { name: "Bridge", rate: "8.50%", ltv: "75% LTV" },
  { name: "Construction", rate: "7.50%", ltv: "85% LTC" },
  { name: "Commercial", rate: "6.75%", ltv: "80% LTV" },
  { name: "Cannabis", rate: "12.00%", ltv: "65% LTV" },
]

export default function CookinFlipsHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", type: "", message: "" })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_type: formData.type || "contact",
        message: formData.message,
        source: "homepage",
      })
      setFormSuccess(true)
      setFormData({ name: "", email: "", phone: "", type: "", message: "" })
      setTimeout(() => setFormSuccess(false), 5000)
    } catch (err) {
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Logo" width={36} height={36} className="object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold"><span className="text-gold">Cookin'</span><span className="text-white">Flips</span></span>
                <span className="text-[9px] text-white/40">Powered by SaintSal™ AI</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/research" className="text-white/70 hover:text-gold transition flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> SaintSal™
              </Link>
              <Link href="/analysis" className="text-white/70 hover:text-gold transition flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> Analyze
              </Link>
              <Link href="/banking" className="text-white/70 hover:text-gold transition flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Banking
              </Link>
              <Link href="/lending" className="text-white/70 hover:text-gold transition">Lending</Link>
              <Link href="#team" className="text-white/70 hover:text-gold transition">Team</Link>
              <a href="tel:9499972097" className="px-4 py-2 bg-gold text-black font-semibold rounded-lg text-sm hover:bg-gold/90 transition">
                (949) 997-2097
              </a>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#111] border-t border-white/10">
              <div className="px-4 py-4 space-y-3">
                <Link href="/research" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-gold"><Brain className="w-4 h-4" /> SaintSal™ AI</Link>
                <Link href="/analysis" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-white/80"><Calculator className="w-4 h-4" /> Deal Analyzer</Link>
                <Link href="/banking" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-white/80"><Wallet className="w-4 h-4" /> Banking</Link>
                <Link href="/lending" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white/80">Lending</Link>
                <Link href="#team" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white/80">Team</Link>
                <a href="tel:9499972097" className="block w-full py-3 bg-gold text-black font-semibold rounded-lg text-center">(949) 997-2097</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <span className="text-gold text-sm font-medium">$3B+ Assets • $1B+ Capital • 51 States</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-5xl font-bold mb-4">
                Real Estate Intelligence<br /><span className="text-gold">Powered by AI</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/60 text-lg mb-8 max-w-md">
                Analyze deals, get financing, and find opportunities — all in one platform. SaintSal™ AI makes real estate investing smarter.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
                <Link href="/research" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Ask SaintSal™
                </Link>
                <Link href="/analysis" className="px-6 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Analyze Deal
                </Link>
              </motion.div>
            </div>

            {/* Quick Stats Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-white">Platform Overview</div>
                  <div className="text-xs text-white/40">Live stats</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-gold">$3B+</div>
                  <div className="text-xs text-white/50">Assets Managed</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-gold">51</div>
                  <div className="text-xs text-white/50">States Covered</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-gold">40K+</div>
                  <div className="text-xs text-white/50">Properties Valued</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-gold">24hrs</div>
                  <div className="text-xs text-white/50">Pre-Approval</div>
                </div>
              </div>

              <Link href="/portal" className="block w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition text-center text-sm">
                Browse Investment Properties →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="py-12 px-4 border-y border-white/10 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/research" className="p-5 bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-xl hover:border-gold/40 transition group">
              <Brain className="w-8 h-8 text-gold mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-gold transition">SaintSal™ AI</h3>
              <p className="text-sm text-white/50">Ask anything about real estate, lending, or investments</p>
            </Link>
            <Link href="/analysis" className="p-5 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl hover:border-cyan-500/40 transition group">
              <Calculator className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition">Deal Analyzer</h3>
              <p className="text-sm text-white/50">Calculate MAO, ROI, and get AI deal verdicts</p>
            </Link>
            <Link href="/banking" className="p-5 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <Wallet className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition">Banking Platform</h3>
              <p className="text-sm text-white/50">Manage accounts, investments, and transactions</p>
            </Link>
            <Link href="/lending" className="p-5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl hover:border-green-500/40 transition group">
              <DollarSign className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition">Get Financing</h3>
              <p className="text-sm text-white/50">DSCR, Bridge, Fix-Flip, Commercial — all 51 states</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Lending Section */}
      <section id="lending" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Loan Products</h2>
              <p className="text-white/50 text-sm">Full-service lending across all 51 states</p>
            </div>
            <Link href="/lending" className="text-gold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {loanProducts.map((loan, i) => (
              <div key={i} className="p-4 bg-[#111] border border-white/10 rounded-lg hover:border-gold/30 transition">
                <div className="font-semibold text-white text-sm mb-2">{loan.name}</div>
                <div className="text-gold font-bold">{loan.rate}</div>
                <div className="text-xs text-white/40">{loan.ltv}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/lending" className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition">
              Explore All Products
            </Link>
            <a href="tel:9499972097" className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition flex items-center gap-2">
              <Phone className="w-4 h-4" /> (949) 997-2097
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-4 bg-[#080808] border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Leadership</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Ryan Capatosto - CEO & Founder */}
            <div className="p-6 bg-[#111] border border-gold/30 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                  <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Ryan" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <div className="px-2 py-0.5 bg-gold text-black text-xs font-bold rounded mb-1 inline-block">CEO & FOUNDER</div>
                  <h3 className="text-xl font-bold text-white">Ryan Capatosto</h3>
                  <p className="text-gold text-sm">SaintSal™ AI Creator</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-4">
                CEO & Founder of CookinFlips. Creator of SaintSal™ AI. US Patent #10,290,222. Former Goldman Sachs & JP Morgan. $1.4M+ personally invested.
              </p>
              <div className="flex gap-2">
                <a href="mailto:ryan@saintsal.ai" className="px-4 py-2 bg-gold text-black font-semibold rounded-lg text-sm hover:bg-gold/90 transition">
                  Contact
                </a>
                <a href="https://saintsal.ai" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition">
                  SaintSal.ai
                </a>
              </div>
            </div>

            {/* Darren Brown - CRO */}
            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                  <Image src="/images/DRIPLOGOSAINT_.png" alt="Darren" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <div className="px-2 py-0.5 bg-cyan-500 text-black text-xs font-bold rounded mb-1 inline-block">CRO</div>
                  <h3 className="text-xl font-bold text-white">Darren Brown</h3>
                  <p className="text-cyan-400 text-sm">Chief Relations Officer</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Chief Relations Officer & Director of Acquisitions. $3B+ in distressed assets resolved. $1B+ capital raised. Leading nationwide expansion.
              </p>
              <div className="flex gap-2">
                <Link href="/affiliate/darren" className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg text-sm hover:bg-cyan-400 transition">
                  Join Team
                </Link>
                <a href="tel:9496301858" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:bg-white/5 transition">
                  Call
                </a>
              </div>
            </div>

            {/* JR Taber */}
            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                  <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="JR" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">JR Taber</h3>
                  <p className="text-white/50 text-sm">President, Affiliate Program</p>
                  <p className="text-gold text-xs">VP Director of Lending</p>
                </div>
              </div>
              <Link href="/affiliate/jr" className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition inline-block">
                Join JR's Team
              </Link>
            </div>

            {/* Omar Gutierrez */}
            <div className="p-6 bg-[#111] border border-white/10 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                  <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Omar" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Omar Gutierrez</h3>
                  <p className="text-white/50 text-sm">Director of Operations</p>
                  <p className="text-gold text-xs">40,000+ Property Valuations</p>
                </div>
              </div>
              <a href="mailto:omar@saintsal.ai" className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition inline-block">
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-white/60 mb-6">Ready to start? Reach out and let's discuss your real estate goals.</p>

              <div className="space-y-4">
                <a href="tel:9499972097" className="flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-lg hover:border-gold/30 transition">
                  <Phone className="w-5 h-5 text-gold" />
                  <div>
                    <div className="text-xs text-white/40">Call Us</div>
                    <div className="font-semibold text-white">(949) 997-2097</div>
                  </div>
                </a>
                <a href="mailto:info@saintsal.ai" className="flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-lg hover:border-gold/30 transition">
                  <Mail className="w-5 h-5 text-gold" />
                  <div>
                    <div className="text-xs text-white/40">Email</div>
                    <div className="font-semibold text-white">info@saintsal.ai</div>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-gold" />
                  <div>
                    <div className="text-xs text-white/40">Location</div>
                    <div className="font-semibold text-white">Orange County, CA</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-semibold">Affiliate Program</span>
                </div>
                <p className="text-white/50 text-sm mb-3">Earn commissions on referrals</p>
                <div className="flex gap-2">
                  <Link href="/affiliate/darren" className="px-3 py-1.5 bg-cyan-500 text-black text-xs font-semibold rounded">Darren's Team</Link>
                  <Link href="/affiliate/jr" className="px-3 py-1.5 bg-gold text-black text-xs font-semibold rounded">JR's Team</Link>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Send a Message</h3>
              {formSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p className="font-semibold text-white">Message Sent!</p>
                  <p className="text-white/50 text-sm">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none text-sm" />
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none text-sm" />
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none text-sm">
                      <option value="">Interest</option>
                      <option value="investor">Investing</option>
                      <option value="borrower">Financing</option>
                      <option value="wholesaler">Wholesale</option>
                      <option value="affiliate">Affiliate</option>
                    </select>
                  </div>
                  <textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} placeholder="Message" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none resize-none text-sm" />
                  <button type="submit" disabled={formSubmitting} className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {formSubmitting ? "Sending..." : "Send"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#050505] border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="Logo" width={32} height={32} className="object-contain" />
            <span className="text-sm"><span className="text-gold font-semibold">Cookin'</span><span className="text-white">Flips</span></span>
          </div>
          <div className="text-white/30 text-xs">© 2025 Saint Vision Technologies • SaintSal™ AI • Patent #10,290,222</div>
        </div>
      </footer>
    </div>
  )
}
