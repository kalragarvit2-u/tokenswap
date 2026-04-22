"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useBlockchain } from "@/hooks/useBlockchain";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, connect, loading } = useBlockchain();

  return (
    <nav className="fixed top-0 w-full z-[999] px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-green/10 rounded-lg group-hover:rotate-12 transition-transform">
            <ArrowLeftRight size={20} className="text-brand-green" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Token Swap</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/swap" className="hover:text-brand-green transition-colors">Swap</Link>
          <Link href="/liquidity" className="hover:text-brand-green transition-colors">Liquidity</Link>
          <Link href="/pool" className="hover:text-brand-green transition-colors">Analytics</Link>
          <Link href="/admin" className="hover:text-brand-green transition-colors border-l border-white/10 pl-6">Admin</Link>
          {address && (
            <a 
              href={`https://laboratory.blockchain.org/#account-creator?public_key=${address}`}
              target="_blank" 
              className="hidden lg:flex items-center gap-1 text-[9px] font-bold text-brand-green hover:text-brand-red transition-colors uppercase tracking-widest"
            >
              Get Testnet Tokens
            </a>
          )}
          <button 
            onClick={connect}
            disabled={loading}
            className="bg-brand-green text-black px-5 py-2 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Connecting..." : address ? `${address.slice(0,4)}...${address.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-6 right-6 glass p-6 rounded-2xl flex flex-col gap-4 text-center"
        >
          <Link href="/swap" onClick={() => setIsOpen(false)} className="text-neutral-400 font-medium">Swap Tokens</Link>
          <Link href="/liquidity" onClick={() => setIsOpen(false)} className="text-neutral-400 font-medium">Add Liquidity</Link>
          <Link href="/pool" onClick={() => setIsOpen(false)} className="text-neutral-400 font-medium">Protocol Analytics</Link>
          <Link href="/admin" onClick={() => setIsOpen(false)} className="text-brand-green font-bold">Admin Hub</Link>
          <button 
             onClick={() => { connect(); setIsOpen(false); }}
             disabled={loading}
             className="bg-brand-green text-black py-3 rounded-xl font-bold disabled:opacity-50"
          >
             {loading ? "Connecting..." : address ? `${address.slice(0,4)}...${address.slice(-4)}` : "Connect Wallet"}
          </button>
        </motion.div>
      )}
    </nav>
  );
}
