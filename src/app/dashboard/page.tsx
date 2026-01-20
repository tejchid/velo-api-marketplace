import {
  Zap,
  Activity,
  Key,
  Sparkles,
} from "lucide-react";
import SafeChart from "@/components/dashboard/SafeChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // PURE DEMO DATA — NO AUTH ANYWHERE
  const usageData = [
    { date: "Mon", count: 120 },
    { date: "Tue", count: 240 },
    { date: "Wed", count: 180 },
    { date: "Thu", count: 310 },
    { date: "Fri", count: 260 },
    { date: "Sat", count: 400 },
    { date: "Sun", count: 350 },
  ];

  const apiKeys = [
    {
      id: "demo-key",
      name: "Demo API Key",
      key: "velo_demo_1234567890abcdef",
    },
  ];

  const totalCalls = usageData.reduce((a, b) => a + b.count, 0);
  const quotaLimit = 50000;
  const usagePercentage = Math.min((totalCalls / quotaLimit) * 100, 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-blue-600/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
        {/* NAV */}
        <nav className="flex items-center gap-3 mb-12 px-8 py-5 bg-white/70 backdrop-blur-3xl border rounded-[2.5rem] shadow-xl">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            VELO — Demo
          </span>
        </nav>

        {/* DEMO BANNER */}
        <div className="mb-10 px-6 py-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
          Demo Mode — No authentication · Simulated production data
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Activity className="w-6 h-6 text-blue-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">
              Resource Usage
            </p>
            <h3 className="text-3xl font-black">
              {totalCalls} / {quotaLimit}
            </h3>
            <div className="w-full h-2 bg-slate-200 rounded-full mt-4">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Key className="w-6 h-6 text-indigo-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">
              Active Keys
            </p>
            <h3 className="text-3xl font-black">{apiKeys.length}</h3>
          </div>

          <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-600 mb-4" />
            <p className="text-xs uppercase text-slate-400 mb-1">
              Access Level
            </p>
            <h3 className="text-3xl font-black uppercase">
              Demo
            </h3>
          </div>
        </div>

        {/* TELEMETRY */}
        <div className="bg-white/80 p-10 rounded-[3.5rem] shadow-sm">
          <h2 className="text-2xl font-black mb-6">
            System Telemetry
          </h2>
          <SafeChart data={usageData} />
        </div>

        {/* API KEY DISPLAY */}
        <div className="mt-10 bg-white/80 p-10 rounded-[3.5rem] shadow-sm">
          <h2 className="text-xl font-black mb-6">
            API Keys
          </h2>

          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 bg-blue-50 rounded-xl">
              <div className="text-xs uppercase text-slate-400">
                {key.name}
              </div>
              <code className="block font-mono text-blue-600 truncate">
                {key.key}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
