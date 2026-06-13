import React, { useState } from 'react';
import { useEnrollStudent } from '../hooks/enrollmentHooks';
import FormInputField from '../../../components/form/FormInputField';

const EnrollmentForm = ({ instId, onCancel, onSuccess }) => {
    const { mutateAsync: enrollStudent, isPending: isSubmitting, error } = useEnrollStudent();

    // Default academic year based on current year
    const currentYear = new Date().getFullYear();
    const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        guardian_name: '',
        guardian_phone: '',
        academic_year: defaultAcademicYear,
        grade: '',
        section: '',
        roll_no: '',
        monthly_fee: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                inst_id: instId
            };
            
            const responseData = await enrollStudent(payload);
            console.log("DEBUG: Student Successfully Enrolled:", responseData);

            if (onSuccess) onSuccess(responseData);
        } catch (err) {
            console.error("Enrollment submission failed:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-purple-800">
                    New Student Enrollment
                </h3>
            </div>
            
            <div className="p-6 space-y-6">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
                        {error?.response?.data?.message || "An error occurred during enrollment."}
                    </div>
                )}

                {/* Personal Information Section */}
                <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-1">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInputField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required placeholder="First Name" />
                        <FormInputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} required placeholder="Last Name" />
                        <FormInputField label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="student@example.com" />
                        <FormInputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required placeholder="+1 234 567 890" />
                        <FormInputField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleInputChange} required />
                        <FormInputField label="Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} required placeholder="Guardian Full Name" />
                        <FormInputField label="Guardian Phone" name="guardian_phone" value={formData.guardian_phone} onChange={handleInputChange} required placeholder="+1 987 654 321" />
                    </div>
                </div>

                {/* Academic Information Section */}
                <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-1 mt-2">Academic Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInputField label="Academic Year" name="academic_year" value={formData.academic_year} onChange={handleInputChange} required placeholder="2023-2024" />
                        <FormInputField label="Grade/Class" name="grade" value={formData.grade} onChange={handleInputChange} required placeholder="10th Grade" />
                        <FormInputField label="Section (Optional)" name="section" value={formData.section} onChange={handleInputChange} placeholder="A" />
                        <FormInputField label="Roll Number (Optional)" name="roll_no" value={formData.roll_no} onChange={handleInputChange} placeholder="101" />
                        <FormInputField label="Monthly Fee (Optional)" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={handleInputChange} placeholder="0.00" />
                    </div>
                </div>

                <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EnrollmentForm;