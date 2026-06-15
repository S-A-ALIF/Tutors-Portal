import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-4xl p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Student Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    Welcome to the student portal.
                </p>
                
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-100 max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-purple-800 mb-2">Have an Invitation Code?</h3>
                    <p className="text-sm text-purple-600 mb-4">Enter the 6-digit code sent to your email to join an institution.</p>
                    <Link 
                        to="/accept-invitation" 
                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Enter Code
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;