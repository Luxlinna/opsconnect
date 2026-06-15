import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "@/utils/auth";
import { supabase } from "@/utils/supabase/client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when user arrives via reset email link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Also check if already in a recovery session (page refresh case)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError(null);

    const { error: err } = await resetPassword(password);

    setLoading(false);
    if (err) { setError(err); return; }
    setDone(true);
    setTimeout(() => navigate("/login", { replace: true }), 3000);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-accent-100 mb-5">
            <i className="ri-shield-check-line text-3xl text-accent-600"></i>
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground-950 mb-2">Password updated!</h1>
          <p className="text-sm text-foreground-500">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="w-6 h-6 border-2 border-primary-400 border-t-primary-600 rounded-full animate-spin inline-block mb-3" />
          <p className="text-sm text-foreground-500">Verifying reset link…</p>
          <p className="text-xs text-foreground-400 mt-2">
            If nothing happens, your link may have expired.{" "}
            <Link to="/forgot-password" className="text-primary-500 hover:underline">Request a new one</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <div className="flex items-center px-6 py-4 border-b border-background-200/70">
        <Link to="/" className="font-heading text-xl font-bold text-foreground-950">
          OPS<span className="text-primary-500">Connect</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-primary-100 mb-4">
              <i className="ri-lock-password-line text-2xl text-primary-600"></i>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground-950">Set new password</h1>
            <p className="text-sm text-foreground-500 mt-1">Choose a strong password for your account.</p>
          </div>

          <div className="bg-background-100 rounded-2xl border border-background-200/70 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full bg-background-50 border border-background-200/70 rounded-lg pl-4 pr-10 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer">
                    <i className={`text-sm ${showPw ? "ri-eye-off-line" : "ri-eye-line"}`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Confirm new password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                  placeholder="Repeat your password"
                  required
                  className="w-full bg-background-50 border border-background-200/70 rounded-lg px-4 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 placeholder:text-foreground-300 transition-colors"
                />
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
                className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 disabled:opacity-50 transition-colors px-5 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</>
                ) : (
                  <><i className="ri-shield-check-line"></i> Update Password</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
