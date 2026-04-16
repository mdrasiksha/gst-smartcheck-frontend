import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Pricing", to: "/pricing" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Login", to: "/login" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          Online InvoiceConverter
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition ${isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
