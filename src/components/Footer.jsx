export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Rose Bakery • Built by{" "}
          <a
            href="https://amaanxansari.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:underline"
          >
            Amaan Ansari
          </a>
        </p>
      </div>
    </footer>
  );
}
