"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, Sparkles, AlertCircle } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import { useAdmin } from "@/hooks/useAdmin";
import { useBlockchain } from "@/hooks/useBlockchain";
import { toast } from "sonner";

export default function WalletInitCard() {
  const { initializeWallet } = useAdmin();
  const { address, checkAssetTrust } = useBlockchain();
  const [hasTrust, setHasTrust] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkStatus = async () => {
    if (!address) return;
    setChecking(true);
    try {
      const result = await checkAssetTrust("BKSWP");
      setHasTrust(result);
    } catch (e) {
      setHasTrust(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [address]);

  const handleInit = async () => {
    setLoading(true);
    try {
      await initializeWallet();
      await checkStatus();
    } catch (e) {
      // Handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900/60 p-8 rounded-[32px] border border-white/5 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <ShieldCheck className="text-brand-green" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Account Activation</h3>
            <p className="text-xs text-neutral-500 font-medium">Verify and authorize protocol assets</p>
          </div>
        </div>
        {checking ? (
          <span className="p-2 animate-spin text-neutral-700 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <StatusBadge type={hasTrust ? "success" : "warning"}>
            {hasTrust ? "Authorized" : "Inactive"}
          </StatusBadge>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-start gap-3">
            {hasTrust ? (
              <Sparkles className="text-emerald-500 mt-1" size={18} />
            ) : (
              <AlertCircle className="text-amber-500 mt-1" size={18} />
            )}
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {hasTrust ? "Wallet is Ready" : "Terminal Locked"}
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed italic">
                {hasTrust 
                  ? "Your identity is authenticated. You are authorized to manage protocol liquidity and receive assets."
                  : "Cryptographic trustlines required. Every terminal account must authorize the BKSWP asset gate before receiving data."}
              </p>
            </div>
          </div>
        </div>

        {!hasTrust && (
          <button
            onClick={handleInit}
            disabled={loading || checking}
            className="w-full py-4 bg-brand-green text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Initialize Identity
              </>
            )}
          </button>
        )}
        
        {hasTrust && (
          <div className="w-full py-4 bg-emerald-500/10 text-brand-green border border-emerald-500/20 rounded-2xl font-bold flex items-center justify-center gap-2">
            <ShieldCheck size={20} /> Identity Authenticated
          </div>
        )}
      </div>
    </div>
  );
}
