import React, { useEffect, useState } from 'react';
import * as studentService from '../features/student/services/studentService';

const StudentPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await studentService.getStudents();
            setStudents(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch students. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.deleteStudent(id);
                fetchData(); // Refresh list
            } catch (err) {
                alert('Error deleting student');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Students Management</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 border-b">Name</th>
                            <th className="py-2 border-b">Email</th>
                            <th className="py-2 border-b">Phone</th>
                            <th className="py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="text-center">
                                <td className="py-2 border-b">{student.first_name} {student.last_name}</td>
                                <td className="py-2 border-b">{student.email}</td>
                                <td className="py-2 border-b">{student.phone_number}</td>
                                <td className="py-2 border-b">
                                    <button 
                                        onClick={() => handleDelete(student.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentPage;