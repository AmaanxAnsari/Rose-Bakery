import React from 'react'

export default function Input({ label, className = "", error, ...props }) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block text-xs font-medium text-white/70">
          {label}
        </label>
      ) : null}

      <input
        className={`w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30 ${className}`}
        {...props}
      />

      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
