"use client";

import { LayoutDashboard, Lock, ShieldAlert } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { useAdmin } from "@/hooks/useAdmin";
import MintCard from "@/components/admin/MintCard";
import WalletInitCard from "@/components/admin/WalletInitCard";
import PreflightCheck from "@/components/admin/PreflightCheck";
import StatusBadge from "@/components/shared/StatusBadge";
import { motion } from "framer-motion";
import { useBlockchain } from "@/hooks/useBlockchain";
import { ISSUER_ADDRESS } from "@/lib/blockchain";
import { AlertCircle } from "lucide-react";

export default function AdminPage() {
  const { isAdmin, loading, seedDEXLiquidity } = useAdmin();
  const { address } = useBlockchain();
  
  const isIssuer = address === ISSUER_ADDRESS;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Navbar />
        <div className="p-8 rounded-full border-b-2 border-brand-green animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center grain">
        <Navbar />
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Lock className="text-brand-red" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Admin Access Required</h1>
        <p className="text-neutral-500 max-w-md mb-8 italic">
          High-clearance authorization required for this terminal. Connect with a protocol administrator wallet.
        </p>
        <StatusBadge type="error">Access Denied</StatusBadge>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-12 selection:bg-brand-green/20 grain">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="text-brand-green" size={32} />
              <h1 className="text-4xl font-bold tracking-tight text-white tracking-tighter">Protocol Hub</h1>
            </div>
            <p className="text-neutral-500 font-medium">Global administration and diagnostic console</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <StatusBadge type="live">Live Monitor</StatusBadge>
             <StatusBadge type="success" className="bg-emerald-500/10 border border-emerald-500/20">Admin Connected</StatusBadge>
             <StatusBadge type={isIssuer ? "info" : "success"} className={isIssuer ? "bg-blue-500/10 border border-blue-500/20" : "bg-emerald-500/10 border border-emerald-500/20"}>
               Role: {isIssuer ? "Issuer" : "Market Maker"}
             </StatusBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            {!isIssuer && <WalletInitCard />}
            <MintCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-neutral-900/60 p-8 rounded-[32px] border border-white/5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                  <h3 className="text-xl font-bold mb-2 text-white">Orderbook Controls</h3>
                  <p className="text-sm text-neutral-500 mb-6 font-medium">Initialize the Traditional DEX orderbook to enable real network swaps.</p>
                  
                  {isIssuer ? (
                    <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 mb-4 flex items-start gap-3">
                      <AlertCircle className="text-brand-red shrink-0 mt-0.5" size={16} />
                      <div className="text-xs text-brand-red/70 leading-relaxed font-mono">
                        <strong>ISSUE_RESTRICTION:</strong> Swap to Market Maker identity to seed liquidity.
                      </div>
                    </div>
                  ) : null}

                  <button 
                    disabled={isIssuer}
                    onClick={async () => {
                      try {
                        await seedDEXLiquidity();
                      } catch (err) {
                        // Handled by hook toasts
                      }
                    }}
                    className="text-brand-green font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Seed DEX Liquidity
                  </button>
               </div>
               <div className="bg-neutral-900/60 p-8 rounded-[32px] border border-white/5 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                  <h3 className="text-xl font-bold mb-2 text-white">Security Audit</h3>
                  <p className="text-sm text-neutral-500 mb-6 font-medium">Review contract interactions and suspicious ledger activity</p>
                  <button className="text-brand-green font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                    View Logs
                  </button>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <PreflightCheck />
            <div className="mt-8 p-6 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-start gap-4 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
               <ShieldAlert className="text-brand-red mt-1" size={20} />
               <div>
                  <h4 className="text-sm font-bold text-brand-red mb-1">Danger Zone</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    Functions in this area can permanently alter protocol state. Proceed with extreme caution.
                  </p>
                  <button className="mt-4 text-xs font-bold text-white bg-brand-red px-4 py-2 rounded-xl hover:bg-rose-600 transition-all active:scale-[0.95]">
                    Pause Protocol
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
