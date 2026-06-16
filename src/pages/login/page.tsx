import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, signIn, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      if (s) navigate(s.role === "admin" ? "/admin" : s.role === "agent" ? "/agent" : "/dashboard", { replace: true });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { session, error: err } = await signIn(email, password);

    if (err || !session) {
      setError(err ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    navigate(session.role === "admin" ? "/admin" : session.role === "agent" ? "/agent" : "/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-background-200/70">
        <Link to="/" className="font-heading text-xl font-bold text-foreground-950">
          OPS<span className="text-primary-500">Connect</span>
        </Link>
        <span className="text-sm text-foreground-500">
          No account?{" "}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
            Register free
          </Link>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-primary-100 mb-4">
              <i className="ri-lock-line text-2xl text-primary-600"></i>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground-950">Sign in to OPSConnect</h1>
            <p className="text-sm text-foreground-500 mt-1">Access your partner dashboard or admin panel</p>
          </div>

          <div className="bg-background-100 rounded-2xl border border-background-200/70 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Email address</label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="you@yourbusiness.com"
                    required
                    className="w-full bg-background-50 border border-background-200/70 rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Password</label>
                <div className="relative">
                  <i className="ri-key-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="••••••••"
                    required
                    className="w-full bg-background-50 border border-background-200/70 rounded-lg pl-9 pr-10 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 transition-colors cursor-pointer"
                  >
                    <i className={`text-sm ${showPw ? "ri-eye-off-line" : "ri-eye-line"}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-primary-500 hover:text-primary-600 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <i className="ri-error-warning-line text-sm text-red-500 flex-shrink-0"></i>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-5 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
                ) : (
                  <><i className="ri-login-box-line"></i> Sign In</>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-background-200/70">
              <p className="text-xs text-foreground-400 text-center mb-3">Admin access</p>
              <div className="bg-background-200/50 rounded-lg px-4 py-3 text-center">
                <code className="text-xs text-foreground-600 font-mono">{ADMIN_EMAIL}</code>
                <span className="text-foreground-300 mx-2">·</span>
                <code className="text-xs text-foreground-600 font-mono">{ADMIN_PASSWORD}</code>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-foreground-400 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
              Register as a partner →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
