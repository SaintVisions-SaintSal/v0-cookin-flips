import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Users, MessageSquare, Building2, TrendingUp, LogOut } from "lucide-react"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch stats
  const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true })

  const { count: contactsCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: affiliatesCount } = await supabase
    .from("affiliates")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  // Fetch recent leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch recent contacts
  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  const stats = [
    { label: "Total Leads", value: leadsCount || 0, icon: Users, color: "text-gold" },
    { label: "Unread Messages", value: contactsCount || 0, icon: MessageSquare, color: "text-[#00CED1]" },
    { label: "Active Properties", value: propertiesCount || 0, icon: Building2, color: "text-green-400" },
    { label: "Active Affiliates", value: affiliatesCount || 0, icon: TrendingUp, color: "text-purple-400" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="bg-[#111] border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Image
                src="/images/TRANSPARENTSAINTSALLOGO.png"
                alt="SaintSal"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <span className="text-xl font-bold text-gold">Admin</span>
                <span className="text-xl font-light text-white">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gold mb-6">Recent Leads</h2>
            <div className="space-y-4">
              {recentLeads && recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{lead.name}</div>
                      <div className="text-sm text-white/60">{lead.email}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">{lead.lead_type}</span>
                      <div className="text-xs text-white/40 mt-1">{new Date(lead.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  No leads yet. Run the database scripts to get started.
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gold/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#00CED1] mb-6">Recent Messages</h2>
            <div className="space-y-4">
              {recentContacts && recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{contact.name}</div>
                      <div className="text-sm text-white/60 line-clamp-1">{contact.message}</div>
                    </div>
                    <div className="text-right">
                      {!contact.is_read && (
                        <span className="px-2 py-1 bg-[#00CED1]/20 text-[#00CED1] text-xs rounded-full">New</span>
                      )}
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  No messages yet. Run the database scripts to get started.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gold/10 to-[#00CED1]/10 border border-gold/30 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
            >
              View Website
            </Link>
            <Link
              href="/portal"
              className="px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-gold hover:bg-white/20 transition"
            >
              Investor Portal
            </Link>
            <Link
              href="/banking"
              className="px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-white/20 transition"
            >
              Banking Platform
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
