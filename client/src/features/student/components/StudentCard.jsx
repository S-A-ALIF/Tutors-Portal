import React from 'react';

const StudentCard = ({ student, onEdit, onDelete }) => {
    const { 
        first_name, 
        last_name, 
        grade_level, 
        school_name, 
        subjects_needed, 
        tuition_type, 
        phone_number, 
        location,
        is_active 
    } = student;

    const studentId = student.id || student._id;

    return (
        <div className={`p-5 flex flex-col gap-3 shadow-sm rounded-xl border bg-white ${is_active ? 'border-gray-200' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {first_name} {last_name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {grade_level} • {school_name || 'No school provided'}
                    </p>
                </div>
                {!is_active && (
                    <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        Looking
                    </span>
                )}
            </div>
            
            <p className="text-sm text-gray-700 font-medium mt-2">
                <strong>Needs:</strong> {subjects_needed?.length > 0 ? subjects_needed.join(', ') : 'Not specified'}
            </p>
            
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {tuition_type && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md font-medium">
                        {tuition_type}
                    </span>
                )}
                {location && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-medium">
                        {location}
                    </span>
                )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col gap-1 flex-grow">
                <span><strong>Contact:</strong> {phone_number || 'N/A'}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end gap-3">
                <button 
                    onClick={() => onEdit(student)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDelete(studentId)} 
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default StudentCard;