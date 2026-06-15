import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TutorDashboard = () => {
    const { user } = useAuth();

    // MOCK DATA for dashboard statistics
    const stats = [
        { label: "Upcoming Classes", value: "3", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Hours Taught (This Week)", value: "12.5", color: "text-green-600", bg: "bg-green-50" },
        { label: "Active Students", value: "8", color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Pending Assignments", value: "5", color: "text-orange-600", bg: "bg-orange-50" }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.first_name || 'Tutor'}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here is your teaching overview for today.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center sm:items-end text-center sm:text-right">
                    <p className="text-sm text-green-700 font-medium mb-2">Have an Institution Invite Code?</p>
                    <Link 
                        to="/accept-invitation" 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm"
                    >
                        Enter Code
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-4`}>
                            {/* Generic Icon Placeholder */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Schedule Schedule */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                        <button className="text-sm text-[#3b5bdb] font-medium hover:underline">View Calendar</button>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                        <p>Your schedule details will appear here.</p>
                    </div>
                </div>

                {/* Notifications / Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                        <p>No new notifications.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;