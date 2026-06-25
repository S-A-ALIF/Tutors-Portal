import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const profile = user?.profile;

    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-4xl p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Student Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    Welcome to the student portal.
                </p>

                {profile?.institution_name ? (
                    <div className="bg-purple-50 text-purple-800 p-6 rounded-lg border border-purple-100 mt-4 text-left">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            My Institution
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-purple-600 font-medium mb-1">Institution</p>
                                <p className="font-semibold text-lg">{profile.institution_name}</p>
                            </div>
                            <div>
                                <p className="text-purple-600 font-medium mb-1">Grade Level</p>
                                <p className="font-semibold text-lg">{profile.grade || 'Not Assigned'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-orange-50 text-orange-800 p-6 rounded-lg border border-orange-100 mt-4">
                        <p className="font-medium flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            You are not enrolled in any institution yet.
                        </p>
                        <p className="text-sm mt-2">Wait for an invitation from your institution admin to appear in your notification bell.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;