import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession } from "@/utils/auth";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Guide", href: "/guide" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession_] = useState<ReturnType<typeof getSession> extends Promise<infer T> ? T : never>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getSession().then(setSession_);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await clearSession();
    setSession_(null);
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const isAdmin = session?.role === "admin";
  const isPartner = session?.role === "partner";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-50/95 backdrop-blur-md border-b border-background-200/70"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground-950">
            Omni<span className="text-primary-500">Connect</span>
          </span>
        </Link>

        {/* Desktop nav links — only for public visitors */}
        {!session && (
          <div className="hidden md:flex items-center gap-8">
            {PUBLIC_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Partner links */}
        {isPartner && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors">
              Dashboard
            </Link>
            <Link to="/partner-profile" className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors">
              Profile
            </Link>
          </div>
        )}

        {/* Admin links */}
        {isAdmin && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/admin" className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors">
              Admin Panel
            </Link>
          </div>
        )}

        {/* Desktop action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!session ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 transition-colors whitespace-nowrap cursor-pointer px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer px-5 py-2.5 rounded-md"
              >
                Get Started Free
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-600">
                    {session.partnerName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-foreground-600 max-w-[120px] truncate">
                  {session.partnerName}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs font-medium text-foreground-500 hover:text-foreground-800 transition-colors px-3 py-2 cursor-pointer"
              >
                <i className="ri-logout-box-line mr-1"></i>Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer text-foreground-950"
        >
          <i className={`ri-${mobileOpen ? "close" : "menu"}-line text-2xl`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background-50 border-t border-background-200/70">
          <div className="flex flex-col px-4 py-4 gap-2">
            {!session && PUBLIC_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-foreground-700 hover:text-foreground-950 py-2 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}

            {isPartner && (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground-700 hover:text-foreground-950 py-2">Dashboard</Link>
                <Link to="/partner-profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground-700 hover:text-foreground-950 py-2">Profile</Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground-700 hover:text-foreground-950 py-2">Admin Panel</Link>
            )}

            <div className="border-t border-background-200/70 pt-3 mt-1 flex flex-col gap-2">
              {!session ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-foreground-700 hover:text-foreground-950 py-2 transition-colors cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors px-5 py-2.5 rounded-md text-center"
                  >
                    Get Started Free
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-foreground-700 py-2 text-left flex items-center gap-2 cursor-pointer"
                >
                  <i className="ri-logout-box-line"></i> Sign out ({session.partnerName})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
