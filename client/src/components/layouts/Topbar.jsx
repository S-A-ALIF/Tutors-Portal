import React from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { user } = useAuth();
  
  const role = user?.role || user?.data?.role;
  const profile = user?.profile || user?.data?.profile;
  
  // Assuming 'name' exists on the institution profile (Admin)
  // For students and tutors, the backend joins the institution and aliases it as 'institution_name'
  const institutionName = role === 'admin' ? profile?.name : profile?.institution_name;

  return (
    <div className="col-[1/-1] flex items-center justify-between px-[28px] h-[60px] bg-white border-b border-[rgba(60,60,120,0.10)] sticky top-0 z-10">
      <div className="font-['Playfair_Display',serif] text-[18px] font-semibold text-[#1a1a2e] tracking-[-0.3px] flex items-center gap-[10px]">
        <div className="w-[32px] h-[32px] bg-[#3b5bdb] rounded-[8px] flex items-center justify-center">
          <svg viewBox="0 0 18 18" className="w-[18px] h-[18px] fill-none stroke-white stroke-[2px]" strokeLinecap="round">
            <rect x="2" y="2" width="6" height="6" rx="1.5" /><rect x="10" y="2" width="6" height="6" rx="1.5" /><rect x="2" y="10" width="6" height="6" rx="1.5" /><rect x="10" y="10" width="6" height="6" rx="1.5" />
          </svg>
        </div>
        Tutor's Portal
      </div>
      <div className="flex items-center gap-[16px]">
        {institutionName && (
            <div className="text-[12px] font-medium text-[#3b5bdb] bg-[rgba(59,91,219,0.09)] px-[12px] py-[4px] rounded-[20px]">
              {institutionName}
            </div>
        )}
        
        <NotificationDropdown />

        {/* Profile Link */}
        <Link 
            to="/profile" 
            className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#3b5bdb] to-[#9c36b5] flex items-center justify-center text-[12px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
        >
          profile
        </Link>
      </div>
    </div>
  );
};

export default Topbar;