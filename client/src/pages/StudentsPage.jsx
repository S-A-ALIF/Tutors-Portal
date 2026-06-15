import React from 'react';
import { useStudents, useDeleteStudent, useUpdateStudent, StudentCard } from '../features/student';
import LoadingComponent from '../components/ui/LoadingComponent';

const StudentsPage = () => {
    const { data: studentsData, isLoading, isError, error } = useStudents();
    const { mutate: deleteStudent } = useDeleteStudent();
    const { mutate: updateStudent } = useUpdateStudent();

    if (isLoading) {
        return <LoadingComponent message="Loading students..." />;
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
                <p className="font-semibold">Failed to load students</p>
                <p className="text-sm mt-1">{error?.message || 'Please try again later.'}</p>
            </div>
        );
    }

    const students = Array.isArray(studentsData) 
        ? studentsData 
        : (studentsData?.data || studentsData?.students || []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this student?')) {
            deleteStudent(id);
        }
    };

    const handleEdit = (student) => {
        const studentId = student.id || student._id;
        const newName = window.prompt("Edit student's first name:", student.first_name);
        
        if (newName !== null && newName.trim() !== '' && newName !== student.first_name) {
            const cleanName = newName.trim();

            // Send standard { id, data } payload to our newly fixed hook
            updateStudent(
                {
                    id: studentId,
                    data: { first_name: cleanName }
                },
                {
                    onSuccess: () => {
                        console.log('Student updated successfully.');
                    },
                    onError: (err) => {
                        const errorMessage = err?.message || err?.error || 'Validation Error';
                        alert(`Server rejected the update:\n"${errorMessage}"`);
                    }
                }
            );
        }
    };

    // Utility to extract a number for proper numeric sorting of grades (e.g., "Grade 10" vs "Grade 9")
    const extractNumber = (str) => {
        if (!str) return Infinity; 
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : str;
    };

    // Group the students by Grade then Section
    const groupedStudents = students.reduce((acc, student) => {
        const grade = student.grade_level || student.class_grade || 'Unassigned Grade';
        const section = student.section || 'Unassigned Section';
        
        if (!acc[grade]) {
            acc[grade] = {};
        }
        if (!acc[grade][section]) {
            acc[grade][section] = [];
        }
        acc[grade][section].push(student);
        return acc;
    }, {});

    // Sort grades
    const sortedGrades = Object.keys(groupedStudents).sort((a, b) => {
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
            </div>

            {students.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-lg font-medium">No students found.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {sortedGrades.map((grade) => {
                        const sections = groupedStudents[grade];
                        const sortedSections = Object.keys(sections).sort((a, b) => {
                            if (a === 'Unassigned Section') return 1;
                            if (b === 'Unassigned Section') return -1;
                            return a.localeCompare(b);
                        });

                        return (
                            <div key={grade} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                                <h2 className="text-2xl font-bold text-purple-900 border-b border-gray-100 pb-3">{grade}</h2>
                                <div className="space-y-8">
                                    {sortedSections.map((section) => (
                                        <div key={`${grade}-${section}`} className="space-y-4">
                                            <h3 className="text-lg font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md inline-block">
                                                Section: {section}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {sections[section].map((student) => (
                                                    <StudentCard 
                                                        key={student.id || student._id || Math.random()} 
                                                        student={student} 
                                                        onEdit={handleEdit}
                                                        onDelete={handleDelete}
                                                    />
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

export default StudentsPage;