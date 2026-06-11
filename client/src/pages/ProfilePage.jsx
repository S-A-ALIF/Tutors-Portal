import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    // Pull the currently logged-in user from context
    const { user } = useAuth();
    
    // Safely extract the role (handling potential nesting from the backend)
    // Defaulting to 'student' purely as a fallback if user data is still loading
    const role = user?.role || user?.data?.role || user?.user?.role || 'student';

    // ==========================================
    // MOCK DATA (Based strictly on your models)
    // ==========================================

    // 1. User Model (Institution/Admin)
    const mockInstitutionUser = {
        id: "usr_inst_001",
        email: "admin@brillianttutors.com",
        role: "admin",
        createdAt: new Date("2023-01-15T10:00:00Z").toLocaleDateString()
    };

    // 2. Institution Model
    const mockInstitution = {
        id: "inst_100",
        name: "Brilliant Tutors Academy",
        email: "contact@brillianttutors.com",
        phone_number: "+1-555-0198",
        address: "123 Education Lane, Knowledge City",
        logo_url: null,
        is_active: true,
        created_at: new Date("2023-01-15T10:00:00Z").toLocaleDateString()
    };

    // 3. User Model (Tutor)
    const mockTutorUser = {
        id: "usr_tut_002",
        email: "johndoe@example.com",
        role: "tutor",
        createdAt: new Date("2023-06-20T14:30:00Z").toLocaleDateString()
    };

    // 4. Tutor Model
    const mockTutor = {
        id: "tut_200",
        user_id: "usr_tut_002",
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone_number: "+1-555-0245",
        bio: "Experienced Mathematics and Physics tutor with over 5 years of teaching.",
        hourly_rate: 45,
        monthly_salary: null,
        subjects: ["Mathematics", "Physics", "Calculus"],
        is_active: true,
        created_at: new Date("2023-06-20T14:30:00Z").toLocaleDateString(),
        updated_at: new Date("2023-08-01T09:15:00Z").toLocaleDateString()
    };

    // 5. User Model (Student)
    const mockStudentUser = {
        id: "usr_stu_003",
        email: "alice.smith@example.com",
        role: "student",
        createdAt: new Date("2023-09-01T08:00:00Z").toLocaleDateString()
    };

    // 6. Student Model
    const mockStudent = {
        id: "stu_300",
        user_id: "usr_stu_003",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        phone_number: "+1-555-0399",
        grade_level: "10th Grade",
        school_name: "Lincoln High School",
        is_active: true,
        created_at: new Date("2023-09-01T08:00:00Z").toLocaleDateString(),
        updated_at: new Date("2023-10-12T11:20:00Z").toLocaleDateString()
    };

    // ==========================================
    // HELPER COMPONENT FOR CLEAN UI
    // ==========================================
    const InfoRow = ({ label, value }) => {
        // Handle booleans, arrays, and nulls cleanly
        let displayValue = value;
        if (typeof value === 'boolean') displayValue = value ? 'Yes' : 'No';
        if (Array.isArray(value)) displayValue = value.join(', ');
        if (value === null || value === undefined || value === '') displayValue = 'N/A';

        return (
            <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 font-medium text-sm w-1/3">{label}</span>
                <span className="text-gray-900 text-sm text-right font-medium w-2/3 break-words">
                    {displayValue}
                </span>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>
                <p className="text-gray-500 mt-1 capitalize">Viewing profile details for: {role}</p>
            </div>

            {/* Grid Layout for the Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* ========================================== */}
                {/* ADMIN ROLE ONLY: INSTITUTION INFO          */}
                {/* ========================================== */}
                {role === 'admin' && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-blue-800">Institution User Info</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="User ID" value={mockInstitutionUser.id} />
                                <InfoRow label="Email" value={mockInstitutionUser.email} />
                                <InfoRow label="Role" value={mockInstitutionUser.role.toUpperCase()} />
                                <InfoRow label="Created At" value={mockInstitutionUser.createdAt} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-blue-800">Institution Details</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="Institution ID" value={mockInstitution.id} />
                                <InfoRow label="Name" value={mockInstitution.name} />
                                <InfoRow label="Email" value={mockInstitution.email} />
                                <InfoRow label="Phone Number" value={mockInstitution.phone_number} />
                                <InfoRow label="Address" value={mockInstitution.address} />
                                <InfoRow label="Logo URL" value={mockInstitution.logo_url} />
                                <InfoRow label="Active Status" value={mockInstitution.is_active} />
                                <InfoRow label="Created At" value={mockInstitution.created_at} />
                            </div>
                        </div>
                    </>
                )}

                {/* ========================================== */}
                {/* ADMIN & TUTOR ROLES: TUTOR INFO            */}
                {/* ========================================== */}
                {(role === 'admin' || role === 'tutor') && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-green-800">Tutor User Info</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="User ID" value={mockTutorUser.id} />
                                <InfoRow label="Email" value={mockTutorUser.email} />
                                <InfoRow label="Role" value={mockTutorUser.role.toUpperCase()} />
                                <InfoRow label="Created At" value={mockTutorUser.createdAt} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-green-800">Tutor Details</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="Tutor ID" value={mockTutor.id} />
                                <InfoRow label="Linked User ID" value={mockTutor.user_id} />
                                <InfoRow label="First Name" value={mockTutor.first_name} />
                                <InfoRow label="Last Name" value={mockTutor.last_name} />
                                <InfoRow label="Contact Email" value={mockTutor.email} />
                                <InfoRow label="Phone Number" value={mockTutor.phone_number} />
                                <InfoRow label="Bio" value={mockTutor.bio} />
                                <InfoRow label="Hourly Rate" value={mockTutor.hourly_rate ? `$${mockTutor.hourly_rate}/hr` : null} />
                                <InfoRow label="Monthly Salary" value={mockTutor.monthly_salary ? `$${mockTutor.monthly_salary}` : null} />
                                <InfoRow label="Subjects" value={mockTutor.subjects} />
                                <InfoRow label="Active Status" value={mockTutor.is_active} />
                                <InfoRow label="Created At" value={mockTutor.created_at} />
                                <InfoRow label="Updated At" value={mockTutor.updated_at} />
                            </div>
                        </div>
                    </>
                )}

                {/* ========================================== */}
                {/* STUDENT ROLE ONLY: STUDENT INFO            */}
                {/* ========================================== */}
                {role === 'student' && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-purple-800">Student User Info</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="User ID" value={mockStudentUser.id} />
                                <InfoRow label="Email" value={mockStudentUser.email} />
                                <InfoRow label="Role" value={mockStudentUser.role.toUpperCase()} />
                                <InfoRow label="Created At" value={mockStudentUser.createdAt} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-purple-800">Student Details</h2>
                            </div>
                            <div className="p-6 flex flex-col">
                                <InfoRow label="Student ID" value={mockStudent.id} />
                                <InfoRow label="Linked User ID" value={mockStudent.user_id} />
                                <InfoRow label="First Name" value={mockStudent.first_name} />
                                <InfoRow label="Last Name" value={mockStudent.last_name} />
                                <InfoRow label="Contact Email" value={mockStudent.email} />
                                <InfoRow label="Phone Number" value={mockStudent.phone_number} />
                                <InfoRow label="Grade Level" value={mockStudent.grade_level} />
                                <InfoRow label="School Name" value={mockStudent.school_name} />
                                <InfoRow label="Active Status" value={mockStudent.is_active} />
                                <InfoRow label="Created At" value={mockStudent.created_at} />
                                <InfoRow label="Updated At" value={mockStudent.updated_at} />
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default ProfilePage;