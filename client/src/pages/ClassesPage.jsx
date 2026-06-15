import React from 'react';
import { useClasses } from '../features/class/hooks/classHooks';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ClassesPage = () => {
    const { user } = useAuth();
    const role = user?.role || user?.data?.role;
    const profile = user?.profile || user?.data?.profile;
    const instId = role === 'admin' ? profile?.id : undefined;

    const { data: response, isLoading, isError } = useClasses(instId);
    
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
                <p className="font-semibold">Failed to load classes.</p>
            </div>
        );
    }

    const classesData = response?.data || [];

    const extractNumber = (str) => {
        if (!str) return Infinity; 
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : str;
    };

    // Group the classes by Grade then Section
    const groupedClasses = classesData.reduce((acc, cls) => {
        const grade = cls.grade || 'Unassigned Grade';
        const section = cls.section || 'Unassigned Section';
        
        if (!acc[grade]) {
            acc[grade] = {};
        }
        if (!acc[grade][section]) {
            acc[grade][section] = [];
        }
        acc[grade][section].push(cls);
        return acc;
    }, {});

    // Sort grades
    const sortedGrades = Object.keys(groupedClasses).sort((a, b) => {
        if (a === 'Unassigned Grade') return 1;
        if (b === 'Unassigned Grade') return -1;
        
        const numA = extractNumber(a);
        const numB = extractNumber(b);
        
        if (typeof numA === 'number' && typeof numB === 'number') {
            if (numA !== numB) return numA - numB;
        }
        return a.localeCompare(b);
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 h-full">
            <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Classes Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and view all registered classes.</p>
                </div>
                <Link
                    to="/new-class"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    + New Class
                </Link>
            </div>

            {classesData.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-lg font-medium">No classes found.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {sortedGrades.map((grade) => {
                        const sections = groupedClasses[grade];
                        const sortedSections = Object.keys(sections).sort((a, b) => {
                            if (a === 'Unassigned Section') return 1;
                            if (b === 'Unassigned Section') return -1;
                            return a.localeCompare(b);
                        });

                        return (
                            <div key={grade} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                                <h2 className="text-2xl font-bold text-blue-900 border-b border-gray-100 pb-3">{grade}</h2>
                                <div className="space-y-8">
                                    {sortedSections.map((section) => (
                                        <div key={`${grade}-${section}`} className="space-y-4">
                                            <h3 className="text-lg font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md inline-block">
                                                Section: {section}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {sections[section].map((cls) => (
                                                    <div key={cls.id} className="p-5 flex flex-col gap-3 shadow-sm rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {cls.grade} {cls.section ? ` - Sec ${cls.section}` : ''}
                                                        </h3>
                                                        <div className="space-y-1 text-sm text-gray-700 font-medium">
                                                            {cls.department && <p>Dept: {cls.department}</p>}
                                                            {cls.floor && <p>Floor: {cls.floor}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClassesPage;
