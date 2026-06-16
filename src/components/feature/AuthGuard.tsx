import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  require?: "partner" | "admin" | "agent" | "any";
}

export default function AuthGuard({ children, require: required = "any" }: AuthGuardProps) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }
      if (required === "admin" && session.role !== "admin") {
        navigate(session.role === "agent" ? "/agent" : "/dashboard", { replace: true });
        return;
      }
      if (required === "agent" && session.role !== "agent") {
        navigate(session.role === "admin" ? "/admin" : "/dashboard", { replace: true });
        return;
      }
      // Agents visiting general partner routes → send to /agent
      if (required === "any" && session.role === "agent") {
        navigate("/agent", { replace: true });
        return;
      }
      setAllowed(true);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-primary-400 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
