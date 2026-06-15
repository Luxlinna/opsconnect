import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/utils/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error: err } = await forgotPassword(email);

    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-background-200/70">
        <Link to="/" className="font-heading text-xl font-bold text-foreground-950">
          OPS<span className="text-primary-500">Connect</span>
        </Link>
        <Link to="/login" className="text-sm text-foreground-500 hover:text-foreground-800 transition-colors">
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-accent-100 mb-5">
                <i className="ri-mail-send-line text-3xl text-accent-600"></i>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground-950 mb-2">Email sent!</h1>
              <p className="text-sm text-foreground-500 mb-1">We sent a password reset link to</p>
              <p className="text-sm font-semibold text-foreground-800 mb-5">{email}</p>
              <p className="text-xs text-foreground-400 leading-relaxed">
                Click the link in the email to set a new password.
                <br />Didn't receive it? Check your spam folder.
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-primary-100 mb-4">
                  <i className="ri-lock-password-line text-2xl text-primary-600"></i>
                </div>
                <h1 className="font-heading text-2xl font-bold text-foreground-950">Forgot your password?</h1>
                <p className="text-sm text-foreground-500 mt-1">Enter your email and we'll send you a reset link.</p>
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
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><i className="ri-send-plane-line"></i> Send Reset Link</>
                    )}
                  </button>
                </form>
              </div>

              <p className="text-center text-xs text-foreground-400 mt-5">
                Remember your password?{" "}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
