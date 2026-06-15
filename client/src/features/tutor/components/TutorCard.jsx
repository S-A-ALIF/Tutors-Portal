import React, { useState } from 'react';

const TutorCard = ({ tutor, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { 
        first_name, 
        last_name, 
        subjects, 
        bio, 
        hourly_rate, 
        monthly_salary, 
        phone_number, 
        email, 
        is_active,
        qualifications,
        experience_years
    } = tutor;

    const tutorId = tutor.id || tutor._id;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div 
                onClick={() => setIsModalOpen(true)}
                className={`p-5 flex flex-col gap-3 shadow-sm rounded-xl border bg-white cursor-pointer hover:shadow-md transition-shadow ${is_active ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}
            >
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">
                        {first_name} {last_name}
                    </h3>
                    <div className="flex items-center gap-2">
                        {!is_active && (
                            <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                Inactive
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
                                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(tutor); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(tutorId); }}
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
                
                <p className="text-sm text-gray-600 font-medium">
                    {subjects?.length > 0 ? subjects.join(', ') : 'No subjects specified'}
                </p>
                
                <div className="mt-1 flex flex-wrap gap-2 text-sm">
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
                
                <div className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
                    <strong>Bio:</strong> {bio || 'No bio available.'}
                </div>

            </div>

            {/* Personal Info Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-red-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-red-900">Personal Information</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <div className="text-gray-500">Name:</div>
                                    <div className="font-medium text-gray-900">{first_name} {last_name}</div>
                                    
                                    <div className="text-gray-500">Email:</div>
                                    <div className="font-medium text-gray-900 break-all">{email || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Phone:</div>
                                    <div className="font-medium text-gray-900">{phone_number || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Background</h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                                    <div className="text-gray-500">Qualifications:</div>
                                    <div className="font-medium text-gray-900">{qualifications || 'N/A'}</div>
                                    
                                    <div className="text-gray-500">Experience:</div>
                                    <div className="font-medium text-gray-900">{experience_years ? `${experience_years} years` : 'N/A'}</div>
                                </div>
                                <div className="text-gray-500 text-sm mb-1">Full Bio:</div>
                                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {bio || 'No detailed biography provided.'}
                                </p>
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

export default TutorCard;