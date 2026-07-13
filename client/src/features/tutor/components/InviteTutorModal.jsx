import React, { useState } from 'react';
import { useSendInvitation } from '../../enrollment/hooks/invitationHooks';

const InviteTutorModal = ({ instId, isOpen, onClose, onSuccess }) => {
    const { mutateAsync: sendInvitation, isPending, error } = useSendInvitation();
    
    const [formData, setFormData] = useState({
        email: '',
        expiry_option: '24h'
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                inst_id: instId,
                email: formData.email,
                role: 'tutor',
                expiry_option: formData.expiry_option
            };
            const response = await sendInvitation(payload);
            if (onSuccess) onSuccess(response);
            onClose();
        } catch (err) {
            console.error("Failed to send tutor invitation:", err);
        }
    };

    const errorMessage = error?.response?.data?.message || error?.message || null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Invite Tutor</h3>
                    <button 
                        onClick={onClose}
                        className="text-green-100 hover:text-white transition-colors focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    {errorMessage && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {errorMessage}
                        </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-6">
                        Send an invitation code to a tutor's email address. They will be able to join your institution upon entering the code.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tutor Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                                placeholder="tutor@example.com" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Expiry Time</label>
                            <select 
                                name="expiry_option" 
                                value={formData.expiry_option} 
                                onChange={handleInputChange} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white" 
                            >
                                <option value="10m">10 Minutes</option>
                                <option value="1h">1 Hour</option>
                                <option value="24h">24 Hours</option>
                                <option value="7d">7 Days</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isPending || !formData.email}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center"
                        >
                            {isPending ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteTutorModal;
