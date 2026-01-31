
export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-white/70 text-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <span>{label}</span>
    </div>
  );
}
