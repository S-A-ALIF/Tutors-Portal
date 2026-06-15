import React, { useState } from 'react';
import { useEnrollStudent } from '../hooks/enrollmentHooks';
import { useSendInvitation } from '../hooks/invitationHooks';
import FormInputField from '../../../components/form/FormInputField';

const EnrollmentForm = ({ instId, onCancel, onSuccess }) => {
    const { mutateAsync: enrollStudent, isPending: isEnrolling, error: enrollError } = useEnrollStudent();
    const { mutateAsync: sendInvitation, isPending: isInviting, error: inviteError } = useSendInvitation();

    const [isInviteMode, setIsInviteMode] = useState(true);

    // Default academic year based on current year
    const currentYear = new Date().getFullYear();
    const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        gender: '',
        address: '',
        date_of_birth: '',
        guardian_name: '',
        guardian_phone: '',
        academic_year: defaultAcademicYear,
        grade: '',
        section: '',
        roll_no: '',
        monthly_fee: '',
        expiry_option: '24h'
    });

    const isSubmitting = isEnrolling || isInviting;
    const activeError = isInviteMode ? inviteError : enrollError;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMode = () => {
        setIsInviteMode(!isInviteMode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isInviteMode) {
                const payload = {
                    inst_id: instId,
                    email: formData.email,
                    academic_year: formData.academic_year,
                    grade: formData.grade,
                    section: formData.section,
                    expiry_option: formData.expiry_option
                };
                const responseData = await sendInvitation(payload);
                if (onSuccess) onSuccess(responseData);
            } else {
                const payload = {
                    ...formData,
                    inst_id: instId
                };
                const responseData = await enrollStudent(payload);
                if (onSuccess) onSuccess(responseData);
            }
        } catch (err) {
            console.error("Submission failed:", err.response?.data || err);
        }
    };

    // Zod-Specific Error Parser
    const getErrorMessage = () => {
        if (!activeError) return null;
        const responseData = activeError.response?.data;
        if (responseData?.errors) {
            if (Array.isArray(responseData.errors)) {
                return responseData.errors.map(err => {
                    const fieldName = err.path ? err.path[err.path.length - 1] : 'Field';
                    return `[${fieldName.toUpperCase()}] ${err.message || err.msg}`;
                }).join(' | ');
            }
            if (typeof responseData.errors === 'object') {
                return Object.entries(responseData.errors)
                    .map(([key, value]) => {
                        const valStr = Array.isArray(value) ? value.join(', ') : JSON.stringify(value);
                        return `${key.toUpperCase()}: ${valStr}`;
                    }).join(' | ');
            }
        }
        return responseData?.message || responseData?.error || activeError.message || "An error occurred.";
    };

    const errorMessage = getErrorMessage();

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-purple-800">
                    {isInviteMode ? 'Offer Admission via Email' : 'New Student Enrollment'}
                </h3>
                <button 
                    type="button" 
                    onClick={toggleMode}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium underline"
                >
                    {isInviteMode ? 'Create New Profile Instead' : 'Invite via Email Instead'}
                </button>
            </div>
            
            <div className="p-6 space-y-6">
                {errorMessage && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                        <strong>Submission Failed: </strong> {errorMessage}
                    </div>
                )}

                {/* Email Section - Used for Invitation */}
                {isInviteMode && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-1">Invitation Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInputField 
                                label="Student Email" 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                required={isInviteMode} 
                                placeholder="student@example.com" 
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Expiry Time</label>
                                <select 
                                    name="expiry_option" 
                                    value={formData.expiry_option} 
                                    onChange={handleInputChange} 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white" 
                                >
                                    <option value="10m">10 Minutes</option>
                                    <option value="1h">1 Hour</option>
                                    <option value="24h">24 Hours</option>
                                    <option value="7d">7 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Information Section - Only visible in Create Profile mode */}
                {!isInviteMode && (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-1">Personal Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInputField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} required={!isInviteMode} placeholder="First Name" />
                            <FormInputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} required={!isInviteMode} placeholder="Last Name" />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select 
                                    name="gender" 
                                    required={!isInviteMode}
                                    value={formData.gender} 
                                    onChange={handleInputChange} 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white" 
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <FormInputField label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="student@example.com" />
                            <FormInputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required={!isInviteMode} placeholder="+1 234 567 890" />
                            <FormInputField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleInputChange} required={!isInviteMode} />
                            
                            <div className="md:col-span-2">
                                <FormInputField label="Address (Optional)" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" />
                            </div>
                            
                            <FormInputField label="Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} required={!isInviteMode} placeholder="Guardian Full Name" />
                            <FormInputField label="Guardian Phone" name="guardian_phone" value={formData.guardian_phone} onChange={handleInputChange} required={!isInviteMode} placeholder="+1 987 654 321" />
                        </div>
                    </div>
                )}

                {/* Academic Information Section */}
                <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3 border-b pb-1 mt-2">Academic Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInputField label="Academic Year" name="academic_year" value={formData.academic_year} onChange={handleInputChange} required placeholder="2023-2024" />
                        <FormInputField label="Grade/Class" name="grade" value={formData.grade} onChange={handleInputChange} required placeholder="10th Grade" />
                        <FormInputField label="Section (Optional)" name="section" value={formData.section} onChange={handleInputChange} placeholder="A" />
                        
                        {/* Only needed for full enrollment right now */}
                        {!isInviteMode && (
                            <>
                                <FormInputField label="Roll Number (Optional)" name="roll_no" value={formData.roll_no} onChange={handleInputChange} placeholder="101" />
                                <FormInputField label="Monthly Fee (Optional)" name="monthly_fee" type="number" value={formData.monthly_fee} onChange={handleInputChange} placeholder="0.00" />
                            </>
                        )}
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
                        {isSubmitting ? 'Processing...' : (isInviteMode ? 'Offer Admission' : 'Enroll Student')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EnrollmentForm;