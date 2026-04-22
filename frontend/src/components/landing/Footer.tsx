"use client";

import { ArrowLeftRight, Github, Twitter, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CONTRACT_IDS } from "@/lib/blockchain";

export default function Footer() {
  return (
    <footer className="relative py-24 border-t border-white/5 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-rose-500/10 to-transparent blur-sm" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-brand-green/10 rounded-lg">
              <ArrowLeftRight size={20} className="text-brand-green" />
            </div>
            <span className="font-bold text-xl text-white">Token Swap</span>
          </Link>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
             Forging the future of liquidity in the deep space of DeFi. Persistent, atomic, and moving faster than the rest.
          </p>
           <div className="flex gap-4">
             <div className="p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors text-white/60 hover:text-brand-green">
                <Twitter size={20} />
             </div>
             <div className="p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors text-white/60 hover:text-brand-green">
                <Github size={20} />
             </div>
             <div className="p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors text-white/60 hover:text-brand-green">
                <MessageSquare size={20} />
             </div>
           </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 pt-1">Resources</h4>
          <ul className="space-y-4 text-neutral-400 text-sm">
             <li><Link href="#" className="hover:text-brand-green transition-colors">Documentation</Link></li>
             <li><Link href="#" className="hover:text-brand-green transition-colors">Brand Assets</Link></li>
             <li><Link href="#" className="hover:text-brand-green transition-colors">Developer Portal</Link></li>
             <li><Link href="#" className="hover:text-brand-green transition-colors">Audit Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 pt-1">Contracts (Testnet)</h4>
          <ul className="space-y-4 text-xs font-mono text-neutral-500">
             <li className="flex flex-col gap-1">
                <span className="text-neutral-600 uppercase text-[9px] tracking-widest font-bold">Router</span>
                <span className="text-white truncate">{CONTRACT_IDS.router}</span>
             </li>
             <li className="flex flex-col gap-1">
                <span className="text-neutral-600 uppercase text-[9px] tracking-widest font-bold">Liquidity Pool</span>
                <span className="text-white truncate">{CONTRACT_IDS.pool}</span>
             </li>
             <li className="flex flex-col gap-1">
                <span className="text-neutral-600 uppercase text-[9px] tracking-widest font-bold">Token Factory</span>
                <span className="text-white truncate">{CONTRACT_IDS.token}</span>
             </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-mono">
         <p>© 2026 Token Swap Protocol. All rights reserved.</p>
         <div className="flex gap-8">
            <Link href="#" className="hover:text-brand-green transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-green transition-colors">Terms of Service</Link>
         </div>
      </div>
    </footer>
  );
}
