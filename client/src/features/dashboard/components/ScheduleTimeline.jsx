import React from 'react';

const ScheduleItem = ({ time, color, name, sub, room }) => (
  <div className="flex items-center gap-[12px] p-[10px_12px] bg-[#f0f0f8] rounded-[8px]">
    <div className="text-[11px] font-medium text-[#8888aa] min-w-[52px]">{time}</div>
    <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: color }}></div>
    <div className="flex-1">
      <div className="text-[13px] font-medium text-[#1a1a2e] leading-[1.2]">{name}</div>
      <div className="text-[11px] text-[#8888aa]">{sub}</div>
    </div>
    <div className="text-[11px] font-medium px-[8px] py-[2px] rounded-[6px] bg-[rgba(59,91,219,0.08)] text-[#3b5bdb]">{room}</div>
  </div>
);

const ScheduleTimeline = () => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[12px] p-[18px_20px]">
    <div className="text-[13px] font-medium text-[#1a1a2e] mb-[14px] flex items-center justify-between">
      Today's Schedule <span className="text-[11px] text-[#3b5bdb] font-normal cursor-pointer">Full timetable</span>
    </div>
    <div className="flex flex-col gap-[8px]">
      <ScheduleItem time="8:00 AM" color="#3b5bdb" name="Mathematics – Class X" sub="Mr. Karim Hossain" room="R-101" />
      <ScheduleItem time="9:30 AM" color="#0ca678" name="Physics – Class XI" sub="Ms. Ritu Akter" room="R-204" />
      <ScheduleItem time="11:00 AM" color="#e8590c" name="English – Class IX" sub="Mr. Rahim Chowdhury" room="R-102" />
      <ScheduleItem time="2:00 PM" color="#9c36b5" name="Chemistry – Class XII" sub="Ms. Nadia Parvin" room="Lab-1" />
    </div>
  </div>
);

export default ScheduleTimeline;