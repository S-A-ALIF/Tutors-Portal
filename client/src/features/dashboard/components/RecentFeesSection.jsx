import React from 'react';
import Badge from '../../../components/ui/Badge';

const RecentFeesSection = () => (
  <div className="bg-white border border-[rgba(60,60,120,0.10)] rounded-[12px] p-[18px_20px]">
    <div className="text-[13px] font-medium text-[#1a1a2e] mb-[14px] flex items-center justify-between">
      Recent Fee Transactions <span className="text-[11px] text-[#3b5bdb] font-normal cursor-pointer">View all</span>
    </div>
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr>
          <th className="text-left text-[11px] text-[#8888aa] font-medium tracking-[0.4px] uppercase pb-[10px] border-b border-[rgba(60,60,120,0.10)]">Student</th>
          <th className="text-left text-[11px] text-[#8888aa] font-medium tracking-[0.4px] uppercase pb-[10px] border-b border-[rgba(60,60,120,0.10)]">Class</th>
          <th className="text-left text-[11px] text-[#8888aa] font-medium tracking-[0.4px] uppercase pb-[10px] border-b border-[rgba(60,60,120,0.10)]">Amount</th>
          <th className="text-left text-[11px] text-[#8888aa] font-medium tracking-[0.4px] uppercase pb-[10px] border-b border-[rgba(60,60,120,0.10)]">Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'Arifa Begum', class: 'Class X – Science', amount: '৳3,200', status: 'paid', label: 'Paid' },
          { name: 'Mahfuz Alam', class: 'Class IX – Commerce', amount: '৳2,800', status: 'partial', label: 'Partial' },
          { name: 'Tasnim Hossain', class: 'Class VIII', amount: '৳2,500', status: 'paid', label: 'Paid' },
          { name: 'Rafiq Uddin', class: 'Class XI – Sci', amount: '৳3,500', status: 'due', label: 'Due' },
          { name: 'Sadia Islam', class: 'Class VII', amount: '৳2,200', status: 'paid', label: 'Paid' },
        ].map((r, i) => (
          <tr key={i}>
            <td className="py-[9px] border-b border-[rgba(60,60,120,0.10)] text-[#4a4a6a] align-middle">{r.name}</td>
            <td className="py-[9px] border-b border-[rgba(60,60,120,0.10)] text-[#4a4a6a] align-middle">{r.class}</td>
            <td className="py-[9px] border-b border-[rgba(60,60,120,0.10)] text-[#4a4a6a] align-middle">{r.amount}</td>
            <td className="py-[9px] border-b border-[rgba(60,60,120,0.10)] text-[#4a4a6a] align-middle"><Badge status={r.status}>{r.label}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentFeesSection;