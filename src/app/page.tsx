import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 text-slate-900 px-6 overflow-hidden">
      {/* Enhanced Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-200/60 to-cyan-200/40 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-200/50 to-pink-200/30 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-gradient-to-r from-indigo-200/30 to-blue-200/30 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Enterprise Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-100 bg-white shadow-sm text-sm font-semibold text-blue-600 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          Enterprise API Infrastructure
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
          VELO <span className="text-blue-600">API Marketplace</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The high-performance API gateway for modern developers. 
          Manage keys, track telemetry, and automate billing in one unified dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <button className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
          
          <a 
            href="https://github.com/tejchid/velo-api-marketplace" 
            target="_blank" 
            className="h-14 px-10 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
          >
            GitHub
          </a>
        </div>

        {/* Dashboard Preview - Styled to match image_9cafc1.jpg */}
        <div className="mt-20 relative rounded-[32px] border border-white bg-white/40 p-4 backdrop-blur-md shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
          <div className="relative bg-white rounded-[24px] aspect-video flex flex-col items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
             {/* Nav Header Mockup */}
             <div className="absolute top-0 w-full h-12 border-b border-slate-50 flex items-center px-6 justify-between">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                </div>
                <div className="w-24 h-4 bg-slate-50 rounded-full" />
             </div>

             <div className="text-blue-500 font-bold text-sm tracking-widest uppercase opacity-40">
                System Telemetry Live
             </div>
             
             {/* Chart Mockup Line */}
             <div className="mt-6 relative w-64 h-24">
                <svg viewBox="0 0 100 40" className="w-full h-full stroke-blue-500 fill-none stroke-[3] opacity-30">
                  <path d="M0,35 Q20,35 40,15 T80,25 T100,5" strokeLinecap="round" />
                </svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}