import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, User, Calendar, BookOpen, CreditCard, DollarSign, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudents } from '../../features/student/hooks/studentHooks';
import { useTutors } from '../../features/tutor/hooks/tutorHooks';

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
    {count !== undefined && count !== null && count !== 0 && (
      <span className="ml-auto text-[11px] bg-[#e8590c] text-white px-2 py-0.5 rounded-full font-medium">
        {count}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  const { user } = useAuth();
  
  // Fetch data to get counts
  const { data: studentsData } = useStudents();
  const { data: tutorsData } = useTutors();

  const studentsCount = Array.isArray(studentsData) ? studentsData.length : (studentsData?.data || studentsData?.students || []).length;
  const tutorsCount = Array.isArray(tutorsData) ? tutorsData.length : (tutorsData?.data || tutorsData?.tutors || []).length;
  
  const userRole = user?.data?.role || user?.role || 'admin';
  
  let dashboardPath = '/dashboard';
  if (userRole === 'tutor') dashboardPath = '/tutor-dashboard';
  if (userRole === 'student') dashboardPath = '/student-dashboard';

  return (
    <div className="bg-white border-r border-[rgba(60,60,120,0.10)] p-5 flex flex-col gap-1 h-full">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-[#3b5bdb]">Tutors Portal</h1>
      </div>

      <NavItem path={dashboardPath} label="Dashboard" icon={LayoutDashboard} />
      
      <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
        Academic
      </div>
      
      {/* Admin Specific */}
      {userRole === 'admin' && (
        <>
          <NavItem path="/students" label="Students" count={studentsCount} icon={Users} />
          <NavItem path="/tutors" label="Tutors" count={tutorsCount} icon={User} />
          <NavItem path="/classes" label="Classes" icon={BookOpen} />
        </>
      )}

      {/* Shared Academic */}
      <NavItem path="/routines" label="Routines" icon={Calendar} />
      <NavItem path="/examinations" label="Examinations" icon={BookOpen} />
      
      {/* Finance Section */}
      {userRole !== 'tutor' && (
        <>
          <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
            Finance
          </div>
          
          {userRole === 'admin' && (
            <>
              <NavItem path="/fee-collection" label="Fee Collection" icon={CreditCard} />
              <NavItem path="/payroll" label="Payroll" icon={DollarSign} />
            </>
          )}

          {userRole === 'student' && (
            <NavItem path="/my-fees" label="Fees & Payments" icon={CreditCard} />
          )}
        </>
      )}
      
      <div className="text-[10px] font-semibold text-[#8888aa] tracking-[1.2px] uppercase mt-4 mb-1 px-4">
        System
      </div>
      <NavItem path="/settings" label="Settings" icon={Settings} />
    </div>
  );
};

export default Sidebar;