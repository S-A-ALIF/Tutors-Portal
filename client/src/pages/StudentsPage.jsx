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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {students.map((student) => (
                        <StudentCard 
                            key={student.id || student._id || Math.random()} 
                            student={student} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentsPage;