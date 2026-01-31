
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Rose Bakery • Built with React + Firebase
        </p>
      </div>
    </footer>
  );
}
