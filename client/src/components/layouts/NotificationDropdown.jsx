import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePendingInvitations, useRejectInvitation } from '../../features/enrollment/hooks/invitationHooks';
import AcceptInvitationModal from '../../features/enrollment/components/AcceptInvitationModal';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const email = user?.email || user?.data?.user?.email || user?.data?.email;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data: invitations = [], isLoading } = usePendingInvitations(email);
    const { mutate: rejectInvitation, isPending: isRejecting } = useRejectInvitation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAcceptClick = (invitation) => {
        setSelectedInvitation(invitation);
        setIsAcceptModalOpen(true);
        setIsOpen(false);
    };

    const handleRejectClick = (invitation) => {
        if (window.confirm("Are you sure you want to reject this invitation?")) {
            rejectInvitation({ id: invitation.id, email: invitation.email });
        }
    };

    // If the user doesn't have an email or is admin, maybe we still show it but it'll be empty
    const unreadCount = invitations.length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Trigger */}
            <div 
                className="w-[34px] h-[34px] rounded-[8px] bg-[#f0f0f8] flex items-center justify-center cursor-pointer border border-[rgba(60,60,120,0.10)] relative hover:bg-[#e4e4f0] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <div className="w-[18px] h-[18px] bg-[#e8590c] rounded-full absolute -top-1 -right-1 border-[1.5px] border-white flex items-center justify-center text-[10px] font-bold text-white">
                        {unreadCount}
                    </div>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs font-medium bg-[#e8590c] text-white px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Loading notifications...</div>
                        ) : invitations.length === 0 ? (
                            <div className="p-6 text-center">
                                <div className="text-gray-300 mb-2 flex justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {invitations.map((inv) => (
                                    <li key={inv.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800 leading-snug">
                                                    You have been invited to join <span className="font-semibold text-gray-900">{inv.institution_name}</span> as a <span className="capitalize font-medium">{inv.role}</span>.
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 mb-3">
                                                    Expires: {new Date(inv.expires_at).toLocaleDateString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleAcceptClick(inv)}
                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRejectClick(inv)}
                                                        disabled={isRejecting}
                                                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <AcceptInvitationModal 
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                invitation={selectedInvitation}
            />
        </div>
    );
};

export default NotificationDropdown;
