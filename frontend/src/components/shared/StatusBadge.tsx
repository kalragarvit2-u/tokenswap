import { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  type?: "success" | "warning" | "error" | "info" | "live";
  className?: string;
}

export default function StatusBadge({ children, type = "info", className = "" }: StatusBadgeProps) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-white/5 text-neutral-400 border-white/10",
    live: "bg-brand-green/10 text-brand-green border-brand-green/20",
  };

  return (
    <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${styles[type]} ${className}`}>
      {type === "live" && <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />}
      {children}
    </div>
  );
}
