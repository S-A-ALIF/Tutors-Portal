import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePendingInvitations, useRejectInvitation } from '../../features/enrollment/hooks/invitationHooks';
import AcceptInvitationModal from '../../features/enrollment/components/AcceptInvitationModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { Bell, MailOpen } from 'lucide-react';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const email = user?.email || user?.data?.user?.email || user?.data?.email;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch Invitations
    const { data: invitations = [], isLoading: loadingInvitations } = usePendingInvitations(email);
    const { mutate: rejectInvitation, isPending: isRejecting } = useRejectInvitation();

    // Mutation to mark general notifications as read
    const markAsReadMutation = useMutation({
        mutationFn: async (id) => {
            return apiClient.patch(`/send-emails/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generalNotifications', email] });
        }
    });

    // Fetch General Announcements from our new backend table
    const { data: announcementsData, isLoading: loadingAnnouncements } = useQuery({
        queryKey: ['generalNotifications', email],
        queryFn: async () => {
            if (!email) return [];
            const response = await apiClient.get(`/send-emails/notifications?email=${encodeURIComponent(email)}`);
            return response.data.data || [];
        },
        enabled: !!email
    });
    
    const announcements = announcementsData || [];

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

    const unreadAnnouncements = announcements.filter(a => !a.is_read).length;
    const unreadCount = invitations.length + unreadAnnouncements;
    const isLoading = loadingInvitations || loadingAnnouncements;
    const hasNoNotifications = invitations.length === 0 && announcements.length === 0;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Trigger */}
            <div 
                className="w-[34px] h-[34px] rounded-[8px] bg-[#f0f0f8] flex items-center justify-center cursor-pointer border border-[rgba(60,60,120,0.10)] relative hover:bg-[#e4e4f0] transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-[18px] h-[18px] text-gray-700" />
                {unreadCount > 0 && (
                    <div className="w-[18px] h-[18px] bg-[#e8590c] rounded-full absolute -top-1 -right-1 border-[1.5px] border-white flex items-center justify-center text-[10px] font-bold text-white">
                        {unreadCount}
                    </div>
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
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
                            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                        ) : hasNoNotifications ? (
                            <div className="p-6 text-center">
                                <div className="text-gray-300 mb-2 flex justify-center">
                                    <Bell className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="text-sm text-gray-500">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                
                                {/* Render Invitations First */}
                                {invitations.map((inv) => (
                                    <li key={inv.id} className="p-4 bg-blue-50/30 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <MailOpen className="w-4 h-4" />
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

                                {/* Render General Announcements */}
                                {announcements.map((ann) => (
                                    <li 
                                        key={ann.id} 
                                        onClick={() => {
                                            if (!ann.is_read) {
                                                markAsReadMutation.mutate(ann.id);
                                            }
                                        }}
                                        className={`p-4 transition-colors ${!ann.is_read ? 'bg-indigo-50/20 hover:bg-gray-50 cursor-pointer' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 leading-snug">
                                                    {ann.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(ann.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!ann.is_read && (
                                                <div className="w-2 h-2 rounded-full bg-[#e8590c] mt-1.5 flex-shrink-0"></div>
                                            )}
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
