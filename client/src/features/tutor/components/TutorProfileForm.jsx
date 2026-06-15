import { useState, useEffect } from 'react';
import { useCreateTutor, useUpdateTutor } from '../hooks/tutorHooks';
import { useQueryClient } from '@tanstack/react-query';

const TutorProfileForm = ({ userId, userRole,userEmail, initialData = null, onCancel, onSuccess }) => {
    const queryClient = useQueryClient();
    
    // Initialize React Query Mutations (Ensure these match your actual hook names)
    const { mutateAsync: createTutor, isPending: isCreating } = useCreateTutor();
    const { mutateAsync: updateTutor, isPending: isUpdating } = useUpdateTutor();
    
    const isEditMode = !!initialData;
    const isSubmitting = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: userEmail || '', 
        phone_number: '',
        subjects: '', // Stored as comma-separated string in form, sent as array or string to backend
        bio: ''
    });

    // Populate form if we are in edit mode, or just set the email if creating
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || userEmail || '',
                phone_number: initialData.phone_number || '',
                // If subjects come back as an array, join them for the input field
                subjects: Array.isArray(initialData.subjects) ? initialData.subjects.join(', ') : (initialData.subjects || ''),
                bio: initialData.bio || ''
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
            // Format payload: ensure subjects are sent in the format your backend expects (e.g., array)
            const payload = {
                ...formData,
                user_id: userId,
                user_role: userRole, // Include role if needed for backend logic
                // Optional: convert "Math, Science" into ["Math", "Science"]
                subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s) 
            };
            
            if (isEditMode) {
                responseData = await updateTutor({ id: initialData.id, data: payload });
            } else {
                responseData = await createTutor(payload);
            }

            console.log("DEBUG: Raw Response from API after saving Tutor:", responseData);

            // Extract the actual data payload
            const profileData = responseData?.data ? responseData.data : responseData;

            // Update global auth state
            if (profileData) {
                 updateUser(profileData); 
            }
            
            if (onSuccess) onSuccess(profileData);
            
        } catch (error) {
            console.error("Failed to save tutor profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-green-800">
                    {isEditMode ? 'Update Tutor Profile' : 'Setup Tutor Profile'}
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                            placeholder="John" 
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                            placeholder="Doe" 
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone_number" 
                        required 
                        value={formData.phone_number} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                        placeholder="+1 234 567 890" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (Comma separated)</label>
                    <input 
                        type="text" 
                        name="subjects" 
                        required 
                        value={formData.subjects} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                        placeholder="Math, Physics, English" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                    <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                        rows="3" 
                        placeholder="Tell students a bit about your experience..."
                    ></textarea>
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
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TutorProfileForm;