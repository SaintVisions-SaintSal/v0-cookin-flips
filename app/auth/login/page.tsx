"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      console.log("[v0] Login successful, redirecting to portal")
      router.push("/portal")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/TRANSPARENTSAINTSALLOGO.png"
            alt="SaintSal"
            width={80}
            height={80}
            className="object-contain mb-4"
          />
          <div className="text-center">
            <span className="text-2xl font-bold text-gold">Cookin'</span>
            <span className="text-2xl font-light text-white">Flips</span>
          </div>
          <div className="text-xs text-gold/70 tracking-wider">POWERED BY SAINTSAL.AI</div>
        </div>

        <Card className="bg-[#111] border-gold/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Client Portal Login</CardTitle>
            <CardDescription className="text-white/60">
              Enter your credentials to access your investor portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@saintsal.ai"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-white/20 text-white"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full bg-gold text-black hover:bg-gold/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-gold hover:underline">
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
