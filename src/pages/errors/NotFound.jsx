
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-black flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center">
        <h1 className="text-xl font-semibold text-white">404</h1>
        <p className="mt-2 text-sm text-white/60">Page not found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

