import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, signUp } from "@/utils/auth";

const CHANNELS = [
  { id: "whatsapp",  label: "WhatsApp",  icon: "ri-whatsapp-line",  color: "#25D366" },
  { id: "messenger", label: "Messenger", icon: "ri-messenger-line",  color: "#0084FF" },
  { id: "telegram",  label: "Telegram",  icon: "ri-telegram-line",   color: "#26A5E4" },
  { id: "instagram", label: "Instagram", icon: "ri-instagram-line",  color: "#E4405F" },
  { id: "line",      label: "LINE",       icon: "ri-line-line",       color: "#00C300" },
  { id: "email",     label: "Email",      icon: "ri-mail-line",       color: "#EA4335" },
  { id: "wechat",    label: "WeChat",     icon: "ri-wechat-line",     color: "#07C160" },
  { id: "livechat",  label: "Live Chat",  icon: "ri-chat-3-line",     color: "#1E7FC2" },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      if (s) navigate(s.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    });
  }, []);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Business name must be at least 2 characters.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selectedChannels.length === 0) {
      setErrors({ channels: "Select at least one channel." });
      return;
    }
    setLoading(true);
    setErrors({});

    const { session, needsConfirmation, error } = await signUp(name, email, password, selectedChannels);

    if (error) {
      setErrors({ channels: error });
      setLoading(false);
      return;
    }

    if (needsConfirmation) {
      setConfirmedEmail(email.trim().toLowerCase());
      setLoading(false);
      return;
    }

    if (session) {
      navigate("/dashboard", { replace: true });
    }
  };

  // ── Confirmation screen ──────────────────────────────────────────────────────
  if (confirmedEmail) {
    return (
      <div className="min-h-screen bg-background-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-accent-100 mb-5">
            <i className="ri-mail-check-line text-3xl text-accent-600"></i>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950 mb-2">Check your email</h1>
          <p className="text-sm text-foreground-500 mb-1">We sent a confirmation link to</p>
          <p className="text-sm font-semibold text-foreground-800 mb-5">{confirmedEmail}</p>
          <p className="text-xs text-foreground-400 leading-relaxed">
            Click the link in the email to activate your account, then{" "}
            <Link to="/login" className="text-primary-500 hover:underline font-medium">sign in here</Link>.
          </p>
          <p className="text-xs text-foreground-300 mt-4">Didn't receive it? Check your spam folder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-background-200/70">
        <Link to="/" className="font-heading text-xl font-bold text-foreground-950">
          OPS<span className="text-primary-500">Connect</span>
        </Link>
        <span className="text-sm text-foreground-500">
          Already a partner?{" "}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign in</Link>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center gap-2 justify-center mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s ? "bg-primary-500 text-white" : "bg-background-200 text-foreground-400"
                }`}>{s}</div>
                {s < 2 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-primary-500" : "bg-background-200"}`} />}
              </div>
            ))}
            <div className="ml-2 text-xs text-foreground-500">
              {step === 1 ? "Account details" : "Choose your channels"}
            </div>
          </div>

          <div className="bg-background-100 rounded-2xl border border-background-200/70 p-6 md:p-8">
            {step === 1 ? (
              <>
                <h1 className="font-heading text-xl font-bold text-foreground-950 mb-1">Create your partner account</h1>
                <p className="text-sm text-foreground-500 mb-6">Get your Partner ID and start integrating channels.</p>

                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Business / Partner name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors({}); }}
                      placeholder="e.g. SmartChat, Acme Corp"
                      className={`w-full bg-background-50 border rounded-lg px-4 py-2.5 text-sm text-foreground-800 outline-none transition-colors placeholder:text-foreground-300 ${errors.name ? "border-red-300 focus:border-red-400" : "border-background-200/70 focus:border-primary-400"}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1"><i className="ri-error-warning-line mr-1"></i>{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                      placeholder="you@company.com"
                      className={`w-full bg-background-50 border rounded-lg px-4 py-2.5 text-sm text-foreground-800 outline-none transition-colors placeholder:text-foreground-300 ${errors.email ? "border-red-300 focus:border-red-400" : "border-background-200/70 focus:border-primary-400"}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1"><i className="ri-error-warning-line mr-1"></i>{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                        placeholder="Min. 6 characters"
                        className={`w-full bg-background-50 border rounded-lg pl-4 pr-10 py-2.5 text-sm text-foreground-800 outline-none transition-colors placeholder:text-foreground-300 ${errors.password ? "border-red-300 focus:border-red-400" : "border-background-200/70 focus:border-primary-400"}`}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer">
                        <i className={`text-sm ${showPw ? "ri-eye-off-line" : "ri-eye-line"}`}></i>
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1"><i className="ri-error-warning-line mr-1"></i>{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">Confirm password</label>
                    <input
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setErrors({}); }}
                      placeholder="Repeat your password"
                      className={`w-full bg-background-50 border rounded-lg px-4 py-2.5 text-sm text-foreground-800 outline-none transition-colors placeholder:text-foreground-300 ${errors.confirm ? "border-red-300 focus:border-red-400" : "border-background-200/70 focus:border-primary-400"}`}
                    />
                    {errors.confirm && <p className="text-xs text-red-500 mt-1"><i className="ri-error-warning-line mr-1"></i>{errors.confirm}</p>}
                  </div>

                  <button type="submit" className="w-full text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 transition-colors px-5 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer mt-2">
                    Next — Choose channels <i className="ri-arrow-right-line"></i>
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="font-heading text-xl font-bold text-foreground-950 mb-1">Which channels do you need?</h1>
                <p className="text-sm text-foreground-500 mb-6">Select all the messaging channels you want to use. You can add or remove them later.</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {CHANNELS.map((ch) => {
                    const selected = selectedChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => { toggleChannel(ch.id); setErrors({}); }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          selected
                            ? "border-primary-400 bg-primary-50"
                            : "border-background-200/70 bg-background-50 hover:border-background-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ch.color + "20" }}>
                          <i className={`${ch.icon} text-xl`} style={{ color: ch.color }}></i>
                        </div>
                        <span className="text-xs font-semibold text-foreground-800">{ch.label}</span>
                        {selected && <i className="ri-checkbox-circle-fill text-xs text-primary-500"></i>}
                      </button>
                    );
                  })}
                </div>

                {errors.channels && (
                  <p className="text-xs text-red-500 mb-4"><i className="ri-error-warning-line mr-1"></i>{errors.channels}</p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} disabled={loading} className="flex-1 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors px-4 py-2.5 rounded-lg border border-background-200/70 cursor-pointer">
                    <i className="ri-arrow-left-line mr-1"></i> Back
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="flex-1 text-sm font-semibold bg-primary-500 text-background-50 dark:text-foreground-950 hover:bg-primary-600 disabled:opacity-50 transition-colors px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
                    ) : (
                      <><i className="ri-verified-badge-line"></i> Create Partner Account</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-foreground-400 mt-5">
            By registering you agree to OPSConnect's{" "}
            <span className="text-primary-500 cursor-pointer hover:underline">Terms of Service</span> and{" "}
            <span className="text-primary-500 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
