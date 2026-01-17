import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 font-sans">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Velo API Marketplace
        </h1>
        <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          A high-performance API gateway with real-time telemetry, 
          usage-based billing, and secure key management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Shown if user is NOT logged in */}
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all transform hover:scale-105">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>

          {/* Shown if user IS logged in (like you are right now) */}
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all transform hover:scale-105">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
          
          <a 
            href="https://github.com/tejchid/velo-api-marketplace" 
            target="_blank" 
            className="border border-zinc-800 px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-900 transition-all"
          >
            View Source
          </a>
        </div>

        {/* Dashboard Preview Section */}
        <div className="mt-20 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-zinc-800 to-zinc-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl aspect-video flex items-center justify-center overflow-hidden">
             <div className="text-zinc-700 font-medium italic">
               Visualizing API Telemetry & Subscription Tiers
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}