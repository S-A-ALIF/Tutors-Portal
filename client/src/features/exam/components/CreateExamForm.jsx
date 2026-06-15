import React, { useState } from 'react';

const CreateExamForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        exam_date: '',
        exam_time: '',
        grade: '',
        section: '',
        duration_minutes: '',
        total_marks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            duration_minutes: Number(formData.duration_minutes),
            total_marks: Number(formData.total_marks)
        });
    };

    // Duration conversion
    const getDurationText = () => {
        const mins = parseInt(formData.duration_minutes, 10);
        if (isNaN(mins) || mins <= 0) return '';
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        
        let text = '';
        if (hours > 0) text += `${hours} hour${hours > 1 ? 's' : ''} `;
        if (remainingMins > 0) text += `${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
        return text.trim();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Exam Details</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the information to schedule a new exam.</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Exam Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Exam Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Mid-Term Assessment"
                        />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Mathematics"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Exam Date <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="exam_date"
                            required
                            value={formData.exam_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Exam Time <span className="text-red-500">*</span></label>
                        <input
                            type="time"
                            name="exam_time"
                            required
                            value={formData.exam_time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Grade */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Grade / Class <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="grade"
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Grade 10"
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
                            placeholder="e.g., A"
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Duration (in minutes) <span className="text-red-500">*</span></span>
                            <span className="text-blue-600 font-semibold">{getDurationText()}</span>
                        </label>
                        <input
                            type="number"
                            name="duration_minutes"
                            required
                            min="1"
                            value={formData.duration_minutes}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., 120"
                        />
                    </div>

                    {/* Marks */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Total Marks <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="total_marks"
                            required
                            min="1"
                            value={formData.total_marks}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., 100"
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
                    {isLoading ? 'Creating Exam...' : 'Create Exam'}
                </button>
            </div>
        </form>
    );
};

export default CreateExamForm;
