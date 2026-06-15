import { useState, useEffect } from 'react';
import { useCreateStudent, useUpdateStudent } from '../hooks/studentHooks';
import { useAuth } from '../../../context/AuthContext';

const StudentProfileForm = ({ userId, userEmail, initialData = null, onCancel, onSuccess }) => {
    const { updateUser } = useAuth();
    
    // Initialize React Query Mutations
    const { mutateAsync: createStudent, isPending: isCreating } = useCreateStudent();
    const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();
    
    const isEditMode = !!initialData;
    const isSubmitting = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: userEmail || '', 
        phone_number: '',
        date_of_birth: '',
        gender: '',
        address: '',
        guardian_name: '',
        guardian_phone: ''
    });

    // Populate form if we are in edit mode, or just set the email if creating
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            
            // Format date for HTML date input (YYYY-MM-DD)
            let formattedDate = '';
            if (initialData.date_of_birth) {
                try {
                    formattedDate = new Date(initialData.date_of_birth).toISOString().split('T')[0];
                } catch (e) {
                    console.error("DEBUG: Failed to parse date_of_birth", e);
                }
            }

            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || userEmail || '',
                phone_number: initialData.phone_number || '',
                date_of_birth: formattedDate || '',
                gender: initialData.gender || '',
                address: initialData.address || '',
                guardian_name: initialData.guardian_name || '',
                guardian_phone: initialData.guardian_phone || ''
            });
        } else if (userEmail) {
            setFormData(prev => ({ ...prev, email: userEmail }));
        }
    }, [initialData, userEmail]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let responseData;
            const payload = {
                ...formData,
                user_id: userId
            };
            
            if (isEditMode) {
                responseData = await updateStudent({ id: initialData.id, data: payload });
            } else {
                responseData = await createStudent(payload);
            }

            console.log("DEBUG: Raw Response from API after saving Student:", responseData);

            // Extract the actual data payload
            const profileData = responseData?.data ? responseData.data : responseData;

            // Update global auth state
            if (profileData) {
                 updateUser(profileData); 
            }
            
            if (onSuccess) onSuccess(profileData);
            
        } catch (error) {
            console.error("Failed to save student profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-purple-800">
                    {isEditMode ? 'Update Student Profile' : 'Setup Student Profile'}
                </h3>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                            type="text" 
                            name="first_name" 
                            required 
                            value={formData.first_name} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="First Name" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            name="last_name" 
                            required 
                            value={formData.last_name} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="Last Name" 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        readOnly
                        value={formData.email} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" 
                    />
                    <p className="text-xs text-gray-400 mt-1">This email is synced with your main account.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone_number" 
                            required
                            value={formData.phone_number} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="+1 234 567 890" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select 
                            name="gender" 
                            required
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input 
                            type="date" 
                            name="date_of_birth" 
                            required 
                            value={formData.date_of_birth} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="Full Address" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input 
                            type="text" 
                            name="guardian_name" 
                            required
                            value={formData.guardian_name} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="Guardian Full Name" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                        <input 
                            type="tel" 
                            name="guardian_phone" 
                            required
                            value={formData.guardian_phone} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                            placeholder="+1 987 654 321" 
                        />
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
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StudentProfileForm;