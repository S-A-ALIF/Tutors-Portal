import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { InstitutionProfileForm } from '../features/institution'; 
import { TutorProfileForm } from '../features/tutor'; 
import { StudentProfileForm } from '../features/student';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    
    // Safely extract user_info (handles both Axios wrapper and raw object)
    const user_info = user?.data || user;

    // State to toggle the Create/Edit Profile Form visibility
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // DEBUG: This will print the exact structure of your user_info object to the console
    useEffect(() => {
        if (!loading) {
            console.log("DEBUG: Full User_info Object from AuthContext:", user_info);
            if (!user_info) {
                console.warn("DEBUG: User_info object is null or undefined!");
            } else {
                console.log("DEBUG: User_info Role found:", user_info.role);
            }
        }
    }, [user, loading, user_info]);

    // Handle loading state strictly to prevent premature rendering
    if (loading) {
        return <div className="p-10 text-center text-xl text-gray-600">Authenticating...</div>;
    }

    // If no user_info exists after loading, redirect or show error
    if (!user_info) {
        return <div className="p-10 text-center text-xl text-red-500">No user data found. Please login.</div>;
    }

    // Extract role securely
    const role = user_info.role || 'no-role-found';
    
    // The profile data for the current role
    const profileData = user_info.profile; 

    // Helper to safely format dates if needed for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    const InfoRow = ({ label, value }) => {
        let displayValue = value;
        if (typeof value === 'boolean') displayValue = value ? 'Yes' : 'No';
        if (Array.isArray(value)) displayValue = value.join(', ');
        if (value === null || value === undefined || value === '') displayValue = 'N/A';

        return (
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 font-medium text-sm w-1/3">{label}</span>
                <span className="text-gray-900 text-sm text-right font-medium w-2/3 break-words capitalize">
                    {displayValue}
                </span>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>
                <p className="text-gray-500 mt-1 capitalize">Logged in as: <strong>{role}</strong></p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* ================= ADMIN SECTIONS ================= */}
                {role === 'admin' && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-blue-800">Admin User Info</h2>
                            </div>
                            <div className="p-6">
                                <InfoRow label="User ID" value={user_info.id} />
                                <InfoRow label="Email" value={user_info.email} />
                                <InfoRow label="Role" value={user_info.role} />
                                <InfoRow label="Created At" value={formatDate(user_info.createdAt || user_info.created_at)} />
                            </div>
                        </div>

                        {profileData && !isEditingProfile ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-blue-800">Institution Details</h2>
                                    <button 
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="p-6">
                                    <InfoRow label="Name" value={profileData.name} />
                                    <InfoRow label="Email" value={profileData.email} />
                                    <InfoRow label="Phone" value={profileData.phone_number} />
                                    <InfoRow label="Address" value={profileData.address} />
                                    <InfoRow label="Status" value={profileData.is_active} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                {!profileData && !isEditingProfile ? (
                                    <>
                                        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                            <h2 className="text-lg font-semibold text-blue-800">Institution Details</h2>
                                        </div>
                                        <div className="p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                            <div className="text-center">
                                                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-full inline-block mb-4">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Incomplete</h3>
                                                <p className="text-gray-500 mb-6 max-w-sm">Your admin account requires an associated institution profile to unlock full platform features.</p>
                                                <button 
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Create Profile Now
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <InstitutionProfileForm 
                                        userId={user_info.id}
                                        userEmail={user_info.email}
                                        userRole={user_info.role}
                                        initialData={profileData} 
                                        onCancel={() => setIsEditingProfile(false)} 
                                        onSuccess={() => setIsEditingProfile(false)} 
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ================= TUTOR SECTIONS ================= */}
                {(role === 'tutor') && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-green-800">Tutor User Info</h2>
                            </div>
                            <div className="p-6">
                                <InfoRow label="User ID" value={user_info.id} />
                                <InfoRow label="Email" value={user_info.email} />
                                <InfoRow label="Role" value={user_info.role} />
                                <InfoRow label="Created At" value={formatDate(user_info.createdAt || user_info.created_at)} />
                            </div>
                        </div>

                        {profileData && !isEditingProfile ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                <div className="bg-green-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-green-800">Tutor Details</h2>
                                    <button 
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="p-6">
                                    <InfoRow label="First Name" value={profileData.first_name} />
                                    <InfoRow label="Last Name" value={profileData.last_name} />
                                    <InfoRow label="Phone" value={profileData.phone_number} />
                                    <InfoRow label="Subjects" value={profileData.subjects} />
                                    <InfoRow label="Bio" value={profileData.bio} />
                                    <InfoRow label="Status" value={profileData.is_active} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                {!profileData && !isEditingProfile ? (
                                    <>
                                        <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                                            <h2 className="text-lg font-semibold text-green-800">Tutor Details</h2>
                                        </div>
                                        <div className="p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                            <div className="text-center">
                                                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-full inline-block mb-4">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Incomplete</h3>
                                                <p className="text-gray-500 mb-6 max-w-sm">Please set up your tutor profile to start connecting with students.</p>
                                                <button 
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Create Profile Now
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <TutorProfileForm 
                                        userId={user_info.id}
                                        userRole={user_info.role}
                                        userEmail={user_info.email}
                                        initialData={profileData} 
                                        onCancel={() => setIsEditingProfile(false)} 
                                        onSuccess={() => setIsEditingProfile(false)} 
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ================= STUDENT SECTIONS ================= */}
                {role === 'student' && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-purple-800">Student User Info</h2>
                            </div>
                            <div className="p-6">
                                <InfoRow label="User ID" value={user_info.id} />
                                <InfoRow label="Email" value={user_info.email} />
                                <InfoRow label="Role" value={user_info.role} />
                                <InfoRow label="Created At" value={formatDate(user_info.createdAt || user_info.created_at)} />
                            </div>
                        </div>

                        {profileData && !isEditingProfile ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                <div className="bg-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-purple-800">Student Details</h2>
                                    <button 
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="p-6">
                                    <InfoRow label="First Name" value={profileData.first_name} />
                                    <InfoRow label="Last Name" value={profileData.last_name} />
                                    <InfoRow label="Gender" value={profileData.gender} />
                                    <InfoRow label="Phone" value={profileData.phone_number} />
                                    <InfoRow label="Date of Birth" value={formatDate(profileData.date_of_birth)} />
                                    <InfoRow label="Address" value={profileData.address} />
                                    <InfoRow label="Guardian Name" value={profileData.guardian_name} />
                                    <InfoRow label="Guardian Phone" value={profileData.guardian_phone} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                                {!profileData && !isEditingProfile ? (
                                    <>
                                        <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                                            <h2 className="text-lg font-semibold text-purple-800">Student Details</h2>
                                        </div>
                                        <div className="p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                            <div className="text-center">
                                                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-full inline-block mb-4">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Incomplete</h3>
                                                <p className="text-gray-500 mb-6 max-w-sm">Please set up your student profile to start finding tutors.</p>
                                                <button 
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Create Profile Now
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <StudentProfileForm 
                                        userId={user_info.id}
                                        userEmail={user_info.email}
                                        initialData={profileData} 
                                        onCancel={() => setIsEditingProfile(false)} 
                                        onSuccess={() => setIsEditingProfile(false)} 
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;