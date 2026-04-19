import React from 'react';

const Topbar = () => {
  return (
    <div className="col-[1/-1] flex items-center justify-between px-[28px] h-[60px] bg-white border-b border-[rgba(60,60,120,0.10)] sticky top-0 z-10">
      <div className="font-['Playfair_Display',serif] text-[18px] font-semibold text-[#1a1a2e] tracking-[-0.3px] flex items-center gap-[10px]">
        <div className="w-[32px] h-[32px] bg-[#3b5bdb] rounded-[8px] flex items-center justify-center">
          <svg viewBox="0 0 18 18" className="w-[18px] h-[18px] fill-none stroke-white stroke-[2px]" strokeLinecap="round">
            <rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>
          </svg>
        </div>
        Tutor's Portal
      </div>
      <div className="flex items-center gap-[16px]">
        <div className="text-[12px] font-medium text-[#3b5bdb] bg-[rgba(59,91,219,0.09)] px-[12px] py-[4px] rounded-[20px]">
          Sunrise Academy
        </div>
        <div className="w-[34px] h-[34px] rounded-[8px] bg-[#f0f0f8] flex items-center justify-center cursor-pointer border border-[rgba(60,60,120,0.10)] relative">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div className="w-[7px] h-[7px] bg-[#e8590c] rounded-full absolute top-[7px] right-[7px] border-[1.5px] border-white"></div>
        </div>
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#9c36b5] flex items-center justify-center text-[12px] font-medium text-white">
          SA
        </div>
      </div>
    </div>
  );
};

export default Topbar;