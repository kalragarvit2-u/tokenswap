"use client";

import { useState, useEffect } from "react";
import { Coins, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import StatusBadge from "../shared/StatusBadge";
import { useAdmin } from "@/hooks/useAdmin";
import { useBlockchain } from "@/hooks/useBlockchain";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ISSUER_ADDRESS } from "@/lib/blockchain";

function RecipientStatus({ address }: { address: string }) {
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const { checkAssetTrust } = useBlockchain();

  useEffect(() => {
    const verify = async () => {
      setStatus("checking");
      try {
        const hasTrust = await checkAssetTrust("BKSWP", address);
        setStatus(hasTrust ? "valid" : "invalid");
      } catch {
        setStatus("invalid");
      }
    };
    if (address.length === 56) verify();
  }, [address, checkAssetTrust]);

  if (status === "checking") return <Loader2 className="animate-spin text-slate-300" size={16} />;
  return status === "valid" ? (
    <StatusBadge type="success">Trusted</StatusBadge>
  ) : (
    <StatusBadge type="error">No Trustline</StatusBadge>
  );
}

export default function MintCard() {
  const { mintToken } = useAdmin();
  const { address, checkAssetTrust } = useBlockchain();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  
  const MM_ADDRESS = "GCGUQ2F6LKRCD6PUDJKTVNGNEFVGJJPLBM7L64I5YFM7SBQGGXNXMVUM";
  const isIssuer = address && address === ISSUER_ADDRESS;
  const isNotIssuer = address && !isIssuer;

  // Smart defaulting: If issuer is connected, point to Market Maker
  useEffect(() => {
    if (isIssuer && !recipient) {
      setRecipient(MM_ADDRESS);
    } else if (!address) {
      setRecipient("");
    }
  }, [address, isIssuer, recipient]);

  const handleMint = async () => {
    if (!recipient || !amount) {
      toast.error("Please fill in recipient and amount");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Trustline & Account Check
      try {
        const hasTrust = await checkAssetTrust("BKSWP", recipient);
        if (!hasTrust) {
          toast.error("Recipient lacks trustline", {
            description: "Please initiate a trustline on the recipient wallet first."
          });
          setLoading(false);
          return;
        }
      } catch (e: any) {
        if (e.response?.status === 404) {
          toast.error("Account not funded", {
            description: "The recipient wallet needs XLM to perform transactions on Testnet.",
            action: {
              label: "Get XLM",
              onClick: () => window.open(`https://laboratory.stellar.org/#account-creator?public_key=${recipient}`, "_blank")
            }
          });
          setLoading(false);
          return;
        }
      }

      await mintToken(recipient, amount);
      
      // Record to MongoDB
      await fetch("/api/admin/logs", {
        method: "POST",
        body: JSON.stringify({
          adminAddress: address,
          action: "MINT",
          details: `Minted ${amount} BKSWP to ${recipient}`,
          txHash: "tx_mint_" + Math.random().toString(36).substring(7)
        })
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setAmount("");
    } catch (e) {
      // Errors are handled by the useAdmin hook toasts
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
            <Coins className="text-brand-green" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Token Issuance</h3>
            <p className="text-xs text-neutral-500 font-medium">Mint protocol assets to any authorized wallet</p>
          </div>
        </div>
        <StatusBadge type="info">Active</StatusBadge>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">CONNECTED_IDENTITY</label>
          <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-xs text-neutral-600 overflow-hidden text-ellipsis italic">
            {address || "NOT_FOUND"}
          </div>
        </div>

        <div className="relative group/input">
           <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">RECIPIENT_WALLET</label>
           <input 
            type="text"
            placeholder="G..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-green transition-all font-mono text-xs text-white pr-32"
          />
          {recipient && recipient.length === 56 && (
            <div className="absolute right-4 bottom-4">
               <RecipientStatus address={recipient} />
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">ISSUANCE_AMOUNT</label>
          <input 
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-green transition-all font-bold text-lg text-white tracking-tighter"
          />
        </div>

        {isNotIssuer && (
          <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-brand-red shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-brand-red/70 leading-relaxed font-medium italic">
              <strong>RESTRICTED:</strong> Only the primary issuing account can mint tokens. Please switch identity.
            </div>
          </div>
        )}

        <button
          onClick={handleMint}
          disabled={!!(loading || isNotIssuer)}
          className="w-full py-4 bg-brand-green text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CheckCircle2 size={20} /> Authorize Issuance
            </>
          )}
        </button>
      </div>
    </div>
  );
}
