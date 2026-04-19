import React from 'react';

const StatCard = ({ label, value, trend, meta, color, trendBg, trendColor }) => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[12px] p-[16px_18px] relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-[12px_12px_0_0]" style={{ background: color }}></div>
    <div className="text-[11px] text-[#8888aa] font-medium tracking-[0.4px] uppercase mb-[8px]">{label}</div>
    <div className="text-[26px] font-medium text-[#1a1a2e] leading-none mb-[6px] font-['Playfair_Display',serif]">{value}</div>
    <div className="text-[12px] text-[#8888aa] flex items-center gap-[4px]">
      <span className="text-[11px] font-medium px-[6px] py-[2px] rounded-[4px]" style={{ background: trendBg, color: trendColor }}>{trend}</span> {meta}
    </div>
  </div>
);

const StatsSection = () => (
  <div className="grid grid-cols-4 gap-[14px] mb-[24px]">
    <StatCard label="Total Students" value="342" trend="+12" meta="this month" color="var(--accent,#3b5bdb)" trendBg="rgba(12,166,120,0.12)" trendColor="#0ca678" />
    <StatCard label="Fee Collected" value="৳8.4L" trend="94%" meta="of target" color="var(--accent2,#0ca678)" trendBg="rgba(12,166,120,0.12)" trendColor="#0ca678" />
    <StatCard label="Pending Dues" value="৳51K" trend="18 students" meta="" color="var(--accent3,#e8590c)" trendBg="rgba(232,89,12,0.12)" trendColor="#e8590c" />
    <StatCard label="Active Exams" value="6" trend="2 live" meta="now" color="var(--accent4,#9c36b5)" trendBg="rgba(12,166,120,0.12)" trendColor="#0ca678" />
  </div>
);

export default StatsSection;