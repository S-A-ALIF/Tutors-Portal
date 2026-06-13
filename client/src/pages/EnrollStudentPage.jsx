import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnrollmentForm from '../features/enrollment/components/EnrollmentForm';
import { useAuth } from '../context/AuthContext';

const EnrollmentPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    console.log("DEBUG: Current User Data in EnrollmentPage:", user);

    // Safely fallback through possible nested states from your AuthContext
    const instId = user?.data?.inst_id || user?.inst_id || user?.data?.profile?.id;

    const handleSuccess = (data) => {
        alert("Student successfully enrolled!");
        // Navigate to the student list or profile page after successful enrollment
        navigate('/students'); 
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
            <div className="p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
                
                {/* Page Header replacing the Titlebar */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Register a new student and enroll them in the current academic year.
                    </p>
                </div>

                {/* 
                  Safety check: Do not render the form if inst_id isn't available yet.
                  This prevents submitting data with a null institution ID. 
                */}
                {!instId ? (
                    <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center min-h-[200px]">
                        Loading institution data...
                    </div>
                ) : (
                    <EnrollmentForm 
                        instId={instId} 
                        onSuccess={handleSuccess} 
                        onCancel={handleCancel}
                    />
                )}
                
            </div>
    );
};

export default EnrollmentPage;