import React from 'react';

const Badge = ({ status, children }) => {
  const styles = {
    paid: 'bg-[rgba(12,166,120,0.12)] text-[#0ca678]',
    due: 'bg-[rgba(232,89,12,0.12)] text-[#e8590c]',
    partial: 'bg-[rgba(59,91,219,0.10)] text-[#3b5bdb]',
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-[8px] py-[2px] rounded-[10px] ${styles[status]}`}>
      {children}
    </span>
  );
};

export default Badge;