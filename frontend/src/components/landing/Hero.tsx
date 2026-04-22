"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-neutral-950 grain">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />
      
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 1, y: 0 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-emerald-500/20 text-xs font-bold mb-6 text-brand-green">
            <span className="flex h-2 w-2 rounded-full bg-brand-green animate-ping" />
                Soroban Mainnet Soon
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8 text-white tracking-tighter">
            Swap at the <br />
            <span className="text-gradient">Velocity of Light</span>
          </h1>
          <p className="text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed tracking-tight">
            The next evolution of inter-network liquidity. Fueled by Soroban's engine and engineered for the speed of the future.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/swap" className="px-8 py-4 bg-brand-green text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30">
              Start Trading <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors">
              Read Docs
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <div className="text-sm text-neutral-400">
              <span className="font-bold text-white">2,400+</span>
              <span className="ml-1">Beta Users</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Main Hero Asset */}
          <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="relative w-full max-w-lg"
          >
             <img 
               src="/Users/garvit/.gemini/antigravity/brain/a046bb98-7873-43ab-98fd-4f659b2345e0/blockchain_swap_hero_white_1776712958885.png" 
               alt="Token Swap Interface"
               className="rounded-[40px] shadow-2xl border border-white/20"
             />
             <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
               <div className="w-full h-[20%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-scanner shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
             </div>
             
             {/* Live TPS Badge - Updated for light mode */}
             <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-neutral-900/90 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl shadow-xl"
             >
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                       <Zap size={20} />
                    </div>
                    <div>
                       <div className="text-[10px] uppercase font-bold text-neutral-500">Live Throughput</div>
                       <div className="text-xl font-bold text-white">248 TPS</div>
                    </div>
                 </div>
             </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
