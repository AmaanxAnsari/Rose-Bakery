import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-white/50">
            Secure confirmation required.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
