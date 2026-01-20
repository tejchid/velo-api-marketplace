import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="max-w-2xl w-full bg-white/80 border border-slate-200 rounded-3xl p-10 shadow-lg">
        <h1 className="text-3xl font-black mb-4">
          VELO — API Access & Usage Demo
        </h1>

        <p className="text-slate-600 mb-8">
          This interactive demo showcases how API-driven platforms manage access,
          track usage, and enforce quotas in production systems.
        </p>

        <h2 className="text-sm font-bold uppercase text-slate-500 mb-3">
          What this demo shows
        </h2>
        <ul className="space-y-2 text-sm text-slate-700 mb-8">
          <li>• API key generation and lifecycle management</li>
          <li>• Server-side usage aggregation and telemetry</li>
          <li>• Plan-based quota enforcement</li>
          <li>• Billing-ready usage metrics</li>
        </ul>

        <h2 className="text-sm font-bold uppercase text-slate-500 mb-3">
          Why it matters
        </h2>
        <p className="text-slate-700 text-sm mb-10">
          These mechanisms are foundational for API-first SaaS products,
          platform engineering teams, and abuse prevention at scale.
        </p>

        <Link
          href="/api/demo"
          className="block w-full text-center bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600"
        >
          Enter Live Demo
        </Link>

        <p className="text-xs text-slate-400 text-center mt-4">
          No sign-in required · Demo mode enabled
        </p>
      </div>
    </main>
  );
}
