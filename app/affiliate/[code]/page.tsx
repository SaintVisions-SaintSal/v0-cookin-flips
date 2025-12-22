import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Phone,
  Mail,
  ExternalLink,
  Crown,
  Award,
  Rocket,
  Users,
  DollarSign,
  Building2,
  CheckCircle2,
  Star,
} from "lucide-react"
import { AffiliateContactForm } from "./affiliate-contact-form"

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = await createClient()

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("affiliate_code", code)
    .eq("is_active", true)
    .single()

  if (!affiliate) {
    return { title: "Affiliate Not Found | SaintSal.ai" }
  }

  return {
    title: `${affiliate.name} | SaintSal™ Affiliate Program`,
    description: affiliate.bio?.substring(0, 160),
  }
}

export default async function AffiliatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = await createClient()

  // Fetch affiliate data
  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("affiliate_code", code)
    .eq("is_active", true)
    .single()

  if (error || !affiliate) {
    notFound()
  }

  const isDarren = code === "darren"
  const primaryColor = isDarren ? "#00CED1" : "#D4AF37"
  const colorClass = isDarren ? "text-[#00CED1]" : "text-gold"
  const bgColorClass = isDarren ? "bg-[#00CED1]" : "bg-gold"
  const borderColorClass = isDarren ? "border-[#00CED1]" : "border-gold"

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/images/TRANSPARENTSAINTSALLOGO.png" alt="SaintSal" fill className="object-contain" />
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

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-white/80 hover:text-gold transition">
                Home
              </Link>
              <Link href="/#services" className="text-white/80 hover:text-gold transition">
                Services
              </Link>
              <Link href="/#lending" className="text-white/80 hover:text-gold transition">
                Lending
              </Link>
              <Link
                href="/portal"
                className={`px-6 py-2.5 ${bgColorClass} text-black font-semibold rounded-lg hover:opacity-90 transition`}
              >
                Investor Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(ellipse at center, ${primaryColor} 0%, transparent 70%)` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Affiliate Info */}
            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 ${isDarren ? "bg-[#00CED1]/20 border-[#00CED1]/50" : "bg-gold/20 border-gold/50"} border rounded-full mb-6`}
              >
                {affiliate.role === "president" ? (
                  <Crown className={`w-5 h-5 ${colorClass}`} />
                ) : (
                  <Award className={`w-5 h-5 ${colorClass}`} />
                )}
                <span className={`${colorClass} font-bold uppercase tracking-wider text-sm`}>
                  {affiliate.role === "president" ? "President" : "Affiliate Partner"}
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-4">{affiliate.name}</h1>

              <p className={`text-xl ${colorClass} font-semibold mb-6`}>{affiliate.title}</p>

              <p className="text-lg text-white/70 mb-8 leading-relaxed">{affiliate.bio}</p>

              {/* Stats */}
              {isDarren && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className={`bg-black/30 rounded-xl p-4 border ${borderColorClass}/30`}>
                    <div className={`text-3xl font-bold ${colorClass}`}>$3B+</div>
                    <div className="text-white/60 text-sm">Assets Resolved</div>
                  </div>
                  <div className={`bg-black/30 rounded-xl p-4 border ${borderColorClass}/30`}>
                    <div className={`text-3xl font-bold ${colorClass}`}>$1B+</div>
                    <div className="text-white/60 text-sm">Capital Raised</div>
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-4">
                {affiliate.phone && (
                  <a
                    href={`tel:${affiliate.phone.replace(/[^0-9]/g, "")}`}
                    className={`flex items-center gap-2 px-6 py-3 ${bgColorClass} text-black font-bold rounded-lg hover:opacity-90 transition`}
                  >
                    <Phone className="w-5 h-5" />
                    {affiliate.phone}
                  </a>
                )}
                <a
                  href={`mailto:${affiliate.email}`}
                  className={`flex items-center gap-2 px-6 py-3 bg-white/10 border ${borderColorClass}/30 rounded-lg text-white hover:bg-white/20 transition`}
                >
                  <Mail className={`w-5 h-5 ${colorClass}`} />
                  {affiliate.email}
                </a>
                {affiliate.linkedin_url && (
                  <a
                    href={affiliate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-3 bg-white/10 border ${borderColorClass}/30 rounded-lg text-white hover:bg-white/20 transition`}
                  >
                    <ExternalLink className={`w-5 h-5 ${colorClass}`} />
                  </a>
                )}
              </div>
            </div>

            {/* Right - Image/Logo */}
            <div className="relative">
              <div
                className={`bg-gradient-to-br from-black via-[${primaryColor}]/10 to-black border-2 ${borderColorClass} rounded-3xl p-12 shadow-[0_0_60px_rgba(${isDarren ? "0,206,209" : "212,175,55"},0.2)]`}
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={affiliate.image_url || "/images/TRANSPARENTSAINTSALLOGO.png"}
                    alt={affiliate.name}
                    width={250}
                    height={250}
                    className="object-contain mb-8"
                  />
                  {isDarren && (
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">
                        <span className="text-white">Flip</span>
                        <span className="text-[#00CED1]">Effective</span>
                      </div>
                      <div className="text-white/60">Leading the Future of Real Estate</div>
                    </div>
                  )}
                  {!isDarren && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gold mb-2">SaintSal™</div>
                      <div className="text-white/60">Affiliate Program</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Join <span className={colorClass}>{affiliate.name.split(" ")[0]}'s Team</span>?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Partner with a proven leader and access exclusive resources, training, and commissions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Industry-Leading Commissions",
                description: "Earn competitive commissions on every qualified referral. Get paid when deals close.",
              },
              {
                icon: Users,
                title: "Build Your Team",
                description:
                  "Recruit your own affiliates and earn override commissions. Create passive income streams.",
              },
              {
                icon: Building2,
                title: "Exclusive Deal Access",
                description:
                  "Get first access to wholesale properties, investment opportunities, and lending products.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-[#1a1a1a] to-[#111] border ${borderColorClass}/20 rounded-2xl p-8 hover:${borderColorClass}/40 transition`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${isDarren ? "bg-[#00CED1]/10" : "bg-gold/10"} flex items-center justify-center mb-6`}
                >
                  <benefit.icon className={`w-7 h-7 ${colorClass}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-white/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">
                What You <span className={colorClass}>Get</span>
              </h2>

              <div className="space-y-4">
                {[
                  "Personal affiliate link and tracking dashboard",
                  "Marketing materials and templates",
                  "Direct access to leadership team",
                  "Weekly training calls and updates",
                  "Priority support for your referrals",
                  "Access to SaintSal™ AI tools",
                  "Exclusive market insights and data",
                  "Networking with top producers",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${colorClass} flex-shrink-0`} />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#111] border ${borderColorClass}/30 rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <Rocket className={`w-6 h-6 ${colorClass}`} />
                <h3 className="text-2xl font-bold">Join {affiliate.name.split(" ")[0]}'s Team</h3>
              </div>

              <AffiliateContactForm
                affiliateCode={affiliate.affiliate_code}
                affiliateName={affiliate.name}
                primaryColor={primaryColor}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-16 ${isDarren ? "bg-gradient-to-r from-[#00CED1]/20 via-[#00CED1]/10 to-[#00CED1]/20" : "bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20"} border-y ${borderColorClass}/30`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className={`w-6 h-6 ${colorClass}`} />
            <span className={`${colorClass} font-bold`}>SAINTSAL™ TRADEMARKED AFFILIATE PROGRAM</span>
            <Star className={`w-6 h-6 ${colorClass}`} />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Contact {affiliate.name} today to learn more about the affiliate program and how you can start building your
            real estate empire.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {affiliate.phone && (
              <a
                href={`tel:${affiliate.phone.replace(/[^0-9]/g, "")}`}
                className={`px-8 py-4 ${bgColorClass} text-black font-bold rounded-lg hover:opacity-90 transition flex items-center gap-2`}
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            )}
            <a
              href={`mailto:${affiliate.email}`}
              className={`px-8 py-4 border-2 ${borderColorClass} ${colorClass} font-bold rounded-lg hover:bg-white/5 transition flex items-center gap-2`}
            >
              <Mail className="w-5 h-5" />
              Email {affiliate.name.split(" ")[0]}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0a0a0a] border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <div className="text-lg font-bold">
                  <span className="text-gold">Cookin'</span>
                  <span className="text-white">Flips</span>
                </div>
                <div className="text-xs text-gold/70">POWERED BY SAINTSAL.AI</div>
                <div className="text-xs font-bold">
                  <span className="text-white">Flip</span>
                  <span className="text-[#00CED1]">Effective</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/" className="hover:text-gold transition">
                Home
              </Link>
              <Link href="/portal" className="hover:text-gold transition">
                Investor Portal
              </Link>
              <Link href="/#contact" className="hover:text-gold transition">
                Contact
              </Link>
              <a
                href="https://saintsal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition"
              >
                SaintSal.ai
              </a>
            </div>

            <div className="text-sm text-white/40">© 2025 SaintSal™ AI. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
