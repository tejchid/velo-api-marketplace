export default function UsageChart({ data }: { data: { date: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mt-6">
      <h2 className="text-xl font-bold mb-6 text-slate-200">API Usage (Last 7 Days)</h2>
      <div className="flex items-end gap-2 h-48">
        {data.length === 0 ? (
          <p className="text-slate-500 w-full text-center pb-20 italic">No usage data recorded yet.</p>
        ) : (
          data.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-blue-500/20 border-t-2 border-blue-500 rounded-t-sm transition-all group-hover:bg-blue-500/40" 
                style={{ height: `${(day.count / maxCount) * 100}%` }}
              />
              <span className="text-[10px] text-slate-500 font-mono rotate-45 mt-2">{day.date.split('-').slice(1).join('/')}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}