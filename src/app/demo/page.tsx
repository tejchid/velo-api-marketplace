import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">VELO — API Access & Usage Demo</h1>
        <p className="text-slate-600">
          Explore API key generation, request execution, usage tracking,
          and quotas. No sign-in required.
        </p>
        <Link
          href="/dashboard?demo=true"
          className="inline-block rounded bg-black px-6 py-3 text-white"
        >
          Start Live Demo
        </Link>
      </div>
    </main>
  );
}
