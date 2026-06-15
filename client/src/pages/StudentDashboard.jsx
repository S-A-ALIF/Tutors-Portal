import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-4xl p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Student Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    Welcome to the student portal.
                </p>
            </div>
        </div>
    );
};

export default StudentDashboard;