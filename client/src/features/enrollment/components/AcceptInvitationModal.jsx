import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useVerifyInvitation } from '../hooks/invitationHooks';

const AcceptInvitationModal = ({ isOpen, onClose, invitation }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const { mutateAsync: verifyInvitation, isPending, error } = useVerifyInvitation();

    if (!isOpen) return null;

    const userRole = user?.data?.role || user?.role;
    const userId = user?.data?.profile?.id || user?.profile?.id || user?.data?.id || user?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyInvitation({
                code: code.trim(),
                user_id: userId
            });
            
            // Redirect after successful verification
            onClose();
            if (userRole === 'tutor') {
                navigate('/tutor-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            console.error("Verification failed", err);
        }
    };

    const errorMessage = error?.response?.data?.message || error?.message || null;
    const themeColor = userRole === 'tutor' ? 'green' : 'purple';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className={`bg-${themeColor}-600 px-6 py-4 flex justify-between items-center`}>
                    <h3 className="text-xl font-bold text-white">Accept Invitation</h3>
                    <button 
                        onClick={onClose}
                        className={`text-${themeColor}-100 hover:text-white transition-colors focus:outline-none`}
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
                    
                    {invitation && (
                        <p className="text-sm text-gray-600 mb-6">
                            You are accepting an invitation from <strong>{invitation.institution_name}</strong>.
                            Please enter the 6-digit code sent to your email to verify.
                        </p>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                                6-Digit Code
                            </label>
                            <input 
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                required 
                                className={`w-full text-center text-3xl tracking-widest font-mono border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 outline-none transition-all uppercase`}
                                placeholder="XXXXXX" 
                            />
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
                            disabled={isPending || code.length !== 6}
                            className={`flex-1 bg-${themeColor}-600 hover:bg-${themeColor}-700 disabled:bg-${themeColor}-400 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center`}
                        >
                            {isPending ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvitationModal;
