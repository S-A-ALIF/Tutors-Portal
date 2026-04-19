import React from 'react';

const FeeChartWidget = () => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[12px] p-[18px_20px]">
    <div className="text-[13px] font-medium text-[#1a1a2e] mb-[14px] flex items-center justify-between">
      Monthly Fee Collection <span className="text-[11px] text-[#8888aa] font-normal">2025–26</span>
    </div>
    <div className="flex items-end gap-[6px] h-[80px] pt-[8px]">
      {[
        { h: '52%', c: '#3b5bdb', l: 'Jul' }, { h: '65%', c: '#3b5bdb', l: 'Aug' }, { h: '70%', c: '#3b5bdb', l: 'Sep' },
        { h: '80%', c: '#3b5bdb', l: 'Oct' }, { h: '60%', c: '#3b5bdb', l: 'Nov' }, { h: '88%', c: '#3b5bdb', l: 'Dec' },
        { h: '75%', c: '#3b5bdb', l: 'Jan' }, { h: '90%', c: '#3b5bdb', l: 'Feb' }, { h: '94%', c: '#0ca678', l: 'Mar' }
      ].map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-[4px]">
          <div className="w-full rounded-[4px_4px_0_0] transition-opacity duration-200 hover:opacity-80 cursor-pointer" style={{ height: b.h, background: b.c }}></div>
          <div className="text-[10px] text-[#8888aa]">{b.l}</div>
        </div>
      ))}
    </div>
  </div>
);

export default FeeChartWidget;