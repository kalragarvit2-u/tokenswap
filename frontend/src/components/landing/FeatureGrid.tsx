"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Coins, Layers, Activity } from "lucide-react";

const features = [
  {
    title: "Warp-Speed Swaps",
    desc: "Execute near-instantaneous token reconfigurations with zero friction and absolute atomic precision.",
    icon: <Coins size={24} />,
    className: ""
  },
  {
    title: "Flux Provision",
    desc: "Fuel the network's core conduits and extract recurring rewards for stabilizing the trade routes.",
    icon: <Layers size={24} />,
    className: ""
  },
  {
    title: "Soroban Engine",
    desc: "Secured by the impenetrable logic of next-gen smart contracts, built to withstand the pressures of massive scale.",
    icon: <Cpu size={24} />,
    className: ""
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Inter-Network Infrastructure</h2>
        <p className="text-neutral-400 max-w-xl mx-auto text-lg">
          Harnessing the raw power of Soroban nodes to deliver zero-latency DeFi across the blockchain frontier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-neutral-900 border border-white/5 hover:border-brand-green/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)] p-8 rounded-[32px] group transition-all duration-500 overflow-hidden ${f.className}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-brand-green/20 transition-colors"
              >
                {React.cloneElement(f.icon as React.ReactElement, { className: "text-brand-green" })}
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{f.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
