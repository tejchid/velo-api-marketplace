import { Zap, Terminal, Shield, ArrowLeft, Code2, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Zap className="text-blue-600 w-6 h-6 fill-blue-600" />
          <span className="text-2xl font-black tracking-tighter">VELO <span className="text-blue-600">DOCS</span></span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Integrating the Velo Gateway</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Follow this guide to authenticate your requests and manage your infrastructure load using Velo credentials.
          </p>
        </header>

        <section className="space-y-12">
          {/* Authentication Section */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-10 rounded-[3rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Authentication</h2>
            </div>
            <p className="text-slate-600 mb-6">All requests must include your API Key in the <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-bold">x-api-key</code> header.</p>
            <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden">
               <pre className="text-emerald-400 font-mono text-sm overflow-x-auto">
{`curl -X GET https://velo-api.vercel.app/api/v1/resource \\
  -H "x-api-key: your_velo_live_key_here"`}
               </pre>
            </div>
          </div>

          {/* Rate Limits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/40 border border-white/80 p-8 rounded-[2.5rem] shadow-sm">
              <Shield className="w-6 h-6 text-amber-500 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-slate-800">Free Sandbox</h3>
              <p className="text-slate-500 text-sm font-medium">Limited to 1,000 requests per month. Ideal for local testing and MVP development.</p>
            </div>
            <div className="bg-white/40 border border-white/80 p-8 rounded-[2.5rem] shadow-sm border-emerald-100">
              <Zap className="w-6 h-6 text-emerald-500 mb-4 fill-emerald-500" />
              <h3 className="font-bold text-lg mb-2 text-slate-800">Pro Gateway</h3>
              <p className="text-slate-500 text-sm font-medium">Up to 50,000 requests per month with priority throughput and global edge caching.</p>
            </div>
          </div>

          {/* Response Codes */}
          <div className="bg-white/40 border border-white/80 p-10 rounded-[3rem] shadow-sm">
            <h2 className="text-2xl font-bold mb-8">HTTP Response Codes</h2>
            <div className="space-y-4">
              {[
                { code: "200", status: "OK", desc: "Request was successful and data is returned." },
                { code: "401", status: "Unauthorized", desc: "API Key is missing or incorrectly formatted." },
                { code: "403", status: "Forbidden", desc: "API Key has been revoked or is invalid." },
                { code: "429", status: "Too Many Requests", desc: "Monthly quota reached. Upgrade to Pro required." }
              ].map((res) => (
                <div key={res.code} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-black text-blue-600 w-12">{res.code}</span>
                    <span className="font-bold text-slate-800 text-sm">{res.status}</span>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">{res.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}