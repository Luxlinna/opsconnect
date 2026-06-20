const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL  = "dev@ballangkmall.com";
const FROM_EMAIL    = "OPSConnect <noreply@opsconnect.io>";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "content-type",
  "Content-Type": "application/json",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  return res.ok;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  let email: string;
  try {
    const body = await req.json() as Record<string, unknown>;
    email = ((body.email as string) ?? "").trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: CORS });
  }

  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers: CORS });
  }

  // 1. Confirmation email to the subscriber
  await sendEmail(
    email,
    "You're subscribed to OPSConnect! 🎉",
    `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1f2937">
      <img src="https://opsconnect-ic3j.onrender.com/logo.svg" alt="OPSConnect" style="height:36px;margin-bottom:24px" />
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Thanks for subscribing! 🎉</h2>
      <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 20px">
        You're now on the OPSConnect newsletter list. We'll keep you updated with the latest features,
        product news, and tips to help you unify your customer messaging.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 32px">
        In the meantime, feel free to explore what OPSConnect can do for your business.
      </p>
      <a href="https://opsconnect-ic3j.onrender.com"
         style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#24396D,#38BDEB);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
        Explore OPSConnect
      </a>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb" />
      <p style="font-size:12px;color:#9ca3af;margin:0">
        © 2026 OPSConnect · You're receiving this because you subscribed at opsconnect-ic3j.onrender.com
      </p>
    </div>
    `
  );

  // 2. Notification to admin
  await sendEmail(
    NOTIFY_EMAIL,
    "New OPSConnect Newsletter Subscriber",
    `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f2937">
      <h3 style="margin:0 0 12px">New subscriber</h3>
      <p style="margin:0;font-size:15px">Email: <strong>${email}</strong></p>
      <p style="margin:8px 0 0;font-size:13px;color:#6b7280">Subscribed via OPSConnect website</p>
    </div>
    `
  );

  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
});
