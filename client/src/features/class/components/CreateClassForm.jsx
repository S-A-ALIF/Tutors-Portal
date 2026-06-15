import React, { useState } from 'react';

const CreateClassForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        grade: '',
        department: '',
        section: '',
        floor: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Class Details</h2>
                <p className="text-sm text-gray-500 mt-1">Enter the necessary information to create a new class.</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Grade/Class */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Grade / Class <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="grade"
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Grade 10 or Class X"
                        />
                    </div>

                    {/* Department/Group */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Department / Group <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Science, Commerce, Arts"
                        />
                    </div>

                    {/* Section */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Section <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., A, B, Section 1"
                        />
                    </div>

                    {/* Floor */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Floor <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., 1st Floor, Room 102"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? 'Saving...' : 'Add Class'}
                </button>
            </div>
        </form>
    );
};

export default CreateClassForm;
