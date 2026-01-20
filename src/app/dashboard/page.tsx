import {
  syncUser,
  createApiKey,
  getUsageData,
  createCheckoutSession,
  revokeApiKey,
} from "@/lib/actions";
import { seedDemoData } from "@/lib/seed";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import {
  Zap,
  ShieldCheck,
  Activity,
  Key,
  CreditCard,
  Plus,
  Trash2,
  Database,
  Sparkles,
} from "lucide-react";
import SafeChart from "@/components/dashboard/SafeChart";
import Sandbox from "@/components/dashboard/Sandbox";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { demo?: string };
}) {
  const isDemo = searchParams?.demo === "true";

  const dbUser = await syncUser();
  const usageData = await getUsageData();
  const totalCalls = usageData.reduce((a, b) => a + b.count, 0);
  const isPro = dbUser?.plan === "PRO";

  const quotaLimit = isPro ? 50000 : 1000;
  const usagePercentage = Math.min((totalCalls / quotaLimit) * 100, 100);

  const apiKeys = isDemo
    ? [
        {
          id: "demo-key",
          name: "Demo Key",
          key: "demo_1234567890",
          revoked: false,
        },
      ]
    : await prisma.apiKey.findMany({
        where: { userId: dbUser?.id, revoked: false },
        orderBy: { createdAt: "desc" },
      });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 pb-20 relative overflow-hidden">
      {/* DEMO MODE BANNER */}
      {isDemo && (
        <div className="relative z-20 mx-auto mt-6 max-w-7xl px-8">
          <div className="rounded-2xl bg-yellow-100 px-6 py-3 text-sm font-black text-yellow-900">
            Demo Mode — no sign-in required. Data is simulated.
          </div>
        </div>
      )}

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
            <span className="text-2xl font-black tracking-tighter uppercase">
              VELO
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isPro && !isDemo ? (
              <form action={createCheckoutSession}>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:scale-105 hover:bg-blue-600 transition-all active:scale-95 shadow-lg cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-2xl uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                {isDemo ? "Sandbox Demo" : "Enterprise Access"}
              </div>
            )}
            <div className="h-8 w-[1px] bg-slate-200/50 mx-2" />
            {!isDemo && <UserButton afterSignOutUrl="/" />}
          </div>
        </nav>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              Resource Quota
            </p>
            <h3 className="text-3xl font-black text-slate-800">
              {totalCalls.toLocaleString()} /{" "}
              {quotaLimit.toLocaleString()}
            </h3>
          </div>

          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              Active Credentials
            </p>
            <h3 className="text-3xl font-black text-slate-800">
              {apiKeys.length} Keys
            </h3>
          </div>

          <div className="group bg-white/80 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              Access Level
            </p>
            <h3 className="text-3xl font-black text-slate-800 uppercase">
              {isDemo ? "Sandbox" : isPro ? "Enterprise" : "Free"}
            </h3>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[3.5rem] shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-10">
                System Telemetry
              </h2>
              <div className="h-[340px] w-full">
                <SafeChart data={usageData} />
              </div>
            </div>

            <Sandbox apiKeys={apiKeys as any} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[3.5rem] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800">
                  API Keys
                </h2>
                {!isDemo && (
                  <form
                    action={async () => {
                      "use server";
                      await createApiKey("Live Key");
                    }}
                  >
                    <button className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600">
                      <Plus className="w-6 h-6" />
                    </button>
                  </form>
                )}
              </div>

              {isDemo && (
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-2xl"
                  disabled
                >
                  <Database className="w-4 h-4" />
                  Simulate Traffic
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
