"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const MOCK_DATA = [
  { time: "09:00", price: 0.124 },
  { time: "10:00", price: 0.126 },
  { time: "11:00", price: 0.125 },
  { time: "12:00", price: 0.128 },
  { time: "13:00", price: 0.131 },
  { time: "14:00", price: 0.129 },
  { time: "15:00", price: 0.132 },
];

export default function PriceChart() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-[0.2em] mb-1">XLM / BKSWP</div>
          <div className="text-2xl font-bold text-white tracking-tighter">0.132 <span className="text-xs text-brand-green font-normal ml-1">+2.4%</span></div>
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {["1H", "1D", "1W"].map(t => (
            <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${t === "1D" ? "bg-brand-green text-black shadow-lg shadow-emerald-500/20" : "hover:bg-white/5 text-neutral-500"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              hide 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              labelStyle={{ color: '#6b7280' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#050505", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
