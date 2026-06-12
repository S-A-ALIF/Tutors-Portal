import { useState, useEffect } from 'react';
import { useCreateInstitution, useUpdateInstitution } from '../hooks/institutionHooks';
import { useAuth } from '../../../context/AuthContext';

const InstitutionProfileForm = ({ userId, userEmail, initialData = null, onCancel, onSuccess }) => {
    const { updateUser } = useAuth();
    
    // Initialize React Query Mutations
    const { mutateAsync: createInstitution, isPending: isCreating } = useCreateInstitution();
    const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();
    
    const isEditMode = !!initialData;
    const isSubmitting = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        name: '',
        email: userEmail || '', // Initialize with userEmail
        phone_number: '',
        address: ''
    });

    // Populate form if we are in edit mode, or just set the email if creating
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || userEmail || '',
                phone_number: initialData.phone_number || '',
                address: initialData.address || ''
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
            
            if (isEditMode) {
                // If updating, we only send the changed data
                responseData = await updateInstitution({ id: initialData.id, data: formData });
            } else {
                // IMPORTANT: Inject the user_id into the payload for backend foreign key mapping
                const payload = {
                    ...formData,
                    user_id: userId 
                };
                responseData = await createInstitution(payload);
            }

            console.log("DEBUG: Raw Response from API after saving:", responseData);

            // Extract the actual data payload (handles Axios wrapper if present)
            const profileData = responseData?.data ? responseData.data : responseData;

            // Update the global AuthContext so the UI instantly reflects the new/updated institution
            if (profileData) {
                 updateUser(profileData); 
            }
            
            // Trigger parent callback (e.g., to close the form/modal)
            if (onSuccess) onSuccess(profileData);
            
        } catch (error) {
            console.error("Failed to save institution profile:", error);
            // Ideally, handle error toast/notification here
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-blue-800">
                    {isEditMode ? 'Update Institution Profile' : 'Setup Institution Profile'}
                </h3>
            </div>
            
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g., Brilliant Academy" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        readOnly
                        value={formData.email} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" 
                        placeholder="contact@institution.com" 
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="+1 234 567 890" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea 
                        name="address" 
                        required 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        rows="3" 
                        placeholder="Full street address"
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
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default InstitutionProfileForm;