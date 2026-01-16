"use client";

import { useState } from "react";
import { Terminal, Play, CheckCircle2, XCircle } from "lucide-react";

export default function Sandbox({ apiKeys }: { apiKeys: any[] }) {
  const [selectedKey, setSelectedKey] = useState(apiKeys[0]?.key || "");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/resource", {
        headers: { "x-api-key": selectedKey },
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err) {
      setResponse({ status: 500, data: { error: "Failed to connect" } });
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold tracking-tight">Request Lab</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Select Credential</label>
          <select 
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-mono text-blue-400 outline-none focus:border-blue-500 transition-all"
          >
            {apiKeys.map(k => <option key={k.id} value={k.key}>{k.name}</option>)}
          </select>
        </div>

        <button 
          onClick={testApi}
          disabled={loading || !selectedKey}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {loading ? "Processing..." : <><Play className="w-4 h-4 fill-current" /> Execute Request</>}
        </button>

        {response && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 mb-2">
                {response.status === 200 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Console</span>
             </div>
             <pre className="bg-black/50 p-4 rounded-2xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
               {JSON.stringify(response.data, null, 2)}
             </pre>
          </div>
        )}
      </div>
    </div>
  );
}