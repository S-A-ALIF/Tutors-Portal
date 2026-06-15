import React, { useState } from 'react';

const StudentCard = ({ student, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { 
        first_name, 
        last_name, 
        grade_level,
        class_grade, 
        department,
        section,
        roll_no,
        school_name,
        school, 
        subjects_needed, 
        tuition_type, 
        phone_number, 
        email,
        address,
        date_of_birth,
        gender,
        guardian_name,
        guardian_phone,
        location,
        is_active 
    } = student;

    const studentId = student.id || student._id;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displaySchool = school_name || school;
    const displayGrade = grade_level || class_grade;

    return (
        <>
            <div 
                onClick={() => setIsModalOpen(true)}
                className={`p-5 flex flex-col gap-3 shadow-sm rounded-xl border bg-white cursor-pointer hover:shadow-md transition-shadow ${is_active ? 'border-gray-200' : 'border-orange-200 bg-orange-50'}`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {first_name} {last_name}
                        </h3>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-700 font-semibold">
                                {displayGrade ? `Grade: ${displayGrade}` : 'Grade unassigned'}
                                {department ? ` • Dept: ${department}` : ''}
                                {section ? ` • Sec: ${section}` : ''}
                                {roll_no ? ` • Roll: ${roll_no}` : ''}
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                                {displaySchool || 'No school provided'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!is_active && (
                            <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                Looking
                            </span>
                        )}
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                            
                            {isMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                                    ></div>
                                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(student); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(studentId); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
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

            </div>

            {/* Personal Info Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-blue-900">Personal Information</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Student Details</h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="text-gray-500">Name:</div>
                                    <div className="font-medium text-gray-900">{first_name} {last_name}</div>
                                    
                                    <div className="text-gray-500">Gender:</div>
                                    <div className="font-medium text-gray-900 capitalize">{gender || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Date of Birth:</div>
                                    <div className="font-medium text-gray-900">{date_of_birth ? new Date(date_of_birth).toLocaleDateString() : 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Email:</div>
                                    <div className="font-medium text-gray-900">{email || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Phone:</div>
                                    <div className="font-medium text-gray-900">{phone_number || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Address:</div>
                                    <div className="font-medium text-gray-900">{address || location || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Guardian Details</h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="text-gray-500">Name:</div>
                                    <div className="font-medium text-gray-900">{guardian_name || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Phone:</div>
                                    <div className="font-medium text-gray-900">{guardian_phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentCard;