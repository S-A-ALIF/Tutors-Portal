import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVerifyInvitation } from '../features/enrollment/hooks/invitationHooks';

const AcceptInvitationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const { mutateAsync: verifyInvitation, isPending } = useVerifyInvitation();

    const userRole = user?.data?.role || user?.role;
    const studentId = user?.data?.profile?.id || user?.profile?.id || user?.data?.id || user?.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || (userRole !== 'student' && userRole !== 'tutor')) {
            return;
        }

        try {
            const result = await verifyInvitation({
                code: code.trim(),
                user_id: studentId
            });
            
            // On success, redirect to the appropriate dashboard
            setTimeout(() => {
                if (userRole === 'tutor') {
                    navigate('/tutor-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            }, 1500);
        } catch (error) {
            console.error("Verification failed", error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">You need to log in to your account to accept an invitation.</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (userRole !== 'student' && userRole !== 'tutor') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600">Only students and tutors can accept enrollment invitations.</p>
                </div>
            </div>
        );
    }

    const themeColor = userRole === 'tutor' ? 'green' : 'purple';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center bg-${themeColor}-50 p-4`}>
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-${themeColor}-600 px-6 py-8 text-center`}>
                    <h1 className="text-3xl font-bold text-white mb-2">Accept Invitation</h1>
                    <p className={`text-${themeColor}-200`}>Enter the 6-digit code from your email</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                            Invitation Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            maxLength={6}
                            placeholder="XXXXXX"
                            required
                            className={`w-full text-center text-3xl tracking-widest font-mono border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 outline-none transition-all uppercase`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || code.length !== 6}
                        className={`w-full bg-${themeColor}-600 hover:bg-${themeColor}-700 disabled:bg-${themeColor}-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center`}
                    >
                        {isPending ? 'Verifying...' : 'Complete Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;
