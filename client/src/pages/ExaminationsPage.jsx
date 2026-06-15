import React from 'react';
import { useExams } from '../features/exam/hooks/examHooks';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ExaminationsPage = () => {
    const { user } = useAuth();
    
    const role = user?.role || user?.data?.role;
    const profile = user?.profile || user?.data?.profile;
    const instId = role === 'admin' ? profile?.id : undefined;

    const { data: response, isLoading, isError } = useExams(instId);
    
    // Process and sort exams
    const exams = response?.data || [];
    const upcomingExams = React.useMemo(() => {
        const now = new Date();
        return exams
            .filter(exam => {
                const datePart = exam.exam_date.split('T')[0];
                const examDateTime = new Date(`${datePart}T${exam.exam_time}`);
                // Only keep exams that are in the future or today
                return examDateTime >= now;
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.exam_date.split('T')[0]}T${a.exam_time}`);
                const dateB = new Date(`${b.exam_date.split('T')[0]}T${b.exam_time}`);
                return dateA - dateB;
            });
    }, [exams]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load examinations. Please try again.
            </div>
        );
    }

    // Format duration helper
    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60);
        const remaining = mins % 60;
        let txt = '';
        if (hours > 0) txt += `${hours}h `;
        if (remaining > 0) txt += `${remaining}m`;
        return txt.trim();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upcoming Examinations</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage all scheduled assessments.</p>
                </div>
                <Link
                    to="/create-exam"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    + Schedule Exam
                </Link>
            </div>

            {upcomingExams.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Upcoming Exams</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are currently no upcoming exams scheduled. You can schedule a new assessment at any time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingExams.map((exam) => {
                        const dateObj = new Date(exam.exam_date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                        
                        // Convert 14:00:00 to 2:00 PM
                        const timeParts = exam.exam_time.split(':');
                        const timeObj = new Date();
                        timeObj.setHours(timeParts[0], timeParts[1], 0);
                        const formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                        return (
                            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group">
                                <div className="p-5 border-b border-gray-100 relative">
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-bl-xl">
                                        {formatDuration(exam.duration_minutes)}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 pr-12 line-clamp-1">{exam.name}</h3>
                                    <p className="text-blue-600 font-medium text-sm mt-1">{exam.subject}</p>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span className="font-medium">{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="font-medium">{formattedTime}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        <span>Grade: <span className="font-medium text-gray-900">{exam.grade}</span> {exam.section && <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">Sec: {exam.section}</span>}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                                        <span>Marks: <span className="font-bold text-gray-900">{exam.total_marks}</span></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExaminationsPage;