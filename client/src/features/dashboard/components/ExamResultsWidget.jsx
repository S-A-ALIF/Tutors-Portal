import React from 'react';

const ExamItem = ({ name, sub, score, color }) => (
  <div className="flex items-center justify-between p-[10px_14px] border border-[rgba(60,60,120,0.10)] rounded-[8px]">
    <div>
      <div className="text-[13px] font-medium text-[#1a1a2e]">{name}</div>
      <div className="text-[11px] text-[#8888aa] mt-[2px]">{sub}</div>
    </div>
    <div className="text-right">
      <div className="text-[16px] font-medium text-[#1a1a2e] font-['Playfair_Display',serif]">{score}</div>
      <div className="text-[11px]" style={{ color }}>avg score</div>
      <div className="h-[4px] rounded-[2px] bg-[#f0f0f8] mt-[6px] w-[80px] overflow-hidden">
        <div className="h-full rounded-[2px]" style={{ width: score, background: color }}></div>
      </div>
    </div>
  </div>
);

const ExamResultsWidget = () => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[12px] p-[18px_20px]">
    <div className="text-[13px] font-medium text-[#1a1a2e] mb-[14px] flex items-center justify-between">
      Recent Exam Results <span className="text-[11px] text-[#3b5bdb] font-normal cursor-pointer">All results</span>
    </div>
    <div className="flex flex-col gap-[8px]">
      <ExamItem name="Mid-Term — Mathematics" sub="Class X · 38 students" score="78%" color="#0ca678" />
      <ExamItem name="Unit Test — Physics" sub="Class XI · 24 students" score="65%" color="#e8590c" />
      <ExamItem name="Quiz — English Literature" sub="Class IX · 41 students" score="82%" color="#0ca678" />
    </div>
  </div>
);

export default ExamResultsWidget;