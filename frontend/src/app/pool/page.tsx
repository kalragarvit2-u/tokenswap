"use client";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { 
  Activity, 
  BarChart3, 
  LineChart as LineChartIcon,
  TrendingUp, 
  History,
  Info,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import GlassCard from "@/components/shared/GlassCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  ResponsiveContainer, 
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import Link from "next/link";

const MOCK_TVL_DATA = [
  { day: "Mon", tvl: 1.2 },
  { day: "Tue", tvl: 1.5 },
  { day: "Wed", tvl: 1.3 },
  { day: "Thu", tvl: 1.9 },
  { day: "Fri", tvl: 2.4 },
  { day: "Sat", tvl: 2.1 },
  { day: "Sun", tvl: 2.45 },
];

const MOCK_VOL_DATA = [
  { day: "Mon", vol: 240 },
  { day: "Tue", vol: 320 },
  { day: "Wed", vol: 180 },
  { day: "Thu", vol: 450 },
  { day: "Fri", vol: 510 },
  { day: "Sat", vol: 390 },
  { day: "Sun", vol: 482 },
];

export default function PoolAnalyticsPage() {
  const { events } = useRealtimeEvents();
  const [dbStats, setDbStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/pool/stats");
        const data = await res.json();
        setDbStats(data);
      } catch (e) {
        console.error("Failed to fetch pool stats", e);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Liquidity", val: dbStats ? `$${(dbStats.tvlUSD / 1e6).toFixed(2)}M` : "$2.45M", change: "+12.4%", icon: LineChartIcon, color: "text-brand-green" },
    { label: "24H Volume", val: dbStats ? `$${dbStats.volume24h.toLocaleString()}` : "$482,000", change: "+4.2%", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Protocol Fees", val: dbStats ? `$${(dbStats.volume24h * 0.003).toLocaleString()}` : "$1,446", change: "+2.1%", icon: BarChart3, color: "text-rose-400" },
    { label: "Active Pools", val: "1", change: "Steady", icon: Info, color: "text-brand-green" },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-20 selection:bg-brand-green/20 grain">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Activity className="text-brand-green" size={32} />
               <h1 className="text-4xl font-bold tracking-tight text-white tracking-tighter">Protocol Analytics</h1>
            </div>
            <p className="text-neutral-500 font-medium max-w-lg">
              Explore the health and performance of the XLM/BKSWP liquidity pool in real-time.
            </p>
          </div>
          <Link 
            href="/liquidity" 
            className="flex items-center gap-2 bg-brand-green hover:bg-emerald-400 px-6 py-3 rounded-2xl text-sm font-bold text-black shadow-lg transition-all group active:scale-[0.98]"
          >
            Manage Liquidity <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <GlassCard key={i} className="p-6 bg-neutral-900/40 border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${stat.label === '24H Volume' ? 'text-emerald-400' : 'text-brand-green'}`}>
                       <stat.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-tight">{stat.change}</span>
                 </div>
                 <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                 <div className="text-2xl font-bold font-mono text-white tracking-tighter">{stat.val}</div>
              </GlassCard>
            ))}
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* TVL Chart */}
            <GlassCard className="p-8 h-[400px] flex flex-col bg-neutral-900/40 border-white/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-500">
                     <LineChartIcon size={16} /> Total Value Locked
                  </h3>
                  <StatusBadge type="live">XLM/BKSWP</StatusBadge>
               </div>
               <div className="flex-1 w-full font-mono text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={MOCK_TVL_DATA}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4b5563'}} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                        <Line type="monotone" dataKey="tvl" stroke="#10b981" strokeWidth={3} dot={{fill: '#10b981'}} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>

            {/* Volume Chart */}
            <GlassCard className="p-8 h-[400px] flex flex-col bg-neutral-900/40 border-white/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-500">
                     <BarChart3 size={16} /> 24H Volume
                  </h3>
                  <StatusBadge type="info">USD Value</StatusBadge>
               </div>
               <div className="flex-1 w-full font-mono text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={MOCK_VOL_DATA}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4b5563'}} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                        <Bar dataKey="vol" fill="#10b981" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
        </div>

        {/* Protocol Feed */}
        <GlassCard className="overflow-hidden bg-neutral-900/40 border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <h3 className="font-bold flex items-center gap-2 tracking-tight text-white">
                  <History size={20} className="text-brand-green" />
                  Global Protocol Events
               </h3>
               <StatusBadge type="live">Real-time</StatusBadge>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="text-[10px] uppercase font-bold text-neutral-600 border-b border-white/5">
                     <tr>
                        <th className="p-6">Action</th>
                        <th className="p-6">Contract</th>
                        <th className="p-6 text-right">Details</th>
                        <th className="p-6 text-right">User</th>
                        <th className="p-6 text-right">Ledger</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs">
                     {events.map((e, i) => (
                        <motion.tr 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           key={e.id} 
                           className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                        >
                           <td className="p-6">
                              <StatusBadge type={e.type === 'swap' ? 'live' : e.type === 'deposit' ? 'success' : 'info'}>
                                 {e.type.toUpperCase()}
                              </StatusBadge>
                           </td>
                           <td className="p-6 text-neutral-500 font-mono text-[10px]">{e.contractId.slice(0, 12)}...</td>
                           <td className="p-6 text-right font-medium text-white">
                              {e.type === 'swap' ? `${Number(e.data.amountIn)/1e7} → ${Number(e.data.amountOut)/1e7}` : "Protocol Call"}
                           </td>
                           <td className="p-6 text-right font-mono text-neutral-600">{e.user.slice(0, 6)}...{e.user.slice(-4)}</td>
                           <td className="p-6 text-right font-mono text-neutral-700">{e.ledger}</td>
                        </motion.tr>
                     ))}
                     {events.length === 0 && (
                        <tr>
                           <td colSpan={5} className="p-12 text-center text-neutral-600 font-mono uppercase tracking-widest text-[10px]">
                              Listening for Soroban RPC Events...
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
        </GlassCard>
      </div>
    </div>
  );
}
