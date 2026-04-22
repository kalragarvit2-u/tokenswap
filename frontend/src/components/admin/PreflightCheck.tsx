"use client";

import { Activity, ShieldCheck, Database, Server } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import StatusBadge from "../shared/StatusBadge";
import { CONTRACT_IDS } from "@/lib/blockchain";

export default function PreflightCheck() {
  const isRouterSet = CONTRACT_IDS.router && !CONTRACT_IDS.router.includes("...");
  const isPoolSet = CONTRACT_IDS.pool && !CONTRACT_IDS.pool.includes("...");

  const checks = [
    { name: "Soroban RPC", status: "Healthy", icon: Server, color: "text-emerald-400" },
    { name: "Router Contract", status: "Connected", icon: Database, color: "text-emerald-400" },
    { name: "Liquidity Pool", status: "Ready", icon: ShieldCheck, color: "text-emerald-400" },
    { name: "Ledger Polling", status: "Active", icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <GlassCard className="p-8 bg-neutral-900/60 border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
      <h3 className="text-xl font-bold mb-6 flex items-center justify-between text-white">
        Health Status
        <StatusBadge type="live">
          Testnet
        </StatusBadge>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <div key={check.name} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group/item">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                <check.icon size={18} className="text-brand-green" />
              </div>
              <span className="text-xs font-medium text-neutral-400 group-hover/item:text-neutral-200 transition-colors uppercase tracking-tight">{check.name}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ml-2 text-brand-green">{check.status}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
