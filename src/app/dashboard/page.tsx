import { headers } from "next/headers";
import { syncUser, createApiKey, getUsageData, createCheckoutSession, revokeApiKey } from "@/lib/actions";
import { seedDemoData } from "@/lib/seed";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { Zap, ShieldCheck, Activity, Key, CreditCard, Plus, Trash2, Database, Sparkles } from "lucide-react";
import SafeChart from "@/components/dashboard/SafeChart";
import Sandbox from "@/components/dashboard/Sandbox";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // ---------- DEMO MODE DETECTION ----------
  const h = headers();
  const referer = h.get("referer") || "";
  const isDemo = referer.includes("demo=true");

  // ---------- USER RESOLUTION ----------
  const dbUser = isDemo
    ? {
        id: "demo-user",
        plan: "PRO",
        email: "demo@velo.dev",
      }
    : await syncUser();

  if (!dbUser) {
    return null;
  }

  // ---------- USAGE + QUOTAS ----------
  const usageData = await getUsageData();
  const totalCalls = usageData.reduce((a, b) => a + b.count, 0);
  const isPro = dbUser.plan === "PRO";

  const quotaLimit = isPro ? 50000 : 1000;
  const usagePercentage = Math.min((totalCalls / quotaLimit) * 100, 100);

  // ---------- API KEYS ----------
  const apiKeys = isDemo
    ? [
        {
          id: "demo-key",
          name: "Demo API Key",
          key: "velo_demo_1234567890abcdef",
        },
      ]
    : await prisma.apiKey.findMany({
        where: { userId: dbUser.id, revoked: false },
        orderBy: { createdAt: "desc" },
      });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-blue-600/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
        {/* NAV */}
        <nav className="flex justify-between items-center mb-12 px-8 py-5 bg-white/70 backdrop-blur-3xl border rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">VELO</span>
          </div>

          <div className="flex items-center gap-4">
            {!isDemo && !isPro && (
              <form action={createCheckoutSession}>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-blue-600 transition">
                  <CreditCard className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              </form>
            )}

            {!isDemo && isPro && (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-2xl uppercase">
                <ShieldCheck className="w-4 h-4" />
                Enterprise Access
              </div>
            )}

            {!isDemo && <UserButton afterSignOutUrl="/" />}
          </div>
        </nav>

        {/* DEMO BANNER */}
        {isDemo && (
          <div className="mb-10 px-6 py-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
            Demo Mode — Explore API key management, usage tracking, and quotas without signing in.
          </div>
        )}

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Activity className="w-6 h-6 text-blue-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">Resource Usage</p>
            <h3 className="text-3xl font-black">{totalCalls} / {quotaLimit}</h3>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-4">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${usagePercentage}%` }} />
            </div>
          </div>

          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Key className="w-6 h-6 text-indigo-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">Active Keys</p>
            <h3 className="text-3xl font-black">{apiKeys.length}</h3>
          </div>

          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">Access Level</p>
            <h3 className="text-3xl font-black uppercase">{isDemo ? "Demo" : isPro ? "Enterprise" : "Sandbox"}</h3>
          </div>
        </div>

        {/* CHART + SANDBOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/80 p-10 rounded-[3.5rem] shadow-sm">
              <h2 className="text-2xl font-black mb-6">System Telemetry</h2>
              <SafeChart data={usageData} />
            </div>
            <Sandbox apiKeys={apiKeys} />
          </div>

          {/* API KEYS */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 p-10 rounded-[3.5rem] shadow-sm">
              <h2 className="text-xl font-black mb-6">API Keys</h2>

              {!isDemo && (
                <form action={async () => { "use server"; await createApiKey("Live Key"); }}>
                  <button className="mb-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold">
                    Generate API Key
                  </button>
                </form>
              )}

              {apiKeys.map(key => (
                <div key={key.id} className="mb-4 p-4 bg-blue-50 rounded-xl">
                  <div className="text-xs uppercase text-slate-400">{key.name}</div>
                  <code className="block font-mono text-blue-600 truncate">{key.key}</code>

                  {!isDemo && (
                    <form action={async () => { "use server"; await revokeApiKey(key.id); }}>
                      <button className="mt-2 text-xs text-red-500">Revoke</button>
                    </form>
                  )}
                </div>
              ))}

              {!isDemo && (
                <form action={seedDemoData}>
                  <button className="mt-6 w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-bold">
                    Simulate Traffic
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
