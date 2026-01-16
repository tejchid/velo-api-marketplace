import { syncUser, createApiKey, getUsageData, createCheckoutSession, revokeApiKey } from "@/lib/actions";
import { seedDemoData } from "@/lib/seed";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { Zap, ShieldCheck, Activity, Key, CreditCard, Plus, Trash2, Database, Sparkles } from "lucide-react";
import SafeChart from "@/components/dashboard/SafeChart";
import Sandbox from "@/components/dashboard/Sandbox";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const dbUser = await syncUser();
  const usageData = await getUsageData();
  const totalCalls = usageData.reduce((a, b) => a + b.count, 0);
  const isPro = dbUser?.plan === 'PRO';
  
  const quotaLimit = isPro ? 50000 : 1000;
  const usagePercentage = Math.min((totalCalls / quotaLimit) * 100, 100);

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: dbUser?.id, revoked: false },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-blue-600/25 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
        <nav className="flex justify-between items-center mb-12 px-8 py-5 bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">VELO</span>
          </div>
          
          <div className="flex items-center gap-4">
            {!isPro ? (
              <form action={createCheckoutSession}>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:scale-105 hover:bg-blue-600 transition-all active:scale-95 shadow-lg cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-2xl uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Enterprise Access
              </div>
            )}
            <div className="h-8 w-[1px] bg-slate-200/50 mx-2" />
            <UserButton afterSignOutUrl="/" />
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="flex justify-between items-start mb-6 text-blue-600">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${usagePercentage > 90 ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                {usagePercentage.toFixed(1)}% Usage
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Resource Quota</p>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">{totalCalls.toLocaleString()} <span className="text-slate-300 text-lg font-medium">/ {quotaLimit.toLocaleString()}</span></h3>
            <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${usagePercentage}%` }} />
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Key className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Active Credentials</p>
            <h3 className="text-3xl font-black text-slate-800">{apiKeys.length} <span className="text-slate-300 text-lg font-medium">Keys</span></h3>
          </div>

          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Access Level</p>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isPro ? "Enterprise" : "Sandbox"}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[3.5rem] shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-10 tracking-tight">System Telemetry</h2>
              <div className="h-[340px] w-full">
                <SafeChart data={usageData} />
              </div>
            </div>
            <Sandbox apiKeys={apiKeys} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[3.5rem] shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-black">API Keys</h2>
                <form action={async () => { "use server"; await createApiKey("Live Key"); }}>
                  <button className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer group shadow-xl">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                  </button>
                </form>
              </div>
              
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-6 bg-white/60 border border-white/80 rounded-3xl hover:border-blue-400/50 hover:bg-white transition-all group shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key.name}</span>
                      <form action={async () => { "use server"; await revokeApiKey(key.id); }}>
                         <button className="p-2 text-slate-300 hover:text-red-500 transition-all hover:scale-125 cursor-pointer">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </form>
                    </div>
                    <code className="text-sm font-mono text-blue-600 block truncate font-bold bg-blue-50/50 p-3 rounded-xl border border-blue-100">{key.key}</code>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <form action={seedDemoData}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-blue-500/20 active:scale-95">
                    <Database className="w-4 h-4" />
                    Simulate Traffic
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}