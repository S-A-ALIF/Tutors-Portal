import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, Calendar, BookOpen, CreditCard, DollarSign, Settings } from 'lucide-react';

const NavItem = ({ icon: Icon, label, path, count }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
        isActive 
          ? 'bg-[rgba(59,91,219,0.10)] text-[#3b5bdb] font-medium' 
          : 'text-[#4a4a6a] font-normal hover:bg-[#f0f0f8] hover:text-[#1a1a2e]'
      }`
    }
  >
    <Icon size={18} className="shrink-0 opacity-80" />
    <span>{label}</span>
    {count && (
      <span className="ml-auto text-[11px] bg-[#e8590c] text-white px-2 py-0.5 rounded-full font-medium">
        {count}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  return (
    <div className="bg-white border-r border-[rgba(60,60,120,0.10)] p-5 flex flex-col gap-1 h-full">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-[#3b5bdb]">Tutors Portal</h1>
      </div>

      <NavItem path="/dashboard" label="Dashboard" icon={LayoutDashboard} />
      
      <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
        Academic
      </div>
      <NavItem path="/students" label="Students" count="342" icon={Users} />
      <NavItem path="/tutors" label="Tutors" icon={User} />
      <NavItem path="/routines" label="Routines" icon={Calendar} />
      <NavItem path="/examinations" label="Examinations" icon={BookOpen} />
      
      <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
        Finance
      </div>
      <NavItem path="/fee-collection" label="Fee Collection" icon={CreditCard} />
      <NavItem path="/payroll" label="Payroll" icon={DollarSign} />
      
      <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
        System
      </div>
      <NavItem path="/settings" label="Settings" icon={Settings} />
    </div>
  );
};

export default Sidebar;