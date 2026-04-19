import React from 'react';

const ActionButton = ({ bg, stroke, label, path }) => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[10px] p-[12px] text-center cursor-pointer transition-all duration-150 hover:shadow-[0_2px_16px_rgba(40,40,100,0.08)] hover:-translate-y-[1px]">
    <div className="w-[32px] h-[32px] rounded-[8px] mx-auto mb-[8px] flex items-center justify-center" style={{ background: bg }}>
      <svg width="16" height="16" fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: path }} />
    </div>
    <div className="text-[11.5px] font-medium text-[#4a4a6a]">{label} ↗</div>
  </div>
);

const QuickActionsSection = () => (
  <div className="grid grid-cols-4 gap-[10px] mb-[14px]">
    <ActionButton bg="rgba(59,91,219,0.1)" stroke="#3b5bdb" label="Enroll Student" path='<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>' />
    <ActionButton bg="rgba(12,166,120,0.1)" stroke="#0ca678" label="New Class" path='<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' />
    <ActionButton bg="rgba(232,89,12,0.1)" stroke="#e8590c" label="Record Payment" path='<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>' />
    <ActionButton bg="rgba(156,54,181,0.1)" stroke="#9c36b5" label="Create Exam" path='<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' />
  </div>
);

export default QuickActionsSection;