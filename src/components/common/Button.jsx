import React from 'react'

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "bg-white text-black hover:bg-white/90",
    ghost: "bg-transparent text-white hover:bg-white/10 border border-white/15",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
