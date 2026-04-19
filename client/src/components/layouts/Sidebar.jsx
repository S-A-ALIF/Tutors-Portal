import React from 'react';

const NavItem = ({ icon, label, active, count }) => (
  <div className={`flex items-center gap-[10px] p-[8px_12px] rounded-[8px] cursor-pointer text-[13.5px] transition-colors duration-150 ${active ? 'bg-[rgba(59,91,219,0.10)] text-[#3b5bdb] font-medium' : 'text-[#4a4a6a] font-normal hover:bg-[#f0f0f8] hover:text-[#1a1a2e]'}`}>
    <div className="w-[16px] h-[16px] shrink-0 opacity-80 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: icon }} />
    {label}
    {count && <div className="ml-auto text-[11px] bg-[#e8590c] text-white px-[7px] py-[1px] rounded-[10px] font-medium">{count}</div>}
  </div>
);

const Sidebar = () => {
  return (
    <div className="bg-white border-r border-[rgba(60,60,120,0.10)] p-[20px_12px] flex flex-col gap-[4px]">
      <NavItem active label="Dashboard" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`} />
      
      <div className="text-[10px] font-medium text-[#8888aa] tracking-[1.2px] uppercase p-[16px_12px_6px]">Academic</div>
      <NavItem label="Students" count="342" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`} />
      <NavItem label="Teachers" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`} />
      <NavItem label="Routines" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`} />
      <NavItem label="Examinations" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`} />
      
      <div className="text-[10px] font-medium text-[#8888aa] tracking-[1.2px] uppercase p-[16px_12px_6px]">Finance</div>
      <NavItem label="Fee Collection" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`} />
      <NavItem label="Payroll" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`} />
      
      <div className="text-[10px] font-medium text-[#8888aa] tracking-[1.2px] uppercase p-[16px_12px_6px]">System</div>
      <NavItem label="Settings" icon={`<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`} />
    </div>
  );
};

export default Sidebar;