import React, { useState } from 'react';

const colors = [
    { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', hover: 'hover:bg-blue-50', avatarText: 'text-blue-600', avatarBg: 'bg-blue-100' },
    { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500', hover: 'hover:bg-rose-50', avatarText: 'text-rose-600', avatarBg: 'bg-rose-100' },
    { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-50', avatarText: 'text-emerald-700', avatarBg: 'bg-emerald-100' },
    { bg: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', hover: 'hover:bg-purple-50', avatarText: 'text-purple-700', avatarBg: 'bg-purple-100' },
    { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500', hover: 'hover:bg-amber-50', avatarText: 'text-amber-600', avatarBg: 'bg-amber-100' }
];

const TutorCard = ({ tutor, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    // Pick a deterministic color based on the first name
    const colorIndex = (first_name?.charCodeAt(0) || 0) % colors.length;
    const theme = colors[colorIndex];

    return (
        <>
            <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-visible hover:-translate-y-1 transition-all duration-300 relative group">
                
                {/* Top Color Block */}
                <div className={`h-24 w-full relative rounded-t-xl ${theme.bg}`}>
                    {!is_active && (
                        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
                            Inactive
                        </span>
                    )}
                    
                    <div className="absolute top-2 right-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}></div>
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(tutorId); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Avatar */}
                <div className="flex justify-center -mt-12 relative z-0">
                    <div className={`w-24 h-24 rounded-full border-4 border-white ${theme.avatarBg} flex items-center justify-center text-3xl font-bold ${theme.avatarText} shadow-sm`}>
                        {first_name?.[0]}{last_name?.[0]}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-3 text-center">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{first_name} {last_name}</h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-1 mt-0.5">{email || 'Tutor'}</p>
                    
                    <div className="flex justify-center mt-5 py-4 border-t border-b border-gray-100/80">
                        <div className="text-center flex-1 px-1">
                            <p className="text-[15px] font-bold text-gray-900 line-clamp-1">
                                {subjects?.length > 0 ? subjects.length : '-'}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Subjects</p>
                        </div>
                        <div className="w-px bg-gray-100"></div>
                        <div className="text-center flex-1 px-1">
                            <p className="text-[15px] font-bold text-gray-900 line-clamp-1 text-green-600">
                                {monthly_salary ? `৳${monthly_salary}` : (hourly_rate ? `৳${hourly_rate}/h` : '-')}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Rate</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                            className={`flex-1 py-2.5 ${theme.bg} text-white rounded-full font-semibold text-sm transition-all hover:shadow-md hover:opacity-90`}
                        >
                            View Profile
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(tutor); }}
                            className={`flex-1 py-2.5 border ${theme.border} ${theme.text} ${theme.hover} rounded-full font-semibold text-sm transition-all`}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Info Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className={`${theme.bg} px-6 py-5 flex justify-between items-center`}>
                            <h3 className="text-xl font-bold text-white">Tutor Details</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-3xl leading-none transition-colors">&times;</button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500 font-medium">Name:</div>
                                    <div className="font-semibold text-gray-900 text-right">{first_name} {last_name}</div>
                                    
                                    <div className="text-gray-500 font-medium">Email:</div>
                                    <div className="font-semibold text-gray-900 text-right break-all">{email || 'N/A'}</div>
                                    
                                    <div className="text-gray-500 font-medium">Phone:</div>
                                    <div className="font-semibold text-gray-900 text-right">{phone_number || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div className="pt-5 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Academic & Teaching</h4>
                                <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                                    <div className="text-gray-500 font-medium">Subjects:</div>
                                    <div className="font-semibold text-gray-900 text-right">{subjects?.length > 0 ? subjects.join(', ') : 'N/A'}</div>
                                    
                                    <div className="text-gray-500 font-medium">Hourly Rate:</div>
                                    <div className="font-semibold text-gray-900 text-right">{hourly_rate ? `৳${hourly_rate}` : 'N/A'}</div>
                                    
                                    <div className="text-gray-500 font-medium">Monthly Salary:</div>
                                    <div className="font-semibold text-gray-900 text-right">{monthly_salary ? `৳${monthly_salary}` : 'N/A'}</div>
                                </div>
                                
                                <div className="text-gray-500 font-medium text-xs uppercase tracking-widest mb-2">Biography</div>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                                    {bio || 'No detailed biography provided.'}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
                            <button onClick={() => setIsModalOpen(false)} className={`bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm`}>
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