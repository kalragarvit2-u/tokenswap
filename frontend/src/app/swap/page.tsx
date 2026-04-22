"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftRight, 
  Settings2, 
  History, 
  ChevronDown, 
  Activity, 
  ExternalLink,
  Loader2,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBlockchain } from "@/hooks/useBlockchain";
import { useSwap } from "@/hooks/useSwap";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { usePoolData } from "@/hooks/usePoolData";
import { CONTRACT_IDS } from "@/lib/blockchain";
import Navbar from "@/components/landing/Navbar";
import TokenSelector from "@/components/swap/TokenSelector";
import SlippageModal from "@/components/swap/SlippageModal";
import PriceChart from "@/components/swap/PriceChart";
import GlassCard from "@/components/shared/GlassCard";
import PreflightCheck from "@/components/admin/PreflightCheck";
import { useBalances } from "@/hooks/useBalances";
import { toast } from "sonner";

export default function SwapPage() {
  const { address, connect, checkAssetTrust, setupTrustline } = useBlockchain();
  const { executeSwap, getSwapQuote, status, txHash } = useSwap();
  const { events } = useRealtimeEvents();
  const [isQuoting, setIsQuoting] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [rawBuyAmount, setRawBuyAmount] = useState(""); // High precision quote
  const [sellToken, setSellToken] = useState({ id: "XLM", symbol: "XLM", logo: "🚀" });
  const [buyToken, setBuyToken] = useState({ id: "BKSWP", symbol: "BKSWP", logo: "🧪" });
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [selectorTarget, setSelectorTarget] = useState<"sell" | "buy">("sell");
  const [isSlippageOpen, setIsSlippageOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const { balances, refresh: refreshBalances } = useBalances(address);

  const { priceImpact, loading: poolLoading } = usePoolData(sellToken.id, sellAmount);

  // Live price update from Network Pathfinding
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (sellAmount && parseFloat(sellAmount) > 0) {
         setIsQuoting(true);
         const amountInScaled = (parseFloat(sellAmount) * 10000000).toString();
         const quote = await getSwapQuote(sellToken.id, amountInScaled, buyToken.id);
         
         if (quote) {
            setRawBuyAmount(quote);
            setBuyAmount(parseFloat(quote).toFixed(4));
         } else {
            setRawBuyAmount("");
            setBuyAmount("0.00");
         }
         setIsQuoting(false);
      } else {
         setBuyAmount("");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sellAmount, sellToken, buyToken, getSwapQuote]);

  const [hasTrust, setHasTrust] = useState(true);
  const [isCheckingTrust, setIsCheckingTrust] = useState(false);

  // Check trustline when buy token or address changes
  useEffect(() => {
    const verifyTrust = async () => {
      if (!address || buyToken.symbol === "XLM") {
        setHasTrust(true);
        return;
      }
      setIsCheckingTrust(true);
      const trusted = await checkAssetTrust(buyToken.symbol);
      setHasTrust(trusted);
      setIsCheckingTrust(false);
    };
    verifyTrust();
  }, [address, buyToken, checkAssetTrust]);

  const handleSwap = async () => {
    if (!address) {
      await connect();
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0 || !buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error("Invalid amount or quote missing");
      return;
    }
    
    // Step 1: Trustline Check
    if (!hasTrust) {
      if (balances.XLM < 1.0) { // 0.5 reserve + fee + buffer
        toast.error("Insufficient XLM balance to enable token (requires at least 1 XLM)");
        return;
      }
      const success = await setupTrustline(buyToken.symbol);
      if (success) {
        // Re-verify trustline state after successful setup (with retries for Horizon)
        const trusted = await checkAssetTrust(buyToken.symbol, undefined, 5);
        setHasTrust(trusted);
        refreshBalances();
      }
      return;
    }

    const calculationBase = rawBuyAmount || buyAmount;
    const minOut = (parseFloat(calculationBase) * (1 - slippage / 100)).toFixed(7);
    const amountIn = (parseFloat(sellAmount) * 10000000).toFixed(0);
    const minOutScaled = (parseFloat(minOut) * 10000000).toFixed(0);

    try {
      await executeSwap(address, sellToken.id, amountIn, minOutScaled);
      refreshBalances();

      // Calculate new reserves (AMM x * y = k)
      // For this demo, we assume initial reserves are 10,000 : 1,000
      const currentReserves = { XLM: 10000, BKSWP: 1000 };
      const amtIn = parseFloat(sellAmount);
      const amtOut = parseFloat(buyAmount);
      const newResA = sellToken.symbol === "XLM" ? currentReserves.XLM + amtIn : currentReserves.XLM - amtOut;
      const newResB = sellToken.symbol === "BKSWP" ? currentReserves.BKSWP + amtIn : currentReserves.BKSWP - amtOut;

      // Persist to MongoDB
      await Promise.all([
        fetch("/api/swaps", {
          method: "POST",
          body: JSON.stringify({
            userAddress: address,
            fromToken: sellToken.symbol,
            toToken: buyToken.symbol,
            fromAmount: sellAmount,
            toAmount: buyAmount,
            txHash: "sim_" + Math.random().toString(36).substring(7)
          })
        }),
        fetch("/api/pool/stats", {
          method: "PATCH",
          body: JSON.stringify({
            xlmReserve: newResA.toString(),
            bkswpReserve: newResB.toString(),
            volume24h: 482000 + (sellToken.symbol === "XLM" ? amtIn : amtOut * 10)
          })
        })
      ]);
    } catch (err) {
      // Handled by hook
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact < 1) return "text-green-500";
    if (impact < 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-12 selection:bg-brand-green/20 grain">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Chart & Info */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] h-[350px] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
            <PriceChart />
          </div>
          <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
            <h3 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase tracking-widest text-neutral-500">
               <Info size={16} className="text-brand-green" /> Pool Info
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                   <span className="text-neutral-500">Liquidity</span>
                   <span className="font-mono text-white font-semibold">$2.4M</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-500">Vol 24H</span>
                   <span className="font-mono text-white font-semibold">$482k</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-neutral-500">Fees 24H</span>
                   <span className="font-mono text-white font-semibold">$1.4k</span>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6 justify-center items-start pt-0 lg:pt-8">
          <PreflightCheck />
          <GlassCard className="w-full max-w-[480px] p-8 shadow-2xl relative bg-neutral-900/60 border-white/10 grain">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Swap</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsSlippageOpen(true)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
                >
                  <Settings2 size={20} className="text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2 relative">
              {/* From */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 group hover:border-brand-green/20 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">You Pay</span>
                  <div className="text-[10px] font-medium text-neutral-500">
                    Balance: <span className="text-neutral-300 font-semibold">{balances[sellToken.symbol as keyof typeof balances] || 0}</span>
                    <button 
                      onClick={() => setSellAmount((balances[sellToken.symbol as keyof typeof balances] || 0).toString())}
                      className="ml-2 text-brand-green uppercase font-bold hover:text-emerald-400 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="bg-transparent text-4xl font-bold outline-none w-full placeholder:text-neutral-800 text-white tracking-tighter"
                  />
                  <button 
                    onClick={() => { setSelectorTarget("sell"); setIsTokenSelectorOpen(true); }}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 shadow-sm transition-all active:scale-95"
                  >
                    <span className="text-xl">{sellToken.logo}</span>
                    <span className="font-bold text-white">{sellToken.symbol}</span>
                    <ChevronDown size={16} className="text-neutral-500" />
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.button 
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => {
                    const temp = sellToken;
                    setSellToken(buyToken);
                    setBuyToken(temp);
                  }}
                  className="p-3 rounded-2xl bg-neutral-900 border border-white/10 text-brand-green shadow-2xl hover:border-brand-green/30 transition-all"
                >
                  <ArrowLeftRight size={20} />
                </motion.button>
              </div>

              {/* To */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 group hover:border-brand-green/20 transition-all pt-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">You Receive</span>
                  <div className="text-[10px] font-medium text-neutral-500">
                    Balance: <span className="text-neutral-300 font-semibold">{(balances[buyToken.symbol as keyof typeof balances] || 0).toLocaleString()}</span>
                    {buyToken.symbol === "BKSWP" && (balances[buyToken.symbol as keyof typeof balances] || 0) === 0 && (
                      <button 
                        onClick={async () => {
                           const { mintToken } = await import("@/hooks/useAdmin").then(m => m.useAdmin());
                           toast.promise(mintToken(address || "", "100"), {
                             loading: "Issuing 100 BKSWP tokens...",
                             success: "100 BKSWP tokens issued!",
                             error: "Only administrators can issue tokens."
                           });
                        }}
                        className="ml-2 text-emerald-500 uppercase font-bold hover:text-emerald-400 transition-colors"
                      >
                        [ Faucet ]
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="text-4xl font-bold w-full truncate h-10 flex items-center text-white tracking-tighter">
                    {isQuoting ? (
                      <Loader2 className="animate-spin text-brand-green" size={24} />
                    ) : buyAmount ? (
                      buyAmount
                    ) : (
                      <span className="text-neutral-800">0.00</span>
                    )}
                  </div>
                  <button 
                    onClick={() => { setSelectorTarget("buy"); setIsTokenSelectorOpen(true); }}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 shadow-sm transition-all active:scale-95"
                  >
                    <span className="text-xl">{buyToken.logo}</span>
                    <span className="font-bold text-white">{buyToken.symbol}</span>
                    <ChevronDown size={16} className="text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <AnimatePresence>
              {sellAmount && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 space-y-3 overflow-hidden text-xs"
                >
                   <div className="flex justify-between items-center text-neutral-500">
                      <span>Exchange Rate</span>
                      <span className="font-mono text-neutral-300">
                        {isQuoting ? "..." : `1 ${sellToken.symbol} = ${(parseFloat(buyAmount) / (parseFloat(sellAmount) || 1)).toFixed(4)} ${buyToken.symbol}`}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-neutral-500">
                      <span>Price Impact</span>
                      <span className={`font-mono font-semibold ${getImpactColor(priceImpact)}`}>{poolLoading ? "..." : `${priceImpact.toFixed(2)}%`}</span>
                   </div>
                   <div className="flex justify-between items-center text-neutral-500">
                      <span>Slippage Tolerance</span>
                      <span className="font-mono text-brand-green font-semibold">{slippage}%</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <button 
              onClick={handleSwap}
              disabled={
                (status !== "IDLE" && status !== "SUCCESS" && status !== "ERROR") || 
                isCheckingTrust || 
                !sellAmount || 
                parseFloat(sellAmount) <= 0 || 
                isQuoting
              }
              className={`w-full py-5 rounded-[24px] font-bold text-lg mt-8 transition-all flex items-center justify-center gap-2 group overflow-hidden relative ${
                address 
                  ? "bg-brand-green text-black shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98]" 
                  : "bg-neutral-800 text-white hover:bg-neutral-700 border border-white/5"
              }`}
            >
              <span className="z-10 flex items-center gap-2">
                {isCheckingTrust ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : !address ? (
                  "Connect Wallet"
                ) : !hasTrust ? (
                  `Enable ${buyToken.symbol}`
                ) : status === "IDLE" || status === "SUCCESS" || status === "ERROR" ? (
                  "Swap Tokens"
                ) : (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    {status}
                  </>
                )}
              </span>
            </button>

            {/* Result Link */}
            {txHash && (
               <motion.a 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 href={`https://blockchain.expert/explorer/testnet/tx/${txHash}`}
                 target="_blank"
                 className="flex items-center justify-center gap-2 mt-6 text-[10px] text-neutral-500 hover:text-brand-green transition-colors uppercase font-bold tracking-widest"
               >
                 View on Explorer <ExternalLink size={10} />
               </motion.a>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Feed */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
           <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 h-full rounded-[32px] overflow-hidden flex flex-col shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2 text-sm text-white">
                   <Activity size={18} className="text-brand-green" /> Live Activity
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                 {events.map((e) => (
                    <div key={e.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-green/20 transition-all">
                       <div className="flex justify-between text-[10px] mb-2">
                          <span className={`font-bold ${
                            e.type === 'swap' ? 'text-brand-green' : 
                            e.type === 'deposit' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>{e.type.toUpperCase()}</span>
                          <span className="text-neutral-500 font-mono">NEW</span>
                       </div>
                       <div className="text-xs font-semibold text-neutral-300">
                          {e.type === 'swap' ? (
                            `${Number(e.data.amountIn)/1e7} XLM → ${Number(e.data.amountOut)/1e7} BKSWP`
                          ) : (
                            "Protocol Activity"
                          )}
                       </div>
                    </div>
                 ))}
                 {events.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-8">
                       <History size={48} className="mb-4 text-slate-300" />
                       <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Awaiting Trades...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Modals */}
      <TokenSelector 
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        selectedToken={selectorTarget === "sell" ? sellToken.id : buyToken.id}
        onSelect={(token) => {
          if (selectorTarget === "sell") setSellAmount(""), setSellToken(token);
          else setBuyToken(token);
        }}
      />

      <SlippageModal 
        isOpen={isSlippageOpen}
        onClose={() => setIsSlippageOpen(false)}
        value={slippage}
        onChange={setSlippage}
      />
    </div>
  );
}
