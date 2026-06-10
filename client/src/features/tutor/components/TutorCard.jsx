import React from 'react';

const TutorCard = ({ tutor, onEdit, onDelete }) => {
    const { 
        first_name, 
        last_name, 
        subjects, 
        bio, 
        hourly_rate, 
        monthly_salary, 
        phone_number, 
        email, 
        is_active 
    } = tutor;

    const tutorId = tutor.id || tutor._id;

    return (
        <div className={`p-5 flex flex-col gap-3 shadow-sm rounded-xl border bg-white ${is_active ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">
                    {first_name} {last_name}
                </h3>
                {!is_active && (
                    <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        Inactive
                    </span>
                )}
            </div>
            
            <p className="text-sm text-gray-600 font-medium">
                {subjects?.length > 0 ? subjects.join(', ') : 'No subjects specified'}
            </p>
            
            <div className="text-sm text-gray-500 mt-1 line-clamp-3 flex-grow">
                {bio || 'No bio available.'}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {hourly_rate && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                        Hourly: ৳{hourly_rate}
                    </span>
                )}
                {monthly_salary && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                        Salary: ৳{monthly_salary}
                    </span>
                )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col gap-1">
                <span><strong>Phone:</strong> {phone_number}</span>
                {email && <span><strong>Email:</strong> {email}</span>}
            </div>

            {/* Action Buttons */}
            <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end gap-3">
                <button 
                    onClick={() => onEdit(tutor)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDelete(tutorId)} 
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TutorCard;