"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Send, CheckCircle2, Loader2 } from "lucide-react"

interface AffiliateContactFormProps {
  affiliateCode: string
  affiliateName: string
  primaryColor: string
}

export function AffiliateContactForm({ affiliateCode, affiliateName, primaryColor }: AffiliateContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Insert lead with affiliate tracking
      const { error: leadError } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_type: "affiliate_signup",
        message: formData.message,
        affiliate_code: affiliateCode,
        source: `affiliate_page_${affiliateCode}`,
      })

      if (leadError) throw leadError

      // Also insert into contact_submissions for visibility
      const { error: contactError } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Affiliate Signup - Referred by ${affiliateName}`,
        message: formData.message || `Interested in joining ${affiliateName}'s affiliate team`,
        source_page: `/affiliate/${affiliateCode}`,
        affiliate_code: affiliateCode,
      })

      if (contactError) throw contactError

      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (err) {
      console.error("Form submission error:", err)
      setError("Something went wrong. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
        <h4 className="text-2xl font-bold text-white mb-2">Application Received!</h4>
        <p className="text-white/60">
          {affiliateName.split(" ")[0]} will be in touch with you shortly to discuss the affiliate program.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="block text-sm font-medium text-white/80 mb-2">Email Address *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Phone Number *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Tell us about yourself</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition resize-none"
          placeholder="Your real estate experience, why you want to join, etc."
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 text-black font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Application
          </>
        )}
      </button>

      <p className="text-xs text-white/40 text-center">
        By submitting, you agree to be contacted about the SaintSal™ Affiliate Program.
      </p>
    </form>
  )
}
