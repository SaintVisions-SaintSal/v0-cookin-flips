import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function AffiliateNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center px-4">
        <Image
          src="/images/TRANSPARENTSAINTSALLOGO.png"
          alt="SaintSal"
          width={120}
          height={120}
          className="object-contain mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">Affiliate Not Found</h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          The affiliate link you're looking for doesn't exist or may have been deactivated. Please check the URL or
          contact us for assistance.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold/90 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
