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

    // Unified profile variable mapping
    let name = 'Profile Incomplete';
    let bio = 'Please complete your profile details.';
    let stats = [];

    if (profileData) {
        if (role === 'admin') {
            name = profileData.name || 'Institution Name';
            bio = profileData.address || 'No address provided.';
            stats = [
                { label: 'Email', value: profileData.email },
                { label: 'Phone', value: profileData.phone_number },
                { label: 'Status', value: profileData.is_active !== false ? 'Active' : 'Inactive' }
            ];
        } else if (role === 'tutor') {
            name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
            bio = profileData.bio || 'Tutor at Tutors Portal';
            stats = [
                { label: 'Email', value: user_info.email },
                { label: 'Phone', value: profileData.phone_number },
                { label: 'Subjects', value: Array.isArray(profileData.subjects) ? profileData.subjects.join(', ') : profileData.subjects },
                { label: 'Status', value: profileData.is_active !== false ? 'Active' : 'Inactive' }
            ];
        } else if (role === 'student') {
            name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
            bio = profileData.address || 'Student at Tutors Portal';
            stats = [
                { label: 'Email', value: user_info.email },
                { label: 'Phone', value: profileData.phone_number },
                { label: 'Gender', value: profileData.gender },
                { label: 'DOB', value: formatDate(profileData.date_of_birth) },
                { label: 'Guardian', value: profileData.guardian_name },
                { label: 'Emergency Contact', value: profileData.guardian_phone }
            ];
        }
    }

    // The form rendering function
    const renderForm = () => {
        if (role === 'admin') {
            return (
                <InstitutionProfileForm 
                    userId={user_info.id}
                    userEmail={user_info.email}
                    userRole={user_info.role}
                    initialData={profileData} 
                    onCancel={() => setIsEditingProfile(false)} 
                    onSuccess={() => setIsEditingProfile(false)} 
                />
            );
        }
        if (role === 'tutor') {
            return (
                <TutorProfileForm 
                    userId={user_info.id}
                    userRole={user_info.role}
                    userEmail={user_info.email}
                    initialData={profileData} 
                    onCancel={() => setIsEditingProfile(false)} 
                    onSuccess={() => setIsEditingProfile(false)} 
                />
            );
        }
        if (role === 'student') {
            return (
                <StudentProfileForm 
                    userId={user_info.id}
                    userEmail={user_info.email}
                    initialData={profileData} 
                    onCancel={() => setIsEditingProfile(false)} 
                    onSuccess={() => setIsEditingProfile(false)} 
                />
            );
        }
        return <p>Unknown role for form rendering.</p>;
    };

    return (
        <div className="p-6 max-w-5xl mx-auto pb-20">
            {isEditingProfile ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
                        <button 
                            onClick={() => setIsEditingProfile(false)}
                            className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    {renderForm()}
                </div>
            ) : !profileData ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-full inline-block mb-6 shadow-sm">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Incomplete</h3>
                    <p className="text-gray-500 mb-8 max-w-md text-lg">Please set up your profile to start using all features of the platform.</p>
                    <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-gray-900 hover:bg-black text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md text-lg"
                    >
                        Create Profile Now
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative pb-12">
                    {/* Cover Photo */}
                    <div className="h-48 md:h-72 w-full bg-blue-100">
                        <img 
                            src="https://images.unsplash.com/photo-1506744626753-1fa44df31c2f?auto=format&fit=crop&q=80&w=2000" 
                            alt="Cover" 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Edit Button */}
                    <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 backdrop-blur-md text-sm font-semibold py-2 px-5 rounded-full shadow-md transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Edit Profile
                    </button>

                    {/* Avatar */}
                    <div className="flex justify-center -mt-24">
                        <img 
                            src={role === 'admin' 
                                ? "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300&h=300"
                                : role === 'tutor' 
                                ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300"
                                : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300"
                            }
                            alt="Avatar" 
                            className="w-48 h-48 rounded-full border-4 border-white object-cover shadow-lg bg-white" 
                        />
                    </div>

                    {/* Text Center */}
                    <div className="text-center mt-5 px-6">
                        <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
                        <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base leading-relaxed">{bio}</p>
                        <p className="font-bold text-gray-900 mt-5 uppercase tracking-wide text-sm">Role: {role}</p>
                    </div>

                    {/* Stats Grid - Just like the reference picture */}
                    <div className="max-w-xl mx-auto mt-10 px-6">
                        <div className="flex flex-col space-y-5">
                            {stats.map((s, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-gray-900 font-bold sm:w-1/3 text-lg">{s.label}:</span>
                                    <span className="text-gray-700 sm:w-2/3 text-lg">{s.value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Optional Caption Section like in picture */}
                    <div className="max-w-2xl mx-auto mt-12 px-6 text-center space-y-4">
                        <p className="text-gray-600 italic">"Empowering education, one step at a time."</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;