import React, { useState, useEffect } from 'react';

const EditTutorModal = ({ isOpen, onClose, tutor, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        hourly_rate: '',
        monthly_salary: '',
        subjects: '',
        bio: ''
    });

    useEffect(() => {
        if (tutor) {
            setFormData({
                first_name: tutor.first_name || '',
                last_name: tutor.last_name || '',
                email: tutor.email || '',
                phone_number: tutor.phone_number || '',
                hourly_rate: tutor.hourly_rate || '',
                monthly_salary: tutor.monthly_salary || '',
                subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : (tutor.subjects || ''),
                bio: tutor.bio || ''
            });
        }
    }, [tutor]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const cleanSubjects = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
        
        onSubmit({
            ...formData,
            hourly_rate: formData.hourly_rate ? Number(formData.hourly_rate) : null,
            monthly_salary: formData.monthly_salary ? Number(formData.monthly_salary) : null,
            subjects: cleanSubjects
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold text-white">Edit Tutor Info</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none transition-colors">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (৳)</label>
                            <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (৳)</label>
                            <input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (CSV)</label>
                            <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Math, Physics" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTutorModal;
